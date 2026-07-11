'use client';

import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable';
import {
  GET_ALL_COURSES,
  CREATE_COURSE_MUTATION,
  UPDATE_COURSE_MUTATION,
  DELETE_COURSE_MUTATION,
  REORDER_COURSES_MUTATION,
} from '@/graphql';
import { showErrorToast } from '@/lib/toast-error';
import { Button } from '@/components/ui/Button';
import { CourseForm } from '@/components/admin/courses/CourseForm';
import { SortableCourseRow } from '@/components/admin/courses/SortableCourseRow';
import type { CourseSubmitInput } from '@/components/admin/courses/CourseForm.types';
import {
  Plus,
  RefreshCw,
  BookOpen,
  X,
} from 'lucide-react';

// Reordering is scoped per category, so courses are grouped into tabs rather
// than one flat list — dragging only ever reorders within the active tab.
const CATEGORY_TABS = [
  { value: 'ONE_ON_ONE', label: 'One-on-One' },
  { value: 'GROUP', label: 'Group' },
] as const;

type CategoryValue = (typeof CATEGORY_TABS)[number]['value'];

export default function AdminCoursesPage() {
  // Query all courses
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_COURSES, {
    fetchPolicy: 'network-only',
  });

  // Local copy of courses so drag-and-drop can reorder instantly, ahead of the mutation response
  const [localCourses, setLocalCourses] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<CategoryValue>('ONE_ON_ONE');

  useEffect(() => {
    if (data?.courses) {
      setLocalCourses(data.courses);
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCourse, setActiveCourse] = useState<any | null>(null);

  // Mutations
  const [createCourse, { loading: isCreating }] = useMutation<any, any>(CREATE_COURSE_MUTATION, {
    onCompleted: () => {
      toast.success('Course created successfully');
      closeModal();
      refetch();
    },
    onError: (err) => {
      showErrorToast('Failed to create course', err);
    }
  });

  const [updateCourse, { loading: isUpdating }] = useMutation<any, any>(UPDATE_COURSE_MUTATION, {
    onCompleted: () => {
      toast.success('Course updated successfully');
      closeModal();
      refetch();
    },
    onError: (err) => {
      showErrorToast('Failed to update course', err);
    }
  });

  const [deleteCourse] = useMutation<any, any>(DELETE_COURSE_MUTATION, {
    onCompleted: () => {
      toast.success('Course deleted successfully');
      refetch();
    },
    onError: (err) => {
      showErrorToast('Failed to delete course', err);
    }
  });

  const [reorderCourses] = useMutation<any, any>(REORDER_COURSES_MUTATION, {
    onCompleted: () => {
      toast.success('Course order updated');
    },
    onError: (err) => {
      showErrorToast('Failed to update course order', err);
      // Local order is now out of sync with the server — pull the last-saved order back.
      refetch();
    },
  });

  // Modal actions
  const openAddModal = () => {
    setActiveCourse(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (course: any) => {
    setActiveCourse(course);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setActiveCourse(null);
  };

  // Direct active toggle inline
  const handleToggleActive = async (course: any) => {
    await updateCourse({
      variables: {
        updateCourseInput: {
          id: course.id,
          isActive: !course.isActive
        }
      }
    });
  };

  // Delete Action
  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete the course "${title}"?`)) {
      await deleteCourse({ variables: { id } });
    }
  };

  // Drag-and-drop reorder — scoped to whichever category tab is active
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const categoryItems = localCourses
      .filter((c: any) => c.category === activeTab)
      .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

    const oldIndex = categoryItems.findIndex((c: any) => c.id === active.id);
    const newIndex = categoryItems.findIndex((c: any) => c.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(categoryItems, oldIndex, newIndex).map((course: any, index: number) => ({
      ...course,
      sortOrder: index,
    }));

    const reorderedIds = new Set(reordered.map((c: any) => c.id));
    const otherCourses = localCourses.filter((c: any) => !reorderedIds.has(c.id));
    setLocalCourses([...otherCourses, ...reordered]);

    reorderCourses({
      variables: {
        input: {
          items: reordered.map((c: any) => ({ id: c.id, sortOrder: c.sortOrder })),
        },
      },
    });
  };

  // Form Submission (packages array stripped of `region`-derived currency is left intact —
  // backend just needs { region, currency, packageTier, title, description, imageUrl, price }[])
  const handleFormSubmit = async (input: CourseSubmitInput) => {
    const packages = input.packages.map(({ region, packageTier, currency, title, description, imageUrl, price }) => ({
      region,
      packageTier,
      currency,
      title,
      description,
      imageUrl,
      price,
    }));

    if (isEditMode && activeCourse) {
      await updateCourse({
        variables: {
          updateCourseInput: {
            id: activeCourse.id,
            title: input.title,
            description: input.description,
            category: input.category,
            features: input.features,
            imageUrl: input.imageUrl,
            imageId: input.imageId,
            isActive: input.isActive,
            packages,
          }
        }
      });
    } else {
      await createCourse({
        variables: {
          createCourseInput: {
            title: input.title,
            description: input.description,
            category: input.category,
            features: input.features,
            imageUrl: input.imageUrl,
            imageId: input.imageId,
            packages,
          }
        }
      });
    }
  };

  if (loading && !data) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 text-gold animate-spin" />
        <p className="text-text-secondary font-medium animate-pulse">Loading admin courses panel...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
          <X size={32} />
        </div>
        <h3 className="text-xl font-bold font-display">Failed to load courses panel</h3>
        <p className="text-text-secondary max-w-md">{error.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      </div>
    );
  }

  const courses = localCourses;
  const activeCourses = courses
    .filter((course: any) => course.category === activeTab)
    .sort((a: any, b: any) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  return (
    <div className="space-y-6 pb-12 relative min-h-[80vh]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-text">Course Management</h2>
          <p className="text-sm text-text-secondary mt-1">
            Create, modify, toggle active status, reorder, and manage regional pricing of Quranic studies programs.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="gold" size="sm" onClick={openAddModal} leftIcon={<Plus size={16} />}>
            Add Course
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={14} />} />
        </div>
      </div>

      {/* Category Tabs — drag-and-drop reordering only ever applies within the active tab */}
      <div className="flex gap-1 border-b border-border">
        {CATEGORY_TABS.map((tab) => {
          const count = courses.filter((course: any) => course.category === tab.value).length;
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px cursor-pointer ${isActive
                ? 'border-gold text-gold'
                : 'border-transparent text-text-secondary hover:text-text'
                }`}
            >
              {tab.label} <span className="text-xs opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Courses List Table */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            {activeCourses.length === 0 ? (
              <div className="py-20 text-center text-text-secondary">
                <BookOpen size={48} className="mx-auto text-text-secondary/35 mb-4" />
                <p className="font-semibold">No courses in this category yet.</p>
                <p className="text-xs text-text-secondary mt-1">Get started by clicking the "Add Course" button above.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-surface-light/45 text-text-secondary font-medium border-b border-border">
                    <th className="p-4 pl-6 w-10"></th>
                    <th className="p-4">Thumbnail</th>
                    <th className="p-4">Title & Description</th>
                    <th className="p-4">Local Price (PKR)</th>
                    <th className="p-4">Regions Priced</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <SortableContext
                  items={activeCourses.map((course: any) => course.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <tbody className="divide-y divide-border">
                    {activeCourses.map((course: any) => (
                      <SortableCourseRow
                        key={course.id}
                        course={course}
                        onEdit={openEditModal}
                        onDelete={handleDelete}
                        onToggleActive={handleToggleActive}
                      />
                    ))}
                  </tbody>
                </SortableContext>
              </table>
            )}
          </div>
        </div>
      </DndContext>

      <CourseForm
        isOpen={isModalOpen}
        isEditMode={isEditMode}
        initialCourse={activeCourse}
        isSubmitting={isCreating || isUpdating}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}

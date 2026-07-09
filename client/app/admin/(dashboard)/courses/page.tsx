'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import {
  GET_ALL_COURSES,
  CREATE_COURSE_MUTATION,
  UPDATE_COURSE_MUTATION,
  DELETE_COURSE_MUTATION,
} from '@/graphql';
import { showErrorToast } from '@/lib/toast-error';
import { Button } from '@/components/ui/Button';
import { CourseForm } from '@/components/admin/courses/CourseForm';
import type { CourseSubmitInput } from '@/components/admin/courses/CourseForm.types';
import { LOCAL_REGION } from '@/constants/regions';
import {
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  BookOpen,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import Image from 'next/image';
import TiptapEditor from '@/lib/TiptapEditor';
export default function AdminCoursesPage() {
  // Query all courses
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_COURSES, {
    fetchPolicy: 'network-only',
  });

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

  const courses = data?.courses || [];
  console.log("courses me ye arha he ", courses)

  return (
    <div className="space-y-6 pb-12 relative min-h-[80vh]">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-text">Course Management</h2>
          <p className="text-sm text-text-secondary mt-1">
            Create, modify, toggle active status, and manage regional pricing of Quranic studies programs.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="gold" size="sm" onClick={openAddModal} leftIcon={<Plus size={16} />}>
            Add Course
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={14} />} />
        </div>
      </div>

      {/* Courses List Table */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          {courses.length === 0 ? (
            <div className="py-20 text-center text-text-secondary">
              <BookOpen size={48} className="mx-auto text-text-secondary/35 mb-4" />
              <p className="font-semibold">No courses created yet.</p>
              <p className="text-xs text-text-secondary mt-1">Get started by clicking the "Add Course" button above.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-light/45 text-text-secondary font-medium border-b border-border">
                  <th className="p-4 pl-6">Thumbnail</th>
                  <th className="p-4">Title & Description</th>
                  <th className="p-4">Class Type</th>
                  <th className="p-4">Local Price (PKR)</th>
                  <th className="p-4">Regions Priced</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course: any) => {
                  const packages = course.packages || [];
                  const localPackage = packages.find((pkg: any) => pkg.region === LOCAL_REGION);
                  const internationalRegionCount = new Set(
                    packages.filter((pkg: any) => pkg.region !== LOCAL_REGION).map((pkg: any) => pkg.region)
                  ).size;

                  return (
                    <tr key={course.id} className="hover:bg-surface-light/45 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="relative h-12 w-20 rounded-lg overflow-hidden bg-bg border border-border">
                          {course.imageUrl ? (
                            <Image
                              src={course.imageUrl}
                              alt={course.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-text-secondary">
                              <ImageIcon size={16} className="text-gold/40" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4 max-w-sm">
                        <div className="font-bold text-text text-sm truncate">{course.title}</div>
                        <div className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                          {course.description?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}
                        </div>
                      </td>
                      {/* class type  */}
                      <td className="p-4 font-bold text-gold">
                        <span className="text-xs text-text-secondary">{course.category}</span>
                      </td>
                      <td className="p-4 font-bold text-gold">
                        {localPackage ? `PKR ${localPackage.price}` : (
                          <span className="text-text-secondary font-normal">Not set</span>
                        )}
                      </td>
                      <td className="p-4 text-text-secondary">
                        {internationalRegionCount} region{internationalRegionCount === 1 ? '' : 's'}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleActive(course)}
                          className="inline-flex items-center justify-center focus:outline-none cursor-pointer text-text-secondary hover:text-gold transition-colors"
                          title={course.isActive ? 'Deactivate course' : 'Activate course'}
                        >
                          {course.isActive ? (
                            <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                              Active
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded-full text-xs font-semibold">
                              Inactive
                            </span>
                          )}
                        </button>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(course)}
                            className="h-8 w-8 rounded bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 flex items-center justify-center transition-all cursor-pointer"
                            title="Edit Course"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(course.id, course.title)}
                            className="h-8 w-8 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 flex items-center justify-center transition-all cursor-pointer"
                            title="Delete Course"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

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

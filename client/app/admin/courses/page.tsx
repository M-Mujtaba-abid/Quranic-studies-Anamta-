'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { 
  GET_ALL_COURSES,
  CREATE_COURSE_MUTATION,
  UPDATE_COURSE_MUTATION,
  DELETE_COURSE_MUTATION,
  GENERATE_UPLOAD_SIGNATURE
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  ToggleLeft, 
  ToggleRight, 
  BookOpen, 
  Upload, 
  X, 
  Check, 
  Image as ImageIcon 
} from 'lucide-react';
import Image from 'next/image';

interface CourseFormState {
  id?: string;
  title: string;
  description: string;
  duration: string;
  days: string;
  price: number;
  imageUrl: string;
  imageId: string;
  isActive: boolean;
}

const initialFormState: CourseFormState = {
  title: '',
  description: '',
  duration: '3 Months',
  days: '3 Days/Week',
  price: 0,
  imageUrl: '',
  imageId: '',
  isActive: true
};

export default function AdminCoursesPage() {
  // Query all courses
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_COURSES, {
    fetchPolicy: 'network-only',
  });

  // Modal and Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formState, setFormState] = useState<CourseFormState>(initialFormState);
  
  // Image upload states
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // Mutations
  const [createCourse, { loading: isCreating }] = useMutation<any, any>(CREATE_COURSE_MUTATION, {
    onCompleted: () => {
      toast.success('Course created successfully');
      closeModal();
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to create course', { description: err.message });
    }
  });

  const [updateCourse, { loading: isUpdating }] = useMutation<any, any>(UPDATE_COURSE_MUTATION, {
    onCompleted: () => {
      toast.success('Course updated successfully');
      closeModal();
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to update course', { description: err.message });
    }
  });

  const [deleteCourse] = useMutation<any, any>(DELETE_COURSE_MUTATION, {
    onCompleted: () => {
      toast.success('Course deleted successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to delete course', { description: err.message });
    }
  });

  const [generateUploadSignature] = useMutation<any, any>(GENERATE_UPLOAD_SIGNATURE);

  // Modal actions
  const openAddModal = () => {
    setFormState(initialFormState);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const openEditModal = (course: any) => {
    setFormState({
      id: course.id,
      title: course.title,
      description: course.description,
      duration: course.duration,
      days: course.days,
      price: course.price || 0,
      imageUrl: course.imageUrl,
      imageId: course.imageId,
      isActive: course.isActive
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormState(initialFormState);
    setImageFile(null);
    setUploadingImage(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormState(prev => ({ ...prev, [name]: checked }));
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

  // Image File Upload Flow
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setImageFile(file);

    try {
      setUploadingImage(true);
      
      // 1. Request signed credentials from backend
      const signatureResponse = await generateUploadSignature({
        variables: {
          input: { folder: 'courses' }
        }
      });

      const { timestamp, signature, apiKey, cloudName, folder } = signatureResponse.data.generateUploadSignature;

      // 2. Prepare FormData
      const uploadData = new FormData();
      uploadData.append('file', file);
      uploadData.append('api_key', apiKey);
      uploadData.append('timestamp', timestamp.toString());
      uploadData.append('signature', signature);
      uploadData.append('folder', folder);

      // 3. Post to Cloudinary direct upload endpoint
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: uploadData
      });

      if (!res.ok) {
        throw new Error('Cloudinary upload request failed');
      }

      const result = await res.json();
      
      // 4. Update Form State
      setFormState(prev => ({
        ...prev,
        imageUrl: result.secure_url,
        imageId: result.public_id
      }));

      toast.success('Image uploaded successfully');
    } catch (err: any) {
      console.error(err);
      toast.error('Image upload failed', { description: err.message || 'Check network connection' });
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.title || !formState.description) {
      toast.warning('Title and Description are required fields.');
      return;
    }

    if (isEditMode && formState.id) {
      await updateCourse({
        variables: {
          updateCourseInput: {
            id: formState.id,
            title: formState.title,
            description: formState.description,
            duration: formState.duration,
            days: formState.days,
            price: parseFloat(formState.price as any) || 0,
            imageUrl: formState.imageUrl,
            imageId: formState.imageId,
            isActive: formState.isActive
          }
        }
      });
    } else {
      await createCourse({
        variables: {
          createCourseInput: {
            title: formState.title,
            description: formState.description,
            duration: formState.duration,
            days: formState.days,
            price: parseFloat(formState.price as any) || 0,
            imageUrl: formState.imageUrl || '',
            imageId: formState.imageId || ''
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-text">Course Management</h2>
          <p className="text-sm text-text-secondary mt-1">
            Create, modify, toggle active status, and manage visual thumbnails of Quranic studies programs.
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
        <div className="overflow-x-auto">
          {courses.length === 0 ? (
            <div className="py-20 text-center text-text-secondary">
              <BookOpen size={48} className="mx-auto text-text-secondary/35 mb-4" />
              <p className="font-semibold">No courses created yet.</p>
              <p className="text-xs text-text-secondary mt-1">Get started by clicking the "Add Course" button above.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-dark/45 text-text-secondary font-medium border-b border-border">
                  <th className="p-4 pl-6">Thumbnail</th>
                  <th className="p-4">Title & Description</th>
                  <th className="p-4">Duration</th>
                  <th className="p-4">Days</th>
                  <th className="p-4">Price</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {courses.map((course: any) => (
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
                      <div className="text-xs text-text-secondary line-clamp-1 mt-0.5">{course.description}</div>
                    </td>
                    <td className="p-4 font-medium text-text">{course.duration}</td>
                    <td className="p-4 text-text-secondary">{course.days}</td>
                    <td className="p-4 font-bold text-gold">PKR {course.price}</td>
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
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Form Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface border border-border w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-scale-in">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-text">
                {isEditMode ? 'Edit Course Program' : 'Create New Course'}
              </h3>
              <button
                onClick={closeModal}
                className="p-1 rounded border border-border text-text-secondary hover:text-gold"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <Input
                  label="Course Title *"
                  name="title"
                  value={formState.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Online Tajweed Course"
                  required
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formState.description}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Provide a detailed overview of the syllabus and target audience..."
                    className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold placeholder:text-text-secondary/40"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Duration
                    </label>
                    <select
                      name="duration"
                      value={formState.duration}
                      onChange={handleInputChange}
                      className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                    >
                      {['1 Month', '3 Months', '6 Months', '12 Months', 'Ongoing'].map(dur => (
                        <option key={dur} value={dur}>{dur}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                      Schedule Frequency
                    </label>
                    <select
                      name="days"
                      value={formState.days}
                      onChange={handleInputChange}
                      className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                    >
                      {['2 Days/Week', '3 Days/Week', '5 Days/Week', 'Weekend Only'].map(dy => (
                        <option key={dy} value={dy}>{dy}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price input */}
                <div className="space-y-1.5">
                  <Input
                    label="Price (PKR) *"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 3500"
                    value={formState.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                {/* Cloudinary Upload Widget */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Course Thumbnail Image
                  </label>
                  
                  <div className="flex items-center gap-4 border border-border bg-surface-dark/45 p-4 rounded-xl">
                    <div className="relative h-16 w-24 bg-bg border border-border rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center text-text-secondary">
                      {formState.imageUrl ? (
                        <Image
                          src={formState.imageUrl}
                          alt="Thumbnail Preview"
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      ) : (
                        <ImageIcon size={20} className="text-text-secondary/40" />
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="relative">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          id="admin-image-upload"
                          className="hidden"
                          disabled={uploadingImage}
                        />
                        <label
                          htmlFor="admin-image-upload"
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg text-xs font-semibold text-text-secondary hover:text-gold hover:border-gold cursor-pointer transition-all ${
                            uploadingImage ? 'opacity-50 pointer-events-none' : ''
                          }`}
                        >
                          {uploadingImage ? (
                            <>
                              <RefreshCw size={12} className="animate-spin" />
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <Upload size={12} />
                              <span>Choose Image</span>
                            </>
                          )}
                        </label>
                      </div>
                      <p className="text-[10px] text-text-secondary">
                        PNG, JPG, or WEBP up to 5MB. Uploaded directly and securely.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Active Checkbox (Edit mode) */}
                {isEditMode && (
                  <div className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formState.isActive}
                      onChange={handleCheckboxChange}
                      id="course-active-checkbox"
                      className="rounded text-gold focus:ring-gold border-border cursor-pointer h-4 w-4 bg-bg"
                    />
                    <label htmlFor="course-active-checkbox" className="text-sm font-medium text-text select-none cursor-pointer">
                      Publish and make this course active for student enrollment
                    </label>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-border flex items-center justify-end gap-3 bg-surface-dark/25">
                <Button type="button" variant="outline" size="sm" onClick={closeModal}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="gold" 
                  size="sm" 
                  isLoading={isCreating || isUpdating}
                >
                  {isEditMode ? 'Save Changes' : 'Create Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

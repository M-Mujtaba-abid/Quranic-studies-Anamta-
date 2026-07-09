'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { 
  GET_ALL_TESTIMONIALS,
  APPROVE_TESTIMONIAL,
  REJECT_TESTIMONIAL,
  UPDATE_TESTIMONIAL,
  DELETE_TESTIMONIAL
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  MessageSquare,
  Check,
  X,
  Edit2,
  Trash2,
  Star,
  RefreshCw,
  Globe,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';

interface TestimonialFormState {
  id: string;
  name: string;
  gender: 'MALE' | 'FEMALE';
  country: string;
  rating: number;
  description: string;
}

const initialFormState: TestimonialFormState = {
  id: '',
  name: '',
  gender: 'MALE',
  country: '',
  rating: 5,
  description: ''
};

export default function AdminTestimonials() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formState, setFormState] = useState<TestimonialFormState>(initialFormState);

  // Queries
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_TESTIMONIALS, {
    fetchPolicy: 'network-only'
  });

  // Mutations
  const [approveTestimonial, { loading: isApproving }] = useMutation(APPROVE_TESTIMONIAL, {
    onCompleted: () => {
      toast.success('Testimonial approved successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to approve testimonial', { description: err.message });
    }
  });

  const [rejectTestimonial, { loading: isRejecting }] = useMutation(REJECT_TESTIMONIAL, {
    onCompleted: () => {
      toast.success('Testimonial rejected successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to reject testimonial', { description: err.message });
    }
  });

  const [updateTestimonial, { loading: isUpdating }] = useMutation(UPDATE_TESTIMONIAL, {
    onCompleted: () => {
      toast.success('Testimonial updated successfully');
      setIsModalOpen(false);
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to update testimonial', { description: err.message });
    }
  });

  const [deleteTestimonial, { loading: isDeleting }] = useMutation(DELETE_TESTIMONIAL, {
    onCompleted: () => {
      toast.success('Testimonial deleted successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to delete testimonial', { description: err.message });
    }
  });

  const handleApprove = async (id: string) => {
    await approveTestimonial({ variables: { id } });
  };

  const handleReject = async (id: string) => {
    await rejectTestimonial({ variables: { id } });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this testimonial?')) {
      await deleteTestimonial({ variables: { id } });
    }
  };

  const openEditModal = (t: any) => {
    setFormState({
      id: t.id,
      name: t.name,
      gender: t.gender,
      country: t.country,
      rating: t.rating,
      description: t.description
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name.trim() || !formState.country.trim() || !formState.description.trim()) {
      toast.warning('Please fill out all required fields.');
      return;
    }

    await updateTestimonial({
      variables: {
        updateTestimonialInput: {
          id: formState.id,
          name: formState.name.trim(),
          gender: formState.gender,
          country: formState.country.trim(),
          rating: formState.rating,
          description: formState.description.trim()
        }
      }
    });
  };

  if (loading && !data) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 text-gold animate-spin" />
        <p className="text-text-secondary font-medium animate-pulse">Loading testimonials...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
          <X size={32} />
        </div>
        <h3 className="text-xl font-bold font-display">Failed to load testimonials</h3>
        <p className="text-text-secondary max-w-md">{error.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      </div>
    );
  }

  const testimonials = data?.testimonials || [];

  // Filter calculations
  const totalCount = testimonials.length;
  const pendingCount = testimonials.filter((t: any) => t.status === 'PENDING').length;
  const approvedCount = testimonials.filter((t: any) => t.status === 'APPROVED').length;
  const rejectedCount = testimonials.filter((t: any) => t.status === 'REJECTED').length;

  const filteredTestimonials = testimonials.filter((t: any) => {
    if (activeTab === 'ALL') return true;
    return t.status === activeTab;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-text">Testimonial Reviews</h2>
          <p className="text-sm text-text-secondary mt-1">
            Review, approve, reject, edit, and delete student feedback displayed on the home page.
          </p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={14} />} />
        </div>
      </div>

      {/* Analytics stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Total Reviews</span>
          <span className="text-2xl font-bold font-display text-text mt-2 block">{totalCount}</span>
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Pending Approval</span>
          <span className="text-2xl font-bold font-display text-amber-500 mt-2 block">{pendingCount}</span>
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Approved / Active</span>
          <span className="text-2xl font-bold font-display text-emerald-500 mt-2 block">{approvedCount}</span>
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Rejected Reviews</span>
          <span className="text-2xl font-bold font-display text-red-500 mt-2 block">{rejectedCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-border/80 pb-px">
        {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => {
          const tabLabel = tab === 'ALL' ? 'All Reviews' : tab.charAt(0) + tab.slice(1).toLowerCase();
          const tabCount = tab === 'ALL' ? totalCount : tab === 'PENDING' ? pendingCount : tab === 'APPROVED' ? approvedCount : rejectedCount;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs uppercase font-bold tracking-wider border-b-2 cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'border-gold text-gold font-bold'
                  : 'border-transparent text-text-secondary hover:text-text hover:border-border'
              }`}
            >
              {tabLabel} <span className="ml-1 px-1.5 py-0.5 rounded bg-bg text-[10px] text-text-secondary">{tabCount}</span>
            </button>
          );
        })}
      </div>

      {/* Testimonials List */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          {filteredTestimonials.length === 0 ? (
            <div className="py-20 text-center text-text-secondary">
              <MessageSquare size={48} className="mx-auto text-text-secondary/35 mb-4" />
              <p className="font-semibold">No reviews found.</p>
              <p className="text-xs text-text-secondary mt-1">There are no reviews matching the selected filter.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-surface-dark/45 text-text-secondary font-medium border-b border-border">
                  <th className="p-4 pl-6">Student Info</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Rating</th>
                  <th className="p-4 max-w-md">Review Message</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredTestimonials.map((t: any) => (
                  <tr key={t.id} className="hover:bg-surface-light/45 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-bold text-text text-sm">{t.name}</div>
                      <div className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                        <Globe size={11} className="text-gold" />
                        <span>{t.country}</span>
                      </div>
                    </td>
                    <td className="p-4 text-text-secondary text-xs uppercase font-semibold">
                      {t.gender.toLowerCase()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-0.5 text-gold">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star 
                            key={idx} 
                            size={12} 
                            className={idx < t.rating ? "fill-gold text-gold" : "text-text-secondary/20"} 
                          />
                        ))}
                      </div>
                    </td>
                    <td className="p-4 max-w-md">
                      <p className="text-xs text-text-secondary leading-relaxed line-clamp-3">
                        "{t.description}"
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                        t.status === 'APPROVED'
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                          : t.status === 'REJECTED'
                          ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                          : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {t.status !== 'APPROVED' && (
                          <button
                            onClick={() => handleApprove(t.id)}
                            disabled={isApproving}
                            title="Approve Review"
                            className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Check size={14} />
                          </button>
                        )}
                        {t.status !== 'REJECTED' && (
                          <button
                            onClick={() => handleReject(t.id)}
                            disabled={isRejecting}
                            title="Reject Review"
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                          >
                            <X size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => openEditModal(t)}
                          title="Edit Review"
                          className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-text hover:border-gold hover:text-gold transition-all cursor-pointer"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={isDeleting}
                          title="Delete Review"
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
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

      {/* Edit Testimonial Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          
          <form 
            onSubmit={handleEditSubmit}
            className="glass max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-gold/30 glow-gold relative space-y-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-gold p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold font-display text-text">Edit Student Testimonial</h3>
              <p className="text-xs text-text-secondary mt-1">Modify testimonial properties.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Student Name"
                name="name"
                value={formState.name}
                onChange={handleInputChange}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formState.gender}
                  onChange={handleInputChange}
                  className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Country / Flag"
                name="country"
                value={formState.country}
                onChange={handleInputChange}
                required
              />
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Rating
                </label>
                <select
                  name="rating"
                  value={formState.rating}
                  onChange={handleInputChange}
                  className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold"
                >
                  {[5, 4, 3, 2, 1].map(r => (
                    <option key={r} value={r}>{r} Stars</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Review Description
              </label>
              <textarea
                name="description"
                value={formState.description}
                onChange={handleInputChange}
                rows={5}
                required
                className="w-full bg-bg border border-border rounded-xl p-3 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                className="flex-1"
                isLoading={isUpdating}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

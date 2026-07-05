'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { 
  GET_ALL_ENROLLMENTS, 
  UPDATE_ENROLLMENT_MUTATION, 
  DELETE_ENROLLMENT_MUTATION 
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import {
  ClipboardList,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Edit2,
  Trash2,
  Calendar,
  User,
  BookOpen,
  DollarSign,
  X
} from 'lucide-react';

export default function AdminEnrollmentsPage() {
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_ENROLLMENTS, {
    fetchPolicy: 'network-only'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Edit Modal States
  const [editingEnrollment, setEditingEnrollment] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    preferredHour: 5,
    preferredMinute: 0,
    preferredPeriod: 'PM',
    preferredDays: '',
    status: 'PENDING'
  });

  // Mutations
  const [updateEnrollment, { loading: updating }] = useMutation<any, any>(UPDATE_ENROLLMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Enrollment updated successfully');
      setEditingEnrollment(null);
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to update enrollment', { description: err.message });
    }
  });

  const [deleteEnrollment, { loading: deleting }] = useMutation<any, any>(DELETE_ENROLLMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Enrollment deleted successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to delete enrollment', { description: err.message });
    }
  });

  const enrollments = data?.enrollments || [];

  // Filter & Search Logic
  const filteredEnrollments = enrollments.filter((enrollment: any) => {
    const studentName = `${enrollment.student?.firstName} ${enrollment.student?.lastName}`.toLowerCase();
    const courseTitle = enrollment.course?.title.toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase()) || courseTitle.includes(searchTerm.toLowerCase());
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && enrollment.status === statusFilter;
  });

  const handleEditClick = (enrollment: any) => {
    setEditingEnrollment(enrollment);
    setEditForm({
      preferredHour: enrollment.preferredHour ?? 5,
      preferredMinute: enrollment.preferredMinute ?? 0,
      preferredPeriod: enrollment.preferredPeriod ?? 'PM',
      preferredDays: enrollment.preferredDays ?? '',
      status: enrollment.status
    });
  };

  // Preferred schedule fields only apply to local (Pakistan) enrollments —
  // international enrollments have no schedule, so they're left untouched here.
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEnrollment) return;

    const isLocalEnrollment = editingEnrollment.preferredHour != null;

    await updateEnrollment({
      variables: {
        updateEnrollmentInput: {
          id: editingEnrollment.id,
          status: editForm.status as any,
          ...(isLocalEnrollment && {
            preferredHour: parseInt(editForm.preferredHour as any),
            preferredMinute: parseInt(editForm.preferredMinute as any),
            preferredPeriod: editForm.preferredPeriod,
            preferredDays: editForm.preferredDays,
          }),
        }
      }
    });
  };

  const handleDeleteClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this enrollment? This action cannot be undone.')) {
      await deleteEnrollment({ variables: { id } });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold text-[10px]">
            <CheckCircle size={10} /> Approved
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-semibold text-[10px]">
            <Clock size={10} /> Pending
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-semibold text-[10px]">
            <XCircle size={10} /> Rejected
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/20 text-gold border border-gold/20 font-semibold text-[10px]">
            <CheckCircle size={10} /> Completed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-text">Enrollments</h1>
          <p className="text-xs text-text-secondary">Approve trial enrollments, edit class schedules, and review student applications.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
        >
          Refresh Log
        </Button>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search by student or course name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 bg-surface/50 border border-border p-1 rounded-xl">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status 
                  ? 'bg-gold text-primary-dark shadow-sm'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="h-60 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-8 w-8 text-gold animate-spin" />
          <p className="text-xs text-text-secondary font-medium animate-pulse">Loading enrollments...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center space-y-2">
          <p className="text-sm font-semibold text-red-500">Failed to load enrollments</p>
          <p className="text-xs text-text-secondary">{error.message}</p>
        </div>
      )}

      {/* Enrollments Table */}
      {!loading && !error && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-md">
          {filteredEnrollments.length === 0 ? (
            <div className="py-12 text-center text-text-secondary space-y-2">
              <ClipboardList size={40} className="mx-auto text-border" />
              <p className="text-sm font-medium">No enrollments found</p>
              <p className="text-xs">No records matched the selected status or search keywords.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-bg/50 text-text-secondary uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Schedule Details</th>
                    <th className="py-3 px-4">Receipt Status</th>
                    <th className="py-3 px-4">Enrollment Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredEnrollments.map((enrollment: any) => (
                    <tr key={enrollment.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-text">
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-gold shrink-0" />
                          <div>
                            <span className="block text-text">{enrollment.student?.firstName} {enrollment.student?.lastName}</span>
                            <span className="text-[10px] text-text-secondary font-mono select-all block">{enrollment.student?.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <BookOpen size={13} className="text-gold shrink-0" />
                          <span className="font-medium text-text">{enrollment.course?.title}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary space-y-0.5">
                        {enrollment.preferredHour != null ? (
                          <>
                            <div className="flex items-center gap-1">
                              <Clock size={11} className="text-gold shrink-0" />
                              <span>
                                {enrollment.preferredHour.toString().padStart(2, '0')}:
                                {enrollment.preferredMinute.toString().padStart(2, '0')} {enrollment.preferredPeriod}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar size={11} className="text-gold shrink-0" />
                              <span className="truncate max-w-[140px]" title={enrollment.preferredDays}>{enrollment.preferredDays}</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center gap-1">
                            <DollarSign size={11} className="text-gold shrink-0" />
                            <span>
                              {enrollment.packageTier && enrollment.packageTier !== 'NONE' ? `${enrollment.packageTier}` : 'International'}
                              {enrollment.enrollmentType === 'FREE_TRIAL' ? ' (Free Trial)' : ''}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {enrollment.payment ? (
                          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded font-semibold text-[9px] ${
                            enrollment.payment.status === 'PAID'
                              ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-500'
                              : enrollment.payment.status === 'UNDER_REVIEW'
                              ? 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 animate-pulse'
                              : 'bg-red-500/10 border border-red-500/25 text-red-500'
                          }`}>
                            <DollarSign size={8} /> {enrollment.payment.status}
                          </span>
                        ) : (
                          <span className="text-text-secondary italic text-[10px]">No receipt uploaded</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(enrollment.status)}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        {new Date(enrollment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleEditClick(enrollment)}
                          leftIcon={<Edit2 size={11} />}
                          className="text-[10px] py-1 px-2.5 rounded-md"
                        >
                          Modify
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(enrollment.id)}
                          leftIcon={<Trash2 size={11} />}
                          className="text-[10px] py-1 px-2 rounded-md hover:border-red-500 hover:text-red-500 border-border/60"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Edit Schedule/Status Modal */}
      {editingEnrollment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg/50">
              <h3 className="text-sm font-bold font-display text-text">Edit Enrollment Details</h3>
              <button 
                onClick={() => setEditingEnrollment(null)}
                className="p-1 rounded-lg border border-border/80 text-text-secondary hover:text-text transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Enrollment Brief */}
              <div className="bg-bg/40 border border-border/40 p-3 rounded-lg space-y-1">
                <p className="text-text-secondary"><span className="text-text font-medium">Student:</span> {editingEnrollment.student?.firstName} {editingEnrollment.student?.lastName}</p>
                <p className="text-text-secondary"><span className="text-text font-medium">Course:</span> {editingEnrollment.course?.title}</p>
              </div>

              {/* Status */}
              <div className="space-y-1.5">
                <label className="block text-text-secondary font-medium">Enrollment Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-surface border border-border rounded-lg py-2 px-3 text-text focus:outline-none focus:border-gold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="APPROVED">APPROVED</option>
                  <option value="REJECTED">REJECTED</option>
                  <option value="COMPLETED">COMPLETED</option>
                </select>
              </div>

              {/* Timing (local/Pakistan enrollments only) */}
              {editingEnrollment.preferredHour != null ? (
                <>
                  <div className="space-y-1.5">
                    <label className="block text-text-secondary font-medium">Preferred Time</label>
                    <div className="flex gap-2 bg-surface border border-border p-2 rounded-lg items-center">
                      <select
                        value={editForm.preferredHour}
                        onChange={(e) => setEditForm({ ...editForm, preferredHour: parseInt(e.target.value) })}
                        className="bg-transparent border-0 text-text font-semibold focus:outline-none cursor-pointer flex-1"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                          <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      <span>:</span>
                      <select
                        value={editForm.preferredMinute}
                        onChange={(e) => setEditForm({ ...editForm, preferredMinute: parseInt(e.target.value) })}
                        className="bg-transparent border-0 text-text font-semibold focus:outline-none cursor-pointer flex-1"
                      >
                        {[0, 15, 30, 45].map(m => (
                          <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      <select
                        value={editForm.preferredPeriod}
                        onChange={(e) => setEditForm({ ...editForm, preferredPeriod: e.target.value })}
                        className="bg-transparent border-0 text-text font-semibold focus:outline-none cursor-pointer flex-1"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Days */}
                  <Input
                    label="Preferred Days (comma separated)"
                    value={editForm.preferredDays}
                    onChange={(e) => setEditForm({ ...editForm, preferredDays: e.target.value })}
                    required
                  />
                </>
              ) : (
                <p className="text-text-secondary italic bg-bg/40 border border-border/40 p-3 rounded-lg">
                  This is an international enrollment ({editingEnrollment.packageTier}
                  {editingEnrollment.enrollmentType === 'FREE_TRIAL' ? ', Free Trial' : ''}) — no schedule to edit, only status.
                </p>
              )}

              <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setEditingEnrollment(null)}
                  disabled={updating}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="gold" 
                  size="sm" 
                  isLoading={updating}
                >
                  Save Changes
                </Button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { 
  GET_ALL_PAYMENTS, 
  APPROVE_PAYMENT_MUTATION, 
  REJECT_PAYMENT_MUTATION 
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import {
  CreditCard,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  FileText,
  DollarSign,
  Calendar,
  ExternalLink,
  X
} from 'lucide-react';
import Image from 'next/image';

export default function AdminPaymentsPage() {
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_PAYMENTS, {
    fetchPolicy: 'network-only'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Note/Verification Modal states
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [adminNote, setAdminNote] = useState('');
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);

  // Lightbox Receipt Modal
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  // Mutations
  const [approvePayment, { loading: approving }] = useMutation<any, any>(APPROVE_PAYMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Payment approved successfully');
      closeActionModal();
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to approve payment', { description: err.message });
    }
  });

  const [rejectPayment, { loading: rejecting }] = useMutation<any, any>(REJECT_PAYMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Payment rejected successfully');
      closeActionModal();
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to reject payment', { description: err.message });
    }
  });

  const payments = data?.payments || [];

  // Filter & Search Logic
  const filteredPayments = payments.filter((payment: any) => {
    const studentName = `${payment.enrollment?.student?.firstName} ${payment.enrollment?.student?.lastName}`.toLowerCase();
    const transactionId = (payment.transactionId || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = studentName.includes(query) || transactionId.includes(query);
    
    if (statusFilter === 'ALL') return matchesSearch;
    return matchesSearch && payment.status === statusFilter;
  });

  const handleActionClick = (payment: any, type: 'APPROVE' | 'REJECT') => {
    setSelectedPayment(payment);
    setActionType(type);
    setAdminNote(payment.adminNote || '');
  };

  const closeActionModal = () => {
    setSelectedPayment(null);
    setActionType(null);
    setAdminNote('');
  };

  const handleActionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment || !actionType) return;

    if (actionType === 'APPROVE') {
      await approvePayment({
        variables: {
          id: selectedPayment.id,
          adminNote: adminNote.trim() || undefined
        }
      });
    } else {
      if (!adminNote.trim()) {
        toast.warning('Please enter a rejection reason in the notes field.');
        return;
      }
      await rejectPayment({
        variables: {
          id: selectedPayment.id,
          adminNote: adminNote.trim()
        }
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold text-[10px]">
            <CheckCircle size={10} /> Paid
          </span>
        );
      case 'UNDER_REVIEW':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-semibold text-[10px] animate-pulse">
            <Clock size={10} /> Under Review
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-semibold text-[10px]">
            <XCircle size={10} /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-text">Payments</h1>
          <p className="text-xs text-text-secondary">Verify and validate bank transfers, JazzCash, and EasyPaisa payments submitted by students.</p>
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

      {/* Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="max-w-md w-full">
          <Input
            placeholder="Search by student name or transaction ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 bg-surface/50 border border-border p-1 rounded-xl">
          {['ALL', 'UNDER_REVIEW', 'PAID', 'REJECTED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status 
                  ? 'bg-gold text-primary-dark shadow-sm'
                  : 'text-text-secondary hover:text-text'
              }`}
            >
              {status === 'UNDER_REVIEW' ? 'UNDER REVIEW' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="h-60 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-8 w-8 text-gold animate-spin" />
          <p className="text-xs text-text-secondary font-medium animate-pulse">Loading payments...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center space-y-2">
          <p className="text-sm font-semibold text-red-500">Failed to load payments</p>
          <p className="text-xs text-text-secondary">{error.message}</p>
        </div>
      )}

      {/* Payments Table */}
      {!loading && !error && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-md">
          {filteredPayments.length === 0 ? (
            <div className="py-12 text-center text-text-secondary space-y-2">
              <CreditCard size={40} className="mx-auto text-border" />
              <p className="text-sm font-medium">No payments found</p>
              <p className="text-xs">No records matched the selected filters or search parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-bg/50 text-text-secondary uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Transferred</th>
                    <th className="py-3 px-4">Method & Trans ID</th>
                    <th className="py-3 px-4">Receipt Screenshot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredPayments.map((payment: any) => (
                    <tr key={payment.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-text">
                        <span className="block">{payment.enrollment?.student?.firstName} {payment.enrollment?.student?.lastName}</span>
                        <span className="text-[10px] text-text-secondary font-mono block">{payment.enrollment?.student?.email}</span>
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary font-medium">
                        {payment.enrollment?.course?.title}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-text">
                        <span className="flex items-center text-gold">
                          PKR {payment.amount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5 text-text-secondary">
                        <span className="font-semibold text-text text-[10px] uppercase block">
                          {payment.paymentMethod.replace('_', ' ')}
                        </span>
                        <span className="font-mono text-[10px] block truncate max-w-[120px]" title={payment.transactionId}>
                          Ref: {payment.transactionId || 'N/A'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {payment.screenshotUrl ? (
                          <button
                            onClick={() => setPreviewScreenshotUrl(payment.screenshotUrl)}
                            className="flex items-center gap-1 text-[10px] font-semibold text-gold hover:text-gold-light bg-gold/10 hover:bg-gold/20 px-2 py-1 rounded border border-gold/20 cursor-pointer"
                          >
                            <Eye size={10} /> View Receipt
                          </button>
                        ) : (
                          <span className="italic text-text-secondary">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} className="text-gold" />
                          <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                        {payment.status === 'UNDER_REVIEW' && (
                          <>
                            <button
                              onClick={() => handleActionClick(payment, 'APPROVE')}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleActionClick(payment, 'REJECT')}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                            >
                              Reject
                            </button>
                          </>
                        )}
                        {payment.status !== 'UNDER_REVIEW' && (
                          <button
                            onClick={() => {
                              setSelectedPayment(payment);
                              setActionType(null); // Just view details/notes
                              setAdminNote(payment.adminNote || '');
                            }}
                            className="bg-primary/20 hover:bg-primary/30 border border-primary-light/20 text-text font-semibold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors"
                          >
                            Logs
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Verification / Logs Action Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border w-full max-w-md rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg/50">
              <h3 className="text-sm font-bold font-display text-text">
                {actionType === 'APPROVE' 
                  ? 'Approve Payment Registration' 
                  : actionType === 'REJECT' 
                  ? 'Reject Payment Registration' 
                  : 'Verification Logs'}
              </h3>
              <button 
                onClick={closeActionModal}
                className="p-1 rounded-lg border border-border/80 text-text-secondary hover:text-text transition-all cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleActionSubmit} className="p-6 space-y-4 text-xs">
              
              {/* Payment Info */}
              <div className="bg-bg/40 border border-border/40 p-3.5 rounded-xl space-y-1.5">
                <p className="text-text-secondary"><span className="text-text font-medium">Student:</span> {selectedPayment.enrollment?.student?.firstName} {selectedPayment.enrollment?.student?.lastName}</p>
                <p className="text-text-secondary"><span className="text-text font-medium">Course:</span> {selectedPayment.enrollment?.course?.title}</p>
                <p className="text-text-secondary"><span className="text-text font-medium">Transferred:</span> PKR {selectedPayment.amount} via {selectedPayment.paymentMethod.replace('_', ' ')}</p>
                {selectedPayment.transactionId && (
                  <p className="text-text-secondary"><span className="text-text font-medium">Reference Code:</span> {selectedPayment.transactionId}</p>
                )}
              </div>

              {/* Action specific instructions */}
              {actionType === 'APPROVE' && (
                <p className="text-emerald-500/90 font-medium">
                  Approving this will update the enrollment status to APPROVED and mark this payment as PAID. An email confirmation will be sent to the student.
                </p>
              )}

              {actionType === 'REJECT' && (
                <p className="text-red-500/90 font-medium">
                  Rejecting this payment will inform the student to submit a new receipt. You must specify the rejection reason below.
                </p>
              )}

              {/* Admin Note Input */}
              <div className="space-y-1.5">
                <label className="block text-text-secondary font-medium">
                  {actionType === 'REJECT' ? 'Rejection Reason *' : 'Administrator Note / Comments'}
                </label>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  placeholder={actionType === 'REJECT' ? "Specify why the transfer receipt is invalid..." : "Add comments or private logs..."}
                  className="w-full h-24 bg-surface border border-border rounded-lg py-2 px-3 text-text focus:outline-none focus:border-gold resize-none"
                  required={actionType === 'REJECT'}
                  disabled={approving || rejecting}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t border-border mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={closeActionModal}
                  disabled={approving || rejecting}
                >
                  Cancel
                </Button>

                {actionType === 'APPROVE' && (
                  <Button 
                    type="submit" 
                    variant="gold" 
                    size="sm" 
                    isLoading={approving}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                  >
                    Confirm Approval
                  </Button>
                )}

                {actionType === 'REJECT' && (
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="sm" 
                    isLoading={rejecting}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    Confirm Rejection
                  </Button>
                )}

                {!actionType && (
                  <Button 
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={closeActionModal}
                  >
                    Dismiss
                  </Button>
                )}
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Lightbox Modal for Receipt Screenshot preview */}
      {previewScreenshotUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="relative max-w-3xl w-full h-full max-h-[85vh] flex flex-col justify-center items-center">
            <button 
              onClick={() => setPreviewScreenshotUrl(null)}
              className="absolute top-0 right-0 p-2.5 rounded-full bg-surface border border-border text-text hover:text-gold transition-all z-10 cursor-pointer shadow-lg"
              title="Close image"
            >
              <X size={20} />
            </button>
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-border bg-surface flex items-center justify-center p-2">
              <img
                src={previewScreenshotUrl}
                alt="Receipt screenshot proof"
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

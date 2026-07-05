'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_ALL_DONATIONS, UPDATE_DONATION_STATUS_MUTATION } from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import {
  HandCoins,
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Calendar,
  X,
} from 'lucide-react';

const DONATION_TYPE_LABELS: Record<string, string> = {
  LILLAH: 'Lillah',
  SADAQAH_JARIYAH: 'Sadaqah Jariyah',
  SADAQAH_NAFILLAH: 'Sadaqah Nafillah',
  ZAKAT: 'Zakat',
};

export default function AdminDonationsPage() {
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_DONATIONS, {
    fetchPolicy: 'network-only',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Lightbox Receipt Modal
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  const [updateDonationStatus] = useMutation<any, any>(UPDATE_DONATION_STATUS_MUTATION, {
    onCompleted: (res) => {
      const status = res?.updateDonationStatus?.status;
      toast.success(`Donation marked as ${status === 'COMPLETED' ? 'Completed' : 'Failed'}`);
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to update donation status', { description: err.message });
    },
  });

  const donations = data?.donations || [];

  // Filter & Search Logic
  const filteredDonations = donations.filter((donation: any) => {
    const donorName = (donation.donorName || '').toLowerCase();
    const email = (donation.email || '').toLowerCase();
    const query = searchTerm.toLowerCase();

    const matchesSearch = donorName.includes(query) || email.includes(query);
    const matchesType = typeFilter === 'ALL' || donation.type === typeFilter;
    const matchesStatus = statusFilter === 'ALL' || donation.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const handleStatusChange = (donation: any, status: 'COMPLETED' | 'FAILED') => {
    const verb = status === 'COMPLETED' ? 'Completed' : 'Failed';
    if (!confirm(`Are you sure you want to mark this donation as ${verb}?`)) return;

    updateDonationStatus({
      variables: {
        updateDonationStatusInput: { id: donation.id, status },
      },
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold text-[10px]">
            <CheckCircle size={10} /> Completed
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-semibold text-[10px] animate-pulse">
            <Clock size={10} /> Pending
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-semibold text-[10px]">
            <XCircle size={10} /> Failed
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
          <h1 className="text-2xl font-bold font-display tracking-tight text-text">Donations</h1>
          <p className="text-xs text-text-secondary">Verify donor transfer receipts submitted via Sponsor a Student.</p>
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
            placeholder="Search by donor name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Type Filters */}
          <div className="flex flex-wrap gap-1.5 bg-surface/50 border border-border p-1 rounded-xl">
            {['ALL', 'LILLAH', 'SADAQAH_JARIYAH', 'SADAQAH_NAFILLAH', 'ZAKAT'].map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  typeFilter === type
                    ? 'bg-gold text-primary-dark shadow-sm'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                {type === 'ALL' ? 'ALL' : DONATION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-1.5 bg-surface/50 border border-border p-1 rounded-xl">
            {['ALL', 'PENDING', 'COMPLETED', 'FAILED'].map((status) => (
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
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="h-60 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-8 w-8 text-gold animate-spin" />
          <p className="text-xs text-text-secondary font-medium animate-pulse">Loading donations...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center space-y-2">
          <p className="text-sm font-semibold text-red-500">Failed to load donations</p>
          <p className="text-xs text-text-secondary">{error.message}</p>
        </div>
      )}

      {/* Donations Table */}
      {!loading && !error && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-md">
          {filteredDonations.length === 0 ? (
            <div className="py-12 text-center text-text-secondary space-y-2">
              <HandCoins size={40} className="mx-auto text-border" />
              <p className="text-sm font-medium">No donations found</p>
              <p className="text-xs">No records matched the selected filters or search parameters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-bg/50 text-text-secondary uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-3 px-4">Donor</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Screenshot</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Submitted</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredDonations.map((donation: any) => (
                    <tr key={donation.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-text">
                        <span className="block">{donation.donorName || 'Anonymous'}</span>
                        <span className="text-[10px] text-text-secondary font-mono block">
                          {donation.email || 'No email provided'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary font-medium">
                        {DONATION_TYPE_LABELS[donation.type] ?? donation.type}
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-text">
                        <span className="flex items-center text-gold">
                          {donation.currency} {donation.amount}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {donation.screenshotUrl ? (
                          <button
                            onClick={() => setPreviewScreenshotUrl(donation.screenshotUrl)}
                            className="flex items-center gap-1 text-[10px] font-semibold text-gold hover:text-gold-light bg-gold/10 hover:bg-gold/20 px-2 py-1 rounded border border-gold/20 cursor-pointer"
                          >
                            <Eye size={10} /> View Screenshot
                          </button>
                        ) : (
                          <span className="italic text-text-secondary">N/A</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {getStatusBadge(donation.status)}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Calendar size={11} className="text-gold" />
                          <span>{new Date(donation.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1">
                        {donation.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(donation, 'COMPLETED')}
                              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                            >
                              Mark Completed
                            </button>
                            <button
                              onClick={() => handleStatusChange(donation, 'FAILED')}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold text-[10px] px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm"
                            >
                              Mark Failed
                            </button>
                          </>
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

      {/* Lightbox Modal for Screenshot preview */}
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
                alt="Donation transfer screenshot proof"
                className="max-w-full max-h-full object-contain rounded-xl"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

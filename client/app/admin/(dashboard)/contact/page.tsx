'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import {
  GET_ALL_CONTACT_MESSAGES,
  MARK_CONTACT_MESSAGE_AS_READ,
  REPLY_TO_CONTACT_MESSAGE,
  DELETE_CONTACT_MESSAGE
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { showErrorToast } from '@/lib/toast-error';
import {
  Mail,
  Check,
  Trash2,
  RefreshCw,
  Eye,
  Send,
  X,
  MessageSquare,
  Globe
} from 'lucide-react';

interface ReplyState {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  replyContent: string;
}

const initialReplyState: ReplyState = {
  id: '',
  name: '',
  email: '',
  subject: '',
  message: '',
  replyContent: ''
};

export default function AdminContactMessages() {
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null);
  const [replyState, setReplyState] = useState<ReplyState>(initialReplyState);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  // Queries
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_CONTACT_MESSAGES, {
    fetchPolicy: 'network-only'
  });

  // Mutations
  const [markAsRead, { loading: isMarking }] = useMutation(MARK_CONTACT_MESSAGE_AS_READ, {
    onCompleted: () => {
      toast.success('Message marked as read');
      refetch();
    },
    onError: (err) => {
      showErrorToast('Failed to mark message as read', err);
    }
  });

  const [sendReply, { loading: isSendingReply }] = useMutation(REPLY_TO_CONTACT_MESSAGE, {
    onCompleted: () => {
      toast.success('Reply sent successfully via email');
      setIsReplyModalOpen(false);
      setReplyState(initialReplyState);
      refetch();
    },
    onError: (err) => {
      showErrorToast('Failed to send reply email', err);
    }
  });

  const [deleteMessage, { loading: isDeleting }] = useMutation(DELETE_CONTACT_MESSAGE, {
    onCompleted: () => {
      toast.success('Contact message deleted successfully');
      refetch();
    },
    onError: (err) => {
      showErrorToast('Failed to delete message', err);
    }
  });

  const handleMarkAsRead = async (id: string) => {
    await markAsRead({ variables: { id } });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this message?')) {
      await deleteMessage({ variables: { id } });
    }
  };

  const openReplyModal = (msg: any) => {
    setReplyState({
      id: msg.id,
      name: msg.name,
      email: msg.email,
      subject: msg.subject,
      message: msg.message,
      replyContent: ''
    });
    setIsReplyModalOpen(true);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyState.replyContent.trim()) {
      toast.warning('Please enter your reply message.');
      return;
    }

    await sendReply({
      variables: {
        id: replyState.id,
        replyContent: replyState.replyContent.trim()
      }
    });
  };

  if (loading && !data) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 text-gold animate-spin" />
        <p className="text-text-secondary font-medium animate-pulse">Loading contact messages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
          <Mail size={32} />
        </div>
        <h3 className="text-xl font-bold font-display">Failed to load messages</h3>
        <p className="text-text-secondary max-w-md">{error.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      </div>
    );
  }

  const messages = data?.contactMessages || [];

  // Filter calculations
  const totalCount = messages.length;
  const unreadCount = messages.filter((m: any) => !m.isRead).length;
  const readCount = messages.filter((m: any) => m.isRead).length;

  const filteredMessages = messages.filter((m: any) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'UNREAD') return !m.isRead;
    return m.isRead;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-text">Inquiries & Messages</h2>
          <p className="text-sm text-text-secondary mt-1">
            Read and reply directly to messages received from the public Contact page.
          </p>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={14} />} />
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-5">
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Total Messages</span>
          <span className="text-2xl font-bold font-display text-text mt-2 block">{totalCount}</span>
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Unread Inbox</span>
          <span className="text-2xl font-bold font-display text-amber-500 mt-2 block">{unreadCount}</span>
        </div>
        <div className="bg-surface border border-border p-5 rounded-2xl shadow-sm">
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider block">Read</span>
          <span className="text-2xl font-bold font-display text-emerald-500 mt-2 block">{readCount}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-border/80 pb-px">
        {(['ALL', 'UNREAD', 'READ'] as const).map((tab) => {
          const tabLabel = tab === 'ALL' ? 'Inbox' : tab.charAt(0) + tab.slice(1).toLowerCase();
          const tabCount = tab === 'ALL' ? totalCount : tab === 'UNREAD' ? unreadCount : readCount;
          const isActive = activeTab === tab;

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-xs uppercase font-bold tracking-wider border-b-2 cursor-pointer transition-all duration-200 ${isActive
                  ? 'border-gold text-gold'
                  : 'border-transparent text-text-secondary hover:text-text hover:border-border'
                }`}
            >
              {tabLabel} <span className="ml-1 px-1.5 py-0.5 rounded bg-bg text-[10px] text-text-secondary">{tabCount}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Grid / List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Messages List (Span 7) */}
        <div className="lg:col-span-7 bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto scrollbar-hide">
            {filteredMessages.length === 0 ? (
              <div className="py-20 text-center text-text-secondary">
                <Mail size={48} className="mx-auto text-text-secondary/35 mb-4" />
                <p className="font-semibold">No messages found.</p>
                <p className="text-xs text-text-secondary mt-1 font-medium">Your inquiry list is empty.</p>
              </div>
            ) : (
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-surface-dark/45 text-text-secondary font-medium border-b border-border">
                    <th className="p-4 pl-6">Sender</th>
                    <th className="p-4">Subject</th>
                    <th className="p-4 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredMessages.map((m: any) => (
                    <tr
                      key={m.id}
                      onClick={() => setSelectedMessage(m)}
                      className={`hover:bg-surface-light/45 transition-colors cursor-pointer ${!m.isRead ? 'font-bold bg-primary/5' : 'text-text-secondary'
                        } ${selectedMessage?.id === m.id ? 'bg-gold/5 border-l-2 border-l-gold' : ''}`}
                    >
                      <td className="p-4 pl-6">
                        <div className={`text-sm ${!m.isRead ? 'text-text font-bold' : 'text-text-secondary'}`}>{m.name}</div>
                        <div className="text-xs text-text-secondary/80 mt-0.5">{m.email}</div>
                      </td>
                      <td className="p-4">
                        <div className={`text-xs line-clamp-1 ${!m.isRead ? 'text-text font-bold' : 'text-text-secondary'}`}>{m.subject}</div>
                        <div className="text-[10px] text-text-secondary/70 mt-0.5">
                          {new Date(m.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="p-4 pr-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {!m.isRead && (
                            <button
                              onClick={() => handleMarkAsRead(m.id)}
                              disabled={isMarking}
                              title="Mark as Read"
                              className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Check size={13} />
                            </button>
                          )}
                          <button
                            onClick={() => openReplyModal(m)}
                            title="Reply Email"
                            className="p-2 rounded-lg bg-gold/10 border border-gold/20 text-gold hover:bg-gold hover:text-white transition-all cursor-pointer"
                          >
                            <Send size={13} />
                          </button>
                          <button
                            onClick={() => handleDelete(m.id)}
                            disabled={isDeleting}
                            title="Delete Message"
                            className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Trash2 size={13} />
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

        {/* Message Detail Card (Span 5) */}
        <div className="lg:col-span-5 bg-surface border border-border rounded-2xl p-6 shadow-sm min-h-[400px] flex flex-col justify-between">
          {selectedMessage ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-border/40 pb-4">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider ${selectedMessage.isRead
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      }`}>
                      {selectedMessage.isRead ? 'Read' : 'Unread'}
                    </span>
                    <span className="text-[10px] text-text-secondary">
                      {new Date(selectedMessage.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-display text-text mt-3">
                    {selectedMessage.subject}
                  </h3>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-text-secondary">
                    From: <strong className="text-text">{selectedMessage.name}</strong> ({selectedMessage.email})
                  </div>
                </div>

                <div className="bg-bg/40 border border-border p-4 rounded-xl">
                  <p className="text-xs text-text-secondary leading-relaxed whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="flex gap-3 border-t border-border/40 pt-4 mt-6">
                {!selectedMessage.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs py-2.5"
                    onClick={() => handleMarkAsRead(selectedMessage.id)}
                    isLoading={isMarking}
                    leftIcon={<Check size={14} />}
                  >
                    Mark Read
                  </Button>
                )}
                <Button
                  variant="gold"
                  size="sm"
                  className="flex-1 text-xs py-2.5"
                  onClick={() => openReplyModal(selectedMessage)}
                  leftIcon={<Send size={14} />}
                >
                  Compose Reply
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center text-text-secondary">
              <Eye size={36} className="text-text-secondary/30 mb-3" />
              <p className="font-semibold text-sm">No message selected</p>
              <p className="text-xs text-text-secondary max-w-[200px] mt-1 font-medium">Click on an inquiry to view its complete detail and compose replies.</p>
            </div>
          )}
        </div>
      </div>

      {/* Reply Modal */}
      {isReplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsReplyModalOpen(false)} />

          <form
            onSubmit={handleReplySubmit}
            className="glass max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-gold/30 glow-gold relative space-y-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setIsReplyModalOpen(false)}
              className="absolute top-4 right-4 text-text-secondary hover:text-gold p-1"
            >
              <X size={20} />
            </button>

            <div className="text-center">
              <h3 className="text-xl font-bold font-display text-text">Compose Email Reply</h3>
              <p className="text-xs text-text-secondary mt-1">
                Your reply will be dispatched to the recipient's email address immediately.
              </p>
            </div>

            <div className="bg-bg/40 border border-border p-4 rounded-xl text-xs space-y-1.5 text-text-secondary">
              <div>To: <strong className="text-text">{replyState.name}</strong> ({replyState.email})</div>
              <div>Subject: <strong className="text-text">{replyState.subject}</strong></div>
              <div className="pt-2 border-t border-border/40 line-clamp-3">Message: "{replyState.message}"</div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Reply Message *
              </label>
              <textarea
                name="replyContent"
                value={replyState.replyContent}
                onChange={(e) => setReplyState(prev => ({ ...prev, replyContent: e.target.value }))}
                rows={6}
                placeholder="Write your email reply details here..."
                required
                className="w-full bg-bg border border-border rounded-xl p-3.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold resize-none leading-relaxed"
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1 py-3 text-xs uppercase font-bold tracking-wider"
                onClick={() => setIsReplyModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="gold"
                className="flex-1 py-3 text-xs uppercase font-bold tracking-wider"
                isLoading={isSendingReply}
                rightIcon={<Send size={12} />}
              >
                Send Email
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { toast } from 'sonner';
import { 
  GET_ADMIN_DASHBOARD_DATA,
  APPROVE_PAYMENT_MUTATION,
  REJECT_PAYMENT_MUTATION
} from '@/graphql';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  DollarSign, 
  Clock, 
  MessageSquare, 
  Mail, 
  RefreshCw, 
  TrendingUp, 
  Globe, 
  Check, 
  X,
  ExternalLink,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [limit] = useState<number>(5);

  // Fetch all dashboard data
  const { data, loading, error, refetch } = useQuery<any>(GET_ADMIN_DASHBOARD_DATA, {
    variables: { year: selectedYear, limit },
    fetchPolicy: 'network-only',
  });

  // Mutations
  const [approvePayment, { loading: isApproving }] = useMutation(APPROVE_PAYMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Payment approved successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to approve payment', { description: err.message });
    }
  });

  const [rejectPayment, { loading: isRejecting }] = useMutation(REJECT_PAYMENT_MUTATION, {
    onCompleted: () => {
      toast.success('Payment rejected successfully');
      refetch();
    },
    onError: (err) => {
      toast.error('Failed to reject payment', { description: err.message });
    }
  });
  // Wait, let's fix the variable name to matches the imported REJECT_PAYMENT_MUTATION
  const handleApprove = async (id: string) => {
    const adminNote = prompt('Add optional note for student (e.g. Bank slip verified):') || undefined;
    await approvePayment({ variables: { id, adminNote } });
  };

  const handleReject = async (id: string) => {
    const adminNote = prompt('Reason for rejection (e.g. Invalid transaction ID):');
    if (adminNote === null) return; // cancelled
    if (!adminNote.trim()) {
      toast.warning('A reason note is required to reject payments');
      return;
    }
    await rejectPayment({ variables: { id, adminNote } });
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
        <RefreshCw className="h-10 w-10 text-gold animate-spin" />
        <p className="text-text-secondary font-medium animate-pulse">Loading dashboard analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
        <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
          <X size={32} />
        </div>
        <h3 className="text-xl font-bold font-display">Failed to load dashboard data</h3>
        <p className="text-text-secondary max-w-md">{error.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()} leftIcon={<RefreshCw size={16} />}>
          Try Again
        </Button>
      </div>
    );
  }

  const stats = data?.dashboardStats || {
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    pendingPayments: 0,
    paidPayments: 0,
    totalRevenue: 0,
    pendingTestimonials: 0,
    unreadContacts: 0
  };

  const latestEnrollments = data?.latestEnrollments || [];
  const latestPayments = data?.latestPayments || [];
  const popularCourses = data?.popularCourses || [];
  const monthlyRevenue = data?.monthlyRevenue || [];
  const monthlyEnrollments = data?.monthlyEnrollments || [];
  const studentsByCountry = data?.studentsByCountry || [];

  // Helper: Format price
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Helper: Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // SVG Chart Calculations - Revenue (Bar Chart)
  const maxRevenue = Math.max(...monthlyRevenue.map((r: any) => r.totalRevenue), 1000);
  const revenueChartHeight = 200;
  const revenueChartWidth = 500;
  const revenuePadding = 40;
  
  // SVG Chart Calculations - Enrollments (Area Chart)
  const maxEnrollments = Math.max(...monthlyEnrollments.map((e: any) => e.totalEnrollments), 5);
  const enrollmentChartHeight = 200;
  const enrollmentChartWidth = 500;
  const enrollmentPadding = 40;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border border-border p-6 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-text">
            Assalamu Alaikum, Admin
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Here's the latest performance update for Anamta Institute.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="bg-bg border border-border rounded-lg px-3 py-1.5 text-sm font-semibold text-text focus:outline-none focus:ring-1 focus:ring-gold"
          >
            {[currentYear, currentYear - 1, currentYear - 2].map(yr => (
              <option key={yr} value={yr}>{yr}</option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            leftIcon={<RefreshCw size={14} />}
            className="h-9"
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Total Students</span>
            <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold font-display">{stats.totalStudents}</h3>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
              Active student base
            </span>
          </div>
        </div>

        {/* Total Enrollments */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Total Enrollments</span>
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <GraduationCap size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold font-display">{stats.totalEnrollments}</h3>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-1">
              Course registrations
            </span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Total Revenue</span>
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold font-display truncate">{formatPrice(stats.totalRevenue)}</h3>
            <span className="text-xs text-emerald-500 font-medium flex items-center gap-1 mt-2">
              <TrendingUp size={12} /> Received payments
            </span>
          </div>
        </div>

        {/* Active Courses */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-gold/30 transition-all duration-300 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">Total Courses</span>
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold font-display">{stats.totalCourses}</h3>
            <span className="text-xs text-text-secondary font-medium flex items-center gap-1 mt-1">
              Active learning programs
            </span>
          </div>
        </div>
      </div>

      {/* Operational Highlights (Action Badges) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Pending Payments */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${
          stats.pendingPayments > 0 
            ? 'bg-amber-500/5 border-amber-500/20 text-amber-600 dark:text-amber-500' 
            : 'bg-surface border-border text-text-secondary'
        }`}>
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
            stats.pendingPayments > 0 ? 'bg-amber-500/10' : 'bg-bg'
          }`}>
            <Clock size={18} />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider">Pending Payments</h4>
            <p className="text-lg font-bold">
              {stats.pendingPayments} {stats.pendingPayments === 1 ? 'submission' : 'submissions'} requiring review
            </p>
          </div>
          {stats.pendingPayments > 0 && (
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-ping" />
          )}
        </div>

        {/* Unread Contact Messages */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${
          stats.unreadContacts > 0 
            ? 'bg-indigo-500/5 border-indigo-500/20 text-indigo-600 dark:text-indigo-400' 
            : 'bg-surface border-border text-text-secondary'
        }`}>
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
            stats.unreadContacts > 0 ? 'bg-indigo-500/10' : 'bg-bg'
          }`}>
            <Mail size={18} />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider">Unread Contacts</h4>
            <p className="text-lg font-bold">
              {stats.unreadContacts} {stats.unreadContacts === 1 ? 'new inquiry' : 'new inquiries'}
            </p>
          </div>
          {stats.unreadContacts > 0 && (
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
          )}
        </div>

        {/* Pending Testimonials */}
        <div className={`p-4 rounded-xl border flex items-center gap-4 transition-colors ${
          stats.pendingTestimonials > 0 
            ? 'bg-purple-500/5 border-purple-500/20 text-purple-600 dark:text-purple-400' 
            : 'bg-surface border-border text-text-secondary'
        }`}>
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
            stats.pendingTestimonials > 0 ? 'bg-purple-500/10' : 'bg-bg'
          }`}>
            <MessageSquare size={18} />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold uppercase tracking-wider">Pending Testimonials</h4>
            <p className="text-lg font-bold">
              {stats.pendingTestimonials} pending review
            </p>
          </div>
          {stats.pendingTestimonials > 0 && (
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-ping" />
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Revenue Chart */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm min-w-0">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-text">Monthly Revenue ({selectedYear})</h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-500">Earnings</span>
          </div>
          
          {monthlyRevenue.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-text-secondary text-sm">
              No revenue data available for {selectedYear}
            </div>
          ) : (
            <div className="relative w-full overflow-x-auto pt-2 min-w-0">
              <svg 
                viewBox={`0 0 ${revenueChartWidth} ${revenueChartHeight}`} 
                className="w-full h-auto max-w-full min-w-0"
              >
                {/* Horizontal gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = revenuePadding + (revenueChartHeight - 2 * revenuePadding) * (1 - ratio);
                  const labelValue = maxRevenue * ratio;
                  return (
                    <g key={index} className="opacity-40">
                      <line 
                        x1={revenuePadding * 1.5} 
                        y1={y} 
                        x2={revenueChartWidth - revenuePadding} 
                        y2={y} 
                        stroke="currentColor" 
                        strokeWidth="0.5" 
                        strokeDasharray="4"
                        className="text-border" 
                      />
                      <text 
                        x={revenuePadding * 1.2} 
                        y={y + 4} 
                        textAnchor="end" 
                        className="text-[9px] fill-text-secondary font-medium"
                      >
                        {labelValue >= 1000 ? `${(labelValue / 1000).toFixed(0)}k` : labelValue}
                      </text>
                    </g>
                  );
                })}

                {/* Bars */}
                {monthlyRevenue.map((item: any, index: number) => {
                  const totalMonths = monthlyRevenue.length;
                  const chartInnerWidth = revenueChartWidth - 2.5 * revenuePadding;
                  const barWidth = Math.min(22, (chartInnerWidth / totalMonths) - 12);
                  const x = (revenuePadding * 1.8) + (index * (chartInnerWidth / totalMonths)) + ((chartInnerWidth / totalMonths) - barWidth) / 2;
                  
                  const valueRatio = item.totalRevenue / maxRevenue;
                  const barHeight = (revenueChartHeight - 2 * revenuePadding) * valueRatio;
                  const y = revenueChartHeight - revenuePadding - barHeight;

                  return (
                    <g key={item.month} className="group/bar cursor-pointer">
                      {/* Gradient definition per bar */}
                      <defs>
                        <linearGradient id={`revGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#C9A227" />
                          <stop offset="100%" stopColor="#C9A227" stopOpacity="0.25" />
                        </linearGradient>
                      </defs>
                      <rect 
                        x={x} 
                        y={y} 
                        width={barWidth} 
                        height={Math.max(barHeight, 2)} 
                        rx="3"
                        fill={`url(#revGrad-${index})`}
                        className="transition-all duration-300 hover:fill-gold-light" 
                      />
                      {/* Hover value tooltip */}
                      <text 
                        x={x + barWidth / 2} 
                        y={y - 6} 
                        textAnchor="middle" 
                        className="text-[9px] font-semibold fill-gold opacity-0 group-hover/bar:opacity-100 transition-opacity"
                      >
                        {item.totalRevenue >= 1000 ? `${(item.totalRevenue / 1000).toFixed(1)}k` : item.totalRevenue}
                      </text>
                      {/* Month labels */}
                      <text 
                        x={x + barWidth / 2} 
                        y={revenueChartHeight - revenuePadding + 15} 
                        textAnchor="middle" 
                        className="text-[9px] fill-text-secondary group-hover/bar:fill-text group-hover/bar:font-medium transition-colors"
                      >
                        {item.month.substring(0, 3)}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          )}
        </div>

        {/* Monthly Enrollments Chart */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-semibold text-lg text-text">Monthly Enrollments ({selectedYear})</h3>
            <span className="text-xs font-medium px-2.5 py-1 rounded bg-primary/10 text-primary">Trends</span>
          </div>

          {monthlyEnrollments.length === 0 ? (
            <div className="h-[200px] flex items-center justify-center text-text-secondary text-sm">
              No enrollment data available for {selectedYear}
            </div>
          ) : (
            <div className="relative w-full overflow-x-auto pt-2 min-w-0">
              <svg 
                viewBox={`0 0 ${enrollmentChartWidth} ${enrollmentChartHeight}`} 
                className="w-full h-auto max-w-full min-w-0"
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C9A227" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#C9A227" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Gridlines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                  const y = enrollmentPadding + (enrollmentChartHeight - 2 * enrollmentPadding) * (1 - ratio);
                  const labelValue = Math.round(maxEnrollments * ratio);
                  return (
                    <g key={index} className="opacity-40">
                      <line 
                        x1={enrollmentPadding * 1.5} 
                        y1={y} 
                        x2={enrollmentChartWidth - enrollmentPadding} 
                        y2={y} 
                        stroke="currentColor" 
                        strokeWidth="0.5" 
                        strokeDasharray="4"
                        className="text-border" 
                      />
                      <text 
                        x={enrollmentPadding * 1.2} 
                        y={y + 4} 
                        textAnchor="end" 
                        className="text-[9px] fill-text-secondary font-medium"
                      >
                        {labelValue}
                      </text>
                    </g>
                  );
                })}

                {/* Generate line & area coordinates */}
                {(() => {
                  const points: string[] = [];
                  const areaPoints: string[] = [];
                  const chartInnerWidth = enrollmentChartWidth - 2.5 * enrollmentPadding;
                  const stepX = chartInnerWidth / (monthlyEnrollments.length - 1);
                  const startX = enrollmentPadding * 1.8;

                  monthlyEnrollments.forEach((item: any, index: number) => {
                    const x = startX + index * stepX;
                    const valueRatio = item.totalEnrollments / maxEnrollments;
                    const y = enrollmentChartHeight - enrollmentPadding - (enrollmentChartHeight - 2 * enrollmentPadding) * valueRatio;
                    
                    points.push(`${x},${y}`);
                    if (index === 0) {
                      areaPoints.push(`${x},${enrollmentChartHeight - enrollmentPadding}`);
                    }
                    areaPoints.push(`${x},${y}`);
                    if (index === monthlyEnrollments.length - 1) {
                      areaPoints.push(`${x},${enrollmentChartHeight - enrollmentPadding}`);
                    }
                  });

                  return (
                    <g>
                      {/* Area Path */}
                      <polygon 
                        points={areaPoints.join(' ')} 
                        fill="url(#areaGrad)" 
                      />
                      {/* Stroke Line */}
                      <polyline 
                        points={points.join(' ')} 
                        fill="none" 
                        stroke="#C9A227" 
                        strokeWidth="2.5" 
                      />
                      {/* Interactive circles */}
                      {monthlyEnrollments.map((item: any, index: number) => {
                        const x = startX + index * stepX;
                        const valueRatio = item.totalEnrollments / maxEnrollments;
                        const y = enrollmentChartHeight - enrollmentPadding - (enrollmentChartHeight - 2 * enrollmentPadding) * valueRatio;

                        return (
                          <g key={index} className="group/dot cursor-pointer">
                            <circle 
                              cx={x} 
                              cy={y} 
                              r="4" 
                              fill="#fff" 
                              stroke="#C9A227" 
                              strokeWidth="2" 
                              className="transition-all duration-200 group-hover/dot:r-6" 
                            />
                            {/* Hover tooltip */}
                            <text 
                              x={x} 
                              y={y - 10} 
                              textAnchor="middle" 
                              className="text-[9px] font-bold fill-primary opacity-0 group-hover/dot:opacity-100 transition-opacity bg-surface px-1"
                            >
                              {item.totalEnrollments}
                            </text>
                            {/* Labels */}
                            <text 
                              x={x} 
                              y={enrollmentChartHeight - enrollmentPadding + 15} 
                              textAnchor="middle" 
                              className="text-[9px] fill-text-secondary group-hover/dot:fill-text group-hover/dot:font-semibold transition-colors"
                            >
                              {item.month.substring(0, 3)}
                            </text>
                          </g>
                        );
                      })}
                    </g>
                  );
                })()}
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Courses and Geo Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Courses */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-text">Popular Courses</h3>
              <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <GraduationCap size={16} />
              </div>
            </div>

            {popularCourses.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-sm">
                No course enrollment stats available
              </div>
            ) : (
              <div className="space-y-4">
                {popularCourses.map((course: any, idx: number) => {
                  const maxEnr = Math.max(...popularCourses.map((c: any) => c.totalEnrollments), 1);
                  const percentage = (course.totalEnrollments / maxEnr) * 100;
                  return (
                    <div key={course.courseId} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium truncate max-w-[80%] text-text hover:text-gold transition-colors">
                          {course.courseTitle}
                        </span>
                        <span className="font-semibold text-text-secondary">
                          {course.totalEnrollments} {course.totalEnrollments === 1 ? 'student' : 'students'}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-gold to-gold-light rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Students by Country */}
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-semibold text-lg text-text">Geographical Distribution</h3>
              <div className="h-7 w-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Globe size={16} />
              </div>
            </div>

            {studentsByCountry.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-sm">
                No geographical student data available
              </div>
            ) : (
              <div className="space-y-4">
                {studentsByCountry.map((country: any) => {
                  const maxStudents = Math.max(...studentsByCountry.map((c: any) => c.totalStudents), 1);
                  const pct = (country.totalStudents / maxStudents) * 100;
                  return (
                    <div key={country.country} className="space-y-1.5">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-text">{country.country || 'Unknown'}</span>
                        <span className="font-semibold text-text-secondary">{country.totalStudents}</span>
                      </div>
                      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-1000 ease-out" 
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Latest Enrollments Table */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden min-w-0">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-text">Latest Enrollments</h3>
            <span className="text-xs font-semibold text-text-secondary px-2 py-0.5 rounded bg-bg border border-border">
              Recent 5
            </span>
          </div>

          <div className="overflow-x-auto min-w-0">
            {latestEnrollments.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-sm">
                No enrollments registered yet
              </div>
            ) : (
              <table className="min-w-full w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-surface-dark/40 text-text-secondary font-medium border-b border-border">
                    <th className="p-4">Student</th>
                    <th className="p-4">Course</th>
                    <th className="p-4">Pref. Days</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {latestEnrollments.map((enr: any) => {
                    const statusColors: Record<string, string> = {
                      PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
                      APPROVED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                      REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20',
                      COMPLETED: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                    };

                    return (
                      <tr key={enr.id} className="hover:bg-surface-light/45 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-text">
                            {enr.student ? `${enr.student.firstName} ${enr.student.lastName}` : 'N/A'}
                          </div>
                          <div className="text-xs text-text-secondary">
                            {enr.student?.email}
                          </div>
                        </td>
                        <td className="p-4 font-medium text-text truncate max-w-[150px]">
                          {enr.course?.title}
                        </td>
                        <td className="p-4 text-xs text-text-secondary whitespace-nowrap">
                          {enr.preferredHour != null ? (
                            <>
                              {enr.preferredDays} <br />
                              {enr.preferredHour}:{enr.preferredMinute.toString().padStart(2, '0')} {enr.preferredPeriod}
                            </>
                          ) : (
                            <span>{enr.packageTier && enr.packageTier !== 'NONE' ? `${enr.packageTier} package` : 'International'}</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[enr.status] || 'bg-border text-text-secondary'}`}>
                            {enr.status}
                          </span>
                        </td>
                        <td className="p-4 text-right text-text-secondary whitespace-nowrap">
                          {formatDate(enr.createdAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Latest Payments Table */}
        <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden min-w-0">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="font-display font-semibold text-lg text-text">Latest Payments</h3>
            <span className="text-xs font-semibold text-text-secondary px-2 py-0.5 rounded bg-bg border border-border">
              Review Required
            </span>
          </div>

          <div className="overflow-x-auto min-w-0">
            {latestPayments.length === 0 ? (
              <div className="py-12 text-center text-text-secondary text-sm">
                No payments submitted yet
              </div>
            ) : (
              <table className="min-w-full w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-surface-dark/40 text-text-secondary font-medium border-b border-border">
                    <th className="p-4">Student & Course</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method & Trans. ID</th>
                    <th className="p-4 text-center">Receipt</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {latestPayments.map((pmt: any) => {
                    const statusColors: Record<string, string> = {
                      UNDER_REVIEW: 'bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20',
                      PAID: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
                      REJECTED: 'bg-red-500/10 text-red-500 border-red-500/20'
                    };

                    const studentName = pmt.enrollment?.student 
                      ? `${pmt.enrollment.student.firstName} ${pmt.enrollment.student.lastName}`
                      : 'N/A';
                    
                    const courseTitle = pmt.enrollment?.course?.title || 'Unknown Program';

                    return (
                      <tr key={pmt.id} className="hover:bg-surface-light/45 transition-colors">
                        <td className="p-4">
                          <div className="font-semibold text-text">{studentName}</div>
                          <div className="text-xs text-text-secondary truncate max-w-[150px]">{courseTitle}</div>
                        </td>
                        <td className="p-4 font-bold text-text whitespace-nowrap">
                          {formatPrice(pmt.amount)}
                        </td>
                        <td className="p-4 text-xs">
                          <span className="font-medium text-text uppercase">{pmt.paymentMethod.replace('_', ' ')}</span>
                          <div className="text-text-secondary select-all font-mono font-semibold mt-0.5">
                            {pmt.transactionId || 'No ID'}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          {pmt.screenshotUrl ? (
                            <a 
                              href={pmt.screenshotUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-gold hover:text-gold-light font-semibold hover:underline"
                            >
                              <Eye size={12} /> View
                            </a>
                          ) : (
                            <span className="text-xs text-text-secondary">None</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${statusColors[pmt.status] || 'bg-border text-text-secondary'}`}>
                            {pmt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {pmt.status === 'UNDER_REVIEW' ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleApprove(pmt.id)}
                                disabled={isApproving}
                                className="h-7 w-7 rounded bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-emerald-500/20"
                                title="Approve Payment"
                              >
                                <Check size={14} />
                              </button>
                              <button
                                onClick={() => handleReject(pmt.id)}
                                disabled={isRejecting}
                                className="h-7 w-7 rounded bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-red-500/20"
                                title="Reject Payment"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-text-secondary italic">Reviewed</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

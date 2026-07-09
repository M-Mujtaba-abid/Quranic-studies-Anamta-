'use client';

import React, { useState } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_ALL_STUDENTS } from '@/graphql';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PACKAGE_TIER_META } from '@/constants/regions';
import { 
  Users, 
  Search, 
  RefreshCw, 
  Eye, 
  MapPin, 
  Calendar, 
  BookOpen,
  Mail,
  Phone,
  User,
  CheckCircle,
  XCircle
} from 'lucide-react';

export default function AdminStudentsPage() {
  const { data, loading, error, refetch } = useQuery<any>(GET_ALL_STUDENTS, {
    fetchPolicy: 'network-only'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const students = data?.students || [];

  // Filter students based on search term
  const filteredStudents = students.filter((student: any) => {
    const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
    const email = student.email.toLowerCase();
    const phone = student.phone.toLowerCase();
    const query = searchTerm.toLowerCase();

    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  const getMostRecentEnrollment = (student: any) => {
    const enrollments = student.enrollments || [];
    if (enrollments.length === 0) return null;
    return [...enrollments].sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  };

  return (
    <div className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-display tracking-tight text-text">Students</h1>
          <p className="text-xs text-text-secondary">View and manage registered student profiles and their records.</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refetch()}
          leftIcon={<RefreshCw size={14} className={loading ? 'animate-spin' : ''} />}
        >
          Refresh Roster
        </Button>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <Input
          placeholder="Search by name, email or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {/* Loading state */}
      {loading && !data && (
        <div className="h-60 flex flex-col items-center justify-center gap-2">
          <RefreshCw className="h-8 w-8 text-gold animate-spin" />
          <p className="text-xs text-text-secondary font-medium animate-pulse">Loading student roster...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center space-y-2">
          <p className="text-sm font-semibold text-red-500">Failed to load students</p>
          <p className="text-xs text-text-secondary">{error.message}</p>
        </div>
      )}

      {/* Students Table */}
      {!loading && !error && (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-md">
          {filteredStudents.length === 0 ? (
            <div className="py-12 text-center text-text-secondary space-y-2">
              <Users size={40} className="mx-auto text-border" />
              <p className="text-sm font-medium">No students found</p>
              <p className="text-xs">Try adjusting your search criteria or register a student.</p>
            </div>
          ) : (
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-bg/50 text-text-secondary uppercase tracking-wider text-[10px] font-semibold">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Enrollments</th>
                    <th className="py-3 px-4">Course / Package</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredStudents.map((student: any) => (
                    <tr key={student.id} className="hover:bg-bg/25 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-text">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="py-3.5 px-4 space-y-0.5 text-text-secondary">
                        <div className="flex items-center gap-1.5">
                          <Mail size={12} className="text-gold shrink-0" />
                          <span className="truncate">{student.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Phone size={12} className="text-gold shrink-0" />
                          <span>{student.phone}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        {student.city || student.country ? (
                          <div className="flex items-center gap-1">
                            <MapPin size={12} className="text-gold shrink-0" />
                            <span>{[student.city, student.country].filter(Boolean).join(', ')}</span>
                          </div>
                        ) : (
                          <span className="italic">—</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {student.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                            <CheckCircle size={10} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 font-semibold">
                            <XCircle size={10} /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-text">
                        <span className="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-xs">
                          {student.enrollments?.length || 0} Courses
                        </span>
                      </td>
                      <td className="py-3.5 px-4 max-w-[220px]">
                        {(() => {
                          const enrollments = student.enrollments || [];
                          const latest = getMostRecentEnrollment(student);
                          if (!latest) {
                            return <span className="italic text-text-secondary/50">No enrollment yet</span>;
                          }
                          const tierMeta = PACKAGE_TIER_META[latest.packageTier as keyof typeof PACKAGE_TIER_META];
                          const extraCount = enrollments.length - 1;
                          return (
                            <div className="space-y-1">
                              <span className="block font-medium text-text truncate" title={latest.course?.title}>
                                {latest.course?.title || 'Untitled course'}
                              </span>
                              <div className="flex items-center gap-1.5">
                                {tierMeta && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gold/10 text-gold border border-gold/20 text-[10px] font-bold uppercase tracking-wide">
                                    {tierMeta.label}
                                  </span>
                                )}
                                {extraCount > 0 && (
                                  <span className="text-[10px] text-text-secondary font-medium">
                                    +{extraCount} more
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="py-3.5 px-4 text-text-secondary">
                        <div className="flex items-center gap-1">
                          <Calendar size={12} className="text-gold shrink-0" />
                          <span>{new Date(student.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                          leftIcon={<Eye size={12} />}
                          className="text-[11px] py-1 px-2.5 rounded-md"
                        >
                          View Details
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

      {/* Details Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface border border-border w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-fade-in">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-bg/50">
              <div className="flex items-center gap-2">
                <User className="text-gold h-5 w-5" />
                <h3 className="text-base font-bold font-display text-text">Student Profile</h3>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg border border-border/80 text-text-secondary hover:text-text hover:bg-bg transition-all cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Core Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-bg/40 p-4 rounded-xl border border-border/40 text-xs">
                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Full Name</span>
                  <span className="text-sm font-semibold text-text">{selectedStudent.firstName} {selectedStudent.lastName}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Email Address</span>
                  <span className="text-text">{selectedStudent.email}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Phone / WhatsApp</span>
                  <span className="text-text">{selectedStudent.phone}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Location</span>
                  <span className="text-text">{[selectedStudent.address, selectedStudent.city, selectedStudent.country].filter(Boolean).join(', ') || 'No location details'}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Gender Preference</span>
                  <span className="text-text capitalize">{selectedStudent.gender || 'Not specified'}</span>
                </div>
                <div className="space-y-1">
                  <span className="block text-[10px] font-semibold text-text-secondary uppercase tracking-wider">Status / Joined</span>
                  <span className="text-text">
                    {selectedStudent.isActive ? 'Active' : 'Inactive'} • Joined {new Date(selectedStudent.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Enrollments List */}
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 border-b border-border/40 pb-2">
                  <BookOpen size={16} className="text-gold" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-text">Course Enrollments</h4>
                </div>

                {(!selectedStudent.enrollments || selectedStudent.enrollments.length === 0) ? (
                  <p className="text-xs text-text-secondary italic">This student is not enrolled in any courses.</p>
                ) : (
                  <div className="space-y-3">
                    {selectedStudent.enrollments.map((enrollment: any) => (
                      <div key={enrollment.id} className="bg-bg/30 border border-border/50 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        <div className="space-y-1.5">
                          <span className="font-semibold text-text text-sm block">{enrollment.course?.title}</span>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-text-secondary">
                            {enrollment.preferredHour != null ? (
                              <>
                                <span className="flex items-center gap-1">
                                  <RefreshCw size={11} className="text-gold" />
                                  <span>{enrollment.preferredHour.toString().padStart(2, '0')}:{enrollment.preferredMinute.toString().padStart(2, '0')} {enrollment.preferredPeriod}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar size={11} className="text-gold" />
                                  <span>{enrollment.preferredDays}</span>
                                </span>
                              </>
                            ) : (
                              <span className="flex items-center gap-1">
                                {enrollment.packageTier && enrollment.packageTier !== 'NONE' ? `${enrollment.packageTier} package` : 'International enrollment'}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-text-secondary font-mono bg-bg border border-border px-1.5 py-0.5 rounded truncate max-w-[120px]" title={enrollment.id}>
                            ID: {enrollment.id}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                            enrollment.status === 'APPROVED' 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                              : enrollment.status === 'PENDING'
                              ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500'
                              : 'bg-red-500/10 border-red-500/20 text-red-500'
                          }`}>
                            {enrollment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

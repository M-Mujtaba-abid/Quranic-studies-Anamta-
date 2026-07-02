'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client/react';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import { GET_COURSE_BY_ID, ENROLL_STUDENT_MUTATION } from '@/graphql';
import { 
  Clock, 
  Calendar, 
  RefreshCw, 
  ArrowLeft, 
  CheckCircle,
  Phone,
  Mail,
  User,
  MapPin,
  CalendarDays,
  ShieldCheck,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'sonner';
import Link from 'next/link';

const availableDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CourseDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  // Query single course details
  const { data, loading, error, refetch } = useQuery<any>(GET_COURSE_BY_ID, {
    variables: { id },
  });

  // State for Form fields
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    preferredHour: 5,
    preferredMinute: 0,
    preferredPeriod: 'PM',
  });
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);
  const [enrolledId, setEnrolledId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (enrolledId) {
      navigator.clipboard.writeText(enrolledId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Mutation
  const [enrollStudent, { loading: isEnrolling }] = useMutation<any, any>(ENROLL_STUDENT_MUTATION, {
    onCompleted: (res) => {
      setEnrolledId(res?.enrollStudent?.id || null);
      setEnrollmentSuccess(true);
      toast.success('Successfully registered for the course!');
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.message || 'Failed to register. Please try again.');
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.startsWith('preferredHour') || name.startsWith('preferredMinute') ? parseInt(value) : value
    }));
  };

  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      alert('Please fill out all required fields.');
      return;
    }
    if (selectedDays.length === 0) {
      alert('Please select at least one preferred day.');
      return;
    }

    await enrollStudent({
      variables: {
        enrollStudentInput: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address || undefined,
          city: formData.city || undefined,
          country: formData.country || undefined,
          courseId: id,
          preferredHour: formData.preferredHour,
          preferredMinute: formData.preferredMinute,
          preferredPeriod: formData.preferredPeriod,
          preferredDays: selectedDays.join(', '),
        }
      }
    });
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar />
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4">
          <RefreshCw className="h-10 w-10 text-gold animate-spin" />
          <p className="text-text-secondary font-medium animate-pulse">Loading course info...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.course) {
    return (
      <div className="min-h-screen bg-bg text-text">
        <Navbar />
        <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center px-4">
          <div className="h-16 w-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-2">
            <ShieldCheck size={32} />
          </div>
          <h3 className="text-xl font-bold font-display">Course not found</h3>
          <p className="text-text-secondary max-w-md">{error?.message || "The course you are looking for doesn't exist."}</p>
          <Link href="/courses">
            <Button variant="outline" size="sm" leftIcon={<ArrowLeft size={16} />}>
              Back to Courses
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const course = data.course;

  return (
    <div className="min-h-screen bg-bg text-text pb-20">
      <Navbar />

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-[50vh] left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-8 space-y-8">
        
        {/* Back Link */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-gold transition-colors">
          <ArrowLeft size={16} />
          <span>Back to Courses</span>
        </Link>

        {/* Course Banner Card */}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-md p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1 space-y-4">
            <span className="text-[10px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-3 py-1 rounded-full border border-gold/20">
              Active Syllabus
            </span>
            <h1 className="text-3xl md:text-4xl font-bold font-display tracking-tight text-text leading-tight">
              {course.title}
            </h1>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-6 text-sm text-text-secondary pt-2">
              <div className="flex items-center gap-1.5">
                <Clock size={16} className="text-gold" />
                <span className="font-semibold text-text">{course.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar size={16} className="text-gold" />
                <span className="font-semibold text-text">{course.days}</span>
              </div>
              {course.price !== undefined && (
                <div className="flex items-center gap-1.5">
                  <span className="text-gold font-bold">PKR</span>
                  <span className="font-bold text-text">{course.price}</span>
                </div>
              )}
            </div>
          </div>
          <div className="relative h-56 w-full lg:w-96 rounded-xl overflow-hidden bg-surface-dark border border-border">
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 384px"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-text-secondary">
                <ShieldCheck size={48} className="text-gold/50" />
              </div>
            )}
          </div>
        </div>

        {/* Content & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Syllabus / Left Column */}
          <div className="lg:col-span-7 bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-sm space-y-6">
            <h3 className="text-xl font-bold font-display text-text border-b border-border pb-3">
              What You Will Learn
            </h3>
            
            <div className="space-y-4 text-sm leading-relaxed text-text-secondary">
              <p>
                Our 1-on-1 online classes are tailored specifically to your learning speed and initial levels. Our verified, experienced tutors provide structured guidance to help you master the material.
              </p>
              
              <h4 className="font-bold text-text mt-6">Course Outline & Syllabus</h4>
              <ul className="list-disc list-inside space-y-2.5 pl-2">
                <li>Complete foundational rules and phonetics guidance.</li>
                <li>Proper articulation points (Makharij) and phonology.</li>
                <li>Rules of Tajweed (Nunnation, Elongation, Stop signs).</li>
                <li>Interactive 1-on-1 practice sessions with continuous assessments.</li>
                <li>Memorization (Hifz) tracking or Translation (Tafsir) details (if applicable).</li>
              </ul>

              <div className="p-4 bg-primary/5 rounded-xl border border-primary/10 mt-6 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h5 className="font-semibold text-text text-xs">Certified Teachers</h5>
                  <p className="text-xs text-text-secondary">All our teachers are thoroughly tested, certified, and hold references (Ijazah) to teach Quran studies online.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form / Right Column */}
          <div className="lg:col-span-5 relative">
            {enrollmentSuccess ? (
              <div className="bg-surface border border-border p-8 rounded-2xl shadow-md space-y-6 animate-fade-in relative z-10 text-left">
                <div className="h-16 w-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={36} />
                </div>
                <div className="space-y-2 text-center">
                  <h3 className="text-xl font-bold font-display text-text">Enrollment Submitted!</h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    Alhamdulillah, your registration has been successfully received.
                  </p>
                </div>

                <div className="bg-bg/50 border border-border/40 p-4 rounded-xl space-y-3 text-xs">
                  <h4 className="font-semibold text-text uppercase tracking-wider text-[10px]">Enrollment Details</h4>
                  <div className="space-y-1.5 text-text-secondary">
                    <p><span className="text-text font-medium">Student:</span> {formData.firstName} {formData.lastName}</p>
                    <p><span className="text-text font-medium">Schedule:</span> {formData.preferredHour.toString().padStart(2, '0')}:{formData.preferredMinute.toString().padStart(2, '0')} {formData.preferredPeriod} on {selectedDays.join(', ')}</p>
                    {enrolledId && (
                      <div className="pt-2 flex flex-col gap-1 border-t border-border/30 mt-2">
                        <span className="text-text font-medium">Enrollment ID:</span>
                        <div className="flex items-center gap-2 bg-surface/60 p-2 rounded border border-border mt-1">
                          <code className="text-gold font-mono text-[11px] select-all break-all">{enrolledId}</code>
                          <button
                            type="button"
                            onClick={handleCopyId}
                            className="p-1 hover:text-gold transition-colors ml-auto cursor-pointer"
                            title="Copy ID"
                          >
                            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {enrolledId && (
                    <Link href={`/payment?enrollmentId=${enrolledId}`} className="w-full block">
                      <Button variant="gold" size="md" className="w-full text-sm font-semibold tracking-wide py-2.5">
                        Proceed to Payment
                      </Button>
                    </Link>
                  )}
                  <Link href="/courses" className="w-full block">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Browse More Courses
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                className="bg-surface border border-border p-6 md:p-8 rounded-2xl shadow-md space-y-6 relative z-10"
              >
                <div className="space-y-1">
                  <h3 className="text-lg font-bold font-display text-text">Register for this Course</h3>
                  <p className="text-xs text-text-secondary">
                    Fill out the form below to lock your preferred schedule.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="First Name *"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      placeholder="Anas"
                      required
                      leftIcon={<User size={14} />}
                    />
                    <Input
                      label="Last Name *"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      placeholder="Ahmed"
                      required
                    />
                  </div>

                  {/* Email & Phone */}
                  <Input
                    label="Email Address *"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="student@gmail.com"
                    required
                    leftIcon={<Mail size={14} />}
                  />

                  <Input
                    label="Phone / WhatsApp *"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+92 300 1234567"
                    required
                    leftIcon={<Phone size={14} />}
                  />

                  {/* Location Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="City"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Karachi"
                    />
                    <Input
                      label="Country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Pakistan"
                      leftIcon={<MapPin size={14} />}
                    />
                  </div>
                  
                  <Input
                    label="Full Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Sector 11-A, North Karachi"
                  />

                  <div className="h-[1px] bg-border my-2" />

                  {/* Preferred Timing */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-text uppercase tracking-wider">
                      Preferred Timing
                    </label>
                    <div className="flex items-center gap-2 bg-bg border border-border p-2 rounded-xl">
                      <select
                        name="preferredHour"
                        value={formData.preferredHour}
                        onChange={handleInputChange}
                        className="bg-transparent border-0 text-text font-semibold text-sm focus:outline-none cursor-pointer p-1"
                      >
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
                          <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      <span className="text-text-secondary">:</span>
                      <select
                        name="preferredMinute"
                        value={formData.preferredMinute}
                        onChange={handleInputChange}
                        className="bg-transparent border-0 text-text font-semibold text-sm focus:outline-none cursor-pointer p-1"
                      >
                        {[0, 15, 30, 45].map(m => (
                          <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                        ))}
                      </select>
                      <select
                        name="preferredPeriod"
                        value={formData.preferredPeriod}
                        onChange={handleInputChange}
                        className="bg-transparent border-0 text-text font-semibold text-sm focus:outline-none cursor-pointer p-1 ml-auto"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Preferred Days */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-text uppercase tracking-wider flex items-center gap-1">
                      <CalendarDays size={14} className="text-gold" />
                      Preferred Days (Select multiple) *
                    </label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {availableDays.map(day => {
                        const isSelected = selectedDays.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => handleDayToggle(day)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-gold border-gold text-primary-dark font-semibold'
                                : 'bg-bg border-border text-text-secondary hover:border-gold/30 hover:text-text'
                            }`}
                          >
                            {day.substring(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full py-3.5 mt-2 rounded-xl text-sm shadow-md"
                  isLoading={isEnrolling}
                >
                  Submit Registration
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

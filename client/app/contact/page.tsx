"use client";

import React, { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { toast } from "sonner";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SUBMIT_CONTACT_MESSAGE } from "@/graphql";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [submitContact, { loading }] = useMutation(SUBMIT_CONTACT_MESSAGE, {
    onCompleted: () => {
      toast.success("Thank you! Your message has been sent successfully.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to send message. Please try again.");
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.warning("Please fill out all required fields.");
      return;
    }

    await submitContact({
      variables: {
        createContactMessageInput: {
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim()
        }
      }
    });
  };

  return (
    <div className="relative min-h-screen bg-bg text-text pb-20 overflow-hidden">

      {/* Premium subtle background image with gold patterns. Plain opacity (no blend mode) —
          mix-blend-overlay against this page's near-black --color-bg crushes the image to invisible. */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Image
          src="/images/about/contact_bg.png"
          alt="Contact Background"
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg/10 via-bg/70 to-bg" />
      </div>

      {/* Ambient background glows */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(197,168,128,0.08)_0%,transparent_80%)] pointer-events-none" />
      <div className="absolute -left-40 top-[30%] h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 bottom-[20%] h-[400px] w-[400px] rounded-full bg-gold/5 blur-[120px] pointer-events-none" />

      <main className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-10 pt-16">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="inline-flex px-3.5 py-1 rounded-full bg-gold/10 border border-gold/30 text-gold text-[20px] font-bold uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="text-4xl font-bold font-display tracking-tight text-text">
            Connect with <span className="text-gold">Anamta Institute</span>
          </h1>
          <p className="text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
            Have questions about course registration, scheduling, syllabus details, or payment plans? Send us a message and our support team will respond promptly.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details (Left side - Span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface border border-border p-6 rounded-2xl space-y-8">
              <h3 className="text-lg font-bold font-display text-text border-b border-border/40 pb-4">
                Support Details
              </h3>

              <div className="space-y-6">
                {/* Email item */}
                <div className="flex items-start gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Us</h4>
                    <a href="mailto:support@anamtainstitute.com" className="text-sm text-text hover:text-gold transition-colors font-medium mt-1 block">
                      anamtainstitute@gmail.com
                    </a>
                  </div>
                </div>

                {/* Phone item */}
                <div className="flex items-start gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">                    <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">WHATSAPP MESSAGE & CALLS ONLY</h4>
                    </h4>
                    <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="text-sm text-text hover:text-gold transition-colors font-medium mt-1 block">
                      +92 333 0493239
                    </a>
                  </div>
                </div>

                {/* Location item */}
                <div className="flex items-start gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Headquarters</h4>
                    <p className="text-sm text-text font-medium mt-1">
                      Lahore, Pakistan (Serving students globally)
                    </p>
                  </div>
                </div>

                {/* Timing item */}
                <div className="flex items-start gap-4 group">
                  <div className="h-10 w-10 rounded-xl bg-gold/10 text-gold flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Availability</h4>
                    <p className="text-sm text-text font-medium mt-1">
                      24/7
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Note glass box */}
            <div className="glass p-6 rounded-2xl border border-gold/20 flex gap-4 items-start">
              <div className="text-gold flex-shrink-0 mt-0.5">
                {/* <Sparkles size={18} /> */}
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                <strong>For Registered Students:</strong> If you are seeking immediate schedules re-coordination, please mention your Enrollment ID in the message subject to expedite your request.
              </p>
            </div>
          </div>

          {/* Contact Form (Right side - Span 7) */}
          <div className="lg:col-span-7 bg-surface border border-border p-6 sm:p-8 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold font-display text-text border-b border-border/40 pb-4 mb-6 flex items-center gap-2">
              <MessageSquare size={18} className="text-gold" />
              <span>Send Message</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  label="Your Name *"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Abdullah"
                  required
                />
                <Input
                  label="Email Address *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="abdullah@example.com"
                  required
                />
              </div>

              <Input
                label="Subject / Topic *"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question regarding Tajweed Syllabus"
                required
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider">
                  Detailed Message *
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Write your question, feedback, or request here..."
                  required
                  className="w-full bg-bg border border-border rounded-xl p-3.5 text-sm text-text focus:outline-none focus:ring-1 focus:ring-gold focus:border-gold resize-none placeholder:text-text-secondary/30 leading-relaxed"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                className="w-full py-3.5 text-xs uppercase tracking-wider font-bold"
                isLoading={loading}
                rightIcon={<Send size={14} />}
              >
                Send Message
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

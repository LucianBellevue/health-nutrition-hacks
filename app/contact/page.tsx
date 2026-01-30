'use client';

import { useState } from 'react';
import Breadcrumbs from '@/components/Breadcrumbs';

const CONTACT_PHONE = '+1 (706) 460-1201';
const CONTACT_PHONE_TEL = 'tel:+17064601201';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    }
  };

  const breadcrumbItems = [{ name: 'Contact', href: '/contact' }];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Breadcrumbs items={breadcrumbItems} />
        <header className="space-y-3 text-center md:text-left">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-400">
            Get in Touch
          </p>
          <h1 className="text-4xl font-semibold text-white">Contact Us</h1>
          <p className="text-base text-zinc-300">
            Have a question, suggestion, or just want to say hello? We&apos;d love to hear from you.
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>
        </header>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 sm:p-10 shadow-[0_0_60px_rgba(16,185,129,0.08)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-zinc-200">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-zinc-200">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-zinc-200">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              >
                <option value="" className="bg-zinc-800 text-zinc-400">Select a topic...</option>
                <option value="General Inquiry" className="bg-zinc-800 text-white">General Inquiry</option>
                <option value="Content Suggestion" className="bg-zinc-800 text-white">Content Suggestion</option>
                <option value="Partnership Opportunity" className="bg-zinc-800 text-white">Partnership Opportunity</option>
                <option value="Technical Issue" className="bg-zinc-800 text-white">Technical Issue</option>
                <option value="Feedback" className="bg-zinc-800 text-white">Feedback</option>
                <option value="Other" className="bg-zinc-800 text-white">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium text-zinc-200">
                Message <span className="text-emerald-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={6}
                placeholder="Tell us what's on your mind..."
                className="w-full px-4 py-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <p className="text-xs text-zinc-500">
                By submitting this form, you agree to our{' '}
                <a href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline-offset-4 hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-800 disabled:cursor-not-allowed px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 disabled:translate-y-0"
              >
                {status === 'submitting' ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    Send Message
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>

            {status === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-900/30 border border-emerald-700 text-emerald-300 text-sm">
                Thank you for your message! We&apos;ll get back to you soon.
              </div>
            )}

            {status === 'error' && (
              <div className="p-4 rounded-xl bg-red-900/30 border border-red-700 text-red-300 text-sm">
                {errorMessage || 'Something went wrong.'} Please try again or email us directly at{' '}
                <a href="mailto:info@healthnutritionhacks.com" className="underline">
                  info@healthnutritionhacks.com
                </a>
              </div>
            )}
          </form>
        </div>

        {/* Additional contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.894.553l3.3 6.6a1 1 0 01.553.894V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Call Us</h3>
            <p className="text-sm text-zinc-400">
              Simple inquiries and basic information
            </p>
            <a
              href={CONTACT_PHONE_TEL}
              className="inline-block text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              {CONTACT_PHONE}
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Email Us</h3>
            <p className="text-sm text-zinc-400">
              For general inquiries and support
            </p>
            <a
              href="mailto:info@healthnutritionhacks.com"
              className="inline-block text-emerald-400 hover:text-emerald-300 text-sm font-medium"
            >
              info@healthnutritionhacks.com
            </a>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-white">Response Time</h3>
            <p className="text-sm text-zinc-400">
              We typically respond within 24-48 hours during business days.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

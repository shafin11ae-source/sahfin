import React, { useState, useEffect } from 'react';
import { useMotion } from '../context/MotionContext';
import { InquiryData } from '../types';
import { SERVICES_DATA } from '../data/servicesData';
import {
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Mail,
  ArrowUpRight,
  Inbox,
  Paperclip,
  Check,
  PhoneCall,
} from 'lucide-react';
import { InquiryInboxModal } from './InquiryInboxModal';
import { StudioAuthModal } from './StudioAuthModal';

interface ContactProps {
  selectedServicePreset?: string;
}

export const Contact: React.FC<ContactProps> = ({ selectedServicePreset }) => {
  const { playFeedbackSound } = useMotion();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('Brand Identity & Branding');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('$10,000 – $25,000');
  const [deadline, setDeadline] = useState('1 – 2 Months');
  const [referenceLinks, setReferenceLinks] = useState('');
  const [attachmentsNote, setAttachmentsNote] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<InquiryData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showInboxModal, setShowInboxModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [openGmailOnSubmit, setOpenGmailOnSubmit] = useState(true);

  // Sync service preset when user clicks "Inquire About This Service"
  useEffect(() => {
    if (selectedServicePreset) {
      setService(selectedServicePreset);
    }
  }, [selectedServicePreset]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Basic validation
    if (!name.trim() || !email.trim() || !company.trim() || !description.trim()) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const targetDirectorEmail = 'shafinpkadampuzha@gmail.com';

    // Synchronously open Gmail compose window if selected
    if (openGmailOnSubmit) {
      const subject = `[DESIGN FOUNDRY Inquiry] ${company.trim()} - ${service}`;
      const body = `Hello Shafin,\n\nA new project inquiry has been submitted via DESIGN FOUNDRY:\n\nClient Name: ${name.trim()}\nWork Email: ${email.trim()}\nCompany/Brand: ${company.trim()}\nService Discipline: ${service}\nBudget Range: ${budget}\nPreferred Timeline: ${deadline}\n\nProject Brief:\n${description.trim()}\n\nReference Links: ${referenceLinks.trim() || 'None'}\nAttachments: ${attachmentsNote.trim() || 'None'}\n\nDirector Destination: ${targetDirectorEmail}\nSubmitted on: ${new Date().toLocaleString()}`;
      const composeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
        targetDirectorEmail
      )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      try {
        window.open(composeUrl, '_blank');
      } catch {}
    }

    setIsSubmitting(true);
    playFeedbackSound('click');

    const payload: InquiryData = {
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      service,
      description: description.trim(),
      budget,
      deadline,
      referenceLinks: referenceLinks.trim(),
      attachmentsNote: attachmentsNote.trim(),
      recipientEmail: targetDirectorEmail,
      deliveryStatus: `Routed to ${targetDirectorEmail}`,
    };

    try {
      // Real backend POST request to Vite API middleware
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let serverResponseData: any = null;
      if (res.ok) {
        serverResponseData = await res.json();
      }

      const generatedId =
        serverResponseData?.inquiryId ||
        `DF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const finalizedInquiry: InquiryData = {
        ...payload,
        id: generatedId,
        recipientEmail: targetDirectorEmail,
        deliveryStatus: `Routed to ${targetDirectorEmail}`,
        createdAt: new Date().toISOString(),
        status: 'new',
      };

      // Save to client localStorage for persistence
      try {
        const stored = localStorage.getItem('design_foundry_inquiries_v1');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(finalizedInquiry);
        localStorage.setItem('design_foundry_inquiries_v1', JSON.stringify(list));
      } catch {}

      setSubmittedInquiry(finalizedInquiry);
      playFeedbackSound('success');
    } catch (err: any) {
      console.warn('API error, saving to local fallback storage', err);
      const generatedId = `DF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
      const fallbackInquiry: InquiryData = {
        ...payload,
        id: generatedId,
        recipientEmail: targetDirectorEmail,
        deliveryStatus: `Routed to ${targetDirectorEmail}`,
        createdAt: new Date().toISOString(),
        status: 'new',
      };
      try {
        const stored = localStorage.getItem('design_foundry_inquiries_v1');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(fallbackInquiry);
        localStorage.setItem('design_foundry_inquiries_v1', JSON.stringify(list));
      } catch {}
      setSubmittedInquiry(fallbackInquiry);
      playFeedbackSound('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSubmittedInquiry(null);
    setName('');
    setEmail('');
    setCompany('');
    setDescription('');
    setReferenceLinks('');
    setAttachmentsNote('');
  };

  // Studio Phone & WhatsApp configuration (Shafin / DESIGN FOUNDRY)
  const phoneDisplay = '+91 88917 58194';
  const rawPhoneNumber = '8891758194';
  const whatsappNumber = '918891758194';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hello Shafin (DESIGN FOUNDRY), I would like to discuss a project regarding ${service}.`
  )}`;
  const phoneCallUrl = `tel:+91${rawPhoneNumber}`;

  // Email payload string for direct email client opening
  const emailSubject = submittedInquiry
    ? `[DESIGN FOUNDRY Inquiry ${submittedInquiry.id}] ${submittedInquiry.company} - ${submittedInquiry.service}`
    : '';
  const emailBodyText = submittedInquiry
    ? `Hello Shafin,\n\nA new project inquiry has been submitted via DESIGN FOUNDRY:\n\nReference: ${submittedInquiry.id}\nClient Name: ${submittedInquiry.name}\nWork Email: ${submittedInquiry.email}\nCompany/Brand: ${submittedInquiry.company}\nService Discipline: ${submittedInquiry.service}\nBudget Range: ${submittedInquiry.budget}\nPreferred Timeline: ${submittedInquiry.deadline}\n\nProject Brief:\n${submittedInquiry.description}\n\nReference Links: ${submittedInquiry.referenceLinks || 'None'}\nAttachments: ${submittedInquiry.attachmentsNote || 'None'}\n\nSubmitted on: ${new Date().toLocaleString()}`
    : '';

  const gmailComposeUrl = submittedInquiry
    ? `https://mail.google.com/mail/?view=cm&fs=1&to=shafinpkadampuzha@gmail.com&su=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBodyText)}`
    : '';

  const mailtoUrl = submittedInquiry
    ? `mailto:shafinpkadampuzha@gmail.com?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBodyText)}`
    : '';

  return (
    <section id="contact" className="py-24 border-t relative" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Closing Studio CTA */}
        <div className="max-w-3xl space-y-4">
          <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
            Project Inquiries · Commission Studio
          </div>
          <h2
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08]"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)', textWrap: 'balance' }}
          >
            Have an Idea? Let's Make It Unforgettable.
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-muted)] leading-relaxed">
            We partner with ambitious founders, cultural institutions, and forward-thinking enterprises. Tell us about your objectives below.
          </p>
        </div>

        {/* Main Grid: Left Form & Right Contact Channels */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: Project Inquiry Form or Confirmation (lg:col-span-8) */}
          <div
            className="lg:col-span-8 p-6 sm:p-10 rounded-2xl border relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-surface)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            {submittedInquiry ? (
              /* Success Confirmation View */
              <div className="py-8 space-y-6 text-center">
                <div
                  className="w-16 h-16 rounded-full mx-auto flex items-center justify-center border"
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderColor: 'rgba(16, 185, 129, 0.3)',
                    color: '#10b981',
                  }}
                >
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono uppercase tracking-widest text-emerald-400">
                    Inquiry Transmitted & Routed
                  </div>
                  <h3
                    className="text-2xl sm:text-3xl font-extrabold tracking-tight"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
                  >
                    Thank You, {submittedInquiry.name}
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
                    Your project dossier has been registered under reference{' '}
                    <span className="font-mono font-bold text-[var(--text-main)]">
                      {submittedInquiry.id}
                    </span>{' '}
                    and routed to studio director at{' '}
                    <span className="font-mono font-semibold text-emerald-400">
                      shafinpkadampuzha@gmail.com
                    </span>
                    .
                  </p>
                </div>

                <div
                  className="p-4 rounded-xl border text-left max-w-lg mx-auto space-y-2 text-xs font-mono"
                  style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border-subtle)' }}>
                    <span className="text-[var(--text-muted)]">Destination:</span>
                    <span className="font-semibold text-emerald-400">shafinpkadampuzha@gmail.com</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Company:</span>
                    <span className="font-semibold text-[var(--text-main)]">{submittedInquiry.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Discipline:</span>
                    <span className="font-semibold text-[var(--text-main)]">{submittedInquiry.service}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Budget Tier:</span>
                    <span className="font-semibold text-[var(--text-main)]">{submittedInquiry.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Timeline:</span>
                    <span className="font-semibold text-[var(--text-main)]">{submittedInquiry.deadline}</span>
                  </div>
                </div>

                {/* Email Delivery Actions */}
                <div className="space-y-3 max-w-lg mx-auto pt-2">
                  <div className="text-xs text-[var(--text-muted)] font-mono">
                    Direct Email Dispatch Options to shafinpkadampuzha@gmail.com:
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <a
                      href={gmailComposeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg border hover:border-white/40 transition-colors"
                      style={{
                        borderColor: 'var(--border-hover)',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        color: 'var(--text-main)',
                      }}
                    >
                      <Mail className="w-3.5 h-3.5 text-red-400" />
                      <span>Open in Gmail</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>

                    <a
                      href={`https://wa.me/918891758194?text=${encodeURIComponent(
                        `Hello Shafin, I have submitted an inquiry for ${submittedInquiry.company} (${submittedInquiry.service}) under reference ${submittedInquiry.id}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg border hover:border-white/40 transition-colors"
                      style={{
                        borderColor: 'var(--border-hover)',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        color: 'var(--text-main)',
                      }}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      <span>WhatsApp Ping</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>

                    <a
                      href={mailtoUrl}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg border hover:border-white/40 transition-colors"
                      style={{
                        borderColor: 'var(--border-hover)',
                        backgroundColor: 'var(--bg-surface-elevated)',
                        color: 'var(--text-main)',
                      }}
                    >
                      <Send className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Send Mail App</span>
                    </a>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button
                    onClick={() => {
                      playFeedbackSound('click');
                      setShowAuthModal(true);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-mono uppercase tracking-wider rounded-lg border hover:border-white/40 cursor-pointer"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <Inbox className="w-3.5 h-3.5" />
                    <span>View in Studio Inbox</span>
                  </button>

                  <button
                    onClick={handleResetForm}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer"
                    style={{
                      backgroundColor: 'var(--accent-focal)',
                      color: 'var(--accent-inverted)',
                    }}
                  >
                    <span>Submit Another Inquiry</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Usable Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b pb-4 flex items-center justify-between" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                      Project Initiation Dossier
                    </h3>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Direct transmission to DESIGN FOUNDRY creative team
                    </p>
                  </div>
                  
                  {/* Studio Inbox Quick Access */}
                  <button
                    type="button"
                    onClick={() => {
                      playFeedbackSound('click');
                      setShowAuthModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border hover:border-white/40 cursor-pointer"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <Inbox className="w-3.5 h-3.5 opacity-70" />
                    <span>Studio Inbox</span>
                  </button>
                </div>

                {errorMessage && (
                  <div className="p-3.5 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs flex items-center gap-2 font-mono">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="e.g. Alistair Vance"
                      className="w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="alistair@atelier.com"
                      className="w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Brand or Organization *
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={e => setCompany(e.target.value)}
                      placeholder="e.g. Vance Architecture Lab"
                      className="w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Required Service Discipline *
                    </label>
                    <select
                      value={service}
                      onChange={e => setService(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-main)',
                      }}
                    >
                      {SERVICES_DATA.map(s => (
                        <option key={s.id} value={s.title}>
                          {s.number}. {s.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Estimated Budget Range
                    </label>
                    <select
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-main)',
                      }}
                    >
                      <option value="$5,000 – $10,000">$5,000 – $10,000</option>
                      <option value="$10,000 – $25,000">$10,000 – $25,000 (Standard Identity)</option>
                      <option value="$25,000 – $50,000">$25,000 – $50,000 (Comprehensive System)</option>
                      <option value="$50,000+">$50,000+ (Enterprise / Global Launch)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Preferred Timeline / Deadline
                    </label>
                    <select
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                      style={{
                        borderColor: 'var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-main)',
                      }}
                    >
                      <option value="Flexible">Flexible / Exploring</option>
                      <option value="2 – 4 Weeks">2 – 4 Weeks (Expedited)</option>
                      <option value="1 – 2 Months">1 – 2 Months (Standard Pacing)</option>
                      <option value="3+ Months">3+ Months (Comprehensive Monograph)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                    Project Description & Brief *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Outline your brand vision, key challenges, required deliverables, and any specific aesthetic benchmarks..."
                    className="w-full px-4 py-3 rounded-lg border bg-transparent text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      Reference Links / Moodboard URL (Optional)
                    </label>
                    <input
                      type="url"
                      value={referenceLinks}
                      onChange={e => setReferenceLinks(e.target.value)}
                      placeholder="https://arena.na/... or figma.com"
                      className="w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
                      File Attachments / Cloud Drive Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={attachmentsNote}
                      onChange={e => setAttachmentsNote(e.target.value)}
                      placeholder="Share Drive / Dropbox / WeTransfer link"
                      className="w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm focus:outline-hidden focus:border-white/50 transition-colors"
                      style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                    />
                  </div>
                </div>

                <div className="pt-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-mono text-[var(--text-muted)] select-none hover:text-white transition-colors">
                    <input
                      type="checkbox"
                      checked={openGmailOnSubmit}
                      onChange={e => setOpenGmailOnSubmit(e.target.checked)}
                      className="w-4 h-4 rounded border-neutral-700 text-emerald-500 focus:ring-0 cursor-pointer"
                    />
                    <span>Launch Gmail addressed to <span className="text-emerald-400 font-semibold">shafinpkadampuzha@gmail.com</span> on submit</span>
                  </label>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all duration-200 cursor-pointer shadow-sm hover:opacity-90 active:scale-98 disabled:opacity-50"
                    style={{
                      backgroundColor: 'var(--accent-focal)',
                      color: 'var(--accent-inverted)',
                    }}
                  >
                    {isSubmitting ? (
                      <span>Transmitting Brief...</span>
                    ) : (
                      <>
                        <span>Submit Project Inquiry</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right: Studio Direct Channels & WhatsApp (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Direct Email Card */}
            <div
              className="p-6 rounded-2xl border space-y-3"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="w-9 h-9 rounded-xl border flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <Mail className="w-4 h-4 opacity-80" />
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Direct Director Inquiries
              </div>
              <a
                href="mailto:shafinpkadampuzha@gmail.com"
                className="text-base font-semibold block transition-colors hover:underline text-emerald-400"
              >
                shafinpkadampuzha@gmail.com
              </a>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Send RFP documents, NDA agreements, or monograph briefs directly to studio director inbox at shafinpkadampuzha@gmail.com.
              </p>
            </div>

            {/* WhatsApp Quick Channel */}
            <div
              className="p-6 rounded-2xl border space-y-3"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="w-9 h-9 rounded-xl border flex items-center justify-center" style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface-elevated)' }}>
                <MessageSquare className="w-4 h-4 opacity-80" />
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Direct Phone & WhatsApp Hotline
              </div>
              <div className="flex items-baseline gap-2">
                <a
                  href={phoneCallUrl}
                  className="text-lg font-mono font-bold text-emerald-400 hover:underline tracking-tight"
                >
                  {phoneDisplay}
                </a>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">
                  (Shafin)
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Direct studio director line for urgent client inquiries, WhatsApp briefs, or immediate project initiation.
              </p>
              <div className="flex items-center gap-4 pt-1">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider underline underline-offset-4 cursor-pointer hover:opacity-80 transition-opacity text-emerald-400"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Chat on WhatsApp</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href={phoneCallUrl}
                  className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider underline underline-offset-4 cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--accent-focal)' }}
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Direct Call</span>
                </a>
              </div>
            </div>

            {/* Configurable Studio Social Presence */}
            <div
              className="p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-subtle)',
              }}
            >
              <div className="text-xs font-mono uppercase tracking-widest text-[var(--text-muted)]">
                Visual Archives & Socials
              </div>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Behance Monograph', handle: 'behance.net/desifoundry', url: 'https://behance.net/desifoundry' },
                  { name: 'Instagram Atelier', handle: '@shafineyyy.x', url: 'https://instagram.com/shafineyyy.x' },
                  { name: 'LinkedIn Professional', handle: 'in/shafinpkadampuzha', url: 'https://linkedin.com/in/shafinpkadampuzha' },
                ].map((soc, idx) => (
                  <a
                    key={idx}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2.5 rounded-lg border hover:border-white/40 transition-colors group"
                    style={{
                      borderColor: 'var(--border-subtle)',
                      backgroundColor: 'var(--bg-surface-elevated)',
                      color: 'var(--text-main)',
                    }}
                  >
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>{soc.name}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400">
                      {soc.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Inquiry Inbox Modal */}
      {showInboxModal && <InquiryInboxModal onClose={() => setShowInboxModal(false)} />}

      {/* Studio Password Security Gate */}
      <StudioAuthModal
        isOpen={showAuthModal}
        targetTitle="Studio Inquiry Inbox"
        onSuccess={() => setShowInboxModal(true)}
        onClose={() => setShowAuthModal(false)}
      />
    </section>
  );
};

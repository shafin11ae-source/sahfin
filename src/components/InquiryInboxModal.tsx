import React, { useState, useEffect } from 'react';
import { InquiryData } from '../types';
import { useMotion } from '../context/MotionContext';
import {
  X,
  Mail,
  CheckCircle2,
  Download,
  Trash2,
  Clock,
  DollarSign,
  Building,
  Send,
  ArrowUpRight,
  Copy,
  Check,
  ExternalLink,
  PlusCircle,
} from 'lucide-react';

interface InquiryInboxModalProps {
  onClose: () => void;
}

const TARGET_DIRECTOR_EMAIL = 'shafinpkadampuzha@gmail.com';

export const InquiryInboxModal: React.FC<InquiryInboxModalProps> = ({ onClose }) => {
  const { playFeedbackSound } = useMotion();
  const [inquiries, setInquiries] = useState<InquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryData | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      // Fetch from real Vite API endpoint
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.inquiries && data.inquiries.length > 0) {
          setInquiries(data.inquiries);
          setSelectedInquiry(data.inquiries[0]);
          setLoading(false);
          return;
        }
      }
    } catch {
      // Fallback to localStorage
    }

    try {
      const stored = localStorage.getItem('design_foundry_inquiries_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        setInquiries(parsed);
        if (parsed.length > 0) setSelectedInquiry(parsed[0]);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const downloadInquiriesJSON = () => {
    playFeedbackSound('click');
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(inquiries, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `design-foundry-inquiries-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const clearInquiries = () => {
    if (confirm('Clear all stored inquiries from local view?')) {
      localStorage.removeItem('design_foundry_inquiries_v1');
      setInquiries([]);
      setSelectedInquiry(null);
      playFeedbackSound('click');
    }
  };

  const createTestInquiry = async () => {
    playFeedbackSound('click');
    const sample: InquiryData = {
      name: 'Elena Rostova',
      email: 'elena.rostova@atelier-nord.eu',
      company: 'Nordic Architecture Biennale',
      service: 'Brand Identity & Branding',
      description: 'Commissioning a bilingual exhibition identity, custom geometric typeface, and silkscreen posters for the 2026 Biennale in Oslo and Copenhagen.',
      budget: '$25,000 – $50,000',
      deadline: '1 – 2 Months',
      referenceLinks: 'https://arena.na/nordic-biennale',
      attachmentsNote: 'Exhibition hall blueprints attached',
      recipientEmail: TARGET_DIRECTOR_EMAIL,
      deliveryStatus: `Routed to ${TARGET_DIRECTOR_EMAIL}`,
    };

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sample),
      });
      if (res.ok) {
        const data = await res.json();
        const created = data.inquiry || { ...sample, id: data.inquiryId, createdAt: new Date().toISOString() };
        setInquiries(prev => [created, ...prev]);
        setSelectedInquiry(created);
        playFeedbackSound('success');
        return;
      }
    } catch {}

    const localCreated: InquiryData = {
      ...sample,
      id: `DF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    try {
      const stored = localStorage.getItem('design_foundry_inquiries_v1');
      const list = stored ? JSON.parse(stored) : [];
      list.unshift(localCreated);
      localStorage.setItem('design_foundry_inquiries_v1', JSON.stringify(list));
    } catch {}
    setInquiries(prev => [localCreated, ...prev]);
    setSelectedInquiry(localCreated);
    playFeedbackSound('success');
  };

  const getEmailBody = (inq: InquiryData) => {
    return `Hello Shafin,\n\nHere is the project inquiry from DESIGN FOUNDRY:\n\nReference ID: ${inq.id || 'N/A'}\nClient Name: ${inq.name}\nWork Email: ${inq.email}\nCompany: ${inq.company}\nService Discipline: ${inq.service}\nBudget Range: ${inq.budget}\nTimeline: ${inq.deadline}\n\nProject Brief:\n${inq.description}\n\nReference Links: ${inq.referenceLinks || 'None'}\nAttachments: ${inq.attachmentsNote || 'None'}\n\nDestination: ${TARGET_DIRECTOR_EMAIL}\nTimestamp: ${inq.createdAt || new Date().toISOString()}`;
  };

  const getGmailUrl = (inq: InquiryData) => {
    const subject = `[DESIGN FOUNDRY Inquiry ${inq.id || ''}] ${inq.company} - ${inq.service}`;
    const body = getEmailBody(inq);
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      TARGET_DIRECTOR_EMAIL
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const getMailtoUrl = (inq: InquiryData) => {
    const subject = `[DESIGN FOUNDRY Inquiry ${inq.id || ''}] ${inq.company} - ${inq.service}`;
    const body = getEmailBody(inq);
    return `mailto:${TARGET_DIRECTOR_EMAIL}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const copyDossier = (inq: InquiryData) => {
    navigator.clipboard.writeText(getEmailBody(inq));
    setCopiedId(true);
    playFeedbackSound('click');
    setTimeout(() => setCopiedId(false), 2000);
  };

  const getBatchInboxGmailUrl = () => {
    const subject = `[DESIGN FOUNDRY] Studio Inbox Digest (${inquiries.length} Inquiries)`;
    const digest = inquiries.map((inq, idx) => `
==============================
INQUIRY #${idx + 1}: ${inq.company} (${inq.id || 'N/A'})
==============================
Client Name: ${inq.name}
Client Email: ${inq.email}
Company: ${inq.company}
Service: ${inq.service}
Budget Range: ${inq.budget}
Timeline: ${inq.deadline}
Brief:
${inq.description}

Reference Links: ${inq.referenceLinks || 'None'}
Attachments: ${inq.attachmentsNote || 'None'}
Date: ${inq.createdAt || 'N/A'}
`).join('\n\n');
    const body = `Hello Shafin,\n\nHere is the full studio inquiry inbox digest from DESIGN FOUNDRY:\n\nTotal Submissions: ${inquiries.length}\nDestination Email: ${TARGET_DIRECTOR_EMAIL}\nTimestamp: ${new Date().toLocaleString()}\n\n${digest}`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(TARGET_DIRECTOR_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-2xl border shadow-2xl flex flex-col"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: 'var(--border-hover)',
        }}
      >
        {/* Header */}
        <div
          className="sticky top-0 z-20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(var(--bg-canvas), 0.95)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold tracking-tight" style={{ color: 'var(--text-main)' }}>
                Studio Inquiry Inbox
              </h3>
              <span className="text-xs font-mono text-[var(--text-muted)]">
                ({inquiries.length} submissions)
              </span>
            </div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] flex items-center gap-1.5">
              <span>Director Destination:</span>
              <span className="text-emerald-400 font-semibold">{TARGET_DIRECTOR_EMAIL}</span>
              <span className="text-emerald-500 text-[10px]">● Active</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {inquiries.length > 0 && (
              <a
                href={getBatchInboxGmailUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md border hover:border-red-400/50 cursor-pointer text-red-400"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'var(--bg-surface)',
                }}
                title="Send entire inbox digest to shafinpkadampuzha@gmail.com in Gmail"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Inbox to Gmail</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            )}

            <button
              onClick={createTestInquiry}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md border hover:border-emerald-400/50 cursor-pointer text-emerald-400"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
              }}
              title="Generate a test inquiry to test email routing"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Test Inquiry</span>
            </button>

            {inquiries.length > 0 && (
              <>
                <button
                  onClick={downloadInquiriesJSON}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-md border hover:border-white/40 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                  }}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JSON</span>
                </button>
                <button
                  onClick={clearInquiries}
                  className="p-1.5 rounded-lg border hover:border-red-400 text-red-400 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                  title="Clear inquiries"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg border hover:border-white/30 cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
              }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-xs font-mono text-[var(--text-muted)]">
              Loading studio inquiry submissions...
            </div>
          ) : inquiries.length === 0 ? (
            <div className="text-center py-12 space-y-4">
              <Mail className="w-10 h-10 opacity-30 mx-auto" />
              <div className="space-y-1">
                <div className="text-base font-semibold" style={{ color: 'var(--text-main)' }}>
                  No Inquiries in Queue Yet
                </div>
                <p className="text-xs text-[var(--text-muted)] max-w-sm mx-auto">
                  All submitted inquiries are delivered directly to{' '}
                  <span className="font-mono text-emerald-400">{TARGET_DIRECTOR_EMAIL}</span>.
                </p>
              </div>
              <button
                onClick={createTestInquiry}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-focal)',
                  color: 'var(--accent-inverted)',
                }}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Test Inquiry to {TARGET_DIRECTOR_EMAIL}</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Inquiry List */}
              <div className="md:col-span-5 space-y-2 max-h-[52vh] overflow-y-auto pr-1">
                {inquiries.map(inq => {
                  const isSelected = selectedInquiry?.id === inq.id;
                  return (
                    <div
                      key={inq.id || Math.random()}
                      onClick={() => {
                        playFeedbackSound('click');
                        setSelectedInquiry(inq);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected ? 'border-white/40' : 'hover:border-white/20'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'var(--bg-surface-elevated)' : 'var(--bg-surface)',
                        borderColor: isSelected ? 'var(--border-hover)' : 'var(--border-subtle)',
                      }}
                    >
                      <div className="flex items-center justify-between text-xs font-mono text-[var(--text-muted)] mb-1">
                        <span>{inq.id || 'DF-INQUIRY'}</span>
                        <span className="text-[10px]">
                          {inq.createdAt ? new Date(inq.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>
                        {inq.name} · {inq.company}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] truncate mt-0.5">
                        {inq.service}
                      </div>
                      <div className="text-[10px] font-mono text-emerald-400 mt-1 flex items-center gap-1">
                        <span>→ {TARGET_DIRECTOR_EMAIL}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inquiry Detail View */}
              {selectedInquiry && (
                <div
                  className="md:col-span-7 p-6 rounded-xl border space-y-4"
                  style={{
                    backgroundColor: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                  }}
                >
                  <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div>
                      <div className="text-xs font-mono text-[var(--text-muted)]">
                        {selectedInquiry.id}
                      </div>
                      <h4 className="text-lg font-bold" style={{ color: 'var(--text-main)' }}>
                        {selectedInquiry.name}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 block">
                        Routed to Director
                      </span>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {TARGET_DIRECTOR_EMAIL}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[var(--text-muted)] font-mono block">Client Email</span>
                      <a href={`mailto:${selectedInquiry.email}`} className="font-semibold underline" style={{ color: 'var(--text-main)' }}>
                        {selectedInquiry.email}
                      </a>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-mono block">Company</span>
                      <span className="font-semibold" style={{ color: 'var(--text-main)' }}>
                        {selectedInquiry.company}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-mono block">Service</span>
                      <span className="font-semibold" style={{ color: 'var(--text-main)' }}>
                        {selectedInquiry.service}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-mono block">Budget Range</span>
                      <span className="font-semibold" style={{ color: 'var(--text-main)' }}>
                        {selectedInquiry.budget}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-mono block">Timeline</span>
                      <span className="font-semibold" style={{ color: 'var(--text-main)' }}>
                        {selectedInquiry.deadline}
                      </span>
                    </div>
                    <div>
                      <span className="text-[var(--text-muted)] font-mono block">Reference Links</span>
                      <span className="font-semibold truncate block" style={{ color: 'var(--text-main)' }}>
                        {selectedInquiry.referenceLinks || 'None provided'}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <span className="text-xs text-[var(--text-muted)] font-mono block mb-1">
                      Project Brief
                    </span>
                    <p className="text-xs leading-relaxed p-3 rounded-lg border bg-black/20" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}>
                      {selectedInquiry.description}
                    </p>
                  </div>

                  {selectedInquiry.attachmentsNote && (
                    <div className="text-xs text-[var(--text-muted)]">
                      <span className="font-mono">Attachment notes: </span>
                      {selectedInquiry.attachmentsNote}
                    </div>
                  )}

                  {/* Destination Actions: Forward to shafinpkadampuzha@gmail.com */}
                  <div className="pt-3 border-t space-y-2" style={{ borderColor: 'var(--border-subtle)' }}>
                    <div className="text-xs font-mono text-[var(--text-muted)] flex items-center justify-between">
                      <span>Dispatch to Director Inbox:</span>
                      <span className="text-emerald-400">{TARGET_DIRECTOR_EMAIL}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                      <a
                        href={getGmailUrl(selectedInquiry)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-mono hover:border-white/40 transition-colors"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          color: 'var(--text-main)',
                        }}
                      >
                        <Mail className="w-3.5 h-3.5 text-red-400" />
                        <span>Open in Gmail</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>

                      <a
                        href={getMailtoUrl(selectedInquiry)}
                        className="inline-flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-mono hover:border-white/40 transition-colors"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          color: 'var(--text-main)',
                        }}
                      >
                        <Send className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Send to Email</span>
                      </a>

                      <button
                        onClick={() => copyDossier(selectedInquiry)}
                        className="inline-flex items-center justify-center gap-1.5 p-2 rounded-lg border text-xs font-mono hover:border-white/40 cursor-pointer transition-colors"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          color: 'var(--text-main)',
                        }}
                      >
                        {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedId ? 'Copied' : 'Copy Dossier'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

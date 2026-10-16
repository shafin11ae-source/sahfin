import React, { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useMotion } from '../context/MotionContext';
import { Project, ProjectCategory } from '../types';
import { X, Plus, Trash2, Edit3, RotateCcw, Check, Sparkles } from 'lucide-react';

interface ProjectAdminModalProps {
  onClose: () => void;
}

export const ProjectAdminModal: React.FC<ProjectAdminModalProps> = ({ onClose }) => {
  const { projects, addProject, updateProject, deleteProject, resetInitialProjects } = useProjects();
  const { playFeedbackSound } = useMotion();

  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Exclude<ProjectCategory, 'all'>>('branding');
  const [categoryLabel, setCategoryLabel] = useState('Brand Identity & Visual System');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [client, setClient] = useState('');
  const [challenge, setChallenge] = useState('');
  const [concept, setConcept] = useState('');
  const [outcome, setOutcome] = useState('');
  const [deliverablesStr, setDeliverablesStr] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/portfolio_brand_identity_1791980133962.jpg');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleStartAdd = () => {
    setTitle('');
    setCategory('branding');
    setCategoryLabel('Brand Identity & Visual System');
    setYear(new Date().getFullYear().toString());
    setClient('');
    setChallenge('');
    setConcept('');
    setOutcome('');
    setDeliverablesStr('Visual Identity, Typography System, Collateral');
    setImageUrl('/src/assets/images/portfolio_brand_identity_1791980133962.jpg');
    setMode('add');
    playFeedbackSound('click');
  };

  const handleStartEdit = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setCategory(proj.category);
    setCategoryLabel(proj.categoryLabel);
    setYear(proj.year);
    setClient(proj.client);
    setChallenge(proj.challenge);
    setConcept(proj.concept);
    setOutcome(proj.outcome);
    setDeliverablesStr(proj.deliverables.join(', '));
    setImageUrl(proj.imageUrl);
    setMode('edit');
    playFeedbackSound('click');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !client.trim()) {
      setFeedbackMsg('Please complete title and client fields.');
      return;
    }

    const deliverables = deliverablesStr
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    if (mode === 'add') {
      addProject({
        title,
        category,
        categoryLabel: categoryLabel || `${category.toUpperCase()} Project`,
        year,
        client,
        challenge: challenge || 'Bespoke design challenge.',
        concept: concept || 'Refined typographic approach.',
        outcome: outcome || 'High-impact design delivery.',
        deliverables: deliverables.length > 0 ? deliverables : ['Design Strategy'],
        imageUrl: imageUrl || '/src/assets/images/portfolio_brand_identity_1791980133962.jpg',
      });
      setFeedbackMsg('Project added successfully.');
    } else if (mode === 'edit' && editingProject) {
      updateProject({
        ...editingProject,
        title,
        category,
        categoryLabel: categoryLabel || `${category.toUpperCase()} Project`,
        year,
        client,
        challenge,
        concept,
        outcome,
        deliverables,
        imageUrl,
      });
      setFeedbackMsg('Project updated successfully.');
    }

    setTimeout(() => {
      setFeedbackMsg('');
      setMode('list');
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl flex flex-col"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: 'var(--border-hover)',
        }}
      >
        {/* Top Header */}
        <div
          className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(var(--bg-canvas), 0.95)',
            borderColor: 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="text-base font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
            >
              Portfolio Catalog Manager
            </span>
            <span className="text-xs font-mono text-[var(--text-muted)]">
              ({projects.length} Projects)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {mode === 'list' && (
              <button
                onClick={handleStartAdd}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-md cursor-pointer"
                style={{
                  backgroundColor: 'var(--accent-focal)',
                  color: 'var(--accent-inverted)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
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

        {/* Body */}
        <div className="p-6">
          {feedbackMsg && (
            <div
              className="mb-4 p-3 rounded-lg border text-xs font-mono flex items-center gap-2"
              style={{
                borderColor: 'var(--border-hover)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-main)',
              }}
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {mode === 'list' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {projects.map(proj => (
                  <div
                    key={proj.id}
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-colors hover:border-white/30"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)',
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={proj.imageUrl}
                        alt=""
                        className="w-12 h-10 object-cover rounded-md shrink-0 border"
                        style={{ borderColor: 'var(--border-subtle)' }}
                      />
                      <div className="truncate">
                        <div className="text-sm font-semibold truncate" style={{ color: 'var(--text-main)' }}>
                          {proj.title}
                        </div>
                        <div className="text-xs text-[var(--text-muted)] flex items-center gap-2 font-mono">
                          <span className="uppercase">{proj.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>{proj.client}</span>
                          <span aria-hidden="true">·</span>
                          <span>{proj.year}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleStartEdit(proj)}
                        aria-label="Edit Project"
                        className="p-2 rounded-lg border hover:border-white/30 cursor-pointer"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                          color: 'var(--text-main)',
                        }}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Remove "${proj.title}" from portfolio?`)) {
                            deleteProject(proj.id);
                          }
                        }}
                        aria-label="Delete Project"
                        className="p-2 rounded-lg border hover:border-red-400 cursor-pointer text-red-400"
                        style={{
                          borderColor: 'var(--border-subtle)',
                          backgroundColor: 'var(--bg-surface-elevated)',
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset to Default Projects */}
              <div className="pt-4 border-t flex justify-between items-center" style={{ borderColor: 'var(--border-subtle)' }}>
                <span className="text-xs text-[var(--text-muted)]">
                  Restore studio initial project showcase:
                </span>
                <button
                  onClick={() => {
                    if (confirm('Reset portfolio to initial curated projects?')) {
                      resetInitialProjects();
                      setFeedbackMsg('Restored initial project catalog.');
                      setTimeout(() => setFeedbackMsg(''), 1500);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg border hover:border-white/40 cursor-pointer"
                  style={{
                    borderColor: 'var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface)',
                    color: 'var(--text-main)',
                  }}
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Initial Projects</span>
                </button>
              </div>
            </div>
          ) : (
            /* Add or Edit Form */
            <form onSubmit={handleSave} className="space-y-4">
              <div className="text-sm font-semibold border-b pb-2" style={{ color: 'var(--text-main)', borderColor: 'var(--border-subtle)' }}>
                {mode === 'add' ? 'Add New Portfolio Project' : `Edit "${editingProject?.title}"`}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                    placeholder="e.g. Zenith Optical Identity"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Category *</label>
                  <select
                    value={category}
                    onChange={e => {
                      const val = e.target.value as Exclude<ProjectCategory, 'all'>;
                      setCategory(val);
                      const labels: Record<string, string> = {
                        branding: 'Brand Identity & Visual System',
                        logos: 'Logo & Symbolic Geometry',
                        posters: 'Poster & Kinetic Campaign',
                        magazines: 'Editorial & Monograph Design',
                        websites: 'Website & Digital Experience',
                        social: 'Social Media & Curated Art Direction',
                        packaging: 'Packaging & Structural Design',
                      };
                      setCategoryLabel(labels[val] || val);
                    }}
                    className="w-full px-3 py-2 text-sm rounded-lg border"
                    style={{ borderColor: 'var(--border-subtle)', backgroundColor: 'var(--bg-surface)', color: 'var(--text-main)' }}
                  >
                    <option value="branding">Branding</option>
                    <option value="logos">Logos</option>
                    <option value="posters">Posters</option>
                    <option value="magazines">Magazines</option>
                    <option value="websites">Websites</option>
                    <option value="social">Social Media</option>
                    <option value="packaging">Packaging</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={e => setClient(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                    placeholder="e.g. Zurich Museum of Architecture"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Year</label>
                  <input
                    type="text"
                    value={year}
                    onChange={e => setYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent font-mono"
                    style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                    placeholder="2026"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Image Asset URL or Path *</label>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent font-mono text-xs"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">The Design Challenge</label>
                <textarea
                  rows={2}
                  value={challenge}
                  onChange={e => setChallenge(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                  placeholder="Describe the brief and design constraints..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Creative Concept</label>
                <textarea
                  rows={2}
                  value={concept}
                  onChange={e => setConcept(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                  placeholder="Describe the conceptual solution..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Outcome & Impact</label>
                <textarea
                  rows={2}
                  value={outcome}
                  onChange={e => setOutcome(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                  placeholder="Measurable impact, awards, or cultural reception..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[var(--text-muted)]">Deliverables (comma-separated)</label>
                <input
                  type="text"
                  value={deliverablesStr}
                  onChange={e => setDeliverablesStr(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border bg-transparent"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-main)' }}
                  placeholder="e.g. Identity Architecture, Monogram, Typography, Custom Packaging"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg border hover:border-white/30 cursor-pointer"
                  style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg cursor-pointer"
                  style={{
                    backgroundColor: 'var(--accent-focal)',
                    color: 'var(--accent-inverted)',
                  }}
                >
                  Save Project
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

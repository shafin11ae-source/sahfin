import React, { useState, useEffect, useRef } from 'react';
import { useMotion } from '../context/MotionContext';
import { Lock, KeyRound, Eye, EyeOff, X, ShieldAlert, Check } from 'lucide-react';

interface StudioAuthModalProps {
  isOpen: boolean;
  targetTitle: string;
  onSuccess: () => void;
  onClose: () => void;
}

const CORRECT_PASSKEY = 'desifoundry202618';

export const StudioAuthModal: React.FC<StudioAuthModalProps> = ({
  isOpen,
  targetTitle,
  onSuccess,
  onClose,
}) => {
  const { playFeedbackSound } = useMotion();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword('');
      setErrorMsg('');
      setIsSuccess(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim() === CORRECT_PASSKEY) {
      setErrorMsg('');
      setIsSuccess(true);
      playFeedbackSound('success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 400);
    } else {
      setErrorMsg('Incorrect passkey. Access restricted to studio director.');
      playFeedbackSound('click');
      inputRef.current?.select();
    }
  };

  return (
    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          playFeedbackSound('click');
          onClose();
        }}
      />

      {/* Security Gate Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-gate-title"
        className="relative z-10 w-full max-w-md p-6 sm:p-8 rounded-2xl border shadow-2xl space-y-6"
        style={{
          backgroundColor: 'var(--bg-canvas)',
          borderColor: 'var(--border-hover)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-start justify-between border-b pb-4" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl border flex items-center justify-center"
              style={{
                borderColor: 'var(--border-hover)',
                backgroundColor: 'var(--bg-surface-elevated)',
                color: 'var(--text-main)',
              }}
            >
              <Lock className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
                Atelier Security Gate
              </div>
              <h3
                id="auth-gate-title"
                className="text-base sm:text-lg font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}
              >
                Director Passkey Required
              </h3>
            </div>
          </div>

          <button
            onClick={() => {
              playFeedbackSound('click');
              onClose();
            }}
            aria-label="Close authentication prompt"
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

        {/* Prompt description */}
        <div className="space-y-1">
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Please authenticate to unlock <span className="font-semibold text-[var(--text-main)]">{targetTitle}</span>.
          </p>
          <div className="text-[11px] font-mono text-[var(--text-muted)] opacity-70">
            Protected studio administration area.
          </div>
        </div>

        {/* Error notification */}
        {errorMsg && (
          <div className="p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-mono flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success confirmation */}
        {isSuccess && (
          <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Passkey verified. Unlocking director workspace...</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)]">
              Studio Passkey
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={e => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Enter password..."
                className="w-full px-4 py-2.5 pr-10 rounded-lg border bg-transparent text-sm font-mono focus:outline-hidden focus:border-white/50 transition-colors"
                style={{
                  borderColor: 'var(--border-subtle)',
                  color: 'var(--text-main)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[var(--text-muted)] hover:text-white cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                playFeedbackSound('click');
                onClose();
              }}
              className="px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-lg border hover:border-white/30 cursor-pointer"
              style={{
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'var(--bg-surface)',
                color: 'var(--text-muted)',
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!password || isSuccess}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer disabled:opacity-50"
              style={{
                backgroundColor: 'var(--accent-focal)',
                color: 'var(--accent-inverted)',
              }}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Unlock Access</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

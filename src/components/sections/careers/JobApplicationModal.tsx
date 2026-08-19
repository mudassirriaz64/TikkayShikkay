"use client";

import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import {
  X,
  Upload,
  FileText,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Briefcase,
  User,
  Phone,
  Mail,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { JobListing } from "@/types";
import { careersService } from "@/lib/api/careers.service";
import { useAccount } from "@/providers/AccountProvider";

interface JobApplicationModalProps {
  job: JobListing | null;
  isOpen: boolean;
  onClose: () => void;
}

const ALLOWED_EXTENSIONS = ["pdf", "docx", "doc", "jpg", "jpeg", "png"];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export function JobApplicationModal({
  job,
  isOpen,
  onClose,
}: JobApplicationModalProps) {
  const { profile } = useAccount();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experienceYears, setExperienceYears] = useState(2);
  const [coverLetter, setCoverLetter] = useState("");

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Sync profile when signed in
  useEffect(() => {
    if (profile) {
      if (profile.name && !fullName) setFullName(profile.name);
      if (profile.email && !email) setEmail(profile.email);
      if (profile.phone && !phone) setPhone(profile.phone);
    }
  }, [profile]);

  if (!isOpen || !job) return null;

  const validateAndSetFile = (file: File) => {
    setFileError(null);

    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      setFileError(
        `Invalid file type (.${ext}). Only PDF, DOCX, and JPG/PNG documents are supported.`
      );
      setSelectedFile(null);
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileError(
        `File is too large (${sizeMb} MB). Maximum allowed resume size is 25 MB.`
      );
      setSelectedFile(null);
      return false;
    }

    setSelectedFile(file);
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!selectedFile) {
      setFileError("Please upload your resume file (PDF, DOCX, or JPG up to 25MB)");
      return;
    }

    setSubmitting(true);
    try {
      await careersService.apply({
        job_id: job.id,
        job_title: job.title,
        full_name: fullName,
        email,
        phone,
        experience_years: experienceYears,
        cover_letter: coverLetter,
        resume: selectedFile,
      });

      setIsSuccess(true);
    } catch (err: any) {
      setSubmitError(err?.message || "Failed to submit your application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md"
        onClick={() => !submitting && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[24px] border border-white/10 bg-[#161616] text-[#e5e2e1] shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 bg-[#121212] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-orange)] text-white shadow-md">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-[family:var(--font-serif)] text-base font-bold uppercase text-white">
                  {job.title}
                </h3>
                <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[var(--accent-peach)]">
                  {job.type}
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {job.department} · {job.location}
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={submitting}
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="font-[family:var(--font-serif)] text-2xl font-bold uppercase text-white">
              Application Submitted!
            </h4>
            <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{fullName}</strong>. Your resume has been uploaded and our culinary hiring team will review your application for the <strong>{job.title}</strong> role shortly.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                onClick={onClose}
                className="rounded-xl px-6 text-xs font-bold uppercase"
              >
                Close & View Other Roles
              </Button>
            </div>
          </div>
        ) : (
          /* Application Form */
          <form onSubmit={handleSubmit} className="max-h-[75vh] overflow-y-auto p-6 space-y-4 scrollbar-none">
            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mudassir Riaz"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 1234567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="email"
                    required
                    placeholder="candidate@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] pl-9 pr-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                />
              </div>
            </div>

            {/* Resume Upload Box with Strict Validation */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Upload Resume / CV (PDF, DOCX, JPG — Max 25 MB) *
              </label>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword,image/jpeg,image/png"
                onChange={handleFileChange}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-5 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "border-[var(--accent-orange)] bg-[var(--accent-orange)]/10"
                    : selectedFile
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-white/15 bg-[#1c1c1c] hover:border-white/30"
                }`}
              >
                {selectedFile ? (
                  <div className="space-y-1.5">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-white truncate max-w-xs">{selectedFile.name}</p>
                    <p className="text-[10px] text-emerald-400 font-mono">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · Click or drag to replace
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[var(--accent-orange)]">
                      <Upload className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold text-white">Click or drag & drop resume file</p>
                    <p className="text-[10px] text-neutral-400">
                      Supports PDF, DOCX, DOC, JPG, PNG (Strict limit: 25 MB)
                    </p>
                  </div>
                )}
              </div>

              {fileError && (
                <p className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {fileError}
                </p>
              )}
            </div>

            {/* Cover Letter / Intro */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                Brief Introduction / Notes (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Tell us why you want to join Tikkay Shikkay and your culinary background..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none resize-none"
              />
            </div>

            {submitError && (
              <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400">
                {submitError}
              </p>
            )}

            {/* Footer Actions */}
            <div className="flex items-center justify-between border-t border-white/10 bg-[#121212] -mx-6 -mb-6 px-6 py-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                disabled={submitting}
                className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white"
              >
                Cancel
              </button>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={submitting}
                className="rounded-xl px-6 text-xs font-bold uppercase tracking-wider flex items-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Uploading to Cloudinary...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Submit Application
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

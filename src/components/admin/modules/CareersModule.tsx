"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Briefcase,
  Plus,
  Search,
  Pencil,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  FileText,
  RefreshCw,
  X,
  Check,
  Building,
  MapPin,
  Flame,
} from "lucide-react";
import { PageHeader, SectionCard, StatCard, Badge, BadgeTone } from "../ui/panel";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils/formatDate";
import {
  careersService,
  JobApplicationRecord,
} from "@/lib/api/careers.service";
import { JobListing } from "@/types";

const APPLICATION_STATUS_META: Record<
  string,
  { label: string; tone: BadgeTone }
> = {
  applied: { label: "New Application", tone: "neutral" },
  reviewed: { label: "Under Review", tone: "orange" },
  interview: { label: "Interview Scheduled", tone: "gold" },
  hired: { label: "Hired & Welcomed", tone: "green" },
  rejected: { label: "Not Selected", tone: "red" },
};

export function CareersModule() {
  const [activeSubTab, setActiveSubTab] = useState<"applications" | "jobs">(
    "applications"
  );
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [applications, setApplications] = useState<JobApplicationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Job Modal State
  const [isJobModalOpen, setIsJobModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobListing | null>(null);
  const [jobTitle, setJobTitle] = useState("");
  const [department, setDepartment] = useState("Kitchen & Grill");
  const [jobType, setJobType] = useState<any>("Full-time");
  const [location, setLocation] = useState("DHA Phase 5, Lahore");
  const [description, setDescription] = useState("");
  const [requirementsInput, setRequirementsInput] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [savingJob, setSavingJob] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [jobsData, appsData] = await Promise.all([
        careersService.getAllJobsAdmin().catch(() => []),
        careersService.getAllApplications().catch(() => []),
      ]);
      setJobs(jobsData || []);
      setApplications(appsData || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  // Job CRUD
  const openCreateJobModal = () => {
    setEditingJob(null);
    setJobTitle("");
    setDepartment("Kitchen & Grill");
    setJobType("Full-time");
    setLocation("DHA Phase 5, Lahore");
    setDescription("");
    setRequirementsInput("");
    setIsActive(true);
    setIsJobModalOpen(true);
  };

  const openEditJobModal = (job: JobListing) => {
    setEditingJob(job);
    setJobTitle(job.title);
    setDepartment(job.department);
    setJobType(job.type);
    setLocation(job.location);
    setDescription(job.description);
    setRequirementsInput((job.requirements || []).join("\n"));
    setIsActive(job.is_active !== false);
    setIsJobModalOpen(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingJob(true);

    const requirements = requirementsInput
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean);

    const payload = {
      title: jobTitle,
      department,
      type: jobType,
      location,
      description,
      requirements,
      is_active: isActive,
    };

    try {
      if (editingJob) {
        const updated = await careersService.updateJob(editingJob.id, payload);
        setJobs((prev) =>
          prev.map((j) => (j.id === editingJob.id ? updated : j))
        );
      } else {
        const created = await careersService.createJob(payload);
        setJobs((prev) => [created, ...prev]);
      }
      setIsJobModalOpen(false);
    } catch (err: any) {
      alert(err?.message || "Failed to save job role");
    } finally {
      setSavingJob(false);
    }
  };

  const handleDeleteJob = async (job: JobListing) => {
    if (
      !confirm(
        `Are you sure you want to delete "${job.title}"? This will permanently delete the role and ALL associated applications & Cloudinary resumes.`
      )
    )
      return;

    try {
      await careersService.deleteJob(job.id);
      setJobs((prev) => prev.filter((j) => j.id !== job.id));
      setApplications((prev) => prev.filter((a) => a.job_id !== job.id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete job role");
    }
  };

  // Application CRUD & Hard Delete
  const handleUpdateAppStatus = async (id: string, status: string) => {
    try {
      await careersService.updateApplicationStatus(id, status);
      setApplications((prev) =>
        prev.map((a) => ((a.id || a._id) === id ? { ...a, status: status as any } : a))
      );
    } catch (err: any) {
      alert(err?.message || "Failed to update status");
    }
  };

  const handleDeleteApplication = async (app: JobApplicationRecord) => {
    const id = app.id || app._id;
    if (
      !confirm(
        `Permanently delete application for "${app.full_name}"? This will hard delete the application record and delete their resume file from Cloudinary.`
      )
    )
      return;

    try {
      await careersService.deleteApplication(id!);
      setApplications((prev) => prev.filter((a) => (a.id || a._id) !== id));
    } catch (err: any) {
      alert(err?.message || "Failed to delete application");
    }
  };

  const filteredApplications = applications.filter((app) => {
    const name = app.full_name || "";
    const email = app.email || "";
    const phone = app.phone || "";
    const title = app.job_title || "";

    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      title.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== "all" && app.status !== statusFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Recruitment & Team Building"
        title="Careers & Hiring"
        description="Manage open culinary roles, review candidate applications, view Cloudinary resumes, and manage interview pipelines."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="flex items-center gap-2 rounded-xl text-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={openCreateJobModal}
              className="flex items-center gap-2 rounded-xl text-xs"
            >
              <Plus className="h-3.5 w-3.5" />
              Post New Position
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Briefcase}
          label="Open Positions"
          value={String(jobs.filter((j) => j.is_active !== false).length)}
          sub="Live job openings"
        />
        <StatCard
          icon={User}
          label="Total Applications"
          value={String(applications.length)}
          sub="Candidates applied"
        />
        <StatCard
          icon={Clock}
          label="Under Review"
          value={String(applications.filter((a) => a.status === "reviewed" || a.status === "applied").length)}
          sub="Pending review"
        />
        <StatCard
          icon={CheckCircle2}
          label="Hired Pitmasters"
          value={String(applications.filter((a) => a.status === "hired").length)}
          sub="Successfully placed"
        />
      </div>

      {/* Subtabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[var(--border-warm)]/60 pb-3">
        <button
          type="button"
          onClick={() => setActiveSubTab("applications")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === "applications"
              ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-md"
              : "text-[var(--text-muted)] hover:text-white"
          }`}
        >
          Candidate Applications ({applications.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab("jobs")}
          className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
            activeSubTab === "jobs"
              ? "bg-[var(--accent-orange)] text-[var(--text-on-orange)] shadow-md"
              : "text-[var(--text-muted)] hover:text-white"
          }`}
        >
          Open Positions ({jobs.length})
        </button>
      </div>

      {activeSubTab === "applications" ? (
        <SectionCard
          title="Candidate Applications Directory"
          description="Review applicant experience, open Cloudinary resumes, update hiring status, and permanently hard delete candidates."
        >
          {/* Search and Status Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-[var(--border-warm)]/60 pb-5 mb-5">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-faint)]" />
              <input
                type="text"
                placeholder="Search candidate name, role, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] pl-10 pr-4 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-xl border border-[var(--border-warm)] bg-[var(--bg-base)] px-3 py-2 text-xs text-[var(--text-primary)] focus:border-[var(--accent-orange)] focus:outline-none"
              >
                <option value="all">All Application Statuses ({applications.length})</option>
                <option value="applied">New ({applications.filter((a) => a.status === "applied").length})</option>
                <option value="reviewed">Under Review ({applications.filter((a) => a.status === "reviewed").length})</option>
                <option value="interview">Interviewing ({applications.filter((a) => a.status === "interview").length})</option>
                <option value="hired">Hired ({applications.filter((a) => a.status === "hired").length})</option>
                <option value="rejected">Rejected ({applications.filter((a) => a.status === "rejected").length})</option>
              </select>
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((app) => {
                const id = app.id || app._id || "";
                const meta = APPLICATION_STATUS_META[app.status] || {
                  label: app.status,
                  tone: "neutral",
                };

                return (
                  <div
                    key={id}
                    className="rounded-2xl border border-[var(--border-warm)] bg-[var(--bg-base)] p-5 space-y-4 hover:border-white/20 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[var(--border-warm)]/60 pb-3">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-bold text-base text-[var(--text-primary)]">
                          {app.full_name}
                        </span>
                        <span className="rounded-full bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 px-2.5 py-0.5 text-[10px] font-extrabold uppercase text-[var(--accent-peach)]">
                          {app.job_title}
                        </span>
                        <Badge tone={meta.tone}>{meta.label}</Badge>
                      </div>

                      <span className="text-xs text-[var(--text-faint)]">
                        Applied {formatDate(app.createdAt)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Contact</p>
                        <p className="text-neutral-200 mt-0.5 flex items-center gap-1.5">
                          <Phone className="h-3 w-3 text-neutral-400" /> {app.phone}
                        </p>
                        <p className="text-neutral-300 flex items-center gap-1.5 mt-0.5">
                          <Mail className="h-3 w-3 text-neutral-400" /> {app.email}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Experience</p>
                        <p className="font-bold text-[var(--text-primary)] mt-0.5">
                          {app.experience_years} Years in Culinary / Service
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase text-[var(--text-faint)]">Resume Document</p>
                        <a
                          href={app.resume_url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-1 inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-white/10 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span className="truncate max-w-[160px]">{app.resume_file_name || "View Resume (Cloudinary)"}</span>
                        </a>
                      </div>
                    </div>

                    {app.cover_letter && (
                      <p className="text-xs text-[var(--text-muted)] italic bg-[var(--bg-surface-raised)] p-3 rounded-xl border border-[var(--border-warm)]">
                        &ldquo;{app.cover_letter}&rdquo;
                      </p>
                    )}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--border-warm)]/60 pt-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[var(--text-faint)] font-bold uppercase">Status:</span>
                        <select
                          value={app.status}
                          onChange={(e) => handleUpdateAppStatus(id, e.target.value)}
                          className="rounded-xl border border-white/20 bg-[#222] px-3 py-1.5 text-xs font-bold text-white focus:border-[#D9381E] focus:outline-none cursor-pointer"
                        >
                          <option value="applied">New Application</option>
                          <option value="reviewed">Under Review</option>
                          <option value="interview">Interview Scheduled</option>
                          <option value="hired">Hired & Welcomed</option>
                          <option value="rejected">Not Selected</option>
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteApplication(app)}
                        className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Hard Delete (DB & Cloudinary)</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[var(--text-faint)] space-y-2">
              <User className="mx-auto h-8 w-8 text-[var(--text-faint)]/40" />
              <p className="font-semibold text-sm text-[var(--text-muted)]">No applications found</p>
              <p className="text-xs text-[var(--text-faint)]">
                {loading ? "Loading applications..." : "Submitted job applications will appear here."}
              </p>
            </div>
          )}
        </SectionCard>
      ) : (
        <SectionCard
          title="Open Job Positions"
          description="Manage open roles, edit descriptions, adjust requirements, and control public visibility."
        >
          {jobs.length > 0 ? (
            <div className="divide-y divide-[var(--border-warm)]/60">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0 hover:bg-white/[0.02] -mx-4 px-4 rounded-xl transition-colors"
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-base text-[var(--text-primary)]">
                        {job.title}
                      </h4>
                      <span className="rounded-full bg-[var(--accent-orange)]/15 border border-[var(--accent-orange)]/30 px-2 py-0.5 text-[9px] font-extrabold uppercase text-[var(--accent-peach)]">
                        {job.department}
                      </span>
                      <span className="rounded-full bg-white/5 border border-white/10 px-2 py-0.5 text-[9px] font-bold uppercase text-[var(--text-muted)]">
                        {job.type}
                      </span>
                      {job.is_active === false && (
                        <span className="rounded-full bg-rose-500/20 text-rose-400 text-[9px] font-bold uppercase px-2 py-0.5">
                          Inactive (Hidden)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[var(--text-body)] line-clamp-1">
                      {job.description}
                    </p>
                    <p className="text-[11px] text-[var(--text-faint)] flex items-center gap-2">
                      <MapPin className="h-3 w-3" /> {job.location} · Posted {job.postedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditJobModal(job)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
                      title="Edit Job Role"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteJob(job)}
                      className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                      title="Delete Role & Applications"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-xs text-[var(--text-faint)] space-y-2">
              <Briefcase className="mx-auto h-8 w-8 text-[var(--text-faint)]/40" />
              <p className="font-semibold text-sm text-[var(--text-muted)]">No job positions found</p>
            </div>
          )}
        </SectionCard>
      )}

      {/* Job Edit/Create Modal */}
      {isJobModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
            onClick={() => setIsJobModalOpen(false)}
          />

          <div className="relative z-10 w-full max-w-xl overflow-hidden rounded-[24px] border border-white/10 bg-[#161616] text-[#e5e2e1] shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            <div className="flex items-center justify-between border-b border-white/10 bg-[#121212] px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent-orange)] text-white">
                  <Briefcase className="h-4 w-4" />
                </div>
                <h3 className="font-bold text-sm text-white">
                  {editingJob ? "Edit Position" : "Create New Position"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsJobModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/15 bg-white/5 text-neutral-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveJob} className="max-h-[72vh] overflow-y-auto p-6 space-y-4 scrollbar-none">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Job Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Pitmaster"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Department *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kitchen & Grill"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                    Job Type
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Shift">Shift</option>
                    <option value="Apprenticeship">Apprenticeship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2.5 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Role Description *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the duties and day-to-day responsibilities..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                  Requirements (One per line)
                </label>
                <textarea
                  rows={3}
                  placeholder="3+ years grill experience&#10;Food hygiene certification"
                  value={requirementsInput}
                  onChange={(e) => setRequirementsInput(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-[#1c1c1c] px-3.5 py-2 text-xs text-white focus:border-[var(--accent-orange)] focus:outline-none resize-none"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-[#222] text-[var(--accent-orange)]"
                />
                <span className="text-xs font-bold text-neutral-200">Active (Visible on public careers page)</span>
              </label>

              <div className="flex items-center justify-between border-t border-white/10 bg-[#121212] -mx-6 -mb-6 px-6 py-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsJobModalOpen(false)}
                  className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold text-neutral-300 hover:bg-white/10 hover:text-white"
                >
                  Cancel
                </button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={savingJob}
                  className="rounded-xl px-5 text-xs font-bold uppercase tracking-wider"
                >
                  {savingJob ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  {editingJob ? "Save Changes" : "Create Position"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

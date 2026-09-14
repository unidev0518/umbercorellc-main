"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  joinUsCandidateSchema,
  joinUsClientSchema,
  type JoinUsCandidateInput,
  type JoinUsClientInput,
} from "@umbercore/leads";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import { Card, CardContent } from "../primitives/card";

function SuccessCard({ message }: { message: string }) {
  return (
    <Card className="border-brand-green/30 bg-brand-green/5">
      <CardContent className="pt-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/20 text-2xl">
          ✓
        </div>
        <h3 className="mt-4 font-heading text-xl font-semibold">Thanks — we&apos;ll be in touch</h3>
        <p className="mt-2 text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}

export function CandidateForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<JoinUsCandidateInput>({
    resolver: zodResolver(joinUsCandidateSchema),
  });

  async function onSubmit(data: JoinUsCandidateInput) {
    setError(null);
    const fd = new FormData();
    fd.append("type", "candidate");
    fd.append("first_name", data.first_name);
    fd.append("last_name", data.last_name);
    fd.append("email", data.email);
    fd.append("phone", data.phone);
    fd.append("location", data.location);
    if (resumeFile) fd.append("resume", resumeFile);

    const res = await fetch("/api/join-us", { method: "POST", body: fd });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return <SuccessCard message="We'll review your application and reach out if there's a match." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="c_first_name">First name</Label>
          <Input id="c_first_name" {...register("first_name")} className="mt-1" />
          {errors.first_name && <p className="mt-1 text-sm text-danger">{errors.first_name.message}</p>}
        </div>
        <div>
          <Label htmlFor="c_last_name">Last name</Label>
          <Input id="c_last_name" {...register("last_name")} className="mt-1" />
          {errors.last_name && <p className="mt-1 text-sm text-danger">{errors.last_name.message}</p>}
        </div>
      </div>
      <div>
        <Label htmlFor="c_email">Email</Label>
        <Input id="c_email" type="email" {...register("email")} className="mt-1" />
        {errors.email && <p className="mt-1 text-sm text-danger">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="c_phone">Phone number</Label>
        <Input id="c_phone" type="tel" {...register("phone")} className="mt-1" placeholder="+1 (555) 000-0000" />
        {errors.phone && <p className="mt-1 text-sm text-danger">{errors.phone.message}</p>}
      </div>
      <div>
        <Label htmlFor="c_location">Location</Label>
        <Input id="c_location" {...register("location")} className="mt-1" placeholder="e.g. New York, NY" />
        {errors.location && <p className="mt-1 text-sm text-danger">{errors.location.message}</p>}
      </div>
      <div>
        <Label htmlFor="c_resume">Resume (PDF or Word)</Label>
        <input
          id="c_resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
          className="mt-1 block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border file:border-border file:bg-surface-elevated file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-foreground hover:file:bg-surface-mid"
        />
        {resumeFile && <p className="mt-1 text-xs text-brand-green">{resumeFile.name}</p>}
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" variant="accent" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Submit application"}
      </Button>
    </form>
  );
}

const jobTypes = [
  { value: "direct_placement", label: "Direct Placement" },
  { value: "contract", label: "Contract" },
  { value: "right_to_hire", label: "Right to Hire" },
  { value: "temporary_project", label: "Temporary / Project" },
] as const;

export function ClientForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [jobType, setJobType] = useState<string>("direct_placement");

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<JoinUsClientInput>({
    resolver: zodResolver(joinUsClientSchema),
    defaultValues: { job_type: "direct_placement" },
  });

  async function onSubmit(data: JoinUsClientInput) {
    setError(null);
    const res = await fetch("/api/join-us", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "client", ...data }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong. Please try again.");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return <SuccessCard message="We'll be in touch within 1 business day to schedule a call." />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Name row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cl_first_name">First Name <span className="text-danger">*</span></Label>
          <Input id="cl_first_name" placeholder="First name" {...register("first_name")} className="mt-1.5" />
          {errors.first_name && <p className="mt-1 text-xs text-danger">{errors.first_name.message}</p>}
        </div>
        <div>
          <Label htmlFor="cl_last_name">Last Name</Label>
          <Input id="cl_last_name" placeholder="Last name" {...register("last_name")} className="mt-1.5" />
          {errors.last_name && <p className="mt-1 text-xs text-danger">{errors.last_name.message}</p>}
        </div>
      </div>

      {/* Email + Phone row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="cl_email">Email <span className="text-danger">*</span></Label>
          <Input id="cl_email" type="email" placeholder="your@email.com" {...register("email")} className="mt-1.5" />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
        </div>
        <div>
          <Label htmlFor="cl_phone">Phone</Label>
          <Input id="cl_phone" type="tel" placeholder="+1 (000) 000-0000" {...register("phone")} className="mt-1.5" />
          {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
        </div>
      </div>

      {/* Company */}
      <div>
        <Label htmlFor="cl_company">Company</Label>
        <Input id="cl_company" placeholder="Your company name" {...register("company_name")} className="mt-1.5" />
        {errors.company_name && <p className="mt-1 text-xs text-danger">{errors.company_name.message}</p>}
      </div>

      {/* Job Type toggle */}
      <div>
        <Label>Job Type</Label>
        <div className="mt-1.5 flex flex-wrap gap-2">
          {jobTypes.map((jt) => (
            <button
              key={jt.value}
              type="button"
              onClick={() => {
                setJobType(jt.value);
                setValue("job_type", jt.value as JoinUsClientInput["job_type"]);
              }}
              className={`rounded-md border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                jobType === jt.value
                  ? "border-brand-blue bg-brand-blue/15 text-brand-blue"
                  : "border-border text-muted-foreground hover:border-brand-blue/40 hover:text-foreground"
              }`}
            >
              {jt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <Label htmlFor="cl_message">Message</Label>
        <textarea
          id="cl_message"
          placeholder="Tell us about your project or technical needs…"
          rows={4}
          {...register("message")}
          className="mt-1.5 w-full resize-y rounded-md border border-input bg-input/40 px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          id="cl_consent"
          type="checkbox"
          {...register("consent")}
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-border accent-brand-blue"
        />
        <label htmlFor="cl_consent" className="text-xs leading-relaxed text-muted-foreground">
          I authorize UmberCore to retain my personal data. By entering your number, you agree to receive mobile messages. Message and data rates may apply. You can unsubscribe at any time by replying &ldquo;STOP&rdquo;. Read our{" "}
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground">privacy policy</a>.
        </label>
      </div>
      {errors.consent && <p className="text-xs text-danger">{errors.consent.message}</p>}

      {error && <p className="text-sm text-danger">{error}</p>}

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1">
        <Button type="reset" variant="outline" className="border-border text-muted-foreground hover:text-foreground">
          Discard
        </Button>
        <Button type="submit" variant="accent" disabled={isSubmitting}>
          {isSubmitting ? "Sending…" : "Send"}
        </Button>
      </div>
    </form>
  );
}

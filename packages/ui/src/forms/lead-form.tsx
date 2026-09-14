"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactLeadSchema, type ContactLeadInput } from "@umbercore/leads";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";
import { Card, CardContent } from "../primitives/card";

export function LeadForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactLeadInput>({
    resolver: zodResolver(contactLeadSchema),
    defaultValues: {
      service_interest: "not_sure",
      source: "direct",
    },
  });

  async function onSubmit(data: ContactLeadInput) {
    setError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "contact", ...data }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong");
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <Card className="border-brand-green/30 bg-brand-green/5">
        <CardContent className="pt-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-accent/20 text-2xl">
            ✓
          </div>
          <h3 className="mt-4 font-heading text-xl font-semibold">Thanks — we&apos;ll be in touch</h3>
          <p className="mt-2 text-muted-foreground">We&apos;ll reply within 1 business day.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="first_name">First name</Label>
          <Input id="first_name" {...register("first_name")} className="mt-1" />
          {errors.first_name && (
            <p className="mt-1 text-sm text-danger">{errors.first_name.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="last_name">Last name</Label>
          <Input id="last_name" {...register("last_name")} className="mt-1" />
          {errors.last_name && (
            <p className="mt-1 text-sm text-danger">{errors.last_name.message}</p>
          )}
        </div>
      </div>
      <div>
        <Label htmlFor="company_name">Company</Label>
        <Input id="company_name" {...register("company_name")} className="mt-1" />
        {errors.company_name && (
          <p className="mt-1 text-sm text-danger">{errors.company_name.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} className="mt-1" />
        {errors.email && (
          <p className="mt-1 text-sm text-danger">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="service_interest">What are you looking for?</Label>
        <select
          id="service_interest"
          className="mt-1 flex h-10 w-full rounded-md border border-input bg-surface-elevated px-3 text-sm"
          {...register("service_interest")}
        >
          <option value="not_sure">Not sure yet</option>
          <option value="ai-consulting">Software & AI Consulting</option>
          <option value="ai-assisted-development">AI-Assisted Development</option>
          <option value="data-processing">Data Processing & Integration</option>
          <option value="cloud-hosting">Cloud & Application Hosting</option>
          <option value="staff-augmentation">Engineering Support</option>
          <option value="project-delivery">Project-Based Delivery</option>
          <option value="technical-discovery">Technical Discovery & Scoping</option>
          <option value="team-enablement">Team Enablement & Ramp-up</option>
          <option value="advisory-retainer">Ongoing Tech Advisory</option>
        </select>
      </div>
      <div>
        <Label htmlFor="availability">Your availability for a call (optional)</Label>
        <Input id="availability" {...register("availability")} className="mt-1" placeholder="e.g. Weekdays after 2pm EST, or any time this week" />
      </div>
      <div>
        <Label htmlFor="message">Message (optional)</Label>
        <textarea
          id="message"
          rows={4}
          className="mt-1 flex w-full rounded-md border border-input bg-surface-elevated px-3 py-2 text-sm"
          {...register("message")}
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" variant="accent" disabled={isSubmitting}>
        {isSubmitting ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}

export function NewsletterForm() {
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "newsletter", email }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Could not subscribe. Try again.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <p className="text-sm font-medium text-brand-green">
        You&apos;re subscribed. Thank you!
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="min-w-0 flex-1"
        />
        <Button type="submit" variant="accent" size="sm" className="shrink-0" disabled={loading}>
          {loading ? "…" : "Subscribe"}
        </Button>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
    </form>
  );
}

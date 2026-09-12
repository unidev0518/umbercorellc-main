"use client";

import { useState } from "react";
import { Button } from "../primitives/button";
import { Input } from "../primitives/input";
import { Label } from "../primitives/label";

export function SampleReportForm() {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "sample",
        first_name: fd.get("first_name"),
        last_name: "Download",
        email: fd.get("email"),
        company_name: fd.get("company_name"),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Could not process request. Try again.");
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-brand-green/30 bg-brand-green/5 p-6 text-center">
        <p className="font-heading font-semibold text-brand-green">Request received</p>
        <p className="mt-2 text-sm text-muted-foreground">
          We&apos;ll email your sample report within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="sr_first">First name</Label>
        <Input id="sr_first" name="first_name" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="sr_email">Work email</Label>
        <Input id="sr_email" name="email" type="email" required className="mt-1" />
      </div>
      <div>
        <Label htmlFor="sr_company">Company</Label>
        <Input id="sr_company" name="company_name" required className="mt-1" />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Button type="submit" variant="accent" className="w-full" disabled={loading}>
        {loading ? "Sending…" : "Download sample report"}
      </Button>
    </form>
  );
}

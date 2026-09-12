"use client";

import { Mail, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../primitives/card";

const contactAsideItems = [
  "We reply within 1 business day by email",
  "Include your timezone — we'll suggest call slots",
  "No calendar signup required",
  "Same team handles contact and project requests",
];

export function ContactAside() {
  return (
    <Card className="border-border bg-gradient-card glow-ring">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-brand-blue" />
          Prefer email?
        </CardTitle>
        <CardDescription>
          No forms needed — reach out directly and we&apos;ll get back to you.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {contactAsideItems.map((item) => (
            <li key={item} className="flex gap-3 text-sm text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | UmberCore",
  description: "Terms and conditions governing use of the UmberCore website.",
};

const sections = [
  {
    n: "01",
    title: "Acceptance of Terms",
    body: `By accessing and using the UmberCore website (umbercore.com), you accept and agree to be bound by these Terms of Use and our Privacy Policy. If you do not agree to these terms, please do not use our website.

These terms apply to all visitors, users, and others who access the site. UmberCore reserves the right to update these terms at any time. Continued use of the website following any changes constitutes your acceptance of the revised terms.`,
  },
  {
    n: "02",
    title: "Use of the Website",
    body: `The content on this website is provided for general information purposes only. UmberCore reserves the right to modify, suspend, or discontinue any aspect of the website at any time without notice.

You agree not to use this site for any unlawful purpose or in any way that could damage, disable, overburden, or impair our servers or networks. You may not attempt to gain unauthorised access to any part of the website, or any server, computer, or database connected to it. You may not conduct any denial-of-service attack, transmit unsolicited communications, or introduce malicious code of any kind.`,
  },
  {
    n: "03",
    title: "Intellectual Property",
    body: `All content, trademarks, logos, and intellectual property on this site are the property of UmberCore or its licensors. This includes — but is not limited to — text, graphics, design, and software.

You may not reproduce, distribute, modify, or create derivative works from any content on this site without express written permission from UmberCore. Unauthorised use of any materials on this site may violate copyright, trademark, and other applicable laws.`,
  },
  {
    n: "04",
    title: "Limitation of Liability",
    body: `UmberCore makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability of the website or any information, products, or services contained on it.

To the fullest extent permitted by applicable law, UmberCore excludes all liability for any loss or damage — including indirect or consequential loss — arising from your use of, or inability to use, this website or its content. Your use of this website is entirely at your own risk.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface-default text-foreground">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-border/50 bg-gradient-hero py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/3 top-0 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-green/6 blur-[100px]" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <p className="hero-eyebrow mb-4">Legal</p>
          <h1 className="font-heading text-4xl font-extrabold tracking-[-0.03em] text-foreground sm:text-5xl">
            Terms of Use
          </h1>
          <p className="mt-4 text-lg text-foreground/50">
            Terms and conditions governing use of the UmberCore website.
          </p>
          <p className="mt-3 text-sm text-foreground/30">Last updated: July 2026</p>
        </div>
      </section>

      {/* ── Sections ── */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            {sections.map((s) => (
              <div key={s.n} className="grid gap-4 border-b border-border/40 pb-12 last:border-0 sm:grid-cols-[80px_1fr]">
                <p className="font-mono text-sm font-semibold text-brand-green/50">{s.n}</p>
                <div>
                  <h2 className="font-heading text-xl font-bold text-foreground mb-4">{s.title}</h2>
                  <div className="space-y-3">
                    {s.body.split("\n\n").map((para, i) => (
                      <p key={i} className="text-base leading-relaxed text-foreground/60">{para}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact note */}
          <div className="mt-14 rounded-2xl border border-white/[0.07] bg-surface-elevated/40 p-7">
            <p className="text-sm font-semibold text-foreground mb-1">Questions about these terms?</p>
            <p className="text-sm text-foreground/55">
              If you have any questions regarding these Terms of Use, please contact us at{" "}
              <a href="mailto:support@umbercore.com" className="text-brand-green hover:underline">
                support@umbercore.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

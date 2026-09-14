export const metadata = {
  title: "Privacy Policy — UmberCore",
  description: "How UmberCore collects, uses, and protects your personal information.",
};

const sections = [
  {
    n: "01",
    title: "Information We Collect",
    body: `UmberCore ("UmberCore", "we", "our", or "us") collects information you voluntarily provide when you contact us through our website forms, including your name, email address, phone number, company name, and any messages you submit. We may also collect technical data such as IP addresses, browser type, and pages visited through cookies and analytics tools to improve your experience on our website.`,
  },
  {
    n: "02",
    title: "How We Use Your Information",
    body: `We use the personal information you provide to respond to your inquiries, match you with relevant technology consulting and delivery services, send communications related to your request or our services, improve our website and service offerings, comply with legal obligations, and maintain records of our business interactions. We will not use your personal data for any purpose incompatible with these stated objectives without your prior consent.`,
  },
  {
    n: "03",
    title: "SMS & Mobile Communications",
    body: `By providing your phone number and consenting through our contact form, you agree to receive mobile messages from UmberCore related to your inquiry or our consulting services. Message frequency varies based on your engagement with us. Standard message and data rates may apply depending on your carrier and plan. You can opt out at any time by replying "STOP" to any message. For help, reply "HELP". Carriers are not liable for delayed or undelivered messages. UmberCore respects your communication preferences and will honor all opt-out requests promptly.`,
  },
  {
    n: "04",
    title: "Data Retention",
    body: `UmberCore retains your personal data for as long as necessary to fulfill the purposes outlined in this policy or as required by applicable law. Contact inquiries are typically retained for up to three (3) years from the date of submission. Client and contractor records may be retained for longer periods in accordance with our business and legal obligations. You may request deletion of your data at any time by contacting us directly.`,
  },
  {
    n: "05",
    title: "Sharing Your Information",
    body: `UmberCore does not sell, trade, or rent your personal information to third parties. We may share your information with authorized personnel who need access to respond to your inquiry, with trusted third-party service providers who assist in operating our website or conducting our business (under strict confidentiality agreements), and with legal authorities when required by law or to protect our legal rights. Any third parties with whom we share data are required to maintain the confidentiality and security of your information.`,
  },
  {
    n: "06",
    title: "Cookies & Tracking Technologies",
    body: `Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand how visitors interact with our site. You can control cookie settings through your browser preferences. Disabling cookies may affect some functionality of our website. We use analytics services such as Google Analytics to collect aggregated, anonymized data about website usage patterns.`,
  },
  {
    n: "07",
    title: "Data Security",
    body: `UmberCore implements industry-standard technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes secure HTTPS connections, encrypted data storage, and access controls limited to authorized personnel. While we take every reasonable precaution, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.`,
  },
  {
    n: "08",
    title: "Your Rights",
    body: `Depending on your location and applicable law, you may have the right to access the personal information we hold about you, request correction of inaccurate data, request deletion of your personal data, withdraw consent for data processing at any time, object to or restrict certain types of processing, and request portability of your data. To exercise any of these rights, please contact us using the information provided below. We will respond to all legitimate requests within a reasonable timeframe.`,
  },
  {
    n: "09",
    title: "Children's Privacy",
    body: `UmberCore's services are intended for business professionals and are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has submitted personal information through our website, we will take steps to delete such information promptly.`,
  },
  {
    n: "10",
    title: "Third-Party Links",
    body: `Our website may contain links to third-party websites for your convenience and reference. UmberCore is not responsible for the privacy practices or content of those external sites. We encourage you to review the privacy policies of any third-party sites you visit.`,
  },
  {
    n: "11",
    title: "Changes to This Policy",
    body: `UmberCore reserves the right to update or modify this Privacy Policy at any time. When we make material changes, we will update the "Last Updated" date at the top of this page. Your continued use of our website or services after any changes constitutes your acceptance of the updated policy. We encourage you to review this policy periodically.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-surface-default">
      {/* Header band */}
      <div className="border-b border-border bg-surface-elevated/60">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-blue/70 mb-3">Legal</p>
          <h1 className="font-heading text-4xl font-extrabold tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Last Updated: July 1, 2026 &middot; UmberCore
          </p>
          <p className="mt-5 text-base leading-relaxed text-foreground/60 max-w-xl">
            At UmberCore, we are committed to protecting your privacy and handling your personal
            information with transparency and care. This Privacy Policy explains how we collect,
            use, store, and protect the information you share with us when you use our website
            or engage with our technology consulting and delivery services.
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="mx-auto max-w-3xl px-6 py-14 space-y-12">
        {sections.map((s) => (
          <div key={s.n} className="grid gap-3 sm:grid-cols-[80px_1fr]">
            <p className="font-mono text-xs font-semibold text-brand-green/60 pt-1">
              Section {s.n}
            </p>
            <div>
              <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
                {s.title}
              </h2>
              <p className="text-sm leading-[1.85] text-foreground/60">{s.body}</p>
            </div>
          </div>
        ))}

        {/* Contact section */}
        <div className="grid gap-3 sm:grid-cols-[80px_1fr]">
          <p className="font-mono text-xs font-semibold text-brand-green/60 pt-1">
            Section 12
          </p>
          <div>
            <h2 className="font-heading text-lg font-semibold text-foreground mb-3">
              Contact Us
            </h2>
            <p className="text-sm leading-[1.85] text-foreground/60 mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy or how
              UmberCore handles your personal data, please contact us:
            </p>
            <address className="not-italic text-sm leading-loose text-foreground/70 border-l-2 border-brand-green/30 pl-4">
              UmberCore<br />
              Email:{" "}
              <a href="mailto:privacy@umbercore.com" className="text-brand-blue hover:underline">
                privacy@umbercore.com
              </a>
            </address>
          </div>
        </div>

        {/* Footer line */}
        <div className="border-t border-border pt-8 text-xs text-muted-foreground">
          &copy; 2026 UmberCore. All rights reserved.
        </div>
      </div>
    </div>
  );
}

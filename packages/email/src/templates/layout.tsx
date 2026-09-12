import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";

interface EmailLayoutProps {
  preview: string;
  heading: string;
  children: ReactNode;
}

export function EmailLayout({ preview, heading, children }: EmailLayoutProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://umbercore.com";

  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={logo}>UmberCore</Heading>
            <Text style={tagline}>AI Tech Consulting & Staffing</Text>
          </Section>
          <Section style={accentBar} />
          <Section style={content}>
            <Heading style={h1}>{heading}</Heading>
            {children}
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            © {new Date().getFullYear()} UmberCore ·{" "}
            <Link href={`${siteUrl}/privacy`} style={link}>
              Privacy
            </Link>{" "}
            ·{" "}
            <Link href={`${siteUrl}/terms`} style={link}>
              Terms
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f4ece4",
  fontFamily: "Inter, system-ui, sans-serif",
};

const container = { margin: "0 auto", padding: "24px", maxWidth: "560px" };
const header = { padding: "16px 0" };
const logo = { color: "#1c1612", fontSize: "24px", margin: "0" };
const tagline = { color: "#64748b", fontSize: "12px", margin: "4px 0 0" };
const accentBar = {
  height: "4px",
  background: "linear-gradient(90deg, #c4813a, #c4a574)",
  borderRadius: "2px",
  marginBottom: "24px",
};
const content = { backgroundColor: "#ffffff", padding: "24px", borderRadius: "8px" };
const h1 = { color: "#1c1612", fontSize: "20px", margin: "0 0 16px" };
const hr = { borderColor: "#e2e8f0", margin: "24px 0" };
const footer = { color: "#64748b", fontSize: "12px", textAlign: "center" as const };
const link = { color: "#b56a28" };

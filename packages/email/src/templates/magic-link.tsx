import { Button, Section, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

interface MagicLinkEmailProps {
  recipientName: string;
  role: "client" | "developer";
  registrationUrl: string;
  expiresHours?: number;
}

export function MagicLinkEmail({ recipientName, role, registrationUrl, expiresHours = 48 }: MagicLinkEmailProps) {
  const roleLabel = role === "client" ? "client" : "developer";
  const preview = `Your UmberCore ${roleLabel} portal invitation — complete your registration`;

  return (
    <EmailLayout preview={preview} heading={`You're invited to UmberCore`}>
      <Text style={text}>Hi {recipientName},</Text>
      <Text style={text}>
        You've been invited to access the UmberCore {roleLabel} portal. Click the button below to complete your registration and set up your account.
      </Text>
      <Section style={{ textAlign: "center", margin: "24px 0" }}>
        <Button href={registrationUrl} style={btn}>Complete registration</Button>
      </Section>
      <Text style={small}>
        This link expires in {expiresHours} hours. If you did not expect this invitation, you can safely ignore this email.
      </Text>
      <Text style={small}>
        Or copy this URL into your browser:{" "}
        <span style={{ color: "#b56a28", wordBreak: "break-all" }}>{registrationUrl}</span>
      </Text>
    </EmailLayout>
  );
}

const text  = { color: "#334155", fontSize: "15px", lineHeight: "1.6", margin: "0 0 12px" };
const small = { color: "#94a3b8", fontSize: "12px", lineHeight: "1.6", margin: "12px 0 0" };
const btn   = { backgroundColor: "#b56a28", color: "#ffffff", padding: "12px 24px", borderRadius: "6px", fontSize: "15px", fontWeight: "600", textDecoration: "none", display: "inline-block" };

import { Button, Text } from "@react-email/components";
import { EmailLayout } from "./layout";

export function WelcomeMemberEmail({
  firstName,
  tier,
  passwordSetupUrl,
}: {
  firstName: string;
  tier: string;
  passwordSetupUrl?: string;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://umbercore.com";

  return (
    <EmailLayout
      preview={`Welcome to UmberCore ${tier} membership`}
      heading={`Welcome, ${firstName}!`}
    >
      <Text style={text}>
        Your <strong>{tier}</strong> membership is now active. Access your
        member dashboard for briefs, templates, and AI security resources.
      </Text>
      {passwordSetupUrl ? (
        <>
          <Text style={text}>
            Set your password to sign in:
          </Text>
          <Button style={button} href={passwordSetupUrl}>
            Set password & sign in
          </Button>
        </>
      ) : (
        <Button style={button} href={`${siteUrl}/login`}>
          Sign in to dashboard
        </Button>
      )}
    </EmailLayout>
  );
}

const text = { color: "#334155", fontSize: "14px", lineHeight: "24px" };
const button = {
  backgroundColor: "#0f172a",
  color: "#fff",
  padding: "12px 24px",
  borderRadius: "6px",
  fontSize: "14px",
};

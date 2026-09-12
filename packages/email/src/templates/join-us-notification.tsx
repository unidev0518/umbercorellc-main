import { Text } from "@react-email/components";
import { EmailLayout } from "./layout";
import type { JoinUsPayload } from "../service";

export function JoinUsNotificationEmail(payload: JoinUsPayload) {
  if (payload.type === "candidate") {
    return (
      <EmailLayout
        preview={`New candidate: ${payload.name}`}
        heading="New candidate application"
      >
        <Text style={text}><strong>{payload.name}</strong></Text>
        <Text style={text}>Email: {payload.email}</Text>
        <Text style={text}>Phone: {payload.phone}</Text>
        <Text style={text}>Location: {payload.location}</Text>
        {payload.resume && <Text style={text}>Resume: {payload.resume.filename} (attached)</Text>}
      </EmailLayout>
    );
  }

  return (
    <EmailLayout
      preview={`New client inquiry: ${payload.name} — ${payload.company}`}
      heading="New client — book a call"
    >
      <Text style={text}><strong>{payload.name}</strong> from <strong>{payload.company}</strong></Text>
      <Text style={text}>Email: {payload.email}</Text>
      <Text style={text}>Phone: {payload.phone}</Text>
    </EmailLayout>
  );
}

const text = { color: "#334155", fontSize: "14px", lineHeight: "24px" };

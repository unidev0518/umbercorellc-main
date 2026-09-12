import { Text } from "@react-email/components";
import { EmailLayout } from "./layout";
import type { NewLeadPayload } from "../service";

export function LeadNotificationEmail({ name, email, company, interest, availability, message }: NewLeadPayload) {
  return (
    <EmailLayout
      preview={`New inquiry: ${name} from ${company}`}
      heading="New inquiry received"
    >
      <Text style={text}><strong>{name}</strong> from <strong>{company}</strong></Text>
      <Text style={text}>Email: {email}</Text>
      <Text style={text}>Interest: {interest}</Text>
      {availability && <Text style={text}>Availability: {availability}</Text>}
      {message && <Text style={text}>Message: {message}</Text>}
    </EmailLayout>
  );
}

const text = { color: "#334155", fontSize: "14px", lineHeight: "24px" };

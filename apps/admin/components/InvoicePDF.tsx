import {
  Document, Page, Text, View, StyleSheet, Image, Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    { src: "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2" },
  ],
});

const c = {
  black: "#0a0f1e",
  dark:  "#1a2035",
  mid:   "#4a5568",
  light: "#94a3b8",
  line:  "#e2e8f0",
  green: "#10b981",
  bg:    "#f8fafc",
};

const s = StyleSheet.create({
  page:         { fontFamily: "Inter", fontSize: 9, color: c.black, backgroundColor: "#ffffff", padding: 48 },
  row:          { flexDirection: "row" },
  spaceBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  // Header
  logo:         { width: 40, height: 40, marginBottom: 4, borderRadius: 4 },
  companyName:  { fontSize: 18, fontWeight: 700, color: c.green, letterSpacing: -0.5 },
  companyMeta:  { fontSize: 8, color: c.mid, lineHeight: 1.5, marginTop: 2 },
  invoiceTitle: { fontSize: 26, fontWeight: 700, color: c.dark, letterSpacing: -1 },
  invoiceMeta:  { fontSize: 9, color: c.mid, marginTop: 4, lineHeight: 1.6 },
  invoiceNum:   { fontSize: 9, color: c.green, fontWeight: 700 },
  divider:      { borderBottom: `1px solid ${c.line}`, marginVertical: 16 },
  // Bill to
  sectionLabel: { fontSize: 7, fontWeight: 700, color: c.light, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 5 },
  billName:     { fontSize: 11, fontWeight: 700, color: c.dark },
  billMeta:     { fontSize: 8, color: c.mid, lineHeight: 1.5, marginTop: 2 },
  // Table
  tableHeader:  { flexDirection: "row", backgroundColor: c.bg, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 4, marginTop: 16 },
  tableRow:     { flexDirection: "row", paddingHorizontal: 10, paddingVertical: 8, borderBottom: `0.5px solid ${c.line}` },
  colDesc:      { flex: 1 },
  colQty:       { width: 50, textAlign: "right" },
  colRate:      { width: 70, textAlign: "right" },
  colAmt:       { width: 70, textAlign: "right" },
  thText:       { fontSize: 7, fontWeight: 700, color: c.light, letterSpacing: 0.8, textTransform: "uppercase" },
  tdText:       { fontSize: 9, color: c.dark },
  tdMuted:      { fontSize: 8, color: c.mid },
  // Totals
  totalsBox:    { marginTop: 8, marginLeft: "auto", width: 180 },
  totalRow:     { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3 },
  totalLabel:   { fontSize: 9, color: c.mid },
  totalValue:   { fontSize: 9, color: c.dark },
  grandRow:     { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6, marginTop: 4, borderTop: `1.5px solid ${c.dark}` },
  grandLabel:   { fontSize: 11, fontWeight: 700, color: c.dark },
  grandValue:   { fontSize: 11, fontWeight: 700, color: c.green },
  // Bank
  bankBox:      { marginTop: 24, padding: 14, backgroundColor: c.bg, borderRadius: 6, borderLeft: `3px solid ${c.green}` },
  bankTitle:    { fontSize: 8, fontWeight: 700, color: c.dark, marginBottom: 8 },
  bankGrid:     { flexDirection: "row", flexWrap: "wrap" },
  bankItem:     { width: "50%", marginBottom: 6 },
  bankLabel:    { fontSize: 7, color: c.light, textTransform: "uppercase", letterSpacing: 0.8 },
  bankValue:    { fontSize: 8.5, color: c.dark, fontWeight: 600, marginTop: 1 },
  // Notes
  notesBox:     { marginTop: 16, padding: 12, backgroundColor: c.bg, borderRadius: 4 },
  notesText:    { fontSize: 8, color: c.mid, lineHeight: 1.5 },
  footer:       { position: "absolute", bottom: 30, left: 48, right: 48, textAlign: "center", fontSize: 7.5, color: c.light },
});

function fmt(n: number, cur = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n);
}
function fmtDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export interface InvoicePDFProps {
  invoice: {
    invoice_number: string; issued_date: string | null; due_date: string | null;
    status: string; currency: string; amount: number;
    subtotal: number | null; tax_rate: number | null; tax_amount: number | null;
    notes: string | null;
    project: { name: string } | null;
    client: { full_name: string; company_name: string | null; email: string } | null;
    items: { description: string; quantity: number; unit_price: number; amount: number }[];
  };
  settings: {
    company_name: string; logo_url: string | null; address: string | null;
    city: string | null; state: string | null; zip: string | null; country: string;
    phone: string | null; email: string | null; website: string | null;
    bank_name: string | null; account_holder: string | null; account_number: string | null;
    routing_number: string | null; iban: string | null; swift_bic: string | null; paypal_email: string | null;
    tax_id: string | null; payment_terms: string; invoice_notes: string | null; invoice_footer: string | null;
  };
}

export function InvoicePDFDoc({ invoice: inv, settings: co }: InvoicePDFProps) {
  const subtotal = inv.subtotal ?? inv.items.reduce((s, it) => s + Number(it.amount), 0);
  const taxAmt = inv.tax_amount ?? 0;
  const total = inv.amount;
  const hasTax = taxAmt > 0;
  const hasBank = co.account_number || co.iban || co.paypal_email;

  const addrLine = [co.address, [co.city, co.state].filter(Boolean).join(", "), co.zip].filter(Boolean).join(" · ");

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.spaceBetween}>
          <View>
            {co.logo_url && <Image src={co.logo_url} style={s.logo} />}
            <Text style={s.companyName}>{co.company_name}</Text>
            {addrLine ? <Text style={s.companyMeta}>{addrLine}</Text> : null}
            {co.phone  ? <Text style={s.companyMeta}>{co.phone}</Text> : null}
            {co.email  ? <Text style={s.companyMeta}>{co.email}</Text> : null}
            {co.tax_id ? <Text style={s.companyMeta}>EIN: {co.tax_id}</Text> : null}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.invoiceTitle}>INVOICE</Text>
            <View style={{ alignItems: "flex-end", marginTop: 6 }}>
              <Text style={s.invoiceNum}>{inv.invoice_number}</Text>
              <Text style={s.invoiceMeta}>Issue date: {fmtDate(inv.issued_date)}</Text>
              <Text style={s.invoiceMeta}>Due date: {fmtDate(inv.due_date)}</Text>
              <Text style={[s.invoiceMeta, { fontWeight: 700, color: inv.status === "paid" ? c.green : inv.status === "overdue" ? "#ef4444" : c.mid }]}>
                {inv.status.toUpperCase()}
              </Text>
              {co.payment_terms ? <Text style={s.invoiceMeta}>Terms: {co.payment_terms}</Text> : null}
            </View>
          </View>
        </View>

        <View style={s.divider} />

        {/* Bill to */}
        <View style={s.spaceBetween}>
          <View>
            <Text style={s.sectionLabel}>Bill to</Text>
            <Text style={s.billName}>{inv.client?.company_name || inv.client?.full_name || "—"}</Text>
            {inv.client?.company_name && inv.client?.full_name !== inv.client?.company_name
              ? <Text style={s.billMeta}>{inv.client.full_name}</Text>
              : null}
            {inv.client?.email ? <Text style={s.billMeta}>{inv.client.email}</Text> : null}
          </View>
          {inv.project && (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={s.sectionLabel}>Project</Text>
              <Text style={[s.billName, { fontSize: 10 }]}>{inv.project.name}</Text>
            </View>
          )}
        </View>

        {/* Line items */}
        <View style={s.tableHeader}>
          <Text style={[s.thText, s.colDesc]}>Description</Text>
          <Text style={[s.thText, s.colQty]}>Qty</Text>
          <Text style={[s.thText, s.colRate]}>Rate</Text>
          <Text style={[s.thText, s.colAmt]}>Amount</Text>
        </View>

        {inv.items.map((it, i) => (
          <View key={i} style={s.tableRow}>
            <Text style={[s.tdText, s.colDesc]}>{it.description}</Text>
            <Text style={[s.tdMuted, s.colQty]}>{it.quantity}</Text>
            <Text style={[s.tdMuted, s.colRate]}>{fmt(it.unit_price, inv.currency)}</Text>
            <Text style={[s.tdText, s.colAmt]}>{fmt(Number(it.amount), inv.currency)}</Text>
          </View>
        ))}

        {/* Totals */}
        <View style={s.totalsBox}>
          {hasTax && (
            <>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Subtotal</Text>
                <Text style={s.totalValue}>{fmt(subtotal, inv.currency)}</Text>
              </View>
              <View style={s.totalRow}>
                <Text style={s.totalLabel}>Tax ({((inv.tax_rate || 0) * 100).toFixed(1)}%)</Text>
                <Text style={s.totalValue}>{fmt(taxAmt, inv.currency)}</Text>
              </View>
            </>
          )}
          <View style={s.grandRow}>
            <Text style={s.grandLabel}>Total Due</Text>
            <Text style={s.grandValue}>{fmt(total, inv.currency)}</Text>
          </View>
        </View>

        {/* Bank details */}
        {hasBank && (
          <View style={s.bankBox}>
            <Text style={s.bankTitle}>Payment instructions — please transfer to:</Text>
            <View style={s.bankGrid}>
              {co.account_holder && <View style={s.bankItem}><Text style={s.bankLabel}>Account holder</Text><Text style={s.bankValue}>{co.account_holder}</Text></View>}
              {co.bank_name      && <View style={s.bankItem}><Text style={s.bankLabel}>Bank</Text><Text style={s.bankValue}>{co.bank_name}</Text></View>}
              {co.account_number && <View style={s.bankItem}><Text style={s.bankLabel}>Account number</Text><Text style={s.bankValue}>{co.account_number}</Text></View>}
              {co.routing_number && <View style={s.bankItem}><Text style={s.bankLabel}>Routing number</Text><Text style={s.bankValue}>{co.routing_number}</Text></View>}
              {co.iban           && <View style={s.bankItem}><Text style={s.bankLabel}>IBAN</Text><Text style={s.bankValue}>{co.iban}</Text></View>}
              {co.swift_bic      && <View style={s.bankItem}><Text style={s.bankLabel}>SWIFT / BIC</Text><Text style={s.bankValue}>{co.swift_bic}</Text></View>}
              {co.paypal_email   && <View style={s.bankItem}><Text style={s.bankLabel}>PayPal</Text><Text style={s.bankValue}>{co.paypal_email}</Text></View>}
            </View>
            <Text style={[s.bankLabel, { marginTop: 6 }]}>Reference: {inv.invoice_number}</Text>
          </View>
        )}

        {/* Notes */}
        {(inv.notes || co.invoice_notes) && (
          <View style={s.notesBox}>
            <Text style={s.bankTitle}>Notes</Text>
            <Text style={s.notesText}>{inv.notes || co.invoice_notes}</Text>
          </View>
        )}

        {/* Footer */}
        {co.invoice_footer && (
          <Text style={s.footer}>{co.invoice_footer}</Text>
        )}
      </Page>
    </Document>
  );
}

export type BlogCategory = "Detection" | "Compliance" | "Best practices" | "Investor readiness";

export interface BlogPost {
  title: string;
  date: string;
  readTime: string;
  category: BlogCategory;
  excerpt: string;
  body: readonly string[];
  featured?: boolean;
}

export const blogPosts = {
  "ai-security-startups-2026": {
    title: "Why US Startups Need AI Security Before Series A",
    date: "May 12, 2026",
    readTime: "6 min read",
    category: "Investor readiness",
    featured: true,
    excerpt:
      "Investors and enterprise buyers are asking about AI risk posture. Here is what to document before your next diligence call.",
    body: [
      "Series A diligence in 2026 increasingly includes AI-specific questions: What models do you use? Where does customer data flow? How do you detect prompt injection?",
      "Most startups answer with ad-hoc spreadsheets. Buyers interpret that as unknown risk — and either slow the deal or demand expensive remediation mid-process.",
      "A structured AI Risk Health Check maps your stack against NIST AI RMF and OWASP LLM Top 10 in under a week. You get a scored report, prioritized findings, and a roadmap your engineering team can execute.",
      "The teams that close faster treat AI security as a product surface: documented policies, named owners, and evidence of detection — not a slide that says \"we use OpenAI responsibly.\"",
      "Start with three artifacts: an AI inventory (every model and integration), a one-page acceptable use policy, and a single owner for AI security questions. That alone puts you ahead of most seed-stage peers.",
    ],
  },
  "prompt-injection-101": {
    title: "Prompt Injection: What Startups Should Test Before Launch",
    date: "May 8, 2026",
    readTime: "5 min read",
    category: "Detection",
    excerpt:
      "Your chatbot can be tricked into leaking data or bypassing rules. Here is a practical testing checklist before you ship.",
    body: [
      "Prompt injection is not theoretical — it is the most common finding in our Prompt & LLM Security Audits for production apps.",
      "Attackers use indirect injection (hidden instructions in documents your RAG retrieves), direct injection (user messages), and jailbreaks (role-play escapes) to exfiltrate context or bypass guardrails.",
      "Minimum tests before launch: ask the model to ignore prior instructions, embed \"system:\" overrides in user content, request full conversation history, and probe whether uploaded files can override your system prompt.",
      "Mitigations that work: strict output filtering, tool permission boundaries, human review for sensitive actions, and logging every model call with retention limits.",
      "Budget $1,500–$2,500 for a focused audit if you lack in-house red team capacity — cheaper than a single enterprise deal lost to security questionnaire failure.",
    ],
  },
  "owasp-llm-top10-startups": {
    title: "OWASP LLM Top 10 — A Founder's Cheat Sheet",
    date: "May 3, 2026",
    readTime: "7 min read",
    category: "Best practices",
    excerpt:
      "The OWASP LLM Top 10 is the industry standard for AI app risk. We break down what each item means for a startup.",
    body: [
      "LLM01 Prompt Injection and LLM02 Sensitive Information Disclosure are where most startups fail first — usually in customer-facing chat or internal copilots.",
      "LLM03 Supply Chain covers your API vendors, fine-tuned models, and plugins. If you cannot name every third party in your AI path, you have supply chain risk.",
      "LLM06 Excessive Agency is critical for agentic workflows: can your agent send email, modify data, or call APIs without human approval? Scope it tightly.",
      "LLM09 Misinformation matters for regulated advice (health, finance, legal). Document where humans review outputs and what disclaimers you show users.",
      "You do not need to fix everything at once. Map each OWASP category to owner, status, and target date — investors prefer honest gaps with a plan over silence.",
    ],
  },
  "ai-vendor-due-diligence": {
    title: "How to Vet AI Vendors Before Your Team Adopts Them",
    date: "April 22, 2026",
    readTime: "4 min read",
    category: "Compliance",
    excerpt:
      "Copilot, Notion AI, and new LLM APIs land in your stack weekly. Use this scorecard before you sign.",
    body: [
      "Every AI vendor should answer: Where is data processed? Is it used for training? What subprocessors exist? What is their incident history?",
      "Request SOC 2 Type II or ISO 27001 where available. For early-stage vendors, review their security page and DPA — absence of AI-specific terms is a yellow flag.",
      "Run a lightweight review before procurement: public docs, privacy policy, data flow diagram, and a 30-minute security call for deals over $10k/year.",
      "Our Vendor Security Review delivers an adopt/hold/reject verdict in 2–3 days from $1,500 — often faster than legal reviewing a 40-page DPA alone.",
      "Maintain a living vendor register with risk tier, owner, and renewal date. Enterprise buyers will ask for it.",
    ],
  },
  "nist-ai-rmf-practical": {
    title: "NIST AI RMF in Practice (Without the Enterprise Overhead)",
    date: "April 10, 2026",
    readTime: "6 min read",
    category: "Best practices",
    excerpt:
      "NIST's AI Risk Management Framework sounds heavy. Here is how startups apply GOVERN, MAP, MEASURE, and MANAGE in a week.",
    body: [
      "GOVERN: Name an AI risk owner (often CTO or Head of Eng). One-page charter: what AI you use, what you will not do, and who approves new tools.",
      "MAP: Inventory AI touchpoints — customer data in prompts? Agents with write access? Third-party embeddings? Draw a simple data flow.",
      "MEASURE: Score risks (likelihood × impact). Use OWASP LLM Top 10 as a checklist. Our health checks produce a numeric posture score teams can track monthly.",
      "MANAGE: Prioritize fixes in 30/90-day buckets. Not every gap needs immediate remediation — document accepted risk with executive sign-off where appropriate.",
      "NIST alignment is a sales asset, not just compliance. Include a one-slide RMF summary in your data room.",
    ],
  },
  "series-a-ai-security-checklist": {
    title: "Series A AI Security Checklist — 12 Items Investors Ask",
    date: "March 28, 2026",
    readTime: "5 min read",
    category: "Investor readiness",
    excerpt:
      "Prepare these twelve answers before diligence calls and you will shorten security review by weeks.",
    body: [
      "1. AI inventory and owners. 2. Data classification for prompts and logs. 3. Prompt injection testing summary. 4. Vendor list with DPAs. 5. Incident response plan including AI scenarios.",
      "6. Acceptable use policy. 7. Model change management (how you evaluate new models). 8. Access controls for internal AI tools. 9. Retention and deletion for conversation logs.",
      "10. Bias/fairness approach if applicable. 11. Regulatory mapping (state AI laws, sector rules). 12. Roadmap for the next 90 days.",
      "Missing more than four items triggers deeper technical diligence or a security bridge loan condition. A $2,000–$3,500 compliance snapshot closes most gaps in two weeks.",
      "Book a free 30-minute call if you want a gap analysis against this list before your next fundraise.",
    ],
  },
} as const;

export type BlogSlug = keyof typeof blogPosts;

export type BlogPostListItem = BlogPost & { slug: BlogSlug };

export function getBlogPostsList(): BlogPostListItem[] {
  return (Object.keys(blogPosts) as BlogSlug[]).map((slug) => ({
    slug,
    ...blogPosts[slug],
  })) as BlogPostListItem[];
}

export function getFeaturedPost(): BlogPostListItem {
  const list = getBlogPostsList();
  return list.find((p) => p.featured) ?? list[0]!;
}

export function getRelatedPosts(slug: BlogSlug, limit = 3) {
  const current = blogPosts[slug];
  return getBlogPostsList()
    .filter((p) => p.slug !== slug)
    .sort((a, b) => {
      if (a.category === current.category && b.category !== current.category) return -1;
      if (b.category === current.category && a.category !== current.category) return 1;
      return 0;
    })
    .slice(0, limit);
}

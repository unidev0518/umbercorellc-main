"use client";

import { motion } from "framer-motion";
export type CaseStudyVisualType = "risk-dashboard" | "policy-shield" | "compliance-map";

function RiskDashboardVisual() {
  return (
    <svg viewBox="0 0 400 280" className="h-full w-full" role="img" aria-label="Risk score dashboard improving after AI security assessment">
      <defs>
        <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="hsl(0, 72%, 58%)" />
          <stop offset="50%" stopColor="hsl(38, 92%, 55%)" />
          <stop offset="100%" stopColor="hsl(158, 64%, 62%)" />
        </linearGradient>
        <filter id="glowG">
          <feGaussianBlur stdDeviation="2" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect x="8" y="8" width="384" height="264" rx="14" fill="hsl(222, 40%, 8%)" stroke="hsl(222, 30%, 18%)" />
      <text x="200" y="36" textAnchor="middle" fill="hsl(215, 18%, 62%)" fontSize="10" fontFamily="system-ui" fontWeight="600">
        AI RISK DASHBOARD
      </text>
      {/* Gauge arc */}
      <path d="M 80 160 A 120 120 0 0 1 320 160" fill="none" stroke="hsl(222, 30%, 16%)" strokeWidth="14" strokeLinecap="round" />
      <motion.path
        d="M 80 160 A 120 120 0 0 1 320 160"
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="14"
        strokeLinecap="round"
        strokeDasharray="377"
        initial={{ strokeDashoffset: 240 }}
        animate={{ strokeDashoffset: [240, 90, 90] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
      />
      <motion.text
        x="200"
        y="150"
        textAnchor="middle"
        fill="hsl(158, 64%, 62%)"
        fontSize="36"
        fontWeight="bold"
        fontFamily="system-ui"
        animate={{ opacity: [0.5, 1, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }}
      >
        78
      </motion.text>
      <text x="200" y="172" textAnchor="middle" fill="hsl(215, 18%, 55%)" fontSize="9" fontFamily="system-ui">
        / 100 posture score
      </text>
      {/* Finding cards */}
      {[
        { x: 28, y: 195, label: "Prompt injection", status: "CRITICAL", color: "hsl(0, 72%, 58%)" },
        { x: 28, y: 228, label: "Data leak path", status: "HIGH", color: "hsl(38, 92%, 55%)" },
        { x: 210, y: 195, label: "Vendor gap", status: "FIXED", color: "hsl(158, 64%, 62%)" },
        { x: 210, y: 228, label: "RAG exposure", status: "FIXED", color: "hsl(158, 64%, 62%)" },
      ].map((card, i) => (
        <g key={card.label}>
          <rect x={card.x} y={card.y} width="162" height="28" rx="6" fill="hsl(222, 35%, 12%)" stroke={card.color} strokeWidth="1" opacity="0.9" />
          <text x={card.x + 10} y={card.y + 18} fill="hsl(210, 40%, 90%)" fontSize="9" fontFamily="system-ui">{card.label}</text>
          <motion.text
            x={card.x + 150}
            y={card.y + 18}
            textAnchor="end"
            fill={card.color}
            fontSize="8"
            fontWeight="700"
            fontFamily="system-ui"
            animate={i < 2 ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.3 }}
          >
            {card.status}
          </motion.text>
        </g>
      ))}
      <motion.rect
        x="250"
        y="52"
        width="130"
        height="22"
        rx="6"
        fill="hsl(158, 64%, 42%)"
        filter="url(#glowG)"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x="315" y="67" textAnchor="middle" fill="hsl(222, 47%, 6%)" fontSize="9" fontWeight="bold" fontFamily="system-ui">
        DETECTED
      </text>
    </svg>
  );
}

function PolicyShieldVisual() {
  return (
    <svg viewBox="0 0 400 280" className="h-full w-full" role="img" aria-label="AI policy documents protected by security shield">
      <defs>
        <linearGradient id="shieldG" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(199, 89%, 68%)" />
          <stop offset="100%" stopColor="hsl(158, 64%, 52%)" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="384" height="264" rx="14" fill="hsl(222, 40%, 8%)" stroke="hsl(222, 30%, 18%)" />
      <text x="200" y="36" textAnchor="middle" fill="hsl(215, 18%, 62%)" fontSize="10" fontFamily="system-ui" fontWeight="600">
        POLICY PACK DEPLOYED
      </text>
      {/* Shield */}
      <motion.g
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{ transformOrigin: "200px 150px" }}
      >
        <path
          d="M200 70 L260 95 L260 155 C260 200 200 230 200 230 C200 230 140 200 140 155 L140 95 Z"
          fill="hsl(222, 40%, 10%)"
          stroke="url(#shieldG)"
          strokeWidth="3"
        />
        <text x="200" y="165" textAnchor="middle" fill="hsl(158, 64%, 62%)" fontSize="28" fontFamily="system-ui">
          ✓
        </text>
      </motion.g>
      {/* Floating docs */}
      {[
        { label: "AUP", x: 52, y: 100, delay: 0 },
        { label: "Vendor", x: 300, y: 90, delay: 0.4 },
        { label: "Runbook", x: 48, y: 200, delay: 0.8 },
        { label: "1-Pager", x: 305, y: 195, delay: 1.2 },
      ].map((doc) => (
        <motion.g
          key={doc.label}
          initial={{ opacity: 0, y: doc.y + 20 }}
          animate={{ opacity: [0.6, 1, 0.6], y: [doc.y, doc.y - 6, doc.y] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: doc.delay }}
        >
          <rect x={doc.x} y={doc.y} width="72" height="44" rx="6" fill="hsl(222, 35%, 14%)" stroke="hsl(199, 89%, 68%)" strokeWidth="1.5" />
          <line x1={doc.x + 12} y1={doc.y + 14} x2={doc.x + 60} y2={doc.y + 14} stroke="hsl(215, 18%, 45%)" strokeWidth="2" />
          <line x1={doc.x + 12} y1={doc.y + 24} x2={doc.x + 50} y2={doc.y + 24} stroke="hsl(215, 18%, 35%)" strokeWidth="2" />
          <text x={doc.x + 36} y={doc.y + 38} textAnchor="middle" fill="hsl(199, 89%, 68%)" fontSize="8" fontWeight="600" fontFamily="system-ui">
            {doc.label}
          </text>
        </motion.g>
      ))}
      <motion.circle cx="200" cy="150" r="55" fill="none" stroke="hsl(158, 64%, 62%)" strokeWidth="1" opacity="0.3"
        animate={{ r: [55, 70, 55], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
    </svg>
  );
}

function ComplianceMapVisual() {
  return (
    <svg viewBox="0 0 400 280" className="h-full w-full" role="img" aria-label="US AI compliance regulations mapped across jurisdictions">
      <rect x="8" y="8" width="384" height="264" rx="14" fill="hsl(222, 40%, 8%)" stroke="hsl(222, 30%, 18%)" />
      <text x="200" y="36" textAnchor="middle" fill="hsl(215, 18%, 62%)" fontSize="10" fontFamily="system-ui" fontWeight="600">
        US AI COMPLIANCE MAP
      </text>
      {/* Simplified US outline */}
      <path
        d="M120 220 L140 80 L200 60 L280 75 L300 220 Z"
        fill="hsl(222, 35%, 12%)"
        stroke="hsl(199, 89%, 68%)"
        strokeWidth="1.5"
        opacity="0.6"
      />
      {[
        { cx: 175, cy: 130, label: "FTC" },
        { cx: 230, cy: 110, label: "State" },
        { cx: 200, cy: 175, label: "HIPAA" },
        { cx: 255, cy: 155, label: "EU" },
        { cx: 150, cy: 165, label: "SOC2" },
      ].map((node, i) => (
        <g key={node.label}>
          <motion.circle
            cx={node.cx}
            cy={node.cy}
            r="8"
            fill="hsl(158, 64%, 52%)"
            animate={{ opacity: [0.4, 1, 0.4], r: [6, 10, 6] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.35 }}
          />
          <text x={node.cx} y={node.cy + 22} textAnchor="middle" fill="hsl(210, 40%, 85%)" fontSize="8" fontFamily="system-ui">
            {node.label}
          </text>
        </g>
      ))}
      <motion.line
        x1="175" y1="130" x2="230" y2="110"
        stroke="hsl(199, 89%, 68%)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.line
        x1="200" y1="175" x2="255" y2="155"
        stroke="hsl(158, 64%, 62%)"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        animate={{ opacity: [0.2, 0.8, 0.2] }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
      />
      {/* Checklist panel */}
      <rect x="28" y="52" width="110" height="100" rx="8" fill="hsl(222, 35%, 11%)" stroke="hsl(222, 30%, 20%)" />
      {["CA AI Act", "FTC guidance", "State privacy"].map((item, i) => (
        <motion.g key={item}>
          <motion.text
            x="42"
            y={72 + i * 28}
            fill="hsl(210, 40%, 90%)"
            fontSize="9"
            fontFamily="system-ui"
            animate={{ opacity: [0.5, 1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.6 }}
          >
            ✓ {item}
          </motion.text>
        </motion.g>
      ))}
      <motion.rect
        x="260"
        y="220"
        width="110"
        height="24"
        rx="6"
        fill="hsl(199, 89%, 55%)"
        animate={{ opacity: [0.8, 1, 0.8] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <text x="315" y="236" textAnchor="middle" fill="hsl(222, 47%, 6%)" fontSize="9" fontWeight="bold" fontFamily="system-ui">
        12 RULES MAPPED
      </text>
    </svg>
  );
}

export function CaseStudyVisual({ type }: { type: CaseStudyVisualType }) {
  const visuals = {
    "risk-dashboard": RiskDashboardVisual,
    "policy-shield": PolicyShieldVisual,
    "compliance-map": ComplianceMapVisual,
  };
  const Visual = visuals[type];
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border bg-surface-mid glow-ring">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40" />
      <div className="relative p-3 sm:p-4">
        <Visual />
      </div>
    </div>
  );
}

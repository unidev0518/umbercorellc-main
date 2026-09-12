"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavLink({ href, icon, label, badge }: { href: string; icon: string; label: string; badge?: number }) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors"
      style={active
        ? { background: "#0d1527", border: "0.5px solid #1e293b", color: "#f1f5f9" }
        : { color: "#475569", border: "0.5px solid transparent" }
      }
    >
      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
        style={{ color: active ? "#c4813a" : "currentColor" }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d={icon} />
      </svg>
      <span className="font-medium flex-1">{label}</span>
      {badge != null && badge > 0 && (
        <span className="text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center leading-none"
          style={{ background: "#fbbf2422", color: "#fbbf24", border: "0.5px solid #fbbf2444" }}>
          {badge > 99 ? "99+" : badge}
        </span>
      )}
    </Link>
  );
}

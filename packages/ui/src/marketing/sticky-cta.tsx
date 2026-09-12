"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "../primitives/button";
import { cn } from "../lib/utils";

export function StickyBookCta() {
  const [visible, setVisible] = useState(false);
  const bookUrl = "/join-us";

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 z-40 -translate-x-1/2 transition-all duration-300 md:hidden",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
      )}
    >
      <Button variant="accent" size="lg" className="shadow-glow-lg" asChild>
        <Link href={bookUrl}>Book Free Call</Link>
      </Button>
    </div>
  );
}

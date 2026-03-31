"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useCallback } from "react";

const navItems = [
  { href: "/", label: "概要", icon: "📊" },
  { href: "/trades", label: "トレード履歴", icon: "📈" },
  { href: "/signals", label: "シグナルログ", icon: "📡" },
  { href: "/performance", label: "パフォーマンス", icon: "🏆" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const handleRefetch = useCallback(() => {
    setSpinning(true);
    router.refresh();
    setTimeout(() => setSpinning(false), 800);
  }, [router]);

  return (
    <aside className="w-56 shrink-0 bg-card-bg border-r border-card-border flex flex-col">
      <div className="p-4 border-b border-card-border flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Crypto Bot</h1>
          <p className="text-xs text-muted">Dashboard</p>
        </div>
        <button
          onClick={handleRefetch}
          title="データを再取得"
          className="p-1.5 rounded-md text-muted hover:text-foreground hover:bg-card-border/50 transition-colors"
        >
          <svg
            className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182M21.015 4.356v4.992"
            />
          </svg>
        </button>
      </div>
      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? "bg-accent-blue/20 text-accent-blue"
                  : "text-muted hover:text-foreground hover:bg-card-border/50"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

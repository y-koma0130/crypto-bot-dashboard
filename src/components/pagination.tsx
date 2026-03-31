"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function Pagination({
  total,
  pageSize,
  basePath,
}: {
  total: number;
  pageSize: number;
  basePath: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      const qs = params.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath);
    },
    [router, searchParams, basePath],
  );

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted">
        {total} 件中 {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)} 件
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          className="px-2.5 py-1 rounded text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted hover:text-foreground hover:bg-card-border/50"
        >
          前へ
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
          .reduce<(number | "...")[]>((acc, p, i, arr) => {
            if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
            acc.push(p);
            return acc;
          }, [])
          .map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1 text-xs text-muted">...</span>
            ) : (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                  p === currentPage
                    ? "bg-accent-blue text-white"
                    : "text-muted hover:text-foreground hover:bg-card-border/50"
                }`}
              >
                {p}
              </button>
            ),
          )}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="px-2.5 py-1 rounded text-xs font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed text-muted hover:text-foreground hover:bg-card-border/50"
        >
          次へ
        </button>
      </div>
    </div>
  );
}

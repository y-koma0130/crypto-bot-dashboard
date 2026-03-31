"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { BOT_META } from "@/lib/constants";
import {
  GRID_PROPS,
  AXIS_TICK,
  AXIS_LINE,
  TICK_LINE,
  TOOLTIP_STYLE,
  LEGEND_STYLE,
  dollarFormatter,
} from "@/lib/chart-config";

type DataPoint = {
  date: string;
  momentum: number;
  range: number;
  sentiment: number;
  total: number;
};

const PERIODS = [
  { key: "1d", label: "前日" },
  { key: "1w", label: "1週間" },
  { key: "1m", label: "1ヶ月" },
  { key: "3m", label: "3ヶ月" },
  { key: "6m", label: "6ヶ月" },
  { key: "1y", label: "1年" },
] as const;

const LINE_CONFIG = [
  { key: "total", label: "合計", color: "#22c55e" },
  ...Object.entries(BOT_META).map(([key, meta]) => ({
    key,
    label: meta.label,
    color: meta.color,
  })),
];

export function CumulativePnlChart() {
  const [period, setPeriod] = useState("1m");
  const [data, setData] = useState<DataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async (p: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/pnl-chart?period=${p}`);
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(period);
  }, [period, fetchData]);

  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground/80">
          累計収益推移
        </h2>
        <div className="flex gap-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                period === p.key
                  ? "bg-accent-blue text-white"
                  : "text-muted hover:text-foreground hover:bg-card-border/50"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-72 text-muted text-sm">
          読み込み中...
        </div>
      ) : data.length === 0 ? (
        <div className="flex items-center justify-center h-72 text-muted text-sm">
          この期間のデータがありません
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={320}>
          <LineChart
            data={data}
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <CartesianGrid {...GRID_PROPS} />
            <XAxis
              dataKey="date"
              tick={AXIS_TICK}
              tickLine={TICK_LINE}
              axisLine={AXIS_LINE}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={TICK_LINE}
              axisLine={AXIS_LINE}
              tickFormatter={dollarFormatter}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(value: unknown, name: unknown) => [
                `$${Number(value).toFixed(2)}`,
                String(name),
              ]}
              labelFormatter={(label: unknown) => `${label}`}
            />
            <Legend wrapperStyle={LEGEND_STYLE} />
            {LINE_CONFIG.map((line) => (
              <Line
                key={line.key}
                type="monotone"
                dataKey={line.key}
                name={line.label}
                stroke={line.color}
                strokeWidth={line.key === "total" ? 3 : 1.5}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

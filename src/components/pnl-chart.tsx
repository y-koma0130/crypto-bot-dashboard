"use client";

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
import {
  GRID_PROPS,
  AXIS_TICK,
  AXIS_LINE,
  TICK_LINE,
  TOOLTIP_STYLE,
  LEGEND_STYLE,
  dollarFormatter,
} from "@/lib/chart-config";

type PnlDataPoint = {
  date: string;
  pnl: number;
  cumulativePnl: number;
};

export function PnlChart({ data }: { data: PnlDataPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        データがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
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
            name === "pnl" ? "日次PnL" : "累計PnL",
          ]}
          labelFormatter={(label: unknown) => `日付: ${label}`}
        />
        <Legend
          formatter={(value: string) =>
            value === "pnl" ? "日次PnL" : "累計PnL"
          }
          wrapperStyle={LEGEND_STYLE}
        />
        <Line
          type="monotone"
          dataKey="pnl"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="cumulativePnl"
          stroke="#22c55e"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

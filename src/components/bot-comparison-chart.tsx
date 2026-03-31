"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { getBotColor } from "@/lib/constants";
import {
  GRID_PROPS,
  AXIS_TICK,
  AXIS_LINE,
  TICK_LINE,
  TOOLTIP_STYLE,
  dollarFormatter,
} from "@/lib/chart-config";

type BotPnlData = {
  botName: string;
  totalPnl: number;
  tradeCount: number;
  avgPnl: number;
};

export function BotComparisonChart({ data }: { data: BotPnlData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-muted text-sm">
        データがありません
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
        <CartesianGrid {...GRID_PROPS} />
        <XAxis
          dataKey="botName"
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
          formatter={(value: unknown) => [`$${Number(value).toFixed(2)}`, "総PnL"]}
          labelFormatter={(label: unknown) => `ボット: ${label}`}
        />
        <Bar dataKey="totalPnl" radius={[4, 4, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.botName} fill={getBotColor(entry.botName)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

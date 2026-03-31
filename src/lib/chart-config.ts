export const GRID_PROPS = {
  strokeDasharray: "3 3",
  stroke: "#2a2d3e",
} as const;

export const AXIS_TICK = { fill: "#6b7280", fontSize: 12 } as const;
export const AXIS_LINE = { stroke: "#2a2d3e" } as const;
export const TICK_LINE = { stroke: "#6b7280" } as const;

export const TOOLTIP_STYLE = {
  backgroundColor: "#1a1d2e",
  border: "1px solid #2a2d3e",
  borderRadius: "8px",
  color: "#e5e7eb",
  fontSize: 13,
} as const;

export const LEGEND_STYLE = { color: "#6b7280", fontSize: 12 } as const;

export const dollarFormatter = (v: number) => `$${v.toFixed(0)}`;

"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { EmploymentSlice } from "@/types/major";

const COLORS = ["#1f3061", "#0ea5e9", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#6b7280"];

export function EmploymentPie({ data }: { data: EmploymentSlice[] }) {
  const formatted = data.map((d) => ({
    name: d.category,
    value: Math.round(d.ratio * 100),
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formatted}
            dataKey="value"
            nameKey="name"
            outerRadius="70%"
            innerRadius="40%"
            paddingAngle={2}
            label={({ value }) => `${value}%`}
            labelLine={false}
          >
            {formatted.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v) => `${v}%`} />
          <Legend
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { HOLLAND_LABELS } from "@/lib/diagnosis/mappings";
import type { HollandScores, HollandType } from "@/types/diagnosis";

const ORDER: HollandType[] = ["R", "I", "A", "S", "E", "C"];

export function HollandRadar({ scores }: { scores: HollandScores }) {
  const data = ORDER.map((t) => ({
    type: `${HOLLAND_LABELS[t]}`,
    typeKey: t,
    score: scores[t],
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="type"
            tick={{ fontSize: 12, fill: "#334155" }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#94a3b8" }}
            tickCount={5}
          />
          <Radar
            name="점수"
            dataKey="score"
            stroke="#1f3061"
            fill="#1f3061"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

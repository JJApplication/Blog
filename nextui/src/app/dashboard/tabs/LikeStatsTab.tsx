"use client";

import StatsMetricTab from "./StatsMetricTab";

interface LikeStatsTabProps {
  active: boolean;
}

export default function LikeStatsTab({ active }: LikeStatsTabProps) {
  return (
    <StatsMetricTab
      active={active}
      title="点赞统计"
      endpoint="/api/dashboard/like"
      valueLabel="点赞"
      valueKey="like"
      color="purple"
    />
  );
}

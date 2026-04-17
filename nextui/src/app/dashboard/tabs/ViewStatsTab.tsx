"use client";

import StatsMetricTab from "./StatsMetricTab";

interface ViewStatsTabProps {
  active: boolean;
}

export default function ViewStatsTab({ active }: ViewStatsTabProps) {
  return (
    <StatsMetricTab
      active={active}
      title="文章访问统计"
      endpoint="/api/dashboard/view"
      valueLabel="访问"
      valueKey="view"
      color="blue"
    />
  );
}

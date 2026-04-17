"use client";

import StatsMetricTab from "./StatsMetricTab";

interface ShareStatsTabProps {
  active: boolean;
}

export default function ShareStatsTab({ active }: ShareStatsTabProps) {
  return (
    <StatsMetricTab
      active={active}
      title="分享统计"
      endpoint="/api/dashboard/share"
      valueLabel="分享"
      valueKey="share"
      color="cyan"
    />
  );
}

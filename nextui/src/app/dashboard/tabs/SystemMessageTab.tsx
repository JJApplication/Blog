"use client";

import MessageDataTab from "./MessageDataTab";

interface SystemMessageTabProps {
  active: boolean;
}

export default function SystemMessageTab({ active }: SystemMessageTabProps) {
  return (
    <MessageDataTab
      active={active}
      title="系统留言"
      endpoint="/api/dashboard/message"
      emptyText="暂无系统留言数据"
    />
  );
}

"use client";

import MessageDataTab from "./MessageDataTab";

interface CommentManageTabProps {
  active: boolean;
}

export default function CommentManageTab({ active }: CommentManageTabProps) {
  return (
    <MessageDataTab
      active={active}
      title="评论管理"
      endpoint="/api/dashboard/comment"
      emptyText="暂无评论数据"
    />
  );
}

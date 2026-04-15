"use client";

import { PostDetailClient } from "./PostDetailClient";

interface PostDetailPageProps {
  params: {
    name: string;
  };
}

export default function PostDetailPage({ params }: PostDetailPageProps) {
  const postName = decodeURIComponent(params.name || "");
  return <PostDetailClient postName={postName} />;
}

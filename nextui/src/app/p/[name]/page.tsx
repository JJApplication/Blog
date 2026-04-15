"use client";

import { PostDetailClient } from "../../post/[name]/PostDetailClient";

interface PostDetailPageProps {
  params: {
    name: string;
  };
}

export default function LegacyPostDetailPage({ params }: PostDetailPageProps) {
  const postName = decodeURIComponent(params.name || "");
  return <PostDetailClient postName={postName} />;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import { cn } from "@/lib/utils";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    const parsed = marked.parse(content || "") as string;
    if (typeof window === "undefined") {
      setHtml(parsed);
      return;
    }

    let isActive = true;
    import("isomorphic-dompurify")
      .then((mod) => {
        if (isActive) {
          setHtml(mod.default.sanitize(parsed));
        }
      })
      .catch(() => {
        if (isActive) {
          setHtml(parsed);
        }
      });

    return () => {
      isActive = false;
    };
  }, [content]);

  useEffect(() => {
    const nodes = rootRef.current?.querySelectorAll("pre code") ?? [];
    nodes.forEach((node) => {
      hljs.highlightElement(node as HTMLElement);
    });
  }, [html]);

  return (
    <div
      ref={rootRef}
      className={cn("markdown-content", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

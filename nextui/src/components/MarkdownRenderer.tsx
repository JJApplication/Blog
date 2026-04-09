"use client";

import { useEffect, useRef, useState } from "react";
import { marked } from "marked";
import hljs from "highlight.js";
import { cn } from "@/lib/utils";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

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
  const [slides, setSlides] = useState<Array<{ src: string; alt?: string }>>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

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

  useEffect(() => {
    const root = rootRef.current;
    if (!root) {
      return;
    }

    const images = Array.from(root.querySelectorAll("img"));
    const nextSlides = images
      .map((img) => {
        const src = img.getAttribute("src");
        if (!src) {
          return null;
        }
        return {
          src,
          alt: img.getAttribute("alt") || "",
        };
      })
      .filter((item): item is { src: string; alt: string } => Boolean(item));

    setSlides(nextSlides);
    return;
  }, [html]);

  const handleContentClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    const image = target?.closest("img");
    if (!image) {
      return;
    }

    const root = rootRef.current;
    if (!root) {
      return;
    }

    const validImages = Array.from(root.querySelectorAll("img")).filter((img) =>
      Boolean(img.getAttribute("src"))
    );
    const index = validImages.indexOf(image as HTMLImageElement);
    if (Number.isNaN(index) || index < 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    setActiveIndex(index);
  };

  return (
    <>
      <div
        ref={rootRef}
        className={cn("markdown-content", className)}
        dangerouslySetInnerHTML={{ __html: html }}
        onClick={handleContentClick}
      />
      <Lightbox
        open={activeIndex >= 0}
        close={() => setActiveIndex(-1)}
        index={activeIndex >= 0 ? activeIndex : 0}
        slides={slides}
        plugins={[Zoom]}
        zoom={{
          maxZoomPixelRatio: 3,
          zoomInMultiplier: 1.5,
          doubleTapDelay: 250,
          keyboardMoveDistance: 40,
        }}
      />
    </>
  );
}

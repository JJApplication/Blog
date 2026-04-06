import { useState, useRef, useEffect } from "react";
import { GlassCard } from "@/components/GlassCard";
import { Article } from "@/store/useBlogStore";
import Link from "next/link";

interface ArticleShellViewProps {
  articles: Article[];
  isLoading: boolean;
  error: string | null;
}

export function ArticleShellView({ articles, isLoading, error }: ArticleShellViewProps) {
  const [history, setHistory] = useState<{ command: string; output: React.ReactNode }[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Automatically scroll to bottom on history change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, articles, isLoading]);

  // Initial greeting and 'ls' when loaded
  useEffect(() => {
    if (!isLoading && articles.length > 0 && history.length === 0) {
      handleCommand("ls");
    }
  }, [isLoading, articles]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    let output: React.ReactNode = null;

    if (trimmedCmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    } else if (trimmedCmd === "ls") {
      output = (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-green-400">
          {articles.map((a) => (
            <div key={a.id} className="flex gap-4">
              <span className="text-white/50 w-24 shrink-0">{a.date.split(" ")[0]}</span>
              <Link href={`/post?name=${encodeURIComponent(a.name)}`} className="truncate hover:text-cyan-300">
                {a.name}
              </Link>
            </div>
          ))}
        </div>
      );
    } else if (trimmedCmd === "ls -la" || trimmedCmd === "ll") {
      output = (
        <div className="flex flex-col gap-3 mt-2 text-sm">
          {articles.map((a) => (
            <div key={a.id} className="flex flex-col border-b border-white/10 pb-2">
              <div className="flex gap-4 text-green-400">
                <span className="text-white/50 w-24 shrink-0">{a.date.split(" ")[0]}</span>
                <Link href={`/post?name=${encodeURIComponent(a.name)}`} className="font-bold hover:text-cyan-300">
                  {a.name}
                </Link>
              </div>
              <div className="text-white/80 mt-1">{a.title}</div>
              <div className="text-white/40 mt-1 line-clamp-2">{a.abstract}</div>
              <div className="text-blue-400 mt-1">Tags: {a.tags || "none"}</div>
            </div>
          ))}
        </div>
      );
    } else if (trimmedCmd === "") {
      output = null;
    } else {
      output = (
        <div className="text-red-400 mt-1">
          bash: {trimmedCmd}: command not found. Try &apos;ls&apos;, &apos;ls -la&apos;, or &apos;clear&apos;
        </div>
      );
    }

    setHistory((prev) => [...prev, { command: trimmedCmd, output }]);
    setInput("");
  };

  return (
    <GlassCard className="!p-0 overflow-hidden flex flex-col h-[600px] bg-black/80 font-mono border-white/20 w-full flex-grow">
      {/* Shell Header */}
      <div className="bg-white/10 px-4 py-2 flex items-center gap-2 border-b border-white/10 shrink-0">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-white/50 text-xs ml-2">guest@blognext: ~/posts</span>
      </div>

      {/* Shell Body */}
      <div className="p-4 overflow-y-auto flex-grow text-sm text-white/90">
        {isLoading ? (
          <div className="animate-pulse text-white/50">Loading articles...</div>
        ) : error ? (
          <div className="text-red-400">Error: {error}</div>
        ) : (
          <>
            <div className="mb-4 text-white/50">
              Welcome to BlogNEXT Shell.
              <br />
              Type &apos;ls&apos; to list articles, &apos;ls -la&apos; for details, &apos;clear&apos; to clear terminal.
            </div>

            {history.map((entry, i) => (
              <div key={i} className="mb-4">
                <div className="flex gap-2 text-white/90 flex-wrap">
                  <span className="text-green-400">guest@blognext:</span>
                  <span className="text-blue-400">~/posts$</span>
                  <span>{entry.command}</span>
                </div>
                {entry.output}
              </div>
            ))}

            {/* Input Line */}
            <div className="flex gap-2 text-white/90 items-center flex-wrap">
              <span className="text-green-400 shrink-0">guest@blognext:</span>
              <span className="text-blue-400 shrink-0">~/posts$</span>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCommand(input);
                }}
                className="flex-grow flex min-w-[200px]"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="bg-transparent border-none outline-none flex-grow text-white w-full"
                  autoFocus
                />
              </form>
            </div>
            <div ref={bottomRef} />
          </>
        )}
      </div>
    </GlassCard>
  );
}

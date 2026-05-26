"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { FaPaperPlane, FaPlus, FaRegTrashCan } from "react-icons/fa6";

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

const initialMessages: Message[] = [
  {
    role: "assistant",
    content: "How can i assist you today?",
  },
];

const systemMessage: Message = {
  role: "system",
  content:
    "You are a helpful, friendly study assistant for Nigerian secondary school and exam preparation. Keep answers concise, clear, and supportive. Use simple language and provide examples when appropriate.",
};

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: prompt.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setPrompt("");
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [systemMessage, ...updatedMessages] }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI request failed");
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.text || "I couldn't generate a response. Try again.",
        },
      ]);
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error
          ? err.message
          : "OpenAI request failed. Check your API key.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const clearChat = () => {
    setMessages(initialMessages);
    setError("");
  };

  const conversationTitle = useMemo(() => {
    const lastUser = [...messages]
      .reverse()
      .find((message) => message.role === "user");
    return lastUser ? lastUser.content.slice(0, 40) : "New chat";
  }, [messages]);

  return (
    <div className="h-screen min-h-screen overflow-hidden bg-[#0b1020] text-[#e9ecf7]">
      <div className="grid h-full min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="hidden h-full border-r border-white/10 bg-[linear-gradient(180deg,#121a33_0%,#0d1429_100%)] lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto p-3">
            <button
              type="button"
              onClick={clearChat}
              className="flex w-full items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm text-[#e9ecf7] transition hover:bg-cyan-300/20"
            >
              <FaPlus className="text-xs" />
              New chat
            </button>
            <Link
              href="/"
              className="mt-2 block rounded-xl border border-white/10 px-3 py-2 text-sm text-[#c6cee8] transition hover:bg-white/10"
            >
              Home Page
            </Link>
            <button
              type="button"
              onClick={clearChat}
              className="mt-2 flex w-full items-center gap-2 rounded-xl border border-white/10 px-3 py-2 text-sm text-[#c6cee8] transition hover:bg-white/10"
            >
              <FaRegTrashCan className="text-xs" />
              Clear chat
            </button>

            <p className="mt-6 px-1 text-xs uppercase tracking-[0.2em] text-[#90a1d3]">
              Recent
            </p>
            <div className="mt-2 space-y-1">
              <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                {conversationTitle}
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-h-0 flex-col">
          <div className="border-b border-white/10 bg-[#0f1832]/90 px-4 py-3 text-sm text-[#b6c4ed] backdrop-blur">
            AI Tutor Assistant
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.1),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,#0b1020_0%,#0a0f1d_100%)]">
            <div className="mx-auto w-full max-w-3xl px-4 py-6">
              <div className="space-y-8">
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className="w-full">
                    <div
                      className={`rounded-2xl border px-4 py-4 text-[15px] leading-7 backdrop-blur ${
                        message.role === "user"
                          ? "ml-auto max-w-[90%] border-cyan-300/30 bg-cyan-300/10"
                          : "max-w-[95%] border-white/10 bg-white/5"
                      }`}
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9fb2e6]">
                        {message.role === "user" ? "You" : "AI Tutor"}
                      </p>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading ? (
                  <div className="w-full">
                    <div className="max-w-[95%] rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-[15px] leading-7 backdrop-blur">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9fb2e6]">
                        AI Tutor
                      </p>
                      <p className="text-[#c8d5f5]">Thinking...</p>
                    </div>
                  </div>
                ) : null}
                <div ref={messagesEndRef} />
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 bg-[#0f1832]/80 px-3 py-3 backdrop-blur sm:px-4 sm:py-4">
            <div className="mx-auto w-full max-w-3xl">
              <form onSubmit={handleSubmit}>
                <div className="rounded-3xl border border-white/20 bg-white/10 p-2 shadow-2xl shadow-cyan-500/10">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={prompt}
                      onChange={(event) => setPrompt(event.target.value)}
                      rows={2}
                      placeholder="Message AI Tutor"
                      className="min-h-[52px] flex-1 resize-none bg-transparent px-3 py-2 text-sm text-[#e9ecf7] outline-none placeholder:text-[#9fb2e6]"
                    />
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="mb-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-cyan-300 text-[#0b1020] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <FaPaperPlane className="text-xs" />
                    </button>
                  </div>
                </div>
              </form>
              {error ? (
                <p className="mt-2 rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
                  {error}
                </p>
              ) : null}
              <p className="mt-2 text-center text-xs text-[#9fb2e6]">
                AI Tutor can make mistakes. Check important info.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

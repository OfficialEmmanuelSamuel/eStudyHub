"use client";

import {
  ChangeEvent,
  FormEvent,
  Suspense,
  useRef,
  useMemo,
  useState,
  useEffect,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaImage, FaPaperPlane, FaPhone, FaVideo } from "react-icons/fa6";

type ChatMessage = {
  id: number;
  user: string;
  text: string;
  image?: string;
  timestamp: string;
  mine?: boolean;
};

const starterMessages: ChatMessage[] = [
  {
    id: 1,
    user: "Amina",
    text: "Good morning everyone. Who is revising today?",
    timestamp: "08:14",
  },
  {
    id: 2,
    user: "You",
    text: "I am. I also have a quick summary note.",
    timestamp: "08:16",
    mine: true,
  },
  {
    id: 3,
    user: "Daniel",
    text: "Please share it here so others can use it too.",
    timestamp: "08:17",
  },
];

function LearningGroupChatContent() {
  const params = useSearchParams();
  const group = params.get("group") || "GENERAL";

  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [message, setMessage] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const onlineCount = useMemo(() => 128, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") setImagePreview(result);
    };
    reader.readAsDataURL(file);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    if (!message.trim() && !imagePreview) return;

    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;

    const newMessage: ChatMessage = {
      id: Date.now(),
      user: "You",
      text: message.trim(),
      image: imagePreview || undefined,
      timestamp,
      mine: true,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    setImagePreview("");
  };

  return (
    <main className="-mx-4 h-screen min-h-screen overflow-hidden md:-mx-6">
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex h-full min-h-screen flex-col border-y border-slate-200 bg-[radial-gradient(circle_at_top_left,#fdf2f8_0%,#f8fafc_45%,#ecfeff_100%)] shadow-md"
      >
        <div className="flex h-full min-h-0 flex-col">
          <header className="sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 border-b border-white/40 bg-slate-900 px-4 py-3 text-slate-900 shadow-sm backdrop-blur-md">
            <div>
              <p className="text-xs text-emerald-500">Community Chat</p>
              <h1 className="text-lg font-semibold text-white">
                {group} Group
              </h1>
              <p className="text-xs text-emerald-500">
                {onlineCount} students online
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/learning-group"
                className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate"
              >
                Back to Community
              </Link>
              <button type="button" className="rounded-full bg-slate-100 p-2">
                <FaPhone className="text-xs" />
              </button>
              <button type="button" className="rounded-full bg-slate-100 p-2">
                <FaVideo className="text-xs" />
              </button>
            </div>
          </header>

          <div className="flex-1 min-h-0 overflow-hidden px-0 md:px-3">
            <div className="h-full min-h-0 overflow-y-auto space-y-3 px-3 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl border px-3 py-2 text-sm shadow-sm backdrop-blur md:max-w-[70%] ${
                      msg.mine
                        ? "rounded-br-md border-cyan-300/40 bg-cyan-100/70 text-slate-800"
                        : "rounded-bl-md border-white/50 bg-white/70 text-slate-800"
                    }`}
                  >
                    {!msg.mine ? (
                      <p className="mb-1 text-[11px] font-semibold text-emerald-500">
                        {msg.user}
                      </p>
                    ) : null}
                    {msg.text ? <p className="leading-5">{msg.text}</p> : null}
                    {msg.image ? (
                      <img
                        src={msg.image}
                        alt="Chat upload"
                        className="mt-2 max-h-56 w-full rounded-lg object-cover"
                      />
                    ) : null}
                    <p className="mt-1 text-right text-[10px] text-slate-500">
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {imagePreview ? (
            <div className="border-t border-slate-200 bg-white/80 px-3 py-2 backdrop-blur">
              <p className="text-xs font-medium text-slate-600">
                Image Preview
              </p>
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 max-h-40 rounded-lg object-cover"
              />
            </div>
          ) : null}

          <form
            onSubmit={sendMessage}
            className="flex items-center gap-2 border-t border-slate-200 bg-white/80 px-3 py-3 backdrop-blur"
          >
            <label className="inline-flex cursor-pointer items-center justify-center rounded-full bg-slate-100 p-2 text-slate-600 shadow-sm">
              <FaImage />
              <input
                type="file"
                accept="image/*"
                onChange={onImage}
                className="hidden"
              />
            </label>

            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="h-10 flex-1 rounded-full border border-slate-200 bg-white px-4 text-sm outline-none focus:border-cyan-500"
            />

            <button
              type="submit"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-600 text-white transition-colors hover:bg-cyan-500"
            >
              <FaPaperPlane className="text-xs" />
            </button>
          </form>
        </div>
      </motion.section>
    </main>
  );
}

export default function LearningGroupChatPage() {
  return (
    <Suspense fallback={<main className="-mx-4 h-screen md:-mx-6" />}>
      <LearningGroupChatContent />
    </Suspense>
  );
}

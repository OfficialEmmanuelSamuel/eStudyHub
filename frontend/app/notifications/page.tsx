"use client";

import { useEffect, useMemo, useState } from "react";
import { FaBell, FaCheck, FaClock, FaInbox } from "react-icons/fa6";
import {
  loadNotifications,
  saveNotifications,
} from "@/lib/notificationStorage";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setNotifications(loadNotifications());
  }, []);

  const unreadCount = useMemo(
    () =>
      notifications.filter((notification: any) => notification.unread).length,
    [notifications],
  );

  const markAllRead = () => {
    const updated = notifications.map((notification: any) => ({
      ...notification,
      unread: false,
    }));
    saveNotifications(updated);
    setNotifications(updated);
  };

  const markRead = (id: string) => {
    const updated = notifications.map((notification: any) =>
      notification.id === id
        ? { ...notification, unread: false }
        : notification,
    );
    saveNotifications(updated);
    setNotifications(updated);
  };

  return (
    <div className="space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-lg shadow-slate-900/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-emerald-300">Notifications</p>
            <h1 className="mt-2 text-3xl font-semibold">Your latest alerts</h1>
            <p className="mt-2 text-sm text-slate-300">
              Stay updated with reminders, study tips, and platform
              announcements.
            </p>
          </div>
          <div className="inline-flex items-center rounded-2xl bg-slate-800 px-4 py-3 text-sm text-slate-200">
            <FaBell className="mr-2" />
            {unreadCount} unread message{unreadCount === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200/10 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Notifications
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review your latest study updates and clear unread items.
              </p>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
              Mark all read
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {notifications.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                <p>No notifications available yet.</p>
              </div>
            ) : (
              notifications.map((notification: any) => (
                <article
                  key={notification.id}
                  className={`rounded-3xl border px-5 py-4 shadow-sm transition ${
                    notification.unread
                      ? "border-amber-300 bg-amber-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <FaClock />
                        <span>
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">
                        {notification.title}
                      </h3>
                    </div>
                    {notification.unread ? (
                      <span className="rounded-full bg-rose-500 px-3 py-1 text-xs font-semibold text-white">
                        New
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-700">
                        Read
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-slate-700">{notification.message}</p>
                  {notification.unread ? (
                    <button
                      type="button"
                      onClick={() => markRead(notification.id)}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                    >
                      <FaCheck /> Mark as read
                    </button>
                  ) : null}
                </article>
              ))
            )}
          </div>
        </section>

        <aside className="rounded-3xl border border-slate-200/10 bg-slate-950 p-6 text-slate-100 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-400/10 p-3 text-emerald-300">
              <FaInbox className="text-xl" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">
                Quick summary
              </p>
              <p className="mt-1 text-lg font-semibold text-white">
                {notifications.length} notifications
              </p>
            </div>
          </div>
          <div className="space-y-4 text-sm leading-6 text-slate-300">
            <p>
              New study reminders arrive here automatically as you engage with
              the platform.
            </p>
            <p>Mark the unread messages as read to keep your dashboard tidy.</p>
            <p>
              Use the notification card on the dashboard to get a quick count of
              fresh alerts.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

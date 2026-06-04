export type AppNotification = {
  id: string;
  title: string;
  message: string;
  timestamp: number;
  unread: boolean;
  category?: string;
};

const STORAGE_KEY = "estudyhub_notifications";

const DEFAULT_NOTIFICATIONS: AppNotification[] = [
  {
    id: "welcome",
    title: "Welcome to eStudy Hub",
    message:
      "Your learning dashboard is ready. Check notifications for quick updates and recommended practice.",
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    unread: true,
    category: "system",
  },
  {
    id: "quiz-reminder",
    title: "Quiz reminder",
    message:
      "A new quiz is available for your selected subject. Try it now to keep your streak going.",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    unread: true,
    category: "reminder",
  },
  {
    id: "study-tip",
    title: "Study tip",
    message:
      "Review your last topic and then move on to the next quiz for faster progress.",
    timestamp: Date.now() - 1000 * 60 * 30,
    unread: false,
    category: "tip",
  },
];

export function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return DEFAULT_NOTIFICATIONS;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(DEFAULT_NOTIFICATIONS),
      );
      return DEFAULT_NOTIFICATIONS;
    }
    return JSON.parse(stored) as AppNotification[];
  } catch {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(DEFAULT_NOTIFICATIONS),
    );
    return DEFAULT_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AppNotification[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
}

export function ensureNotifications(): AppNotification[] {
  return loadNotifications();
}

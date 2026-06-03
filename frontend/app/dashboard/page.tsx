import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard",
  description:
    "Your student dashboard on eStudy Hub with progress tracking, leaderboard insights, and exam readiness stats.",
};

export default function DashboardPage() {
  return <DashboardClient />;
}

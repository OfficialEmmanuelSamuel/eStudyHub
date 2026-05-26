import axios from "axios";
import { API_BASE } from "@/lib/apiBase";

export const api = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
});

export async function fetchDatabaseSummary() {
  const { data } = await api.get("/catalog/summary");
  return data as {
    subjects: number;
    topics: number;
    quizzes: number;
    examPapers: number;
    users: number;
    plannerTasks: number;
    communityMessages: number;
  };
}

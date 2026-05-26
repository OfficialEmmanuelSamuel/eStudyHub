"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

type AdminContextType = {
  user: User | null;
  adminData: AdminData | null;
  loading: boolean;
  isAdmin: boolean;
  logout: () => Promise<void>;
};

type AdminData = {
  role?: string;
  fullName?: string;
  [key: string]: unknown;
};

export const AdminContext = createContext<AdminContextType | undefined>(
  undefined,
);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      try {
        if (!currentUser) {
          setUser(null);
          setAdminData(null);
          setIsAdmin(false);
          setLoading(false);
          return;
        }

        // Check admin status from Firestore
        const adminSnap = await getDoc(doc(db, "adminUsers", currentUser.uid));

        if (adminSnap.exists() && adminSnap.data()?.role === "admin") {
          setUser(currentUser);
          setAdminData(adminSnap.data() as AdminData);
          setIsAdmin(true);
        } else {
          // Not an admin, sign out
          await signOut(auth);
          setUser(null);
          setAdminData(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Admin auth check error:", error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setAdminData(null);
      setIsAdmin(false);
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <AdminContext.Provider
      value={{ user, adminData, loading, isAdmin, logout }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  }
  return context;
}

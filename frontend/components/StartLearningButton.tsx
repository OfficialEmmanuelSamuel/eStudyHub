"use client";

import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type StartLearningButtonProps = {
  className: string;
  children: ReactNode;
};

export default function StartLearningButton({
  className,
  children,
}: StartLearningButtonProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleClick = () => {
    router.push(user ? "/dashboard" : "/auth/register");
  };

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  );
}

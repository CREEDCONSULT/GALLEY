"use client";

import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  const { signOut } = useAuthActions();
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/login");
      }}
      className="flex w-full items-center gap-3 px-3 py-3 text-sm text-muted transition-colors hover:text-foreground"
    >
      <LogOut size={17} /> Sign out
    </button>
  );
}

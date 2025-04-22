"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface SignOutProps {
  className?: string;
}

export function SignOut({ className }: SignOutProps) {
  const { signOut } = useAuthActions();
  return (
    <Button
      variant="outline"
      onClick={() => void signOut()}
      className={cn(className)}
    >
      Sign out
    </Button>
  );
}

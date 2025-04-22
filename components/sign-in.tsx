"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
interface SignInProps {
  className?: string;
  afterNavigate?: () => void;
}

export function SignIn({ className, afterNavigate }: SignInProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleClick = () => {
    if (afterNavigate) {
      startTransition(() => {
        router.push("/sign-in");
        afterNavigate();
      });
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <Button variant="outline" onClick={handleClick} className={cn(className)}>
      Sign in
    </Button>
  );
}

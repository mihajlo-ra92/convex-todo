"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

interface SignUpProps {
  className?: string;
  afterNavigate?: () => void;
}

export function SignUp({ className, afterNavigate }: SignUpProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const handleClick = () => {
    if (afterNavigate) {
      startTransition(() => {
        router.push("/sign-up");
        afterNavigate();
      });
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <Button variant="default" onClick={handleClick} className={cn(className)}>
      Sign up
    </Button>
  );
}

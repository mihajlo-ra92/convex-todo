"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignUp() {
  const router = useRouter();
  return (
    <Button variant="default" onClick={() => router.push("/sign-up")}>
      Sign up
    </Button>
  );
}

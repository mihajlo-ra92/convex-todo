"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function SignIn() {
  const router = useRouter();
  return (
    <Button variant="outline" onClick={() => router.push("/sign-in")}>
      Sign in
    </Button>
  );
}

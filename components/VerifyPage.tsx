"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

const resetPasswordSchema = z.object({
  code: z.string().min(1, { message: "Reset code is required." }),
  newPassword: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function VerifyResetComponent() {
  const { signIn } = useAuthActions();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Invalid Request</CardTitle>
            <CardDescription>
              Please start the password reset process from the beginning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/reset">
              <Button className="w-full">Go to Password Reset</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  async function onSubmit(values: z.infer<typeof resetPasswordSchema>) {
    try {
      setError(null);
      const formData = new FormData();
      formData.append("code", values.code);
      formData.append("newPassword", values.newPassword);
      formData.append("email", email as string);
      formData.append("flow", "reset-verification");
      await signIn("password", formData);
      console.log("sign in successful");
      window.location.href = "/";
      console.log("redirected to home");
    } catch {
      setError("Invalid reset code or password. Please try again.");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Enter New Password</CardTitle>
          <CardDescription>
            Enter the reset code sent to {email}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 rounded-md bg-destructive/15 p-3">
              <div className="text-sm text-destructive">{error}</div>
            </div>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reset Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter reset code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Continue
                </Button>
                <Link href="/reset">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

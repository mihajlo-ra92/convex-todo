"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthActions } from "@convex-dev/auth/react";

const formSchema = z.object({
  code: z.string().min(1, {
    message: "Please enter the verification code.",
  }),
});

export function VerifyForm() {
  const { signIn } = useAuthActions();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setError(null);
      const formData = new FormData();
      formData.append("code", values.code);
      // We need to pass the email from the URL query parameter
      const email = new URLSearchParams(window.location.search).get("email");
      if (!email) {
        setError("Email parameter is missing. Please try signing up again.");
        return;
      }
      formData.append("email", email);

      await signIn("resend-otp", formData);
      router.push("/"); // Redirect to home after successful verification
    } catch (e) {
      if (e instanceof Error) {
        const errorMessage =
          e.message || "Failed to verify code. Please try again.";
        if (errorMessage.includes("expired")) {
          setError("Verification code has expired. Please request a new one.");
        } else if (errorMessage.includes("invalid")) {
          setError("Invalid verification code. Please check and try again.");
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          Enter the verification code sent to your email address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="rounded-md bg-destructive/15 p-3">
                <div className="text-sm text-destructive">{error}</div>
              </div>
            )}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter verification code"
                      {...field}
                      maxLength={8}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Verify Email
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

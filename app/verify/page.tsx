import { VerifyForm } from "@/components/verify-form";

export default function VerifyPage() {
  return (
    <main className="container flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <VerifyForm />
      </div>
    </main>
  );
}

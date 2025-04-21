"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { ModeToggle } from "./mode-toggle";
import { SignOut } from "./sign-out";
import { SignIn } from "./sign-in";
import Link from "next/link";
import { SignUp } from "./ui/sign-up";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          {/* You can add a logo or site title here */}
          <Link className="text-2xl font-bold" href="/">
            Todo List
          </Link>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <ModeToggle />
          <Unauthenticated>
            <SignIn />
            <SignUp />
          </Unauthenticated>
          <Authenticated>
            <SignOut />
          </Authenticated>
        </div>
      </div>
    </header>
  );
}

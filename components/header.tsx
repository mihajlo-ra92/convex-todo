"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { ModeToggle } from "./mode-toggle";
import { SignOut } from "./sign-out";
import { SignIn } from "./sign-in";
import Link from "next/link";
import { SignUp } from "./ui/sign-up";
import { ProjectSelector } from "./project-selector";
import { MobileMenu } from "./mobile-menu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex h-14 items-center justify-between">
        <div className="mr-4 flex items-center gap-4">
          {/* You can add a logo or site title here */}
          <Link className="text-2xl font-bold" href="/">
            Tasvex
          </Link>
          <Authenticated>
            <div className="hidden md:block">
              <ProjectSelector />
            </div>
          </Authenticated>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <div className="hidden md:block">
            <Unauthenticated>
              <div className="flex items-center gap-2">
                <SignIn />
                <SignUp />
              </div>
            </Unauthenticated>
            <Authenticated>
              <SignOut />
            </Authenticated>
          </div>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

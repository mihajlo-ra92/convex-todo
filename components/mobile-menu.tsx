"use client";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ProjectSelector } from "./project-selector";
import { Authenticated, Unauthenticated } from "convex/react";
import { SignIn } from "./sign-in";
import { SignUp } from "./ui/sign-up";
import { SignOut } from "./sign-out";
import { MobileModeToggle } from "./mobile-mode-toggle";
import { useState } from "react";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[100vw] px-4 sm:max-w-none">
        <SheetHeader className="pt-3 ml-[-1px]">
          <SheetTitle>Tasvex</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 mt-4 w-full">
          <Authenticated>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Project</span>
                <ProjectSelector />
              </div>
              <div className="flex items-center justify-between mt-2 border-t border-b py-2">
                <span className="text-sm font-medium">Theme</span>
                <MobileModeToggle />
              </div>
              <SignOut className="w-full" />
            </div>
          </Authenticated>
          <Unauthenticated>
            <div className="flex flex-col gap-2 w-full">
              <SignUp className="w-full" afterNavigate={() => setOpen(false)} />
              <SignIn className="w-full" afterNavigate={() => setOpen(false)} />
              <div className="flex items-center justify-between mt-2 border-t border-b py-2">
                <span className="text-sm font-medium">Theme</span>
                <MobileModeToggle />
              </div>
            </div>
          </Unauthenticated>
        </div>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import { ModeToggle } from "./mode-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <div className="flex h-14 items-center justify-between">
        <div className="mr-4 flex">
          {/* You can add a logo or site title here */}
          <h1 className="text-2xl font-bold">Todo List</h1>
        </div>
        <div className="flex items-center justify-end space-x-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}

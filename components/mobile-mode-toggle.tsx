"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Monitor, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function MobileModeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const options = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "system", icon: Monitor, label: "System" },
    { value: "dark", icon: Moon, label: "Dark" },
  ];

  return (
    <div className="flex w-60 rounded-lg bg-muted p-1">
      {options.map(({ value, icon: Icon, label }) => {
        const isSelected = theme === value;
        return (
          <button
            key={value}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-md py-2 text-sm font-medium transition-colors",
              isSelected
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setTheme(value)}
            type="button"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

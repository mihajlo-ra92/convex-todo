"use client";

import { useSearchParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import { Authenticated } from "convex/react";
import { TaskBoard } from "@/components/TaskBoard";

export default function Home() {
  const searchParams = useSearchParams();

  const projectId = searchParams.get("projectId");

  return (
    <main className="min-h-screen bg-background">
      <Authenticated>
        {projectId ? (
          <TaskBoard projectId={projectId as Id<"projects">} />
        ) : (
          <div>No project selected</div>
        )}
      </Authenticated>
    </main>
  );
}

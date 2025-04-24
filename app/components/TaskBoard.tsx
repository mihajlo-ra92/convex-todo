"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import { CreateTask } from "./CreateTask";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Pencil, Trash } from "lucide-react";
import { DeleteTaskDialog } from "@/components/delete-task-dialog";

interface TaskBoardProps {
  projectId: Id<"projects">;
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const groups = useQuery(api.groups.listWithTasks, { projectId });
  const toggle = useMutation(api.tasks.toggle);

  if (groups === undefined) {
    // TODO: Implement skeleton loading
    return <div>Loading...</div>;
  }

  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex w-max space-x-4 p-4">
        {groups.map((group) => (
          <Card key={group._id} className="w-[350px] shrink-0">
            <div className="p-4">
              <h3 className="font-semibold tracking-tight">{group.name}</h3>
              {group.description && (
                <p className="text-sm text-muted-foreground">
                  {group.description}
                </p>
              )}
              <div className="mt-4 space-y-3">
                {group.tasks.map((task) => (
                  <div
                    key={task._id}
                    className={cn(
                      "rounded-lg border p-3 flex items-center gap-3",
                      task.isCompleted ? "bg-muted" : "bg-card"
                    )}
                  >
                    <Checkbox
                      checked={task.isCompleted}
                      className="h-5 w-5"
                      onCheckedChange={() => toggle({ id: task._id })}
                    />
                    <p
                      className={cn(
                        "text-sm flex-1",
                        task.isCompleted && "text-muted-foreground line-through"
                      )}
                    >
                      {task.text}
                    </p>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <MoreVertical className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DeleteTaskDialog
                          id={task._id}
                          trigger={
                            <DropdownMenuItem
                              onSelect={(e) => e.preventDefault()}
                              className="text-destructive focus:text-destructive hover:text-destructive"
                            >
                              <Trash className="mr-2 h-4 w-4 text-destructive" />
                              Delete
                            </DropdownMenuItem>
                          }
                        />
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
                <CreateTask groupId={group._id} />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

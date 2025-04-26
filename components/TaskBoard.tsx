"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Trash, Plus } from "lucide-react";
import { DeleteTaskDialog } from "@/components/delete-task-dialog";
import { CreateTask } from "./CreateTask";
import { CreateGroupDialog } from "./CreateGroupDialog";
import React from "react";
import { DeleteGroupDialog } from "@/components/delete-group-dialog";

interface TaskBoardProps {
  projectId: Id<"projects">;
}

export function TaskBoard({ projectId }: TaskBoardProps) {
  const groups = useQuery(api.groups.listWithTasks, { projectId });
  const toggle = useMutation(api.tasks.toggle);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  if (groups === undefined) {
    // TODO: Implement skeleton loading
    return <div>Loading...</div>;
  }

  // If no groups, center the button
  if (groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <CreateGroupDialog
          projectId={projectId}
          open={dialogOpen}
          setOpen={setDialogOpen}
          triggerButton={
            <Button
              size="icon"
              className="rounded-full h-12 w-12 flex items-center justify-center p-0 overflow-visible"
              variant="default"
            >
              <Plus className="h-12 w-12 scale-150 -m-2" />
              <span className="sr-only">Create Group</span>
            </Button>
          }
        />
        <p className="mt-4 text-muted-foreground">
          No groups yet. Create your first group!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-2 relative">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex w-max space-x-4 p-4 pt-0">
          {groups.map((group) => (
            <Card key={group._id} className="w-[280px] sm:w-[350px] shrink-0">
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold tracking-tight break-words">
                      {group.name}
                    </h3>
                    {group.description && (
                      <p className="text-sm text-muted-foreground break-words">
                        {group.description}
                      </p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer border-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Open group menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DeleteGroupDialog
                        groupId={group._id}
                        trigger={
                          <DropdownMenuItem
                            onSelect={(e) => e.preventDefault()}
                            className="text-destructive focus:text-destructive hover:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4 text-destructive" />
                            Delete Group
                          </DropdownMenuItem>
                        }
                      />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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
                        className="h-5 w-5 shrink-0"
                        onCheckedChange={() => toggle({ id: task._id })}
                      />
                      <p
                        className={cn(
                          "text-sm flex-1 break-words",
                          task.isCompleted &&
                            "text-muted-foreground line-through"
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
                          {/* TODO: Implement edit */}
                          {/* <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem> */}
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
      {/* Floating circular button at bottom right */}
      <div className="fixed bottom-8 right-8 z-50">
        <CreateGroupDialog
          projectId={projectId}
          open={dialogOpen}
          setOpen={setDialogOpen}
          triggerButton={
            <Button
              size="icon"
              className="rounded-full h-12 w-12 flex items-center justify-center p-0 overflow-visible"
              variant="default"
            >
              <Plus className="h-12 w-12 scale-150 -m-2" />
              <span className="sr-only">Create Group</span>
            </Button>
          }
        />
      </div>
    </div>
  );
}

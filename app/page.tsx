"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { cn } from "./lib/utils";
import { useState } from "react";
import { Id } from "../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

export default function Home() {
  const tasks = useQuery(api.tasks.get);
  const toggleTask = useMutation(api.tasks.toggle);
  const createTask = useMutation(api.tasks.create);
  const deleteTask = useMutation(api.tasks.remove);
  const [newTaskText, setNewTaskText] = useState("");
  const [taskToDelete, setTaskToDelete] = useState<{
    id: Id<"tasks">;
    text: string;
  } | null>(null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim() === "") return;
    void createTask({ text: newTaskText });
    setNewTaskText("");
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="mb-8 text-2xl font-semibold tracking-tight">Tasks</h1>

          <form onSubmit={handleCreateTask} className="mb-8 flex gap-2">
            <Input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1"
            />
            <Button type="submit">Add</Button>
          </form>

          <div className="space-y-3">
            {tasks?.map((task) => (
              <div
                key={task._id}
                className={cn(
                  "flex items-center gap-4 rounded-lg border p-3 transition-colors",
                  task.isCompleted ? "bg-muted" : "bg-card hover:bg-accent/5"
                )}
              >
                <Checkbox
                  id={task._id}
                  checked={task.isCompleted}
                  onCheckedChange={() => toggleTask({ id: task._id })}
                  className="h-5 w-5"
                />
                <label
                  htmlFor={task._id}
                  className={cn(
                    "flex-1 cursor-pointer text-sm font-medium",
                    task.isCompleted && "text-muted-foreground line-through"
                  )}
                >
                  {task.text}
                </label>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setTaskToDelete({ id: task._id, text: task.text })
                  }
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}

            {tasks?.length === 0 && (
              <p className="text-center text-sm text-muted-foreground">
                No tasks yet. Add one above!
              </p>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={taskToDelete !== null}
        onOpenChange={() => setTaskToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{taskToDelete?.text}
              &rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setTaskToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (taskToDelete) {
                  deleteTask({ id: taskToDelete.id });
                }
                setTaskToDelete(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

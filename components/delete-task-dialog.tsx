"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

interface DeleteTaskDialogProps {
  id: Id<"tasks">;
  trigger: React.ReactNode;
}

export function DeleteTaskDialog({ id, trigger }: DeleteTaskDialogProps) {
  const [open, setOpen] = React.useState(false);
  const remove = useMutation(api.tasks.remove);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await remove({ id });
      setOpen(false);
      toast.success("Task deleted successfully.");
    } catch (err) {
      console.error("Failed to delete task:", err);
      toast.error("Failed to delete task.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

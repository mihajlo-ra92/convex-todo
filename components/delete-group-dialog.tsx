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

interface DeleteGroupDialogProps {
  groupId: Id<"groups">;
  trigger: React.ReactNode;
}

export function DeleteGroupDialog({
  groupId,
  trigger,
}: DeleteGroupDialogProps) {
  const [open, setOpen] = React.useState(false);
  const remove = useMutation(api.groups.remove);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await remove({ groupId });
      setOpen(false);
      toast.success("Group deleted successfully.");
    } catch (err) {
      console.error("Failed to delete group:", err);
      toast.error("Failed to delete group.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Delete Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this group? All tasks in this
              group will also be deleted. This action cannot be undone.
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

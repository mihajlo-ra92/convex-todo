"use client";

import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";

interface CreateTaskProps {
  groupId: Id<"groups">;
}

export function CreateTask({ groupId }: CreateTaskProps) {
  const create = useMutation(api.tasks.create);
  const form = useForm({
    defaultValues: {
      text: "",
    },
  });

  const onSubmit = async (data: { text: string }) => {
    await create({ text: data.text, groupId });
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="Add a task..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Add</Button>
      </form>
    </Form>
  );
}

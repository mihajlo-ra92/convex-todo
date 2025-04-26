import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

interface ProjectSettingsDialogProps {
  project: {
    _id: string;
    name: string;
    description?: string;
  };
  children: React.ReactNode;
}

export function ProjectSettingsDialog({
  project,
  children,
}: ProjectSettingsDialogProps) {
  const members = useQuery(api.projects.getMembers, {
    projectId: project._id as Id<"projects">,
  });
  const owner = members?.find((member) => member.role === "owner")?.user;
  const user = useQuery(api.auth.getUser);
  const addMember = useMutation(api.projects.addMember);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await addMember({
        projectId: project._id as Id<"projects">,
        email: values.email,
      });
      form.reset();
      toast.success("Member added successfully");
    } catch (error) {
      toast.error("Failed to add member");
      console.error(error);
    }
  }

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Project Settings</DialogTitle>
          <DialogDescription>
            Manage settings for{" "}
            <span className="font-semibold">{project.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="block mb-1">Name</Label>
            <Input value={project.name} readOnly className="bg-muted/50" />
          </div>
          <div>
            <Label className="block mb-1">Description</Label>
            <Input
              value={project.description || ""}
              readOnly
              className="bg-muted/50"
            />
          </div>
        </div>
        <Separator className="my-4" />
        <div>
          <Label className="mb-2 block">Members</Label>
          <div className="flex flex-wrap gap-3 mb-3">
            {members &&
              members.map((member) => (
                <div key={member._id} className="flex items-center gap-2">
                  <Avatar>
                    <span className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center">
                      {member?.user?.email?.[0] || "?"}
                    </span>
                  </Avatar>
                  <span className="text-sm">
                    {member?.user?.email || "Loading..."}
                  </span>
                </div>
              ))}
          </div>
          {owner?._id === user?._id && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex gap-2"
              >
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="space-y-0">
                        <FormControl>
                          <Input placeholder="Add member by email" {...field} />
                        </FormControl>
                        <div className="min-h-[20px]">
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  variant="secondary"
                  size="icon"
                  aria-label="Add member"
                >
                  <UserPlus className="h-5 w-5" />
                </Button>
              </form>
            </Form>
          )}
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

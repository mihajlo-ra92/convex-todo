"use client";

import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CreateProjectDialog } from "./create-project-dialog";

export function ProjectSelector() {
  const projects = useQuery(api.projects.list);
  const [selectedProject, setSelectedProject] = React.useState<{
    _id: string;
    name: string;
  } | null>(null);

  // Set the first project as selected when projects load
  React.useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject) {
      const firstProject = projects.find((p) => p !== null);
      if (firstProject) {
        setSelectedProject(firstProject);
      }
    }
  }, [projects, selectedProject]);

  if (!projects) {
    return (
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="w-[200px] justify-between"
          disabled
        >
          Loading projects...
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
        <CreateProjectDialog />
      </div>
    );
  }

  const validProjects = projects.filter(
    (p): p is NonNullable<typeof p> => p !== null
  );

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedProject?.name ?? "Select a project"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]">
          <DropdownMenuLabel>Projects</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {validProjects.map((project) => (
            <DropdownMenuItem
              key={project._id}
              onClick={() => setSelectedProject(project)}
            >
              {project.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <CreateProjectDialog />
    </div>
  );
}

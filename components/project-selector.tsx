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
import { useRouter, useSearchParams } from "next/navigation";

export function ProjectSelector() {
  const projects = useQuery(api.projects.list);
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [selectedProject, setSelectedProject] = React.useState<{
    _id: string;
    name: string;
  } | null>(null);

  // Update URL when selected project changes
  const updateProjectInUrl = React.useCallback(
    (project: { _id: string; name: string } | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));

      if (project) {
        current.set("projectId", project._id);
      } else {
        current.delete("projectId");
      }

      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.push(`${window.location.pathname}${query}`);
    },
    [router, searchParams]
  );

  // Set selected project based on URL param
  React.useEffect(() => {
    if (projects && projectId) {
      const project = projects.find((p) => p?._id === projectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projects, projectId]);

  // Set the first project as selected when projects load and no project is selected
  React.useEffect(() => {
    if (projects && projects.length > 0 && !selectedProject && !projectId) {
      const firstProject = projects.find((p) => p !== null);
      if (firstProject) {
        setSelectedProject(firstProject);
        updateProjectInUrl(firstProject);
      }
    }
  }, [projects, selectedProject, projectId, updateProjectInUrl]);

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
              onClick={() => {
                setSelectedProject(project);
                updateProjectInUrl(project);
              }}
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

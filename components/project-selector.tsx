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

// Dummy data for projects
const dummyProjects = [
  { id: "1", name: "Personal Tasks" },
  { id: "2", name: "Work Project" },
  { id: "3", name: "Shopping List" },
  { id: "4", name: "Vacation Planning" },
];

export function ProjectSelector() {
  const [selectedProject, setSelectedProject] = React.useState(
    dummyProjects[0]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {selectedProject.name}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dummyProjects.map((project) => (
          <DropdownMenuItem
            key={project.id}
            onClick={() => setSelectedProject(project)}
          >
            {project.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

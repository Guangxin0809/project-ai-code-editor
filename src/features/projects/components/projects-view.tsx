"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { SparkleIcon } from "lucide-react";
import { Poppins } from "next/font/google";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator
} from "unique-names-generator";

import { cn } from "@/lib/utils";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";

import { ProjectsList } from "./projects-list";
import { useCreateProject } from "../hooks/use-projects";
import { ProjectsCommandDialog } from "./projects-command-dialog";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const ProjectsView = () => {

  const createProject = useCreateProject();
  const [commandDialogOpen, setCommandDialogOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "k") {
          e.preventDefault();
          setCommandDialogOpen(true);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    }
  }, []);

  const handleCreateProject = () => {
    const projectName = uniqueNamesGenerator({
      dictionaries: [adjectives, colors, animals],
      separator: "-",
      length: 3,
    });

    createProject({ name: projectName });
  }

  return (
    <>
      <ProjectsCommandDialog
        open={commandDialogOpen}
        onOpenChange={setCommandDialogOpen}
      />

      <div className="flex flex-col justify-center items-center min-h-screen p-6 md:p-16 bg-sidebar">
        <div className="flex flex-col gap-y-4 w-full max-w-sm mx-auto">
          {/* Logo */}
          <div className="flex justify-between items-center gap-x-4 w-full">
            <div className="flex items-center gap-x-2 w-full group/logo">
              <Image
                src="/logo.svg"
                alt="Polaris"
                width={32}
                height={32}
                className="size-8 md:size-11.5"
              />

              <h1 className={cn("font-semibold text-4xl md:text-5xl", fontPoppins.className)}>
                Polaris
              </h1>
            </div>
          </div>

          {/* Action buttons & projects list */}
          <div className="flex flex-col gap-y-4 w-full">
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={handleCreateProject}
                className="flex flex-col justify-start items-start gap-y-6 h-full p-4 border rounded-none bg-background"
              >
                <div className="flex justify-between items-center w-full">
                  <SparkleIcon size={16} />

                  <Kbd className="border bg-accent">
                    ⌘J
                  </Kbd>
                </div>

                <div>
                  <span className="text-sm">
                    New
                  </span>
                </div>
              </Button>

              <Button
                variant="outline"
                onClick={() => {}}
                className="flex flex-col justify-start items-start gap-y-6 h-full p-4 border rounded-none bg-background"
              >
                <div className="flex justify-between items-center w-full">
                  <FaGithub size={16} />

                  <Kbd className="border bg-accent">
                    ⌘I
                  </Kbd>
                </div>

                <div>
                  <span className="text-sm">
                    Import
                  </span>
                </div>
              </Button>
            </div>

            <ProjectsList onViewAll={() => setCommandDialogOpen(true)} />
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { Poppins } from "next/font/google";
import { CloudCheckIcon, LoaderIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/utils/date-time";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";

import { Id } from "../../../../convex/_generated/dataModel";
import { useProject, useRenameProject } from "../hooks/use-projects";

const fontPoppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

export const Navbar = ({ projectId }: { projectId: Id<"projects"> }) => {

  const project = useProject(projectId);
  const renameProject = useRenameProject();

  const [name, setName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);

  const handleStartRename = () => {
    if (!project) return;

    setName(project.name);
    setIsRenaming(true);
  }

  const handleSubmit = () => {
    if (!project) return;
    setIsRenaming(false);

    const trimmedName = name.trim();
    if (!trimmedName || (trimmedName === project.name)) return;

    renameProject({
      id: projectId,
      newName: trimmedName,
    });
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      setIsRenaming(false);
    }
  }

  return (
    <nav className="flex justify-between items-center gap-x-2 p-2 border-b bg-sidebar">
      <div className="flex items-center gap-x-2">
        <Breadcrumb>
          <BreadcrumbList className="gap-0!">
            <BreadcrumbItem>
              <BreadcrumbLink
                className="flex items-center gap-x-1.5"
                asChild
              >
                <Button
                  variant="ghost"
                  className="w-fit! h-7! p-1.5!"
                  asChild
                >
                  <Link href="/">
                    <Image
                      src="/logo.svg"
                      alt="Logo"
                      width={20}
                      height={20}
                    />

                    <span className={cn("font-medium text-sm", fontPoppins.className)}>
                      Polaris
                    </span>
                  </Link>
                </Button>
              </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator className="ml-0! mr-1" />

            <BreadcrumbItem>
              {!isRenaming && (
                <BreadcrumbPage
                  onClick={handleStartRename}
                  className="max-w-40 font-medium text-sm hover:text-primary truncate cursor-pointer"
                >
                  {project?.name ?? "Loading..."}
                </BreadcrumbPage>
              )}

              {isRenaming && (
                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={(e) => e.currentTarget.select()}
                  onBlur={handleSubmit}
                  onKeyDown={handleKeyDown}
                  className="max-w-40 bg-transparent font-medium text-sm text-foreground truncate ourline-none focus:ring-1 focus:ring-inset focus:ring-ring"
                />
              )}
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {(project?.importStatus !== "importing") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <CloudCheckIcon className="size-4 text-muted-foreground" />
            </TooltipTrigger>

            <TooltipContent>
              Saved{" "}
              {project?.updatedAt ? formatTimestamp(project.updatedAt) : "Loading..."}
            </TooltipContent>
          </Tooltip>
        )}

        {(project?.importStatus === "importing") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <LoaderIcon className="size-4 text-muted-foreground animate-spin" />
            </TooltipTrigger>

            <TooltipContent>Importing...</TooltipContent>
          </Tooltip>
        )}
      </div>

      <div className="flex items-center gap-x-2">
        <UserButton />
      </div>
    </nav>
  );
}
"use client";

import z from "zod";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";

import { useProject } from "../hooks/use-projects";
import { Id } from "../../../../convex/_generated/dataModel";

const formSchema = z.object({
  repoName: z
    .string()
    .min(1, "Repository name is required")
    .max(100, "Repository name is too long")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Only alphanumeric characters, hyphens, underscores, and dots are allowed"
    ),
  visibility: z.enum(["public", "private"]),
  description: z
    .string()
    .max(350, "Description is too long"),
});

export const ExportPopover = ({ projectId }: { projectId: Id<"projects"> }) => {

  const project = useProject(projectId);
  const { openUserProfile } = useClerk();
  const [open, setOPen] = useState(false);

  const ecportStatus = project?.exportStatus;
  const exportRepoUrl = project?.exportRepoUrl;


  return (
    <div>ExportPopover</div>
  );
}

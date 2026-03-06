import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

type Props = {
  internalKey: string;
  projectId: Id<"projects">;
}

const paramsSchema = z.object({
  parentId: z.string(),
  files: z
    .array(
      z.object({
        name: z.string().min(1, "File name cannot be empty"),
        content: z.string(),
      })
    )
    .min(1, "Provide at least one file to cerate"),
});

export const createCreateFilesTool = ({ internalKey, projectId }: Props) => {

  return createTool({
    name: "createFiles",
    description: "Create multiple files at once in the same folder. Use this to batch create files that share the same parent folder. More efficient than creating files one by one.",
    parameters: z.object({
      parentId: z
        .string()
        .describe("The ID of the parent folder. Use empty string for root level. Must be a valid folder ID from listFiles."),
      files: z
        .array(
          z.object({
            name: z.string().describe("The file name including extension"),
            content: z.string().describe("The file content"),
          })
        )
        .describe("Array of files to create")
    }),
    handler: async (params, { step: toolStep }) => {
      const parsedParams = paramsSchema.safeParse(params);
      if (!parsedParams.success) {
        return `Error: ${parsedParams.error.issues[0].message}`;
      }

      const { parentId, files } = parsedParams.data;

      try {
        return await toolStep?.run("create-files", async () => {
          let resolvedParentId: Id<"files"> | undefined;

          if (parentId && parentId !== "") {
            try {
              resolvedParentId = parentId as Id<"files">;

              const parentFolder = await convex.query(
                api.system.getFileById,
                {
                  internalKey,
                  fileId: resolvedParentId,
                },
              );

              if (!parentFolder) {
                return `Error: Parent folder with ID "${parentId}" not found. Use listFiles to get valid folder IDs.`;
              }
              if (parentFolder.type !== "folder") {
                return `Error: The ID "${parentId}" is a file, not a folder. Use a folder ID as parentId.`;
              }
            } catch {
              return `Error: Invalid parentId "${parentId}". Use listFiles to get valid folder IDs, or use empty string for root level.`;
            }
          }

          const results = await convex.mutation(
            api.system.createFiles,
            {
              internalKey,
              projectId,
              parentId: resolvedParentId,
              files,
            },
          );

          const created = results.filter(r => !r.error);
          const failed = results.filter(r => r.error);

          let response = `Created ${created.length} file(s)`;
          if (created.length > 0) {
            response += `: ${created.map(c => c.name).join(", ")}`;
          }
          if (failed.length > 0) {
            response += `. Failed: ${failed.map(f => `${f.name} (${f.error})`).join(", ")}`;
          }

          return response;
        });
      } catch (error) {
        return `Error creating files: ${error instanceof Error ? error.message : "Unknown error"}`;
      }

    },
  });

}
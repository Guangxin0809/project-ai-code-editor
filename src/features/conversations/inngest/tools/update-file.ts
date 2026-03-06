import { z } from "zod";
import { createTool } from "@inngest/agent-kit";

import { convex } from "@/lib/convex-client";

import { api } from "../../../../../convex/_generated/api";
import { Id } from "../../../../../convex/_generated/dataModel";

type Props = {
  internalKey: string;
}

const paramsSchema = z.object({
  fileId: z.string().min(1, "File ID is required"),
  content: z.string(),
});

export const createUpdateFileTool = ({ internalKey }: Props) => {

  return createTool({
    name: "updateFile",
    description: "Update the content of an axisting file.",
    parameters: z.object({
      fileId: z.string().describe("The ID of the file to update"),
      content: z.string().describe("The new content for the file"),
    }),
    handler: async (params, { step: toolStep }) => {
      const parsedParams = paramsSchema.safeParse(params);
      if (!parsedParams.success) {
        return `Error: ${parsedParams.error.issues[0].message}`;
      }

      const { fileId, content } = parsedParams.data;

      // Validate file exists before running the step
      const file = await convex.query(
        api.system.getFileById,
        {
          internalKey,
          fileId: fileId as Id<"files">,
        },
      );

      if (!file) {
        return `Error: File with ID "${fileId}" not found. Use listFiles to get valid file IDs.`;
      }
      if (file.type === "folder") {
        return `Error: "${fileId}" is a folder, not a file. You can pnly update file contents.`;
      }

      try {
        return await toolStep?.run("update-file", async () => {
          await convex.mutation(
            api.system.updateFile,
            {
              internalKey,
              fileId: fileId as Id<"files">,
              content,
            },
          );

          return `File "${file.name}" updated successfully`
        });
      } catch (error) {
        return `Error updating file: ${error instanceof Error ? error.message : "Unknown error"}`;
      }

    },
  });

}
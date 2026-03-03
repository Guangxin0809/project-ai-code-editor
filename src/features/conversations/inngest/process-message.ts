import { NonRetriableError } from "inngest";

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";

import { api } from "../../../../convex/_generated/api";
import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { Id } from "../../../../convex/_generated/dataModel";
import { CODING_AGENT_SYSTEM_PROMPT, TITLE_GENERATOR_SYSTEM_PROMPT } from "./constants";

interface MessageEvent {
  messageId: Id<"messages">;
  conversationId: Id<"conversations">;
  projectId: Id<"projects">;
  message: string;
}

export const processmessage = inngest.createFunction(
  {
    id: "process-message",
    cancelOn: [
      {
        event: "message/cancel",
        if: "event.data.messageId == async.data.messageId",
      },
    ],
    onFailure: async ({ event, step }) => {
      const { messageId } = event.data.event.data as MessageEvent;
      const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;

      // Update the message with error content
      if (internalKey) {
        await step.run("update-message-on-failure", async () => {
          await convex.mutation(
            api.system.updateMessageContent,
            {
              internalKey,
              messageId,
              content: "My apologies, I encountered an error while processing your request. Let me know if you need anything else!",
            },
          );
        });
      }
    },
  },
  {
    event: "message/sent",
  },
  async ({ event, step }) => {

    const {
      messageId,
      conversationId,
      projectId,
      message
    } = event.data as MessageEvent;

    // TODO: change it back
    // const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
    const internalKey = "guangxin-ai-code-editor-19980809";

    if (!internalKey) {
      throw new NonRetriableError("POLARIS_CONVEX_INTERNAL_KEY is not configured");
    }

    // TODO: Check if this is needed
    await step.sleep("wait-for-db-sync", "1s");

    // Get conversation for title generation check
    // const conversation = await step.run("get-conversation", async () => {
    //   return await convex.query(
    //     api.system.getConversationById,
    //     {
    //       internalKey,
    //       conversationId
    //     },
    //   );
    // });

    // if (!conversation) {
    //   throw new NonRetriableError("Conversation not found");
    // }

    // Fetch recent messages for conversation context
    // const recentMessages = await step.run("get-recent-messages", async () => {
    //   return await convex.query(
    //     api.system.getRecentMessages,
    //     {
    //       internalKey,
    //       conversationId,
    //       limit: 10,
    //     },
    //   );
    // });

    // Build system prompt with conversation history (exclude the current processing message)
    // let systemPrompt = CODING_AGENT_SYSTEM_PROMPT;

    // Filter out the current processing message and empty messages
    // const contextMessages = recentMessages.filter(
    //   msg => (msg._id !== messageId) && (msg.content.trim() !== "")
    // );

    // if (contextMessages.length > 0) {
    //   const historyText = contextMessages
    //     .map(msg => `${msg.role.toUpperCase()}: ${msg.content}`)
    //     .join("\n\n");

    //   systemPrompt += `\n\n## Previous Conversation (for context only - do NOT repeat these responses):\n${historyText}\n\n## Current Request:\nRespond ONLY to the user's new message below. Do not repeat or reference your previous responses.`;
    // }

    // Generate conversation title if it's still the default
    // const shouldGenerateTitle =
    //   conversation.title === DEFAULT_CONVERSATION_TITLE;

    // if (shouldGenerateTitle) {
    //   const titleAgent = createAgent({
    //     name: "title-generator",
    //     system: TITLE_GENERATOR_SYSTEM_PROMPT,
    //     model: anthropic({
    //       model: "claude-3-5-haiku-20241022",
    //       defaultParameters: { temperature: 0, max_tokens: 50 },
    //     }),
    //   });

    //   const { output } = await titleAgent.run(message, { step });
    //   const textMessage = output.find(
    //     msg => (msg.type === "text") && (msg.role === "assistant")
    //   );

    //   if (textMessage?.type === "text") {
    //     const title =
    //       typeof textMessage.content === "string"
    //         ? textMessage.content.trim()
    //         : textMessage.content
    //             .map(c => c.text)
    //             .join("")
    //             .trim();

    //     if (title) {
    //       await step.run("update-conversation-title", async () => {
    //         await convex.mutation(
    //           api.system.updateConversationTitle,
    //           {
    //             internalKey,
    //             conversationId,
    //             title,
    //           },
    //         );
    //       });
    //     }
    //   }
    // }

    // Create the coding agent with file tools
    // Create network with single agent
    // Run the agent
    // Extract the assiatnt's text response from the last agent result


    await step.run("update-assistant-message", async () => {
      await convex.mutation(
        api.system.updateMessageContent,
        {
          internalKey,
          messageId,
          content: "AI processed this message (TODO)",
        },
      );
    });
  },
);
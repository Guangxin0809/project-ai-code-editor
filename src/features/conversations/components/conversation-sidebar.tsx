"use client";

import ky from "ky";
import { toast } from "sonner";
import { useState } from "react";
import {
  CopyIcon,
  HistoryIcon,
  LoaderIcon,
  PlusIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
  MessageResponse
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";

import { DEFAULT_CONVERSATION_TITLE } from "../constants";
import { Id } from "../../../../convex/_generated/dataModel";
import { PastConversationDialog } from "./past-conversation-dialog";
import {
  useConversation,
  useConversations,
  useCreateConversation,
  useMessages
} from "../hooks/use-conversations";

export const ConversationSidebar = ({ projectId }: { projectId: Id<"projects"> }) => {

  const [input, setInput] = useState("");
  const [
    pastConversationDialogOpen,
    setPastConversationDialogOpen
  ] = useState(false);
  const [
    selectedConversationId,
    setSelectedConversationId
  ] = useState<Id<"conversations"> | null>(null);

  const conversations = useConversations(projectId);
  const createConversation = useCreateConversation();

  const activeConversationId =
    selectedConversationId ?? conversations?.[0]?._id ?? null;

  const activeConversation = useConversation(activeConversationId);
  const conversationMessages = useMessages(activeConversationId);

  // Check if any message is currently processing
  const isProcessing = conversationMessages?.some(
    message => message.status === "processing"
  );

  const handleCreateConversation = async () => {
    try {
      const newConversationId = await createConversation({
        projectId,
        title: DEFAULT_CONVERSATION_TITLE,
      });

      setSelectedConversationId(newConversationId);
      return newConversationId;
    } catch {
      toast.error("Unable to create new conversation");
      return null;
    }
  }

  const handleSubmit = async (message: PromptInputMessage) => {
    // If processing and no new message, this is just a stop function
    if (isProcessing && !message.text) {
      await handleCancel();
      setInput("");
      return;
    }

    let conversationId = activeConversationId;

    if (!conversationId) {
      conversationId = await handleCreateConversation();
      if (!conversationId) return;
    }

    // Trigger Inngest function via API
    try {
      await ky.post("/api/messages", {
        json: {
          conversationId,
          message: message.text,
        },
      });
    } catch {
      toast.error("Message failed to send");
    }

    setInput("");
  }

  const handleCancel = async () => {
    try {
      await ky.post("/api/messages/cancel", {
        json: { projectId }
      });
    } catch {
      toast.error("Unable to cancel request");
    }
  }

  return (
    <>
      <PastConversationDialog
        projectId={projectId}
        open={pastConversationDialogOpen}
        onOpenChange={setPastConversationDialogOpen}
        onSelect={setSelectedConversationId}
      />

      <div className="flex flex-col h-full bg-sidebar">
        {/* Top bar */}
        <div className="flex justify-between items-center h-8.75 border-b">
          <div className="pl-3 text-sm truncate">
            {activeConversation?.title ?? DEFAULT_CONVERSATION_TITLE}
          </div>

          <div className="flex items-center gap-x-1 px-1">
            <Button
              size="icon-xs"
              variant="highlight"
              onClick={() => setPastConversationDialogOpen(true)}
            >
              <HistoryIcon size={14} />
            </Button>

            <Button
              size="icon-xs"
              variant="highlight"
              onClick={handleCreateConversation}
            >
              <PlusIcon size={14} />
            </Button>
          </div>
        </div>

        {/* Conversation meesages */}
        <Conversation className="flex-1">
          <ConversationContent>
            {conversationMessages?.map((message, messageIndex) => (
              <Message
                key={message._id}
                from={message.role}
              >
                <MessageContent>
                  {(message.status === "processing") ? (
                    <div className="flex items-center gap-x-2 text-muted-foreground">
                      <LoaderIcon className="size-4 animate-spin" />
                      <span>Thinking...</span>
                    </div>
                  ) : (message.status === "cancelled") ? (
                    <span className="italic text-muted-foreground">
                      Request cancelled
                    </span>
                  ) : (
                    <MessageResponse>{message.content}</MessageResponse>
                  )}
                </MessageContent>

                {
                  (message.role === "assistant")
                    && (message.status === "completed")
                    && (messageIndex === (conversationMessages?.length ?? 0) - 1)
                    && (
                      <MessageActions>
                        <MessageAction
                          label="Copy"
                          onClick={() => navigator.clipboard.writeText(message.content)}
                        >
                          <CopyIcon size={12} />
                        </MessageAction>
                      </MessageActions>
                    )
                }
              </Message>
            ))}
          </ConversationContent>

          <ConversationScrollButton />
        </Conversation>

        {/* Prompt input */}
        <div className="p-3">
          <PromptInput className="mt-2" onSubmit={handleSubmit}>
            <PromptInputBody>
              <PromptInputTextarea
                value={input}
                disabled={isProcessing}
                placeholder="Ask Polaris anything..."
                onChange={e => setInput(e.target.value)}
              />
            </PromptInputBody>

            <PromptInputFooter>
              <PromptInputTools />
              <PromptInputSubmit
                disabled={isProcessing ? false : !input}
                status={isProcessing ? "streaming" : undefined}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </>
  );
}
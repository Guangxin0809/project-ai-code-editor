"use client";

import { useState } from "react";
import { Allotment } from "allotment";
import {
  AlertTriangleIcon,
  Loader2Icon,
  RefreshCwIcon,
  TerminalSquareIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWebContainer } from "@/features/preview/hooks/use-webcontainer";
import { PreviewTerminal } from "@/features/preview/components/preview-terminal";
import { PreviewSettingsPopover } from "@/features/preview/components/preview-settings-popover";

import { useProject } from "../hooks/use-projects";
import { Id } from "../../../../convex/_generated/dataModel";

export const PreviewView = ({ projectId }: { projectId: Id<"projects"> }) => {

  const project = useProject(projectId);
  const [showTerminal, setShowTerminal] = useState(false);

  const {
    status, previewUrl, error, restart, terminalOutput
  } = useWebContainer({
    projectId,
    enabled: true,
    settings: project?.settings,
  });

  const isLoading = (status === "booting") || (status === "installing");

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex items-center shrink-0 h-8.75 border-b bg-sidebar">
        <Button
          size="sm"
          variant="ghost"
          title="Restart contaienr"
          disabled={isLoading}
          onClick={restart}
          className="h-full rounded-none"
        >
          <RefreshCwIcon size={12} />
        </Button>

        <div className="flex-1 flex items-center h-full p-3 border-x bg-background truncate font-mono text-xs text-muted-foreground">
          {isLoading && (
            <div className="flex items-center gap-x-1.5">
              <Loader2Icon className="size-3 animate-spin" />
              {(status === "booting") ? "Starting..." : "Installing..."}
            </div>
          )}

          {previewUrl && <span className="truncate">{previewUrl}</span>}
          {!isLoading && !previewUrl && !error && <span>Ready to preview</span>}
        </div>

        <Button
          size="sm"
          variant="ghost"
          title="Toggle terminal"
          className="h-full rounded-none"
          onClick={() => setShowTerminal(prev => !prev)}
        >
          <TerminalSquareIcon size={12} />
        </Button>

        <PreviewSettingsPopover
          projectId={projectId}
          initialValues={project?.settings}
          onSave={restart}
        />
      </div>

      <div className="flex-1 min-h-0">
        <Allotment vertical>
          <Allotment.Pane>
            {error && (
              <div className="flex justify-center items-center size-full text-muted-foreground">
                <div className="flex flex-col items-center gap-y-2 max-w-md mx-auto text-center">
                  <AlertTriangleIcon size={24} />
                  <p className="font-medium text-sm">{error}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={restart}
                  >
                    <RefreshCwIcon size={16} />
                  </Button>
                </div>
              </div>
            )}

            {isLoading && !error && (
              <div className="flex justify-center items-center size-full text-muted-foreground">
                <div className="flex flex-col items-center gap-y-2 max-w-md mx-auto text-muted-foreground">
                  <Loader2Icon className="size-6 animate-spin" />
                  <p className="font-medium text-sm">Installing...</p>
                </div>
              </div>
            )}

            {previewUrl && (
              <iframe
                src={previewUrl}
                title="Preview"
                className="size-full border-0"
              />
            )}
          </Allotment.Pane>

          {showTerminal && (
            <Allotment.Pane
              minSize={100}
              maxSize={500}
              preferredSize={200}
            >
              <div className="flex flex-col h-full border-t bg-background">
                <div className="flex items-center gap-x-0.5 shrink-0 h-7 px-3 border-b border-border text-xs text-muted-foreground">
                  <TerminalSquareIcon size={12} />
                  Terminal
                </div>

                <PreviewTerminal output={terminalOutput} />
              </div>
            </Allotment.Pane>
          )}
        </Allotment>
      </div>
    </div>
  );
}

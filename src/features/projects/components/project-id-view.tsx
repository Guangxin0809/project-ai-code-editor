"use client";

import { useState } from "react";
import { Allotment } from "allotment";

import { cn } from "@/lib/utils";
import { EditorView } from "@/features/editor/components/editor-view";

import { FileExplorer } from "./file-explorer";
import { Id } from "../../../../convex/_generated/dataModel";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_SIDEBAR_WIDTH = 350;
const DEFAULT_MAIN_SIZE = 1000;

export const ProjectIdView = ({ projectId }: { projectId: Id<"projects"> }) => {

  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");

  return (
    <div className="flex flex-col h-full">
      <nav className="flex items-center h-8.75 border-b bg-sidebar">
        <Tab
          label="Code"
          isActive={activeView === "editor"}
          onClick={() => setActiveView("editor")}
        />

        <Tab
          label="Preview"
          isActive={activeView === "preview"}
          onClick={() => setActiveView("preview")}
        />

        <div className="flex-1 flex justify-end h-full">
          export popover
        </div>
      </nav>

      <div className="flex-1 relative">
        {/* Editor view */}
        <div className={cn(
          "absolute inset-0",
          activeView === "editor" ? "visible" : "invisible"
        )}>
          <Allotment defaultSizes={[
            DEFAULT_SIDEBAR_WIDTH,
            DEFAULT_MAIN_SIZE
          ]}>
            <Allotment.Pane
              snap
              minSize={MIN_SIDEBAR_WIDTH}
              maxSize={MAX_SIDEBAR_WIDTH}
              preferredSize={DEFAULT_SIDEBAR_WIDTH}
            >
              <FileExplorer projectId={projectId} />
            </Allotment.Pane>

            <Allotment.Pane>
              <EditorView projectId={projectId} />
            </Allotment.Pane>
          </Allotment>
        </div>

        {/* Preview view */}
        <div className={cn(
          "absolute inset-0",
          activeView === "preview" ? "visible" : "invisible"
        )}>
          preview view
        </div>
      </div>
    </div>
  );
}

type TabProps = {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const Tab = ({ label, isActive, onClick }: TabProps) => (
  <div
    onClick={onClick}
    className={cn(
      "flex items-center gap-x-2 h-full p-3 border hover:bg-accent/30 text-muted-foreground cursor-pointer",
      isActive && "bg-background text-foreground"
    )}
  >
    <span className="text-sm">{label}</span>
  </div>
);
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { FileIcon } from "@react-symbols/icons/utils";
import { useFile } from "@/features/projects/hooks/use-files";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { useEditor } from "../hooks/use-editor";
import { Id } from "../../../../convex/_generated/dataModel";


export const TopNavigation = ({ projectId }: { projectId: Id<"projects"> }) => {

  const { openTabs } = useEditor(projectId);

  return (
    <ScrollArea className="flex-1">
      <nav className="flex items-center h-8.75 border-b bg-sidebar">
        {openTabs.map((fileId, index) => (
          <Tab
            key={fileId}
            fileId={fileId}
            projectId={projectId}
            isFirst={index === 0}
          />
        ))}
      </nav>

      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

type TabProps = {
  projectId: Id<"projects">;
  fileId: Id<"files">;
  isFirst: boolean;
}

const Tab = ({ projectId, fileId, isFirst }: TabProps) => {

  const file = useFile(fileId);
  const {
    activeTabId,
    previewtabId,
    setActiveTab,
    openFile,
    closeTab,
  } = useEditor(projectId);

  const isActive = activeTabId === fileId;
  const isPreview = previewtabId === fileId;
  const fileName = file?.name ?? "Loading...";

  return (
    <div
      onClick={() => setActiveTab(fileId)}
      onDoubleClick={() => openFile(fileId, { pinned: true })}
      className={cn(
        "group flex items-center gap-x-2 h-8.75 pr-1.5 pl-2 border-y border-x border-transparent hover:bg-accent/30 text-muted-foreground cursor-pointer",
        isActive && "-mb-px border-x-border border-b-background drop-shadow bg-background text-foreground",
        isFirst && "border-l-transparent!"
      )}
    >
      {(file === undefined) ? (
        <Spinner className="text-ring" />
      ) : (
        <FileIcon autoAssign fileName={fileName} className="size-4" />
      )}

      <span className={cn("text-sm whitespace-nowrap", isPreview && "italic")}>
        {fileName}
      </span>

      <button
        onClick={e => {
          e.preventDefault();
          e.stopPropagation();
          closeTab(fileId);
        }}
        onKeyDown={e => {
          if ((e.key === "Enter") || (e.key === " ")) {
            e.preventDefault();
            e.stopPropagation();
            closeTab(fileId);
          }
        }}
        className={cn(
          "p-0.5 rounded-sm hover:bg-white/10 opacity-0 group-hover:opacity-100",
          isActive && "opacity-100"
        )}
      >
        <XIcon className="size-3.5" />
      </button>
    </div>
  );
}
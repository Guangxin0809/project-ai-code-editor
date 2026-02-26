import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger
} from "@/components/ui/context-menu";

import { getItemPadding } from "./constants";
import { Doc } from "../../../../../convex/_generated/dataModel";

type Props = {
  item: Doc<"files">;
  level: number;
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  onDoubleClick?: () => void;
  onRename?: () => void;
  onDelete?: () => void;
  onCreateFile?: () => void;
  onCreateFolder?: () => void;
}

export const TreeItemWrapper = ({
  item,
  level,
  children,
  isActive,
  onClick,
  onDoubleClick,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
}: Props) => {

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onRename?.();
    }
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <button
          onClick={onClick}
          onDoubleClick={onDoubleClick}
          onKeyDown={handleKeyDown}
          className={cn(
            "group flex items-center gap-x-1 w-full h-5.5 outline-none hover:bg-accent/30 focus:ring-1 focus:ring-inset focus:ring-ring",
            isActive && "bg-accent/30"
          )}
          style={{ paddingLeft: getItemPadding(level, item.type === "file") }}
        >
          {children}
        </button>
      </ContextMenuTrigger>

      <ContextMenuContent
        onCloseAutoFocus={e => e.preventDefault()}
        className="w-64"
      >
        {(item.type === "folder") && (
          <>
            <ContextMenuItem onClick={onCreateFile} className="text-sm">
              New File...
            </ContextMenuItem>

            <ContextMenuItem onClick={onCreateFolder} className="text-sm">
              New Folder...
            </ContextMenuItem>
          </>
        )}

        <ContextMenuItem onClick={onRename} className="text-sm">
          Rename...
          <ContextMenuShortcut>Enter</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={onDelete} className="text-sm">
          Delete Permanently
          <ContextMenuShortcut>⌘Backspace</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

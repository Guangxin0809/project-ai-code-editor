import { useState } from "react";
import {
  ChevronRightIcon,
  CopyMinusIcon,
  FilePlusCornerIcon,
  FolderPlusIcon
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Tree } from "./tree";
import { LoadingRow } from "./loading-row";
import { CreateInput } from "./create-input";
import { useProject } from "../../hooks/use-projects";
import { Id } from "../../../../../convex/_generated/dataModel";
import {
  useCreateFile,
  useCreateFolder,
  useFolderContents
} from "../../hooks/use-files";

export const FileExplorer = ({ projectId }: { projectId: Id<"projects"> }) => {

  const [isOpen, setIsOpen] = useState(true);
  const [collapseKey, setCollapseKey] = useState(0);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const project = useProject(projectId);
  const rootFiles = useFolderContents({
    projectId,
    enabled: isOpen
  });

  const createFile = useCreateFile();
  const createFolder = useCreateFolder();

  const handleCreate = (name: string) => {
    setCreating(null);

    if (creating === "file") {
      createFile({
        projectId,
        parentId: undefined,
        name,
        content: "",
      });
    } else {
      createFolder({
        projectId,
        parentId: undefined,
        name,
      });
    }
  }

  return (
    <div className="h-full bg-sidebar">
      <ScrollArea>
        {/* Top action area */}
        <div
          role="button"
          onClick={() => setIsOpen(prev => !prev)}
          className="group/project flex items-center gap-x-0.5 w-full h-5.5 p-1 bg-accent font-bold text-left cursor-pointer"
        >
          <ChevronRightIcon className={cn(
            "shrink-0 size-4 text-muted-foreground",
            isOpen && "rotate-90"
          )} />

          <p className="line-clamp-1 uppercase text-xs">
            {project?.name ?? "Loading..."}
          </p>

          <div className="flex items-center gap-x-0.5 ml-auto transition-none duration-0 opacity-0 group-hover/project:opacity-100">
            <Button
              variant="highlight"
              size="icon-xs"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating("file");
              }}
            >
              <FilePlusCornerIcon className="size-3.5" />
            </Button>

            <Button
              variant="highlight"
              size="icon-xs"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setIsOpen(true);
                setCreating("folder");
              }}
            >
              <FolderPlusIcon className="size-3.5" />
            </Button>

            <Button
              variant="highlight"
              size="icon-xs"
              onClick={e => {
                e.stopPropagation();
                e.preventDefault();
                setCollapseKey(prev => prev + 1);
              }}
            >
              <CopyMinusIcon className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* Content area */}
        {isOpen && (
          <>
            {(rootFiles === undefined) && <LoadingRow level={0} />}

            {creating && (
              <CreateInput
                type={creating}
                level={0}
                onSubmit={handleCreate}
                onCancel={() => setCreating(null)}
              />
            )}

            {rootFiles?.map(item => (
              <Tree
                key={`${item._id}-${collapseKey}`}
                item={item}
                level={0}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </ScrollArea>
    </div>
  );
}

import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";

import { cn } from "@/lib/utils";

import { LoadingRow } from "./loading-row";
import { CreateInput } from "./create-input";
import { getItemPadding } from "./constants";
import { RenameInput } from "./rename-input";
import { TreeItemWrapper } from "./tree-item-wrapper";
import { Doc, Id } from "../../../../../convex/_generated/dataModel";
import {
  useCreateFile,
  useCreateFolder,
  useDeleteFile,
  useFolderContents,
  useRenameFile
} from "../../hooks/use-files";

type Props = {
  item: Doc<"files">;
  projectId: Id<"projects">;
  level?: number;
}

export const Tree = ({
  item,
  projectId,
  level = 0,
}: Props) => {

  const [isOpen, setIsOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [creating, setCreating] = useState<"file" | "folder" | null>(null);

  const createFolder = useCreateFolder();
  const createFile = useCreateFile();
  const renameFile = useRenameFile({
    projectId,
    parentId: item.parentId
  });
  const deleteFile = useDeleteFile({
    projectId,
    parentId: item.parentId
  });
  const folderContents = useFolderContents({
    projectId,
    parentId: item._id,
    enabled: (item.type === "folder") && isOpen,
  });

  const handleRename = (newName: string) => {
    setIsRenaming(true);

    if (newName === item.name) return;

    renameFile({ id: item._id, newName });
  }

  const handleCreate = (name: string) => {
    setCreating(null);

    if (creating === "file") {
      createFile({
        projectId,
        name,
        content: "",
        parentId: item._id,
      });
    } else {
      createFolder({
        projectId,
        name,
        parentId: item._id,
      });
    }
  }

  const startCreating = (type: "file" | "folder") => {
    setIsOpen(true);
    setCreating(type);
  }

  // For file
  if (item.type === "file") {
    const fileName = item.name;
    // const isActive = activeTabId === item._id;
    const isActive = false;

    if (isRenaming) {
      return (
        <RenameInput
          type="file"
          defaultValue={fileName}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />
      );
    }

    return (
      <TreeItemWrapper
        item={item}
        level={level}
        isActive={isActive}
        // onClick={() => openFile(item._id, { pinned: false })}
        // onDoubleClick={() => openFile(item._id, { pinned: true })}
        onRename={() => setIsRenaming(true)}
        onDelete={() => {
          // TODO: closeTab(item._id);
          deleteFile({ id: item._id });
        }}
      >
        <FileIcon autoAssign fileName={fileName} className="size-4" />
        <span className="truncate text-sm">{fileName}</span>
      </TreeItemWrapper>
    );
  }

  // For folder
  const folderName = item.name;

  const folderRender = (
    <>
      <div className="flex items-center gap-x-0.5">
        <ChevronRightIcon className={cn(
          "shrink-0 size-4 text-muted-foreground",
          isOpen && "rotate-90"
        )} />

        <FolderIcon folderName={folderName} className="size-4" />
      </div>

      <span className="truncate text-sm">{folderName}</span>
    </>
  );

  if (creating) {
    return (
      <>
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className="group flex items-center gap-x-1 w-full h-5.5 hover:bg-accent/30"
          style={{ paddingLeft: getItemPadding(level, false) }}
        >
          {folderRender}
        </button>

        {isOpen && (
          <>
            {(folderContents === undefined) && <LoadingRow level={level + 1} />}

            <CreateInput
              type={creating}
              level={level + 1}
              onSubmit={handleCreate}
              onCancel={() => setCreating(null)}
            />

            {folderContents?.map(subItem => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }

  if (isRenaming) {
    return (
      <>
        <RenameInput
          type="folder"
          defaultValue={folderName}
          isOpen={isOpen}
          level={level}
          onSubmit={handleRename}
          onCancel={() => setIsRenaming(false)}
        />

        {isOpen && (
          <>
            {(folderContents === undefined) && <LoadingRow level={level + 1} />}

            {folderContents?.map(subItem => (
              <Tree
                key={subItem._id}
                item={subItem}
                level={level + 1}
                projectId={projectId}
              />
            ))}
          </>
        )}
      </>
    );
  }

  return (
    <>
      <TreeItemWrapper
        item={item}
        level={level}
        onClick={() => setIsOpen(prev => !prev)}
        onRename={() => setIsRenaming(true)}
        onCreateFile={() => startCreating("file")}
        onCreateFolder={() => startCreating("folder")}
        onDelete={() => {
          // TODO: close tab
          deleteFile({ id: item._id })
        }}
      >
        {folderRender}
      </TreeItemWrapper>

      {isOpen && (
        <>
          {(folderContents === undefined) && <LoadingRow level={level + 1} />}

          {folderContents?.map(subItem => (
            <Tree
              key={subItem._id}
              item={subItem}
              level={level + 1}
              projectId={projectId}
            />
          ))}
        </>
      )}
    </>
  );
}

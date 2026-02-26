import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";

import { getItemPadding } from "./constants";

type Props = {
  type: "file" | "folder";
  level: number;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export const CreateInput = ({
  type,
  level,
  onSubmit,
  onCancel,
}: Props) => {

  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      onSubmit(trimmedValue)
    } else {
      onCancel();
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  return (
    <div
      className="flex items-center gap-x-1 w-full h-5.5 bg-accent/50"
      style={{ paddingLeft: getItemPadding(level, type === "file") }}
    >
      <div className="flex items-cneter gap-x-0.5">
        {(type === "folder") && (
          <>
            <ChevronRightIcon className="shrink-0 size-4 text-muted-foreground" />
            <FolderIcon folderName={value} className="size-4" />
          </>
        )}

        {(type === "file") && (
          <FileIcon autoAssign fileName={value} className="size-4" />
        )}
      </div>

      <input
        autoFocus
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleSubmit}
        className="flex-1 outline-none bg-transparent text-sm focus:ring-1 focus:ring-inset focus:ring-ring"
      />
    </div>
  );
}

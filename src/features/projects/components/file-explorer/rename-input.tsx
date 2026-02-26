import { useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { FileIcon, FolderIcon } from "@react-symbols/icons/utils";

import { cn } from "@/lib/utils";

import { getItemPadding } from "./constants";

type Props = {
  type: "file" | "folder";
  level: number;
  defaultValue: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
  isOpen?: boolean;
}

export const RenameInput = ({
  type,
  level,
  defaultValue,
  isOpen,
  onSubmit,
  onCancel,
}: Props) => {

  const [value, setValue] = useState(defaultValue);

  const handleSubmit = () => {
    const trimmedValue = value.trim() || defaultValue;
    onSubmit(trimmedValue);
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    } else if (e.key === "Escape") {
      onCancel();
    }
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (type === "folder") {
      e.currentTarget.select();
    } else {
      const value = e.currentTarget.value;
      const lastDotIndex = value.lastIndexOf(".");
      if (lastDotIndex > 0) {
        e.currentTarget.setSelectionRange(0, lastDotIndex);
      } else {
        e.currentTarget.select();
      }
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
            <ChevronRightIcon className={cn(
              "shrink-0 size-4 text-muted-foreground",
              isOpen && "rotate-90"
            )} />

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
        onFocus={handleFocus}
        onBlur={handleSubmit}
        className="flex-1 outline-none bg-transparent text-sm focus:ring-1 focus:ring-inset focus:ring-ring"
      />
    </div>
  );
}

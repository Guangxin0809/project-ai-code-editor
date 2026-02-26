import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

import { getItemPadding } from "./constants";

type Props = {
  level?: number;
  className?: string;
}

export const LoadingRow = ({ level = 0, className }: Props) => (
  <div
    className={cn(
      "flex items-center h-5.5 text-muted-foreground",
      className
    )}
    style={{ paddingLeft: getItemPadding(level, true) }}
  >
    <Spinner className="size-4 ml-0.5 text-ring" />
  </div>
);

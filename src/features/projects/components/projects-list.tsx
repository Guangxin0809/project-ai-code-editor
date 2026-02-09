import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";
import { getProjectIcon } from "@/utils/project";
import { Spinner } from "@/components/ui/spinner";
import { formatTimestamp } from "@/utils/date-time";

import { useProjectsPartial } from "../hooks/use-projects";
import { Doc } from "../../../../convex/_generated/dataModel";

type Props = {
  onViewAll: () => void;
}

export const ProjectsList = ({ onViewAll }: Props) => {

  const projects = useProjectsPartial(6);

  if (projects === undefined) {
    return <Spinner className="size-4 text-ring" />
  }

  const [mostRecent, ...rest] = projects;

  return (
    <div className="flex flex-col gap-y-4">
      {mostRecent ? <ContinueCard data={mostRecent} /> : null}

      {(rest.length > 0) && (
        <div className="flex flex-col gap-y-2">
          <div className="flex justify-between items-center gap-x-2">
            <span className="text-xs text-muted-foreground">
              Recent projects
            </span>
            <button
              onClick={onViewAll}
              className="flex items-center gap-x-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <span>View all</span>
              <Kbd className="border bg-accent">
                ⌘K
              </Kbd>
            </button>
          </div>

          <ul className="flex flex-col">
            {rest.map((project) => (
              <ProjectItem
                key={project._id}
                data={project}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


const ProjectItem = ({ data }: { data: Doc<"projects"> }) => (
  <Link
    href={`/projects/${data._id}`}
    className="group flex justify-between items-center w-full py-1 font-medium text-sm text-foreground/60 hover:text-foreground"
  >
    <div className="flex items-center gap-x-2">
      {getProjectIcon(data)}
      <span className="font-medium truncate">{data.name}</span>
    </div>

    <span className="text-xs text-muted-foreground transition-colors group-hover:text-foreground/60">
      {formatTimestamp(data.updatedAt)}
    </span>
  </Link>
);

const ContinueCard = ({ data }: { data: Doc<"projects"> }) => (
  <div className="flex flex-col gap-y-2">
    <span className="text-xs text-muted-foreground">
      Last updated
    </span>

    <Button
      variant="outline"
      asChild
      className="flex flex-col justify-start items-start gap-y-2 h-auto p-2 rounded-none border bg-background"
    >
      <Link href={`/projects/${data._id}`} className="group">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-x-2">
            {getProjectIcon(data)}
            <span className="font-mediun truncate">
              {data.name}
            </span>
          </div>

          <ArrowRightIcon className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
        </div>

        <span className="text-xs text-muted-foreground">
          {formatTimestamp(data.updatedAt)}
        </span>
      </Link>
    </Button>
  </div>
);
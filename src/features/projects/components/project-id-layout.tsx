"use client";

import { Allotment } from "allotment";

import { Navbar } from "./navbar";
import { Id } from "../../../../convex/_generated/dataModel";

import "allotment/dist/style.css";

const MIN_SIDEBAR_WIDTH = 200;
const MAX_SIDEBAR_WIDTH = 800;
const DEFAULT_MAIN_SIZE = 1000;
const DEFAULT_CONVERSATION_SIDEBAR_WIDTH = 400;

type Props = {
  children: React.ReactNode;
  projectId: string;
}

export const ProjectIdLayout = ({ children, projectId }: Props) => (
  <div className="flex flex-col w-full h-screen">
    <Navbar projectId={projectId as Id<"projects">} />

    <div className="flex-1 flex overflow-hidden">
      <Allotment
        className="flex-1"
        defaultSizes={[
          DEFAULT_CONVERSATION_SIDEBAR_WIDTH,
          DEFAULT_MAIN_SIZE
        ]}
      >
        <Allotment.Pane
          snap
          minSize={MIN_SIDEBAR_WIDTH}
          maxSize={MAX_SIDEBAR_WIDTH}
          preferredSize={DEFAULT_CONVERSATION_SIDEBAR_WIDTH}
        >
          <div>
            conversation sidebar
          </div>
        </Allotment.Pane>

        <Allotment.Pane>
          {children}
        </Allotment.Pane>
      </Allotment>
    </div>
  </div>
);
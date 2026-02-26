import { ProjectIdLayout } from "@/features/projects/components/project-id-layout";

import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  children: React.ReactNode;
  params: Promise<{ projectId: Id<"projects"> }>;
}

const ProjectLayout = async ({ children, params }: Props) => {

  const { projectId } = await params;

  return (
    <ProjectIdLayout projectId={projectId}>
      {children}
    </ProjectIdLayout>
  )
}

export default ProjectLayout;

import { ProjectIdLayout } from "@/features/projects/components/project-id-layout";

import { Id } from "../../../../convex/_generated/dataModel";

type Props = {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

const ProjectLayout = async ({ children, params }: Props) => {

  const { projectId } = await params;

  return (
    <ProjectIdLayout projectId={projectId as Id<"projects">}>
      {children}
    </ProjectIdLayout>
  )
}

export default ProjectLayout;

"use client";

import { useMutation, useQuery } from "convex/react";

import { Button } from "@/components/ui/button";

import { api } from "../../convex/_generated/api";

const Home = () => {

  const projects = useQuery(api.projects.get);
  const createProject = useMutation(api.projects.create);

  return (
    <div className="flex flex-col gap-y-4">
      <p>Home</p>

      <Button onClick={() => createProject({ name: "Bobbi" })}>
        New project
      </Button>

      <pre>{JSON.stringify(projects, null, 4)}</pre>
    </div>
  );
}

export default Home;
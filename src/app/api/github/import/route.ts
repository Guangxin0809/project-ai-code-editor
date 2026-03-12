import z from "zod";
import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { parseGithubUrl } from "@/utils/github";

import { api } from "../../../../../convex/_generated/api";

const requestSchema = z.object({
  url: z.url(),
});

export async function POST(request: Request) {

  const { userId, has } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const hasPro = has({ plan: "pro" });

  if (!hasPro) {
    return NextResponse.json(
      { error: "Pro plan required" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { url } = requestSchema.parse(body);

  const { owner, repo } = parseGithubUrl(url);
  // https://github.com/AntonioErdeljac/cursor-dev
  // { owner: "AntonioErdeljac", repo: "cursor-dev" }

  const client = await clerkClient();
  const tokens = await client.users.getUserOauthAccessToken(userId, "github");
  const githubToken = tokens.data[0]?.token;

  if (!githubToken) {
    return NextResponse.json(
      { error: "Github not connected. Please reconnect your Github account." },
      { status: 400 },
    );
  }

  const internalKey = process.env.POLARIS_CONVEX_INTERNAL_KEY;
  // const internalKey = "guangxin-ai-code-editor-19980809";

  if (!internalKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 },
    );
  }

  const projectId = await convex.mutation(
    api.system.createProject,
    {
      internalKey,
      name: repo,
      ownerId: userId,
    },
  );

  console.log("before event")
  const event = await inngest.send({
    name: "github/import.repo",
    data: {
      owner,
      repo,
      projectId,
      githubToken,
    },
  });
  console.log("after event")

  return NextResponse.json({
    success: true,
    projectId,
    eventId: event.ids[0],
  });

}
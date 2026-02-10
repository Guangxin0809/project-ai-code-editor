import { v } from "convex/values";

import { verifyAuth } from "./utils/auth";
import { query, mutation } from "./_generated/server";

export const getPartial = query({
  args: {
    limit: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);

    if (!identity) return [];

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .order("desc")
      .take(args.limit);

    return projects;
  },
});

export const get = query({
  args: {},
  handler: async (ctx) => {
    const identity = await verifyAuth(ctx);

    if (!identity) return [];

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", identity.subject))
      .order("desc")
      .collect();

    return projects;
  },
});

export const getById = query({
  args: {
    id: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get("projects", args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    return project;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const projectId = await ctx.db.insert("projects", {
      name: args.name,
      ownerId: identity.subject,
      updatedAt: Date.now(),
    });

    return projectId;
  },
});

export const rename = mutation({
  args: {
    id: v.id("projects"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await verifyAuth(ctx);
    const project = await ctx.db.get("projects", args.id);

    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== identity.subject) {
      throw new Error("Unauthorized access to this project")
    }

    await ctx.db.patch("projects", args.id, {
      name: args.newName,
      updatedAt: Date.now(),
    });
  },
});
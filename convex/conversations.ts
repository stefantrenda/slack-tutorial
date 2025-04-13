import { v } from "convex/values";

import { auth } from "./auth";
import { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const createOrGet = mutation({
  args: {
    memberId: v.id("members"),
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }

    const currentMember = await ctx.db
      .query("members")
      .withIndex("by_workspace_id_user_id", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("userId", userId)
      )
      .unique();

    const otherMember = await ctx.db.get(args.memberId) as { _id: Id<"members"> } | null;

    if (!currentMember || !otherMember || !("members" in otherMember._id)) {
      throw new Error("Member not found");
    }

    const existingConversation = await ctx.db
      .query("conversations")
      .filter((q) => q.eq(q.field("workspaceId"), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field("memberOneId"), currentMember._id),
            q.eq(q.field("memberTwoId"), otherMember._id)
          ),
          q.and(
            q.eq(q.field("memberOneId"), otherMember._id),
            q.eq(q.field("memberTwoId"), currentMember._id)
          )
        )
      ).unique();


      if (existingConversation) {
        return existingConversation
      }

      const conversationId = await ctx.db.insert("conversations", {
        workspaceId: args.workspaceId,
        memberOneId: currentMember._id,
        memberTwoId: otherMember._id,
      });

      const conversation = await ctx.db.get(conversationId);

      if (!conversation) {
        throw new Error("Conversation not found");
      }

      return conversation;

      

  },
});

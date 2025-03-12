import { mutation } from "./_generated/server";

export const generateUloadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

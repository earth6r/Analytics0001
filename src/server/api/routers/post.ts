import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { collection, getDocs } from 'firebase/firestore/lite';
import signIn from "@/utils/firebase/signin";

let post = {
  id: 1,
  name: "Hello World",
};

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      post = { id: post.id + 1, name: input.name };
      return post;
    }),

  getLatest: protectedProcedure.query(() => {
    return post;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  validatePassword: publicProcedure
    .input(z.object({ password: z.string().min(2) }))
    .mutation(({ input }) => {
      return {
        valid: input.password === process.env.PASSWORD,
      };
    }),

  getUnansweredMessagesCount: publicProcedure.query(
    async () => {
      const user = await signIn(process.env.EMAIL, process.env.PASSWORD);
      if (!user) {
        throw new Error("User not found");
      }
      const querySnapshot = await getDocs(collection(db, 'messages'));
      return querySnapshot.size;
    }),
});

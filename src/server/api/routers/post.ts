import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore/lite';
import signIn from "@/utils/firebase/signin";

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
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
      const messagesRef = collection(db, 'messages');
      let q = query(messagesRef, where('initialMessage', '==', true));
      let querySnapshot = await getDocs(q);

      const toUsers = new Set();
      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const to = data.to;
        toUsers.add(to);
      }

      q = query(messagesRef, where('username', 'in', Array.from(toUsers)));

      querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        toUsers.delete(data.username);
      }

      return toUsers.size;
    }),

    getTotalMessagesCount: publicProcedure.query(
      async () => {
        const user = await signIn(process.env.EMAIL, process.env.PASSWORD);
        if (!user) {
          throw new Error("User not found");
        }
        const querySnapshot = await getDocs(collection(db, 'messages'));
        return querySnapshot.size;
      }),

    getTotalUniqueRegisteredUsersCount: publicProcedure.query(
      async () => {
        const user = await signIn(process.env.EMAIL, process.env.PASSWORD);
        if (!user) {
          throw new Error("User not found");
        }
        const querySnapshot = await getDocs(collection(db, 'register'));
        const emails = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          emails.add(data.email.toLowerCase());
        });

        return emails.size;
      }),

    getTotalUniqueUsers: publicProcedure.query(
      async () => {
        const user = await signIn(process.env.EMAIL, process.env.PASSWORD);
        if (!user) {
          throw new Error("User not found");
        }
        const querySnapshot = await getDocs(collection(db, 'messages'));
        const users = new Set();
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          users.add(data.username);
        });

        return users.size;
      }),

      getRecentMessages: publicProcedure.query(
        async () => {
          const limit = 5;
          const user = await signIn(process.env.EMAIL, process.env.PASSWORD);
          if (!user) {
            throw new Error("User not found");
          }

          const messagesRef = collection(db, 'messages');
          const q = query(
            messagesRef,
            where('initialMessage', '==', false),
            orderBy('createdAt', 'desc'),
          );

          const querySnapshot = await getDocs(q);

          const messages = [];
          querySnapshot.forEach((doc) => {
            const data = doc.data();

            if (messages.length >= limit) {
              return;
            }
            messages.push(data);
          });

          return messages;
        }),
});

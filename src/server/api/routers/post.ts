import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
} from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore/lite';
import signIn from "@/utils/firebase/signin";

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

// TODO: fix this
let idToken = null;

const authenticate = async () => {
  if (!idToken) {
    console.log("Authenticating")
    idToken = await signIn(process.env.EMAIL, process.env.PASSWORD);
  }
  return idToken;
};

export const postRouter = createTRPCRouter({
  validatePassword: publicProcedure
    .input(z.object({ password: z.string().min(2) }))
    .mutation(({ input }) => {
      return {
        valid: input.password === process.env.PASSWORD,
      };
    }),

  getUnansweredMessagesCount: publicProcedure.query(
    async () => {
      await authenticate();
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

  getUnansweredMessagesCountDelta: publicProcedure.query(
    async () => {
      await authenticate();
      const messagesRef = collection(db, 'messages');
      let q = query(messagesRef, where('initialMessage', '==', true));
      let querySnapshot = await getDocs(q);

      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;

      const toUsers = new Set();
      for (const doc of querySnapshot.docs) {
        const data = doc.data();

        if (new Date(data.createdAt).getMonth() !== currentMonth) {
          continue;
        }

        const to = data.to;
        toUsers.add(to);
      }

      q = query(messagesRef, where('username', 'in', Array.from(toUsers)));

      querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        toUsers.delete(data.username);
      }

      const currentMonthMessageCount = toUsers.size;
      let lastMonthMessageCount = 0;

      q = query(messagesRef, where('initialMessage', '==', true));

      querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        const data = doc.data();

        if (new Date(data.createdAt).getMonth() !== lastMonth) {
          continue;
        }

        lastMonthMessageCount++;
      }

      return (currentMonthMessageCount - lastMonthMessageCount) / lastMonthMessageCount * 100;
    }),

  getTotalMessagesCount: publicProcedure.query(
    async () => {
      await authenticate();
      const querySnapshot = await getDocs(collection(db, 'messages'));
      return querySnapshot.size;
    }),

  getTotalMessagesCountDelta: publicProcedure.query(
    async () => {
      await authenticate();
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
      );

      const querySnapshot = await getDocs(q);

      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      let currentMonthMessageCount = 0;
      let lastMonthMessageCount = 0;
      querySnapshot.forEach((doc) => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt.getMonth() === currentMonth) {
          currentMonthMessageCount++;
        } else if (createdAt.getMonth() === lastMonth) {
          lastMonthMessageCount++;
        }
      });

      const percentValue = (currentMonthMessageCount - lastMonthMessageCount) / lastMonthMessageCount * 100;

      return percentValue; // percentage
    }),

  getTotalUniqueRegisteredUsersCount: publicProcedure.query(
    async () => {
      await authenticate();
      const querySnapshot = await getDocs(collection(db, 'register'));
      const emails = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        emails.add(data.email.toLowerCase());
      });

      return emails.size;
    }),

  getTotalUniqueRegisteredUsersCountDelta: publicProcedure.query(
    async () => {
      await authenticate();
      const messagesRef = collection(db, 'register');
      const q = query(
        messagesRef,
      );

      const querySnapshot = await getDocs(q);

      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      let currentMonthMessageCount = 0;
      let lastMonthMessageCount = 0;
      querySnapshot.forEach((doc) => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt.getMonth() === currentMonth) {
          currentMonthMessageCount++;
        } else if (createdAt.getMonth() === lastMonth) {
          lastMonthMessageCount++;
        }
      });

      const percentValue = (currentMonthMessageCount - lastMonthMessageCount) / lastMonthMessageCount * 100;

      return percentValue; // percentage
    }),

  getTotalUniqueUsers: publicProcedure.query(
    async () => {
      await authenticate();
      const querySnapshot = await getDocs(collection(db, 'messages'));
      const users = new Set();
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        users.add(data.username);
      });

      return users.size;
    }),

  getTotalUniqueUsersDelta: publicProcedure.query(
    async () => {
      await authenticate();
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
      );

      const querySnapshot = await getDocs(q);

      const currentMonth = new Date().getMonth();
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const users = new Set();
      querySnapshot.forEach((doc) => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt.getMonth() === currentMonth) {
          users.add(doc.data().username);
        }
      });

      const currentMonthMessageCount = users.size;
      users.clear();

      querySnapshot.forEach((doc) => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt.getMonth() === lastMonth) {
          users.add(doc.data().username);
        }
      });

      const lastMonthMessageCount = users.size;

      return (currentMonthMessageCount - lastMonthMessageCount) / lastMonthMessageCount * 100;
    }),

  getRecentMessages: publicProcedure.query(
    async () => {
      const limit = 5;
      await authenticate();

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

  getMessagesThisMonth: publicProcedure.query(
    async () => {
      await authenticate();
      const messagesRef = collection(db, 'messages');
      const dateReference = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const q = query(
        messagesRef,
      );

      const querySnapshot = await getDocs(q);

      let count = 0;
      querySnapshot.forEach((doc) => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt >= dateReference) {
          count++;
        }
      });

      return querySnapshot.size;
    }),

  getMessagesForTheYearGroupedCount: publicProcedure.query(
    async () => {
      await authenticate();

      const messagesRef = collection(db, 'messages');

      const q = query(messagesRef);

      const querySnapshot = await getDocs(q);

      const data = {};

      querySnapshot.forEach((doc) => {
        const createdAt = new Date(doc.data().createdAt);
        if (createdAt.getFullYear() !== new Date().getFullYear()) {
          return;
        }
        const month = createdAt.getMonth();
        const monthName = monthNames[month];
        if (!data[monthName]) {
          data[monthName] = 0;
        }
        data[monthName]++;
      });

      const formattedData = [];
      monthNames.forEach((monthName) => {
        formattedData.push({
          name: monthName,
          total: data[monthName] ?? 0,
        });
      });

      return formattedData;
    }),

  getLocationsOfInterest: publicProcedure.query(
    async () => {
      await authenticate();
      const registerRef = collection(db, 'register');
      const q = query(registerRef);
      const querySnapshot = await getDocs(q);
      const data = {};
      querySnapshot.forEach((doc) => {
        const location = doc.data().locationsOfInterest;
        if (location && typeof location === "string") {
          if (!data[location]) {
            data[location] = 0;
          }
          data[location]++;
        } else if (location && Array.isArray(location)) {
          location.forEach((loc) => {
            if (!data[loc]) {
              data[loc] = 0;
            }
            data[loc]++;
          });
        }
      });

      const formattedData = [];
      for (const key in data) {
        formattedData.push({
          [key]: data[key],
        });
      }

      const sortedData = formattedData.sort((a, b) => {
        return Object.values(b)[0] - Object.values(a)[0];
      });

      return sortedData;
    }),
});

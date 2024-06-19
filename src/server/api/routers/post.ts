import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import admin, { firestore } from 'firebase-admin';
import { db } from "@/utils/firebase/initialize";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore/lite";
import signIn from "@/utils/firebase/signin";
import { propertyTypes } from "@/lib/property-types";
import { buyingProgressStepNumberToLabel } from "./customer";
import { buyingProgressTypeToLabel } from "@/components/dashboard/customers/buying-progress-chart";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function extractOsInfo(userAgent: string) {
  // Regular expressions to match broad OS categories
  const osRegexes = {
    Mac: /Macintosh|Mac OS X/,
    Windows: /Windows/,
    "GNU/Linux": /Linux(?!.*Android)/, // Exclude Android from Linux matches
    iOS: /iPhone|iPad/,
    Android: /Android/,
    "Chrome OS": /CrOS/,
  };

  // Check the user agent string against each regex
  for (const [os, regex] of Object.entries(osRegexes)) {
    if (regex.test(userAgent)) {
      return os;
    }
  }

  return "Unknown";
}

function extractBrowserInfo(userAgent: string) {
  // Regular expressions to match broad browser categories
  const browserRegexes = {
    Instagram: /Instagram/,
    Chrome: /Chrome|Chromium|CriOS/,
    Firefox: /Firefox/,
    Safari: /Safari|AppleWebKit/,
    Edge: /Edg|Edge/,
    IE: /MSIE|Trident/,
  };

  // Check the user agent string against each regex
  for (const [browser, regex] of Object.entries(browserRegexes)) {
    if (regex.test(userAgent)) {
      return browser;
    }
  }

  return "Unknown";
}

function extractLanguage(userAgent: string) {
  const languageMatch = userAgent.match(/([a-z]{2}_[A-Z]{2})/);
  return languageMatch ? languageMatch[1] : null;
}

const authenticate = async () => {
  return true;
};

export const postRouter = createTRPCRouter({
  validatePassword: publicProcedure
    .input(z.object({ password: z.string().min(2) }))
    .mutation(async ({ input }) => {
      const isAuthorized = input.password === process.env.PASSWORD;

      if (isAuthorized) {
        // @ts-expect-error - fix this
        await signIn(process.env.EMAIL, process.env.PASSWORD);
      }
      return {
        valid: isAuthorized,
      };
    }),

  getUnansweredMessagesCount: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    let q = query(messagesRef, where("initialMessage", "==", true));
    let querySnapshot = await getDocs(q);

    const toUsers = new Set();
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      const to = data.to;
      toUsers.add(to);
    }

    if (toUsers.size !== 0) {
      q = query(messagesRef, where("username", "in", Array.from(toUsers)));

      querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        toUsers.delete(data.username);
      }
    }

    return toUsers.size;
  }),

  getUnansweredMessagesCountDelta: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    let q = query(messagesRef, where("initialMessage", "==", true));
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

    if (toUsers.size !== 0) {
      q = query(messagesRef, where("username", "in", Array.from(toUsers)));

      querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        toUsers.delete(data.username);
      }
    }

    const currentMonthMessageCount = toUsers.size;
    let lastMonthMessageCount = 0;

    q = query(messagesRef, where("initialMessage", "==", true));

    querySnapshot = await getDocs(q);

    for (const doc of querySnapshot.docs) {
      const data = doc.data();

      if (new Date(data.createdAt).getMonth() !== lastMonth) {
        continue;
      }

      lastMonthMessageCount++;
    }

    return (
      ((currentMonthMessageCount - lastMonthMessageCount) /
        lastMonthMessageCount) *
      100
    );
  }),

  getTotalMessagesCount: publicProcedure.query(async () => {
    await authenticate();
    const querySnapshot = await getDocs(collection(db, "messages"));
    return querySnapshot.size;
  }),

  getTotalMessagesCountDelta: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef);

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

    const percentValue =
      ((currentMonthMessageCount - lastMonthMessageCount) /
        lastMonthMessageCount) *
      100;

    return percentValue; // percentage
  }),

  getTotalUniqueRegisteredUsersCountDelta: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "register");
    const q = query(messagesRef);

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

    const percentValue =
      ((currentMonthMessageCount - lastMonthMessageCount) /
        lastMonthMessageCount) *
      100;

    return percentValue; // percentage
  }),

  getTotalUniqueUsers: publicProcedure.query(async () => {
    await authenticate();
    const querySnapshot = await getDocs(collection(db, "messages"));
    const users = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.add(data.username);
    });

    return users.size;
  }),

  getTotalUniqueUsersDelta: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef);

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

    return (
      ((currentMonthMessageCount - lastMonthMessageCount) /
        lastMonthMessageCount) *
      100
    );
  }),

  getRecentMessages: publicProcedure.query(async () => {
    const limit = 5;
    await authenticate();

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("initialMessage", "==", false),
      orderBy("createdAt", "desc"),
    );

    const querySnapshot = await getDocs(q);

    // @ts-expect-error - fix this
    const messages = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();

      if (messages.length >= limit) {
        return;
      }
      messages.push(data);
    });

    // @ts-expect-error - fix this
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return messages;
  }),

  getMessagesThisMonth: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const dateReference = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );
    const q = query(messagesRef);

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

  getMessagesForTheYearGroupedCount: publicProcedure.query(async () => {
    await authenticate();

    const messagesRef = collection(db, "messages");

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
      // @ts-expect-error - fix this
      if (!data[monthName]) {
        // @ts-expect-error - fix this
        data[monthName] = 0;
      }
      // @ts-expect-error - fix this
      data[monthName]++;
    });

    const formattedData: any[] | PromiseLike<any[]> = [];
    monthNames.forEach((monthName) => {
      formattedData.push({
        name: monthName,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        total: (data as { [key: string]: any })[monthName] ?? 0,
      });
    });

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return formattedData;
  }),

  getMessageGroupsCount: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("initialMessage", "==", true));
    const querySnapshot = await getDocs(q);

    return querySnapshot.size;
  }),

  getMessageGroupsCountDelta: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, where("initialMessage", "==", true));

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

    const percentValue =
      ((currentMonthMessageCount - lastMonthMessageCount) /
        lastMonthMessageCount) *
      100;

    return percentValue; // percentage
  }),

  getInstagramMessagesCount: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef);
    const querySnapshot = await getDocs(q);

    let count = 0;
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (data?.visitor?.includes("instagram")) {
        count++;
      }
    }

    return count;
  }),

  getInstagramMessagesCountDelta: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef);

    const querySnapshot = await getDocs(q);

    const currentMonth = new Date().getMonth();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    let currentMonthMessageCount = 0;
    let lastMonthMessageCount = 0;
    querySnapshot.forEach((doc) => {
      const createdAt = new Date(doc.data().createdAt);
      if (
        createdAt.getMonth() === currentMonth &&
        doc.data()?.visitor?.includes("instagram")
      ) {
        currentMonthMessageCount++;
      } else if (
        createdAt.getMonth() === lastMonth &&
        doc.data()?.visitor?.includes("instagram")
      ) {
        lastMonthMessageCount++;
      }
    });

    const percentValue =
      ((currentMonthMessageCount - lastMonthMessageCount) /
        lastMonthMessageCount) *
      100;

    return percentValue; // percentage
  }),

  // register
  getLocationsOfInterest: publicProcedure.query(async () => {
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef);
    const querySnapshot = await getDocs(q);
    const data = {};
    querySnapshot.forEach((doc) => {
      const location = doc.data().locationsOfInterest;
      if (location && typeof location === "string") {
        // @ts-expect-error - fix this
        if (!data[location]) {
          // @ts-expect-error - fix this
          data[location] = 0;
        }
        // @ts-expect-error - fix this
        data[location]++;
      } else if (location && Array.isArray(location)) {
        location.forEach((loc) => {
          // @ts-expect-error - fix this
          if (!data[loc]) {
            // @ts-expect-error - fix this
            data[loc] = 0;
          }
          // @ts-expect-error - fix this
          data[loc]++;
        });
      }
    });

    const formattedData = [];
    for (const key in data) {
      formattedData.push({
        // @ts-expect-error - fix this
        [key]: data[key],
      });
    }

    const sortedData = formattedData.sort((a, b) => {
      return Object.values(b)[0] - Object.values(a)[0];
    });

    return sortedData;
  }),

  // register
  getDeviceInfoStats: publicProcedure.query(async () => {
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef);
    const querySnapshot = await getDocs(q);
    const data = {};
    querySnapshot.forEach((doc) => {
      const userAgent = doc.data().userAgent;
      if (!userAgent) {
        return;
      }
      const osInfo = extractOsInfo(userAgent);
      // @ts-expect-error - fix this
      if (!data[osInfo]) {
        // @ts-expect-error - fix this
        data[osInfo] = 0;
      }
      // @ts-expect-error - fix this
      data[osInfo]++;
    });

    const formattedData = [];
    for (const key in data) {
      formattedData.push({
        // @ts-expect-error - fix this
        [key]: data[key],
      });
    }

    const sortedData = formattedData.sort((a, b) => {
      return Object.values(b)[0] - Object.values(a)[0];
    });

    return sortedData;
  }),

  // register
  getBrowserInfoStats: publicProcedure.query(async () => {
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef);
    const querySnapshot = await getDocs(q);
    const data = {};
    querySnapshot.forEach((doc) => {
      const userAgent = doc.data().userAgent;
      if (!userAgent) {
        return;
      }
      const browserInfo = extractBrowserInfo(userAgent);
      // @ts-expect-error - fix this
      if (!data[browserInfo]) {
        // @ts-expect-error - fix this
        data[browserInfo] = 0;
      }
      // @ts-expect-error - fix this
      data[browserInfo]++;
    });

    const formattedData = [];
    for (const key in data) {
      formattedData.push({
        // @ts-expect-error - fix this
        [key]: data[key],
      });
    }

    const sortedData = formattedData.sort((a, b) => {
      return Object.values(b)[0] - Object.values(a)[0];
    });

    return sortedData;
  }),

  // register
  getLanguageStats: publicProcedure.query(async () => {
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef);
    const querySnapshot = await getDocs(q);
    const data = {};
    querySnapshot.forEach((doc) => {
      const userAgent = doc.data().userAgent;
      if (!userAgent) {
        return;
      }
      const language = extractLanguage(userAgent);
      // @ts-expect-error - fix this
      if (!data[language]) {
        // @ts-expect-error - fix this
        data[language] = 0;
      }
      // @ts-expect-error - fix this
      data[language]++;
    });

    const formattedData = [];
    for (const key in data) {
      formattedData.push({
        // @ts-expect-error - fix this
        [key]: data[key],
      });
    }

    const sortedData = formattedData.sort((a, b) => {
      return Object.values(b)[0] - Object.values(a)[0];
    });

    return sortedData;
  }),

  // register
  getIpAddressStats: publicProcedure.query(async () => {
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef);
    const querySnapshot = await getDocs(q);
    const data = {};

    // const api_url = `https://ipapi.co/${ipAddress}/json/`;
    // const response = await axios.get(api_url);
    const responseData = {
      ip: "0.0.0.0",
      network: "0.0.0.0/20",
      version: "IPv4",
      city: "Toronto",
      region: "Ontario",
      region_code: "ON",
      country: "CA",
      country_name: "Canada",
      country_code: "CA",
      country_code_iso3: "CAN",
      country_capital: "Ottawa",
      country_tld: ".ca",
      continent_code: "NA",
      in_eu: false,
      postal: "M3C",
      latitude: 43.7338,
      longitude: -79.3325,
      timezone: "America/Toronto",
      utc_offset: "-0400",
      country_calling_code: "+1",
      currency: "CAD",
      currency_name: "Dollar",
      languages: "en-CA,fr-CA,iu",
      country_area: 9984670,
      country_population: 37058856,
      asn: "AS812",
      org: "ROGERS-COMMUNICATIONS",
    };
    const promises = querySnapshot.docs.map(async (doc) => {
      const ipAddress = doc.data()?.ipAddress ?? "0.0.0.0";
      if (!ipAddress) {
        return;
      }
      const country = responseData.country;
      // @ts-expect-error - fix this
      if (!data[country]) {
        // @ts-expect-error - fix this
        data[country] = 0;
      }
      // @ts-expect-error - fix this
      data[country]++;
    });

    await Promise.all(promises);

    const formattedData = [];
    for (const key in data) {
      formattedData.push({
        // @ts-expect-error - fix this
        [key]: data[key],
      });
    }

    const sortedData = formattedData.sort((a, b) => {
      return Object.values(b)[0] - Object.values(a)[0];
    });

    return sortedData;
  }),

  // register
  getCityStats: publicProcedure.query(async () => {
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef);
    const querySnapshot = await getDocs(q);
    const data = {};

    // const api_url = `https://ipapi.co/${ipAddress}/json/`;
    // const response = await axios.get(api_url);
    const responseData = {
      ip: "0.0.0.0",
      network: "0.0.0.0/20",
      version: "IPv4",
      city: "Toronto",
      region: "Ontario",
      region_code: "ON",
      country: "CA",
      country_name: "Canada",
      country_code: "CA",
      country_code_iso3: "CAN",
      country_capital: "Ottawa",
      country_tld: ".ca",
      continent_code: "NA",
      in_eu: false,
      postal: "M3C",
      latitude: 43.7338,
      longitude: -79.3325,
      timezone: "America/Toronto",
      utc_offset: "-0400",
      country_calling_code: "+1",
      currency: "CAD",
      currency_name: "Dollar",
      languages: "en-CA,fr-CA,iu",
      country_area: 9984670,
      country_population: 37058856,
      asn: "AS812",
      org: "ROGERS-COMMUNICATIONS",
    };
    const promises = querySnapshot.docs.map(async (doc) => {
      const ipAddress = doc.data()?.ipAddress ?? "0.0.0.0";
      if (!ipAddress) {
        return;
      }
      const city = responseData.city;
      // @ts-expect-error - fix this
      if (!data[city]) {
        // @ts-expect-error - fix this
        data[city] = 0;
      }
      // @ts-expect-error - fix this
      data[city]++;
    });

    await Promise.all(promises);

    const formattedData = [];
    for (const key in data) {
      formattedData.push({
        // @ts-expect-error - fix this
        [key]: data[key],
      });
    }

    const sortedData = formattedData.sort((a, b) => {
      return Object.values(b)[0] - Object.values(a)[0];
    });

    return sortedData;
  }),

  // register
  getRecentRegisters: publicProcedure.query(async () => {
    const limit = 5;
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);

    // @ts-expect-error - fix this
    const registers = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.locationsOfInterest =
        typeof data.locationsOfInterest === "string"
          ? [data.locationsOfInterest]
          : data.locationsOfInterest;
      if (registers.length >= limit) {
        return;
      }
      registers.push(data);
    });

    // @ts-expect-error - fix this
    return registers;
  }),

  // register
  getRegisters: publicProcedure.query(async () => {
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef);
    const querySnapshot = await getDocs(q);

    // @ts-expect-error - fix this
    const registers = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.locationsOfInterest =
        typeof data.locationsOfInterest === "string"
          ? [data.locationsOfInterest]
          : data.locationsOfInterest;
      registers.push(data);
    });

    // @ts-expect-error - fix this
    return registers;
  }),

  // register
  getTotalUniqueRegisteredUsersCount: publicProcedure.query(async () => {
    await authenticate();
    const querySnapshot = await getDocs(collection(db, "register"));
    const emails = new Set();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.email) {
        return;
      }
      emails.add(data.email.toLowerCase());
    });

    return emails.size;
  }),

  // register
  getBuyingTimelineNowCount: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "register");
    const q = query(messagesRef, where("buyingTimelinedec2023", "==", "now"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }),

  // register
  getBuyingTimelineNowCountDelta: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "register");
    const q = query(messagesRef, where("buyingTimelinedec2023", "==", "now"));

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

    const percentValue =
      ((currentMonthMessageCount - lastMonthMessageCount) /
        lastMonthMessageCount) *
      100;

    return percentValue; // percentage
  }),

  // register
  getBuyingTimelineOneToThreeMonthsCount: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "register");
    const q = query(
      messagesRef,
      where("buyingTimelinedec2023", "==", "1to3mos"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }),

  // register
  getBuyingTimelineOneToThreeMonthsCountDelta: publicProcedure.query(
    async () => {
      await authenticate();
      const messagesRef = collection(db, "register");
      const q = query(
        messagesRef,
        where("buyingTimelinedec2023", "==", "1to3mos"),
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

      const percentValue =
        ((currentMonthMessageCount - lastMonthMessageCount) /
          lastMonthMessageCount) *
        100;

      return percentValue; // percentage
    },
  ),

  // register
  getBuyingTimelineNotSureCount: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "register");
    const q = query(
      messagesRef,
      where("buyingTimelinedec2023", "==", "notsure"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  }),

  // register
  getBuyingTimelineNotSureCountDelta: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "register");
    const q = query(
      messagesRef,
      where("buyingTimelinedec2023", "==", "notsure"),
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

    const percentValue =
      ((currentMonthMessageCount - lastMonthMessageCount) /
        lastMonthMessageCount) *
      100;

    return percentValue; // percentage
  }),

  getMessages: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      // where('initialMessage', '==', false),
    );
    const querySnapshot = await getDocs(q);
    // @ts-expect-error - fix this
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    // @ts-expect-error - fix this
    return messages;
  }),

  getCumulativeMessages: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef);
    const querySnapshot = await getDocs(q);
    // @ts-expect-error - fix this
    const messages = [];
    querySnapshot.forEach((doc) => {
      const message = doc.data();
      message.createdAt = new Date(message.createdAt);
      messages.push(message);
    });

    const data = {};
    for (let i = 0; i < messages.length; i++) {
      // @ts-expect-error - fix this
      const message = messages[i];

      const date = message.createdAt;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const key = `${year}-${month}-${day}`;

      // @ts-expect-error - fix this
      if (!data[key]) {
        // @ts-expect-error - fix this
        data[key] = 1;
      } else {
        // @ts-expect-error - fix this
        data[key]++;
      }
    }

    // Define the start and end dates
    const startDate = new Date("2024-05-01");
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0); // Remove time portion for comparison

    // Function to format dates as keys
    // @ts-expect-error - fix this
    const formatDateKey = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      return `${year}-${month}-${day}`;
    };

    const cumulativeData = [];
    let cumulativeTotal = 0;

    // Iterate over each day in the range
    for (
      let date = startDate;
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const key = formatDateKey(date);
      // @ts-expect-error - fix this
      const dailyCount = data[key] || 0; // Get the message count for the day, or 0 if no messages
      cumulativeTotal += dailyCount;
      cumulativeData.push({
        name: key,
        pv: cumulativeTotal,
      });
    }

    return cumulativeData;
  }),

  getMessagesByWeek: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef);
    const querySnapshot = await getDocs(q);
    // @ts-expect-error - fix this
    const messages = [];
    querySnapshot.forEach((doc) => {
      const message = doc.data();
      message.createdAt = new Date(message.createdAt);
      messages.push(message);
    });

    const data = {};
    for (let i = 0; i < messages.length; i++) {
      // @ts-expect-error - fix this
      const message = messages[i];

      const date = message.createdAt;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const week = Math.floor(date.getDate() / 7) + 1;

      const key = `${year}-${month}-${week}`;

      // @ts-expect-error - fix this
      if (!data[key]) {
        // @ts-expect-error - fix this
        data[key] = 1;
      } else {
        // @ts-expect-error - fix this
        data[key]++;
      }
    }

    const formattedData = [];
    for (const key in data) {
      formattedData.push({
        name: key,
        // @ts-expect-error - fix this
        pv: data[key],
      });
    }

    formattedData.sort((a, b) => {
      // @ts-expect-error - fix this
      return new Date(a.name) - new Date(b.name);
    });

    return formattedData;
  }),

  createUserInDatabase: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ input }) => {
      await authenticate();

      const collectionRef = collection(db, "users");

      const queryRef = query(collectionRef, where("email", "==", input.email));
      const querySnapshot = await getDocs(queryRef);
      if (querySnapshot.size > 0) {
        return {
          error: "user_already_exists",
        }
      }

      const userRef = await addDoc(collectionRef, {
        email: input.email,
        createdAt: serverTimestamp(),
      });

      return {
        ...userRef,
        error: null,
      }
    }),

  getUsersInDatabase: publicProcedure.query(async () => {
    await authenticate();

    const collectionRef = collection(db, "users");
    const queryRef = query(collectionRef);
    const querySnapshot = await getDocs(queryRef);

    // @ts-expect-error - fix this
    const users = [];
    querySnapshot.forEach((doc) => {
      const userUID = doc.id;
      users.push({
        ...doc.data(),
        uid: userUID,
      });
    });

    // Parse Firebase configuration from environment variables
    const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT_KEY as string)

    // Check if Firebase Admin SDK is already initialized
    if (!admin.apps.length) {
      // Initialize Firebase app with the parsed configuration
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.PROJECT_ID,
      })
    }

    // @ts-expect-error - fix this
    for (const user of users) {
      // const didUserSetPassword = await auth.
      // query firebase auth to check if a user with this email exists
      let exists = true;

      try {
        await admin.auth().getUserByEmail(user.email);
      } catch (error) {
        exists = false;
      }
      user.setPassword = exists;

      const userBuyingPropertyTypeCollectionRef = collection(db, "usersBuyingProgress");
      const userBuyingPropertyTypeQueryRef = query(userBuyingPropertyTypeCollectionRef, where("userUID", "==", user.uid));
      const userBuyingPropertyTypeQuerySnapshot = await getDocs(userBuyingPropertyTypeQueryRef);

      if (userBuyingPropertyTypeQuerySnapshot.size > 0 && userBuyingPropertyTypeQuerySnapshot.docs[0]) {
        const data = userBuyingPropertyTypeQuerySnapshot?.docs[0].data();

        user.buyingProgress = null;

        if (data.escrowDeposit) {
          user.buyingProgress = "Escrow Deposit";
        }
        if (data.scheduleClosing) {
          user.buyingProgress = "Schedule Closing";
        }
        if (data.downloadDocuments) {
          user.buyingProgress = "Download Documents";
        }
        if (data.fullPayment) {
          // this value can also be "Completed" but being explicit here
          user.buyingProgress = "Full Payment";
        }
        if (data.completed) {
          user.buyingProgress = "Completed";
        }
      } else {
        // possibly not needed but a safety check
        user.buyingProgress = null;
      }
    }

    // @ts-expect-error - fix this
    return users;
  }),

  setUserBuyingPropertyType: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        propertyType: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      await authenticate();

      const collectionRef = collection(db, "users");

      const queryRef = query(collectionRef, where("email", "==", input.email));
      const querySnapshot = await getDocs(queryRef);
      if (querySnapshot.size === 0) {
        return {
          error: "user_not_found",
        }
      }

      const doc = querySnapshot.docs[0];

      if (!doc) {
        return {
          error: "user_not_found",
        }
      }

      // update doc using modular firebase api
      await updateDoc(doc.ref, {
        userBuyingPropertyType: input.propertyType,
      });

      return {
        error: null,
      }
    }),

});

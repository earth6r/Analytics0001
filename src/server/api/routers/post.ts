import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/utils/firebase/initialize";
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore/lite";
import signIn from "@/utils/firebase/signin";
import axios from "axios";

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

    // @ts-expect-error - fix this
    const formattedData = [];
    monthNames.forEach((monthName) => {
      formattedData.push({
        name: monthName,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        total: data[monthName] ?? 0,
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
      if (!data[osInfo]) {
        data[osInfo] = 0;
      }
      data[osInfo]++;
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
      if (!data[browserInfo]) {
        data[browserInfo] = 0;
      }
      data[browserInfo]++;
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
      if (!data[language]) {
        data[language] = 0;
      }
      data[language]++;
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
      if (!data[country]) {
        data[country] = 0;
      }
      data[country]++;
    });

    await Promise.all(promises);

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
      if (!data[city]) {
        data[city] = 0;
      }
      data[city]++;
    });

    await Promise.all(promises);

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

  // register
  getRecentRegisters: publicProcedure.query(async () => {
    const limit = 6;
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);

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

    return registers;
  }),

  // register
  getRegisters: publicProcedure.query(async () => {
    await authenticate();
    const registerRef = collection(db, "register");
    const q = query(registerRef);
    const querySnapshot = await getDocs(q);

    const registers = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      data.locationsOfInterest =
        typeof data.locationsOfInterest === "string"
          ? [data.locationsOfInterest]
          : data.locationsOfInterest;
      registers.push(data);
    });

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
    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push(doc.data());
    });
    return messages;
  }),

  getCumulativeMessages: publicProcedure.query(async () => {
    await authenticate();
    const messagesRef = collection(db, "messages");
    const q = query(messagesRef);
    const querySnapshot = await getDocs(q);
    const messages = [];
    querySnapshot.forEach((doc) => {
      const message = doc.data();
      message.createdAt = new Date(message.createdAt);
      messages.push(message);
    });

    const data = {};
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      const date = message.createdAt;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      const key = `${year}-${month}-${day}`;

      if (!data[key]) {
        data[key] = 1;
      } else {
        data[key]++;
      }
    }

    // Define the start and end dates
    const startDate = new Date("2024-05-01");
    const endDate = new Date();
    endDate.setHours(0, 0, 0, 0); // Remove time portion for comparison

    // Function to format dates as keys
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
    const messages = [];
    querySnapshot.forEach((doc) => {
      const message = doc.data();
      message.createdAt = new Date(message.createdAt);
      messages.push(message);
    });

    const data = {};
    for (let i = 0; i < messages.length; i++) {
      const message = messages[i];

      const date = message.createdAt;

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const week = Math.floor(date.getDate() / 7) + 1;

      const key = `${year}-${month}-${week}`;

      if (!data[key]) {
        data[key] = 1;
      } else {
        data[key]++;
      }
    }

    const formattedData = [];
    for (const key in data) {
      formattedData.push({
        name: key,
        pv: data[key],
      });
    }

    formattedData.sort((a, b) => {
      return new Date(a.name) - new Date(b.name);
    });

    return formattedData;
  }),
});

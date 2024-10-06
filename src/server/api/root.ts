import { postRouter } from "@/server/api/routers/post";
import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { registerRouter } from "@/server/api/routers/register";
import { emailRouter } from "@/server/api/routers/email";
import { customerRouter } from "@/server/api/routers/customer";
import { userSettingsRouter } from "@/server/api/routers/user-settings";
import { bookingsRouter } from "@/server/api/routers/bookings";
import { userRouter } from "@/server/api/routers/user";
import { errorRouter } from "@/server/api/routers/errors";
import { sendgridRouter } from "./routers/sendgrid";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  register: registerRouter,
  email: emailRouter,
  customer: customerRouter,
  userSettings: userSettingsRouter,
  bookings: bookingsRouter,
  user: userRouter,
  error: errorRouter,
  sendgrid: sendgridRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

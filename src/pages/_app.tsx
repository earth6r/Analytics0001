import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { IntervalProvider } from "@/contexts/IntervalContext";
import { UserProvider } from "@/contexts/UserContext";
import { ThemeProvider } from "next-themes";
import useColor from "@/hooks/use-color";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  // required to set theme on website load
  useColor();

  return (
    <SessionProvider session={session}>
      <main className={GeistSans.className}>
        <UserProvider>
          <IntervalProvider>
            <ThemeProvider attribute="class">
              <Component {...pageProps} />
            </ThemeProvider>
          </IntervalProvider>
        </UserProvider>
        <Toaster />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

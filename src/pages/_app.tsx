import { GeistSans } from "geist/font/sans";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";

import { api } from "@/utils/api";

import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster";
import { IntervalProvider } from "@/contexts/IntervalContext";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
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
        <IntervalProvider>
          <ThemeProvider attribute="class">
            <Component {...pageProps} />
          </ThemeProvider>
        </IntervalProvider>
        <Toaster />
      </main>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

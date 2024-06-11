import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

import PasswordInput from "@/components/login/password-input";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home0001 Analytics</title>
        <meta name="description" content="Home0001 Analytics Dashboard" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-start">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">Hello from Home0001</p>
            <AuthShowcase />
          </div>
        </div>
        <PasswordInput />
      </main>
    </>
  );
}

function AuthShowcase() {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}

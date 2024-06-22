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
            {/* <AuthShowcase /> */}
          </div>
        </div>
        <p className="text-5xl uppercase text-start font-bold">Home0001 Analytics Dashboard</p>
        <PasswordInput />
      </main>
    </>
  );
}

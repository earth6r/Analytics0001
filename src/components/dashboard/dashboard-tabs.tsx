import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Registers from "@/components/dashboard/registers/registers";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Messages from "@/components/dashboard/messages/messages";
import Image from "next/image";
import { useRouter } from "next/router";

const DashboardTabs = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(router.query.tab ?? "registers");

  const handleSetActiveTab = async (tab: string) => {
    setActiveTab(tab);
    await router.push({
      pathname: router.pathname,
      query: { tab: tab },
    });
  };

  return (
    <Tabs
      value={router.query.tab ?? "registers"}
      defaultValue={router.query.tab ?? "registers"}
      className="w-full"
    >
      <div className="pl-6 pr-6 pt-6">
        <TabsList className="grid w-full grid-cols-3 md:w-72">
          <TabsTrigger
            value="registers"
            className={cn(
              activeTab === "registers" ? "" : "text-muted-foreground",
              "cursor-pointer",
            )}
            onClick={() => handleSetActiveTab("registers")}
          >
            Registers
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className={cn(
              activeTab === "messages" ? "" : "text-muted-foreground",
              "cursor-pointer",
            )}
            onClick={() => handleSetActiveTab("messages")}
          >
            Messages
          </TabsTrigger>
          <TabsTrigger
            value="emails"
            className={cn(
              activeTab === "emails" ? "" : "text-muted-foreground",
              "cursor-pointer",
            )}
            onClick={() => handleSetActiveTab("emails")}
          >
            Emails
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="registers" className="w-full">
        <Registers />
      </TabsContent>
      <TabsContent value="messages">
        <Messages />
      </TabsContent>
      <TabsContent value="emails" className="p-6">
        <div className="min-h-screen-calc-35vh flex flex-col items-center justify-center rounded-md border">
          <Image
            src="/coming-soon.png"
            className="aspect-square rounded-full object-cover"
            width={300}
            height={300}
            alt="Coming Soon"
          />
          <div className="text-5xl">Coming Soon!</div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;

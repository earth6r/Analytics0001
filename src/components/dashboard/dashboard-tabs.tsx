import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Registers from "@/components/dashboard/registers/registers";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Messages from "@/components/dashboard/messages/messages";
import { useRouter } from "next/router";
import Emails from "@/components/dashboard/emails/emails";
import CustomersTabContent from "@/components/dashboard/customers/customers-tab-content";

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
      value={router.query.tab as string ?? "registers"}
      defaultValue={router.query.tab as string ?? "registers"}
      className="w-full"
    >
      <div className="pl-6 pr-6 pt-6">
        <TabsList className="grid w-full grid-cols-4 md:w-96">
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
          <TabsTrigger
            value="customers"
            className={cn(
              activeTab === "customers" ? "" : "text-muted-foreground",
              "cursor-pointer",
            )}
            onClick={() => handleSetActiveTab("customers")}
          >
            Customers
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
        <Emails />
      </TabsContent>
      <TabsContent value="customers" className="p-6">
        <CustomersTabContent />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;

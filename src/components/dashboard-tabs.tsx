import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Overview from "@/components/overview"
import { useState } from "react";
import { cn } from "@/lib/utils";
import Messages from "./messages";
import Image from "next/image";
import { useRouter } from "next/router";

const DashboardTabs = () => {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(router.query.tab ?? "overview");

    const handleSetActiveTab = async (tab: string) => {
        setActiveTab(tab);
        await router.push({
            pathname: router.pathname,
            query: { tab: tab },
        });
    }

    return (
        <Tabs value={router.query.tab ?? "overview"} defaultValue={router.query.tab ?? "overview"} className="w-full">
            <div className="pt-6 pl-6 pr-6">
                <TabsList className="grid grid-cols-3 w-full md:w-72">
                    <TabsTrigger value="overview" className={cn(activeTab === "overview" ? "" : "text-muted-foreground",
                        "cursor-pointer",
                    )}
                        onClick={() => handleSetActiveTab("overview")}
                    >Overview</TabsTrigger>
                    <TabsTrigger value="messages" className={cn(activeTab === "messages" ? "" : "text-muted-foreground",
                        "cursor-pointer"
                    )}
                        onClick={() => handleSetActiveTab("messages")}
                    >Messages</TabsTrigger>
                    <TabsTrigger value="emails" className={cn(activeTab === "emails" ? "" : "text-muted-foreground", "cursor-pointer")}
                        onClick={() => handleSetActiveTab("emails")}
                    >Emails</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="overview" className="w-full">
                <Overview />
            </TabsContent>
            <TabsContent value="messages">
                <Messages />
            </TabsContent>
            <TabsContent value="emails" className="p-6">
                <div className="flex flex-col items-center justify-center border rounded-md min-h-screen-calc-35vh">
                    <Image src="/coming-soon.png" className="rounded-full aspect-square object-cover" width={300} height={300} alt="Coming Soon" />
                    <div className="text-5xl">Coming Soon!</div>
                </div>
            </TabsContent>
        </Tabs>
    )
}

export default DashboardTabs;

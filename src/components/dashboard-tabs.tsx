import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Overview from "@/components/overview"
import { useState } from "react";
import { cn } from "@/lib/utils";

const DashboardTabs = () => {
    const [activeTab, setActiveTab] = useState("overview");

    return (
        <Tabs defaultValue="overview" className="w-full">
            <div className="pt-6 pl-6 pr-6">
                <TabsList className="grid grid-cols-3 w-full md:w-72">
                    <TabsTrigger value="overview" className={cn(activeTab === "overview" ? "opacity-100" : "opacity-50",
                        "cursor-pointer",
                    )}
                        onClick={() => setActiveTab("overview")}
                    >Overview</TabsTrigger>
                    <TabsTrigger value="messages" className={cn(activeTab === "messages" ? "opacity-100" : "opacity-50",
                        "cursor-pointer"
                    )}
                        onClick={() => setActiveTab("messages")}
                    >Messages</TabsTrigger>
                    <TabsTrigger value="emails" className={cn(activeTab === "emails" ? "opacity-100" : "opacity-50", "cursor-pointer")}
                        onClick={() => setActiveTab("emails")}
                    >Emails</TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="overview" className="w-full">
                <Overview />
            </TabsContent>
            <TabsContent value="messages">
                <Overview />
            </TabsContent>
            <TabsContent value="emails">
                <Overview />
            </TabsContent>
        </Tabs>
    )
}

export default DashboardTabs;

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import Overview from "@/components/overview"

const DashboardTabs = () => {
    return (
        <Tabs defaultValue="overview" className="w-full">
            <div className="pt-6 pl-6">
                <TabsList className="grid grid-cols-3 w-72">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="messages" className="opacity-50">Messages</TabsTrigger>
                    <TabsTrigger value="emails" className="opacity-50">Emails</TabsTrigger>
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

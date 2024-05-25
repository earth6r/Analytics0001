import DashboardTabs from "@/components/dashboard-tabs";
import DateRangePicker from "@/components/date-range-picker";
import Header from "@/components/header";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const Stats = () => {
    useEffect(() => {
        const authenticatedData = JSON.parse(localStorage.getItem("authenticated") ?? "{}");
        if (!authenticatedData.authenticated || authenticatedData.expires < new Date().getTime()) {
            window.location.href = "/";
        }
    }, []);

    return (
        <div>
            <Header />
            <div className="flex flex-col md:flex-row items-center justify-between pl-6 pt-6 pr-6">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <div className="flex flex-row items-center space-x-2">
                    <DateRangePicker />
                    <Button className="hidden md:block">Download</Button>
                </div>
            </div>
            <DashboardTabs />
        </div>
    );
};

export default Stats;

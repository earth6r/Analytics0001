import DashboardTabs from "@/components/dashboard-tabs";
import Header from "@/components/header";
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
            <DashboardTabs />
        </div>
    );
};

export default Stats;

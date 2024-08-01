import DashboardTabs from "@/components/dashboard/dashboard-tabs";
import DateRangePicker from "@/components/dashboard/date-range-picker";
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { ArrowDownToLine } from "lucide-react";

const Stats = () => {
  useEffect(() => {
    const authenticatedData = JSON.parse(
      localStorage.getItem("authenticated") ?? "{}",
    );
    if (
      !authenticatedData.authenticated ||
      authenticatedData.expires < new Date().getTime()
    ) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div>
      <Header />
      <div className="flex flex-col items-center justify-between pl-6 pr-6 pt-6 md:flex-row">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex flex-row items-center space-x-2">
          {/* TODO: uncomment after implementing this */}
          {/* <DateRangePicker />
          <Button className="hidden md:block">
            <div className="flex flex-row items-center space-x-2">
              <ArrowDownToLine className="w-4 h-4" />
              <h1>Download</h1>
            </div>
          </Button> */}
        </div>
      </div>
      <DashboardTabs />
    </div>
  );
};

export default Stats;

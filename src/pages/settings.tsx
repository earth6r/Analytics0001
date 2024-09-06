import AccountForm from "@/components/settings/account-form";
import AppearanceForm from "@/components/settings/appearance-form";
import DisplayForm from "@/components/settings/display-form";
import Header from "@/components/common/header";
import ProfileForm from "@/components/settings/profile-form";
import SettingsTab from "@/components/settings/settings-tab";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import NotificationForm from "@/components/settings/notification-form";
import { ArrowLeftCircleIcon, Bell, CircleUser, Cookie, Handshake, LogOut, Monitor, SunMoon, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

const Settings = () => {
  const [selectedSettingsTab, setSelectedSettingsTab] = useState<string | null>("profile");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const router = useRouter();

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

  // this will set the selectedSettingsTab to null when the window is resized to mobile
  // and is dynamic so that when the screen size is changed by the user, it will adjust accordingly
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setSelectedSettingsTab(null);
        setIsMobile(true);
      } else {
        setSelectedSettingsTab("profile");
        setIsMobile(false);
      }
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div>
      <Header />
      <div className={cn("pl-6 pr-6", isMobile && selectedSettingsTab ? "pt-0" : "pt-6")}>
        {
          (!isMobile || !selectedSettingsTab) &&
          <div>
            <h1 className="text-4xl font-bold">Settings</h1>
            <h2 className="text-lg font-light text-muted-foreground">
              Manage your account settings.
            </h2>
          </div>
        }

        {(!isMobile || !selectedSettingsTab) && <Separator className="mt-6" />}

        {
          !selectedSettingsTab && <div className="mt-6 block md:hidden space-y-4">
            <Button
              variant="secondary"
              className="h-12 w-full flex flex-row items-center justify-center space-x-2"
              onClick={() => setSelectedSettingsTab("profile")}
            >
              <User className="w-4 h-4" />
              <h1>Profile</h1>
            </Button>
            <Button
              variant="secondary"
              className="h-12 w-full flex flex-row items-center justify-center space-x-2"
              onClick={() => setSelectedSettingsTab("account")}
            >
              <CircleUser className="w-4 h-4" />
              <h1>
                Account
              </h1>
            </Button>
            <Button
              variant="secondary"
              className="h-12 w-full flex flex-row items-center justify-center space-x-2"
              onClick={() => setSelectedSettingsTab("appearance")}
            >
              <SunMoon className="w-4 h-4" />
              <h1>
                Appearance
              </h1>
            </Button>
            <Button
              variant="secondary"
              className="h-12 w-full flex flex-row items-center justify-center space-x-2"
              onClick={() => setSelectedSettingsTab("notifications")}
            >
              <Bell className="w-4 h-4" />
              <h1>
                Notifications
              </h1>
            </Button>
            <Button
              variant="secondary"
              className="h-12 w-full flex flex-row items-center justify-center space-x-2"
              onClick={() => setSelectedSettingsTab("display")}
            >
              <Monitor className="w-4 h-4" />
              <h1>
                Display
              </h1>
            </Button>
            <div className="cursor-not-allowed">
              <Button
                variant="secondary"
                className="h-12 w-full flex flex-row items-center justify-center space-x-2 cursor-not-allowed"
                disabled
              // onClick={() => setSelectedSettingsTab("privacy")}
              >
                <Cookie className="w-4 h-4" />
                <h1>
                  Privacy Policy
                </h1>
              </Button>
            </div>
            <div className="cursor-not-allowed">
              <Button
                variant="secondary"
                className="h-12 w-full flex flex-row items-center justify-center space-x-2"
                disabled
              // onClick={() => setSelectedSettingsTab("tos")}
              >
                <Handshake className="w-4 h-4" />
                <h1>
                  Terms of Service
                </h1>
              </Button>
            </div>
            <Button
              variant="secondary"
              className="text-red-500 h-12 w-full flex flex-row items-center justify-center space-x-2"
              onClick={async () => {
                localStorage.removeItem("authenticated");
                window.location.href = "/";
              }}
            >
              <LogOut className="w-4 h-4" />
              <h1>
                Logout
              </h1>
            </Button>
          </div>
        }

        <div className="flex flex-col md:flex-row items-start space-x-6 pt-6">

          <div className="hidden md:block w-1/5 space-y-1">
            <SettingsTab
              selectedSettingsTab={selectedSettingsTab}
              setSelectedSettingsTab={setSelectedSettingsTab}
              title="Profile"
              titleValue="profile"
              icon={<User className="w-4 h-4" />}
            />
            <SettingsTab
              selectedSettingsTab={selectedSettingsTab}
              setSelectedSettingsTab={setSelectedSettingsTab}
              title="Account"
              titleValue="account"
              icon={<CircleUser className="w-4 h-4" />}
            />
            <SettingsTab
              selectedSettingsTab={selectedSettingsTab}
              setSelectedSettingsTab={setSelectedSettingsTab}
              title="Appearance"
              titleValue="appearance"
              icon={<SunMoon className="w-4 h-4" />}
            />
            <SettingsTab
              selectedSettingsTab={selectedSettingsTab}
              setSelectedSettingsTab={setSelectedSettingsTab}
              title="Notifications"
              titleValue="notifications"
              icon={<Bell className="w-4 h-4" />}
            />
            <SettingsTab
              selectedSettingsTab={selectedSettingsTab}
              setSelectedSettingsTab={setSelectedSettingsTab}
              title="Display"
              titleValue="display"
              icon={<Monitor className="w-4 h-4" />}
            />
          </div>

          <div className="w-[90%] md:w-4/5">
            {selectedSettingsTab === "profile" && (
              <div>
                <div className="flex flex-row items-center space-x-2 md:space-x-0">
                  {selectedSettingsTab && <div className="md:hidden">
                    <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => setSelectedSettingsTab(null)} />
                  </div>}
                  <h2 className="text-2xl">Profile</h2>
                </div>
                <h3 className="text-md mt-2 font-light text-muted-foreground">
                  This is how others will see you.
                </h3>
                <Separator className="mb-6 mt-6" />
                <ProfileForm />
              </div>
            )}

            {selectedSettingsTab === "account" && (
              <div>
                <div className="flex flex-row items-center space-x-2 md:space-x-0">
                  {selectedSettingsTab && <div className="md:hidden">
                    <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => setSelectedSettingsTab(null)} />
                  </div>}
                  <h2 className="text-2xl">Account</h2>
                </div>
                <h3 className="text-md mt-2 font-light text-muted-foreground">
                  Manage your account settings.
                </h3>
                <Separator className="mb-6 mt-6" />
                <AccountForm />
                <div
                  className="mt-2 text-sm text-blue-500 hover:underline cursor-pointer select-none"
                  onClick={() => router.push(`/admin`)}
                >
                  View Admin Portal
                </div>
              </div>
            )}

            {selectedSettingsTab === "appearance" && (
              <div>
                <div className="flex flex-row items-center space-x-2 md:space-x-0">
                  {selectedSettingsTab && <div className="md:hidden">
                    <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => setSelectedSettingsTab(null)} />
                  </div>}
                  <h2 className="text-2xl">Appearance</h2>
                </div>
                <h3 className="text-md mt-2 font-light text-muted-foreground">
                  Customize the appearance of the app. Automatically switch
                  between day and night themes and different primary colors.
                </h3>
                <Separator className="mb-6 mt-6" />
                <AppearanceForm />
              </div>
            )}

            {selectedSettingsTab === "notifications" && (
              <div>
                <div className="flex flex-row items-center space-x-2 md:space-x-0">
                  {selectedSettingsTab && <div className="md:hidden">
                    <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => setSelectedSettingsTab(null)} />
                  </div>}
                  <h2 className="text-2xl">Notifications</h2>
                </div>
                <h3 className="text-md mt-2 font-light text-muted-foreground">
                  Configure how you receive notifications.
                </h3>
                <Separator className="mb-6 mt-6" />
                <NotificationForm />
                {/* TODO: add in a setting for subscribing to error emails currently set to yan, james and api
                need to then add in logic to add to firestore and every time saveError is called, need to modify
                the function to query all the subscribed email
                https://github.com/users/apinanyogaratnam/projects/35/views/1?pane=issue&itemId=74689571 */}
                <div
                  className="mt-2 text-sm text-blue-500 hover:underline cursor-pointer select-none"
                  onClick={() => router.push(`/errors`)}
                >
                  Interested in seeing internal errors?
                </div>
              </div>
            )}

            {selectedSettingsTab === "display" && (
              <div>
                <div className="flex flex-row items-center space-x-2 md:space-x-0">
                  {selectedSettingsTab && <div className="md:hidden">
                    <ArrowLeftCircleIcon className="w-10 h-10 cursor-pointer" onClick={() => setSelectedSettingsTab(null)} />
                  </div>}
                  <h2 className="text-2xl">Display</h2>
                </div>
                <h3 className="text-md mt-2 font-light text-muted-foreground">{`Turn items on or off to control what's displayed in the app.`}</h3>
                <Separator className="mb-6 mt-6" />
                <DisplayForm />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;

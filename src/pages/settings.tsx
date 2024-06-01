import AccountForm from "@/components/settings/account-form";
import AppearanceForm from "@/components/settings/appearance-form";
import DisplayForm from "@/components/settings/display-form";
import Header from "@/components/common/header";
import ProfileForm from "@/components/settings/profile-form";
import SettingsTab from "@/components/settings/settings-tab";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import NotificationForm from "@/components/settings/notification-form";

const Settings = () => {
    const [selectedSettingsTab, setSelectedSettingsTab] = useState("profile");

    useEffect(() => {
        const authenticatedData = JSON.parse(localStorage.getItem("authenticated") ?? "{}");
        if (!authenticatedData.authenticated || authenticatedData.expires < new Date().getTime()) {
            window.location.href = "/";
        }
    }, []);

    return (
        <div>
            <Header />
            <div className="pl-6 pt-6 pr-6">
                <h1 className="text-4xl font-bold">Settings</h1>
                <h2 className="text-lg text-muted-foreground font-light">Manage your account settings.</h2>
                <Separator className="mt-6" />

                <div className="flex flex-row items-start space-x-6 pt-6">
                    <div className="w-1/5">
                        <SettingsTab selectedSettingsTab={selectedSettingsTab} setSelectedSettingsTab={setSelectedSettingsTab} title="Profile" titleValue="profile" />
                        <SettingsTab selectedSettingsTab={selectedSettingsTab} setSelectedSettingsTab={setSelectedSettingsTab} title="Account" titleValue="account" />
                        <SettingsTab selectedSettingsTab={selectedSettingsTab} setSelectedSettingsTab={setSelectedSettingsTab} title="Appearance" titleValue="appearance" />
                        <SettingsTab selectedSettingsTab={selectedSettingsTab} setSelectedSettingsTab={setSelectedSettingsTab} title="Notifications" titleValue="notifications" />
                        <SettingsTab selectedSettingsTab={selectedSettingsTab} setSelectedSettingsTab={setSelectedSettingsTab} title="Display" titleValue="display" />
                    </div>
                    <div className="w-4/5">
                        {selectedSettingsTab === "profile" && (
                            <div>
                                <h2 className="text-2xl">Profile</h2>
                                <h3 className="text-md text-muted-foreground font-light mt-2">This is how others will see your sight.</h3>
                                <Separator className="mt-6 mb-6" />
                                <ProfileForm />
                            </div>
                        )}
                        {selectedSettingsTab === "account" && (
                            <div>
                                <h2 className="text-2xl mt-6">Account</h2>
                                <h3 className="text-md text-muted-foreground font-light mt-2">Manage your account settings.</h3>
                                <Separator className="mt-6 mb-6" />
                                <AccountForm />
                            </div>
                        )}
                        {selectedSettingsTab === "appearance" && (
                            <div>
                                <h2 className="text-2xl mt-6">Appearance</h2>
                                <h3 className="text-md text-muted-foreground font-light mt-2">Customize the appearance of the app. Automatically switch between day and night themes.</h3>
                                <Separator className="mt-6 mb-6" />
                                <AppearanceForm />
                            </div>
                        )}
                        {selectedSettingsTab === "notifications" && (
                            <div>
                                <h2 className="text-2xl mt-6">Notifications</h2>
                                <h3 className="text-md text-muted-foreground font-light mt-2">Configure how you receive notifications.</h3>
                                <Separator className="mt-6 mb-6" />
                                <NotificationForm />
                            </div>
                        )}
                        {selectedSettingsTab === "display" && (
                            <div>
                                <h2 className="text-2xl mt-6">Display</h2>
                                <h3 className="text-md text-muted-foreground font-light mt-2">{`Turn items on or off to control what's displayed in the app.`}</h3>
                                <Separator className="mt-6 mb-6" />
                                <DisplayForm />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;

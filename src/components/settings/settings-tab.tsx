import { cn } from "@/lib/utils";

interface SettingsTabProps {
    selectedSettingsTab: string;
    setSelectedSettingsTab: (value: string) => void;
    title: string;
    titleValue: string;
}

const SettingsTab = (props: SettingsTabProps) => {
    const { selectedSettingsTab, setSelectedSettingsTab, title, titleValue } = props;

    return (
        <div
            className={cn(`cursor-pointer rounded-md p-2 ${selectedSettingsTab === titleValue ? "text-foreground bg-slate-100 dark:bg-slate-800" : "text-muted-foreground"}`)}
            onClick={() => setSelectedSettingsTab(titleValue)}
        >
            <h1 className="ml-2">
                {title}
            </h1>
        </div>
    );
};

export default SettingsTab;

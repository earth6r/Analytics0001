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
            className={cn(`cursor-pointer rounded-md p-2 ${selectedSettingsTab === titleValue ? "text-foreground bg-slate-100" : "text-muted-foreground"}`)}
            onClick={() => setSelectedSettingsTab(titleValue)}
        >{title}</div>
    );
};

export default SettingsTab;

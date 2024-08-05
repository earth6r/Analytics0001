import { cn } from "@/lib/utils";

interface SettingsTabProps {
  selectedSettingsTab: string | null;
  setSelectedSettingsTab: (value: string) => void;
  title: string;
  titleValue: string;
  icon: React.ReactNode;
}

const SettingsTab = (props: SettingsTabProps) => {
  const { selectedSettingsTab, setSelectedSettingsTab, title, titleValue, icon } =
    props;

  return (
    <div
      className={cn(
        `hover:dark:bg-gray-800 hover:bg-gray-100 cursor-pointer rounded-md p-2 ${selectedSettingsTab === titleValue ? "bg-slate-100 text-foreground dark:bg-slate-800" : "text-muted-foreground"}`,
      )}
      onClick={() => setSelectedSettingsTab(titleValue)}
    >
      <div className="space-x-2 flex flex-row items-center ml-2">
        {icon}
        <h1 className="ml-2">{title}</h1>
      </div>
    </div>
  );
};

export default SettingsTab;

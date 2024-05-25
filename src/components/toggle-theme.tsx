import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";

const ToggleTheme = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Only run this effect when `theme` or `resolvedTheme` changes
  useEffect(() => {
    if (!resolvedTheme) return;
    document.documentElement.setAttribute("data-theme", resolvedTheme);
  }, [resolvedTheme]);

  if (!mounted) return null; // Don't render the switch server-side

  const isDarkMode = theme === "dark" || resolvedTheme === "dark";

  const handleToggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <Switch
      defaultChecked={isDarkMode}
      checked={isDarkMode}
      onClick={handleToggleTheme}
    />
  );
};

export default ToggleTheme;

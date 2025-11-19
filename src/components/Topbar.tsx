import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { Moon, Sun, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export function Topbar() {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const isDarkMode = root.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <header className="h-16 border-b border-border bg-surface px-6 flex items-center justify-between">
      <div className="flex-1">
        <h1 className="text-lg font-bold tracking-tight">Paidvine Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
        </Button>

        {/* User Avatar */}
        <Avatar className="h-9 w-9 cursor-pointer">
          <AvatarImage src={user?.image} />
          <AvatarFallback>
            {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, LogOut, Menu, User } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardNav() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <img src="/logo.svg" alt="Paidvine" className="h-7 w-7 sm:h-8 sm:w-8" />
              <span className="text-lg sm:text-xl font-bold tracking-tight">Paidvine</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <Button
                variant="ghost"
                className={`gap-2 font-semibold ${
                  window.location.pathname === "/dashboard"
                    ? "text-primary border-b-2 border-primary rounded-none"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className={`gap-2 font-semibold ${
                  window.location.pathname === "/surveys"
                    ? "text-primary border-b-2 border-primary rounded-none"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => navigate("/surveys")}
              >
                Surveys
              </Button>
              <Button
                variant="ghost"
                className={`gap-2 font-semibold ${
                  window.location.pathname === "/survey-history"
                    ? "text-primary border-b-2 border-primary rounded-none"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => navigate("/survey-history")}
              >
                History
              </Button>
              <Button
                variant="ghost"
                className={`gap-2 font-semibold ${
                  window.location.pathname === "/leaderboard"
                    ? "text-primary border-b-2 border-primary rounded-none"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => navigate("/leaderboard")}
              >
                Leaderboard
              </Button>
              <Button
                variant="ghost"
                className={`gap-2 font-semibold ${
                  window.location.pathname === "/request-redemption"
                    ? "text-primary border-b-2 border-primary rounded-none"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => navigate("/request-redemption")}
              >
                Redeem
              </Button>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-muted">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {user?.email || "Guest"}
              </span>
            </div>
            <Button variant="outline" onClick={handleSignOut} className="gap-2">
              <LogOut className="h-4 w-4" />
              Sign Out
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t space-y-2"
            >
              <Button
                variant="ghost"
                className="w-full justify-start gap-2 text-primary font-semibold"
                onClick={() => {
                  navigate("/dashboard");
                  setMobileMenuOpen(false);
                }}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  navigate("/surveys");
                  setMobileMenuOpen(false);
                }}
              >
                Surveys
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  navigate("/survey-history");
                  setMobileMenuOpen(false);
                }}
              >
                History
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  navigate("/leaderboard");
                  setMobileMenuOpen(false);
                }}
              >
                Leaderboard
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start gap-2"
                onClick={() => {
                  navigate("/request-redemption");
                  setMobileMenuOpen(false);
                }}
              >
                Redeem
              </Button>
              <div className="px-3 py-2 text-sm text-muted-foreground">
                {user?.email || "Guest"}
              </div>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Target,
  ShieldAlert,
  GraduationCap,
  Users,
  FileText,
  LogIn,
  UserPlus,
  BarChart3,
  User,
  X,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Campaigns", href: "/campaigns", icon: Target },
  { title: "Risk Analysis", href: "/risk-analytics", icon: ShieldAlert },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "Training", href: "/training", icon: GraduationCap },
  { title: "Users", href: "/users", icon: Users },
  { title: "User Profile", href: "/profile", icon: User },
  { title: "Reports", href: "/reports", icon: FileText },
];

const authItems = [
  { title: "Sign In", href: "/auth/sign-in", icon: LogIn },
  { title: "Register", href: "/auth/sign-up", icon: UserPlus },
];

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const location = useLocation();

  return (
    <aside className="w-56 bg-white flex flex-col relative z-10 h-full border-r border-stone-200">
      {/* Brand */}
      <div className="px-3 py-3 flex items-center justify-between border-b border-stone-100">
        <div className="flex items-center gap-3">
          <img src="https://www.rekrute.com/rekrute/file/entrepriseLogoInfo/recruiter_id/314572" alt="Logo" className="w-8 h-8 object-contain rounded-md" />
          <div>
            <h1 className="text-sm font-bold text-stone-900 leading-none">KIRA Phishing</h1>
            <p className="text-[10px] text-stone-400 mt-1">Risk Platform</p>
          </div>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden p-0.5 h-5 w-5 text-stone-500"
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        <p className="px-2 pt-1 pb-1 text-[9px] font-semibold text-stone-400 uppercase tracking-wider">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <NavLink key={item.href} to={item.href}>
              <div
                className={cn(
                  "flex items-center text-xs rounded-md cursor-pointer px-3 py-2 transition-all duration-150",
                  isActive
                    ? "bg-stone-900 text-white font-medium shadow-sm"
                    : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-normal"
                )}
              >
                <Icon className="mr-3 w-4 h-4 shrink-0" />
                {item.title}
              </div>
            </NavLink>
          );
        })}

        <div className="pt-2 mt-2 border-t border-stone-200">
          <p className="px-2 pb-1 text-[9px] font-semibold text-stone-400 uppercase tracking-wider">Auth</p>
          {authItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <NavLink key={item.href} to={item.href}>
                <div
                  className={cn(
                    "flex items-center text-xs rounded-md cursor-pointer px-3 py-2 transition-all duration-150",
                    isActive
                      ? "bg-stone-900 text-white font-medium shadow-sm"
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900 font-normal"
                  )}
                >
                  <Icon className="mr-3 w-4 h-4 shrink-0" />
                  {item.title}
                </div>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

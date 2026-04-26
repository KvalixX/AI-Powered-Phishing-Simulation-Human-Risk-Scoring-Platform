import {
    Search,
    ChevronDown,
    LogOut,
    User,
    Settings,
} from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";

export function Navbar() {
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { currentUser, logout } = useAppStore();
    const navigate = useNavigate();

    return (
        <div className="h-14 border-b border-stone-200 bg-white flex items-center px-4 gap-4 relative z-30 no-print">
            {/* Search */}
            <div className="relative flex-1 max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                    placeholder="Search..."
                    className="pl-9 h-9 text-xs bg-stone-50 border-stone-200 rounded-md"
                />
            </div>

            <div className="flex-1" />

            {/* User Menu */}
            <div className="relative">
                <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); }}
                    className="flex items-center gap-2 hover:bg-stone-50 rounded-md px-2 py-1 transition-colors"
                >
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                            {currentUser?.name?.split(" ").map((n) => n[0]).join("") ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                        <p className="text-xs font-semibold text-stone-900 leading-none">
                            {currentUser?.name ?? "Guest User"}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-1 capitalize">{currentUser?.organization ?? "Your Organization"}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-stone-400 hidden md:block ml-1" />
                </button>

                {userMenuOpen && (
                    <div className="absolute right-0 top-9 w-40 bg-white border border-stone-200 rounded-lg shadow-xl z-50 py-1">
                        <button
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-stone-700 hover:bg-stone-50"
                            onClick={() => { setUserMenuOpen(false); navigate("/settings"); }}
                        >
                            <Settings className="w-3 h-3" /> Settings
                        </button>
                        <div className="my-0.5 border-t border-stone-100" />
                        <button
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-red-600 hover:bg-red-50"
                            onClick={() => { logout(); navigate("/sign-in"); }}
                        >
                            <LogOut className="w-3 h-3" /> Sign out
                        </button>
                    </div>
                )}
            </div>

            {userMenuOpen && (
                <div className="fixed inset-0 z-20" onClick={() => { setUserMenuOpen(false); }} />
            )}
        </div>
    );
}

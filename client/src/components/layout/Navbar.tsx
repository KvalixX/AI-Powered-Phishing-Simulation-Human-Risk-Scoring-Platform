import {
    Bell,
    Search,
    ChevronDown,
    AlertTriangle,
    CheckCircle2,
    Info,
    XCircle,
    LogOut,
    User,
    Settings,
    X,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppStore, Notification } from "@/store/useAppStore";
import { useNavigate } from "react-router-dom";

function NotificationIcon({ type }: { type: Notification["type"] }) {
    const cls = "w-3 h-3";
    switch (type) {
        case "warning": return <AlertTriangle className={cn(cls, "text-amber-500")} />;
        case "success": return <CheckCircle2 className={cn(cls, "text-green-500")} />;
        case "error": return <XCircle className={cn(cls, "text-red-500")} />;
        default: return <Info className={cn(cls, "text-blue-500")} />;
    }
}

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
}

export function Navbar() {
    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, currentUser, logout } = useAppStore();
    const navigate = useNavigate();

    return (
        <div className="h-14 border-b border-stone-200 bg-white flex items-center px-4 gap-4 relative z-30">
            {/* Search */}
            <div className="relative flex-1 max-w-md hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                    placeholder="Search..."
                    className="pl-9 h-9 text-xs bg-stone-50 border-stone-200 rounded-md"
                />
            </div>

            <div className="flex-1" />

            {/* Notifications */}
            <div className="relative">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setNotifOpen(!notifOpen); setUserMenuOpen(false); }}
                    className="w-9 h-9 p-0 relative text-stone-500 hover:text-stone-900"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </Button>

                {notifOpen && (
                    <div className="absolute right-0 top-9 w-72 bg-white border border-stone-200 rounded-lg shadow-xl z-50">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-stone-100">
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-stone-900 text-xs">Notifications</span>
                                {unreadCount > 0 && (
                                    <Badge className="bg-red-100 text-red-700 text-[9px] px-1 py-0">{unreadCount} new</Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-0.5">
                                {unreadCount > 0 && (
                                    <Button variant="ghost" size="sm" className="text-[10px] h-5 px-1.5" onClick={markAllAsRead}>
                                        Mark all read
                                    </Button>
                                )}
                                <Button variant="ghost" size="sm" className="w-5 h-5 p-0" onClick={() => setNotifOpen(false)}>
                                    <X className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="max-h-64 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="px-3 py-6 text-center text-stone-400 text-xs">No notifications</div>
                            ) : (
                                notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        className={cn(
                                            "flex items-start gap-2.5 px-3 py-2 hover:bg-stone-50 cursor-pointer border-b border-stone-50",
                                            !notif.read && "bg-blue-50/50"
                                        )}
                                        onClick={() => markAsRead(notif.id)}
                                    >
                                        <div className="mt-0.5 shrink-0"><NotificationIcon type={notif.type} /></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] font-medium text-stone-900 truncate">{notif.title}</p>
                                            <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                            <p className="text-[10px] text-stone-400 mt-0.5">{timeAgo(notif.timestamp)}</p>
                                        </div>
                                        {!notif.read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* User Menu */}
            <div className="relative">
                <button
                    onClick={() => { setUserMenuOpen(!userMenuOpen); setNotifOpen(false); }}
                    className="flex items-center gap-2 hover:bg-stone-50 rounded-md px-2 py-1 transition-colors"
                >
                    <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-blue-600 text-white text-xs font-semibold">
                            {currentUser?.name?.split(" ").map((n) => n[0]).join("") ?? "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                        <p className="text-xs font-semibold text-stone-900 leading-none">
                            {currentUser?.name ?? "Admin"}
                        </p>
                        <p className="text-[10px] text-stone-400 mt-1 capitalize">{currentUser?.role ?? "admin"}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-stone-400 hidden md:block ml-1" />
                </button>

                {userMenuOpen && (
                    <div className="absolute right-0 top-9 w-40 bg-white border border-stone-200 rounded-lg shadow-xl z-50 py-1">
                        <button
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-stone-700 hover:bg-stone-50"
                            onClick={() => { setUserMenuOpen(false); navigate("/profile"); }}
                        >
                            <User className="w-3 h-3" /> My Profile
                        </button>
                        <button className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-stone-700 hover:bg-stone-50">
                            <Settings className="w-3 h-3" /> Settings
                        </button>
                        <div className="my-0.5 border-t border-stone-100" />
                        <button
                            className="flex items-center gap-2 w-full px-3 py-1.5 text-[11px] text-red-600 hover:bg-red-50"
                            onClick={() => { logout(); navigate("/auth/sign-in"); }}
                        >
                            <LogOut className="w-3 h-3" /> Sign out
                        </button>
                    </div>
                )}
            </div>

            {(notifOpen || userMenuOpen) && (
                <div className="fixed inset-0 z-20" onClick={() => { setNotifOpen(false); setUserMenuOpen(false); }} />
            )}
        </div>
    );
}

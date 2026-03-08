import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
    id: string;
    type: "warning" | "success" | "info" | "error";
    title: string;
    message: string;
    timestamp: Date;
    read: boolean;
}

export interface CurrentUser {
    id: number;
    name: string;
    email: string;
    role: "admin" | "manager" | "user";
    department: string;
    avatar?: string;
}

interface AppState {
    // ── Auth ──────────────────────────────────────────
    currentUser: CurrentUser | null;
    token: string | null;
    isAuthenticated: boolean;
    setCurrentUser: (user: CurrentUser | null) => void;
    setToken: (token: string | null) => void;
    logout: () => void;

    // ── Notifications ─────────────────────────────────
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, "id" | "timestamp" | "read">) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    removeNotification: (id: string) => void;
    clearAllNotifications: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            // ── Auth ──────────────────────────────────────
            currentUser: {
                id: 1,
                name: "Admin Kira",
                email: "admin@kirasec.com",
                role: "admin",
                department: "Security",
            },
            token: null,
            isAuthenticated: false,
            setCurrentUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
            setToken: (token) => {
                if (token) localStorage.setItem("auth_token", token);
                else localStorage.removeItem("auth_token");
                set({ token, isAuthenticated: !!token });
            },
            logout: () => {
                localStorage.removeItem("auth_token");
                set({ currentUser: null, token: null, isAuthenticated: false });
            },

            // ── Notifications ─────────────────────────────
            notifications: [
                {
                    id: "1",
                    type: "warning",
                    title: "High Risk Alert",
                    message: "Sales department click rate increased 15%",
                    timestamp: new Date(),
                    read: false,
                },
                {
                    id: "2",
                    type: "success",
                    title: "Campaign Completed",
                    message: "Microsoft Login test finished with 89 reports",
                    timestamp: new Date(Date.now() - 3600000),
                    read: false,
                },
                {
                    id: "3",
                    type: "info",
                    title: "New Phishing Vector",
                    message: "New Zoom update phishing template detected",
                    timestamp: new Date(Date.now() - 7200000),
                    read: true,
                },
            ],
            unreadCount: 2,

            addNotification: (notification) => {
                const newNotif: Notification = {
                    ...notification,
                    id: Math.random().toString(36).substr(2, 9),
                    timestamp: new Date(),
                    read: false,
                };
                set((state) => ({
                    notifications: [newNotif, ...state.notifications],
                    unreadCount: state.unreadCount + 1,
                }));
            },

            markAsRead: (id) =>
                set((state) => ({
                    notifications: state.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
                    unreadCount: Math.max(0, state.unreadCount - 1),
                })),

            markAllAsRead: () =>
                set((state) => ({
                    notifications: state.notifications.map((n) => ({ ...n, read: true })),
                    unreadCount: 0,
                })),

            removeNotification: (id) =>
                set((state) => ({
                    notifications: state.notifications.filter((n) => n.id !== id),
                    unreadCount: state.notifications.find((n) => n.id === id && !n.read)
                        ? state.unreadCount - 1 : state.unreadCount,
                })),

            clearAllNotifications: () => set({ notifications: [], unreadCount: 0 }),
        }),
        {
            name: "kira-phishing-store",
            partialize: (state) => ({ currentUser: state.currentUser, token: state.token }),
        }
    )
);

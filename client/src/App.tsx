import { BrowserRouter } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import { authApi } from "./services/api";
import { AppRouter } from "./components/routing/AppRouter";

function App() {
  const { token, currentUser, setCurrentUser, logout } = useAppStore();

  useEffect(() => {
    const initUser = async () => {
      if (token && !currentUser) {
        try {
          const { data } = await authApi.getUser();
          setCurrentUser(data.user);
        } catch (error: any) {
          console.error("Failed to fetch user", error);
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
    };
    initUser();
  }, [token, currentUser, setCurrentUser, logout]);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;


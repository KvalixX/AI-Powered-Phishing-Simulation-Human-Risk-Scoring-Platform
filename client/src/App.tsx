import { HashRouter, Routes, Route } from "react-router-dom";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/footer";
import { ThemeConfigurator } from "@/components/theme-configurator";
import { Menu } from "lucide-react";
import { useState } from "react";
import Dashboard from "@/pages/dashboard";
import Campaigns from "@/pages/campaigns";
import RiskAnalytics from "@/pages/risk-analytics";
import Training from "@/pages/training";
import Users from "@/pages/users";
import Reports from "@/pages/reports";
import Analytics from "@/pages/analytics";
import Profile from "@/pages/profile";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import NotFound from "@/pages/not-found";

function Layout({ children, title, description }: { children: React.ReactNode; title?: string; description?: string }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [themeConfigOpen, setThemeConfigOpen] = useState(false);

  return (
    <div className="flex h-screen bg-stone-50 grain-texture">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-10
        transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
        transition-transform duration-300 ease-in-out
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-2 lg:p-4 flex flex-col">
          <div className="lg:hidden mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          <Card className="flex-1 border border-stone-200 bg-white relative z-20">
            {title && (
              <div className="pt-4 px-3 lg:px-5 pb-3">
                <h1 className="text-base font-semibold text-stone-900 mb-0.5">{title}</h1>
                {description && (
                  <p className="text-xs text-stone-500">{description}</p>
                )}
                <div className="border-b border-stone-200 mt-3"></div>
              </div>
            )}
            {children}
          </Card>
          <Footer />
        </main>
      </div>

      <ThemeConfigurator
        isOpen={themeConfigOpen}
        onClose={() => setThemeConfigOpen(false)}
      />
    </div>
  );
}

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Layout><Dashboard /></Layout>} />
      <Route path="/campaigns" element={
        <Layout title="Phishing Campaigns" description="Create and manage phishing simulation campaigns">
          <Campaigns />
        </Layout>
      } />
      <Route path="/risk-analytics" element={
        <Layout title="Risk Analysis" description="Evaluate human risk with dynamic AI scoring">
          <RiskAnalytics />
        </Layout>
      } />
      <Route path="/analytics" element={
        <Layout title="Analytics & Statistics" description="Advanced analytics and behavioral insights">
          <Analytics />
        </Layout>
      } />
      <Route path="/training" element={
        <Layout title="Training" description="Personalized and automated training modules">
          <Training />
        </Layout>
      } />
      <Route path="/users" element={
        <Layout title="Users" description="Manage users and track their threat exposure">
          <Users />
        </Layout>
      } />
      <Route path="/profile" element={
        <Layout title="User Risk Profile" description="Individual risk profile and behavior analysis">
          <Profile />
        </Layout>
      } />
      <Route path="/profile/:id" element={
        <Layout title="User Risk Profile" description="Individual risk profile and behavior analysis">
          <Profile />
        </Layout>
      } />
      <Route path="/reports" element={
        <Layout title="Reports" description="Detailed reports and performance analytics">
          <Reports />
        </Layout>
      } />
      <Route path="/auth/sign-in" element={<SignIn />} />
      <Route path="/auth/sign-up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </HashRouter>
  );
}

export default App;

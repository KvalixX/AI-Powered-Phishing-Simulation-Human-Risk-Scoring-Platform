import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import Dashboard from "@/pages/dashboard";
import Campaigns from "@/pages/campaigns";
import RiskAnalytics from "@/pages/risk-analytics";
import Training from "@/pages/training";
import Users from "@/pages/users";
import Reports from "@/pages/reports";
import Analytics from "@/pages/analytics";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import NotFound from "@/pages/not-found";

import { useAppStore } from "@/store/useAppStore";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAppStore();
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
      <Route path="/campaigns" element={
        <PrivateRoute><AppLayout title="Phishing Campaigns" description="Create and manage phishing simulation campaigns">
          <Campaigns />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/risk-analytics" element={
        <PrivateRoute><AppLayout title="Risk Analysis" description="Evaluate human risk with dynamic AI scoring">
          <RiskAnalytics />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/analytics" element={
        <PrivateRoute><AppLayout title="Analytics & Statistics" description="Advanced analytics and behavioral insights">
          <Analytics />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/training" element={
        <PrivateRoute><AppLayout title="Training" description="Personalized and automated training modules">
          <Training />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/users" element={
        <PrivateRoute><AppLayout title="Users" description="Manage users and track their threat exposure">
          <Users />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/profile" element={
        <PrivateRoute><AppLayout title="User Risk Profile" description="Individual risk profile and behavior analysis">
          <Profile />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/profile/:id" element={
        <PrivateRoute><AppLayout title="User Risk Profile" description="Individual risk profile and behavior analysis">
          <Profile />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/settings" element={
        <PrivateRoute><AppLayout title="Settings" description="Manage your account preferences and global settings">
          <Settings />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/reports" element={
        <PrivateRoute><AppLayout title="Reports" description="Detailed reports and performance analytics">
          <Reports />
        </AppLayout></PrivateRoute>
      } />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

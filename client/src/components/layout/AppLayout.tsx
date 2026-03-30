import { Sidebar } from "./sidebar";
import { Navbar } from "./Navbar";
import { Footer } from "./footer";
import { ThemeConfigurator } from "@/components/theme-configurator";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AppLayout({ children, title, description }: AppLayoutProps) {
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

          <Card id="app-content" className="flex-1 border border-stone-200 bg-white relative z-20 overflow-visible print:border-none print:shadow-none">
            {/* Print Header */}
            <div className="hidden print:flex items-center justify-between mb-8 pb-4 border-b border-stone-200">
              <div className="flex items-center gap-4">
                <img src="https://www.rekrute.com/rekrute/file/entrepriseLogoInfo/recruiter_id/314572" alt="Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h1 className="text-xl font-bold text-stone-900">Platform de Cyber-sécurité KIRA</h1>
                  <p className="text-sm text-stone-500">Rapport de Simulation de Phishing & Analyse de Risque</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-stone-900">Date du Rapport</p>
                <p className="text-sm text-stone-500">{new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {title && (
              <div className="pt-4 px-3 lg:px-5 pb-3">
                <h1 className="text-base font-semibold text-stone-900 mb-0.5">{title}</h1>
                {description && (
                  <p className="text-xs text-stone-500">{description}</p>
                )}
                <div className="border-b border-stone-200 mt-3 print:hidden"></div>
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

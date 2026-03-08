import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, Lock, Mail, ArrowRight, User, Building, CheckCircle2 } from "lucide-react";

const features = [
  "AI-generated phishing simulations",
  "Real-time human risk scoring",
  "Automated training recommendations",
  "Detailed analytics & reports",
];

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    organization: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 via-stone-900 to-stone-800 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <img src="https://www.rekrute.com/rekrute/file/entrepriseLogoInfo/recruiter_id/314572" alt="Logo" className="w-10 h-10 object-contain bg-white rounded-xl shadow-lg shadow-blue-900/50 p-1" />
          <div>
            <span className="text-white font-bold text-lg">KIRA Phishing</span>
            <p className="text-stone-400 text-xs">Risk Platform</p>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Start protecting<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
              your organization
            </span>
          </h1>
          <p className="text-stone-400 text-base leading-relaxed max-w-sm mb-8">
            Join thousands of organizations training their employees against the most sophisticated cyber threats.
          </p>

          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-blue-400" />
                </div>
                <span className="text-stone-300 text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 p-5 bg-white/5 border border-white/10 rounded-2xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0">
                SM
              </div>
              <div>
                <p className="text-stone-200 text-sm italic">
                  "Our click rate dropped from 31% to 8% in just 3 months using KIRA Phishing campaigns."
                </p>
                <p className="text-stone-500 text-xs mt-2 font-medium">Sarah M. · CISO, TechCorp International</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-stone-50 dark:bg-stone-950">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="https://www.rekrute.com/rekrute/file/entrepriseLogoInfo/recruiter_id/314572" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            <span className="font-bold text-stone-900 dark:text-white">KIRA Phishing</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Create your account</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-1.5 text-sm">
              Get started with a free 30-day trial
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700 dark:text-stone-300">Full name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  type="text"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={update("name")}
                  className="pl-10 h-11 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700 dark:text-stone-300">Work email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  type="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={update("email")}
                  className="pl-10 h-11 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700 dark:text-stone-300">Organization</Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Acme Corp"
                  value={form.organization}
                  onChange={update("organization")}
                  className="pl-10 h-11 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium text-stone-700 dark:text-stone-300">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={form.password}
                  onChange={update("password")}
                  className="pl-10 pr-10 h-11 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-stone-900 hover:bg-stone-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium mt-2"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-stone-400 dark:text-stone-500 text-center mt-4">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
          </p>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Already have an account?{" "}
              <Link to="/auth/sign-in" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div >
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, Lock, Mail, ArrowRight, Zap, Users, Target } from "lucide-react";

const stats = [
  { icon: Target, value: "2,400+", label: "Simulations Run" },
  { icon: Users, value: "98%", label: "Coverage Rate" },
  { icon: Zap, value: "−42%", label: "Avg Risk Reduction" },
];

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-stone-900 via-stone-800 to-slate-900 flex-col justify-between p-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 -left-12 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/4 w-px h-64 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent" />
          <div className="absolute top-1/4 left-1/2 w-px h-48 bg-gradient-to-b from-transparent via-purple-500/20 to-transparent" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        {/* Brand */}
        <div className="relative z-10 flex items-center gap-3">
          <img src="https://www.rekrute.com/rekrute/file/entrepriseLogoInfo/recruiter_id/314572" alt="Logo" className="w-10 h-10 object-contain bg-white rounded-xl shadow-lg shadow-blue-900/50 p-1" />
          <div>
            <span className="text-white font-bold text-lg">KIRA Phishing</span>
            <p className="text-stone-400 text-xs">Risk Platform</p>
          </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 mb-6">
            <Zap className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-blue-300 text-xs font-medium">AI-Powered Security Training</span>
          </div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Strengthen your<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
              human firewall
            </span>
          </h1>
          <p className="text-stone-400 text-base leading-relaxed max-w-sm">
            Simulate real-world phishing attacks, identify vulnerabilities, and train your team with AI-generated campaigns.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {stats.map((s) => (
              <div key={s.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <s.icon className="w-5 h-5 text-blue-400 mb-2" />
                <div className="text-xl font-bold text-white">{s.value}</div>
                <div className="text-xs text-stone-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel – Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-stone-50 dark:bg-stone-950">
        <div className="w-full max-w-sm">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="https://www.rekrute.com/rekrute/file/entrepriseLogoInfo/recruiter_id/314572" alt="Logo" className="w-8 h-8 object-contain rounded-lg" />
            <span className="font-bold text-stone-900 dark:text-white">KIRA Phishing</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">Welcome back</h2>
            <p className="text-stone-500 dark:text-stone-400 mt-1.5 text-sm">
              Sign in to your security dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium text-stone-700 dark:text-stone-300">
                  Password
                </Label>
                <Link to="/auth/reset-password" className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700"
                  required
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
              className="w-full h-11 bg-stone-900 hover:bg-stone-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium"
              disabled={loading}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              Don't have an account?{" "}
              <Link to="/auth/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                Create account
              </Link>
            </p>
          </div>

          <div className="mt-8 p-3 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-stone-500 mt-0.5 shrink-0" />
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Protected by enterprise-grade security. All sessions are encrypted and monitored.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import {
  GraduationCap,
  Users,
  ShieldCheck,
  Mail,
  Lock,
  Hash,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { AuthUser, UserRole } from "../types";
import { loginUser } from "../utils/api";

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("Student");

  // Form states
  const [registerNumber, setRegisterNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Switch role handler
  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    setRegisterNumber("");
    setEmail("");
    setPassword("");
  };

  const handleRegisterNumberChange = (val: string) => {
    setRegisterNumber(val);
    if (selectedRole === "Student") {
      const trimmed = val.trim();
      setEmail(trimmed ? `${trimmed}@eec.srmrmp.edu.in` : "");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await loginUser({
        role: selectedRole,
        email: email.trim(),
        password,
        registerNumber:
          selectedRole === "Student" ? registerNumber.trim() : undefined,
      });
      onLoginSuccess(res.user);
    } catch (err: any) {
      setErrorMsg(
        err.message || "Authentication failed. Please verify credentials.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f6] text-slate-800 flex flex-col justify-center items-center py-8 px-4 sm:px-6 selection:bg-blue-100">
      {/* Brand Header */}
      <div className="w-full max-w-md text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl neu-card p-1.5 mb-3 shadow-[4px_4px_10px_#d1d9e6,-4px_-4px_10px_#ffffff]">
          <img
            src="/Easwari_Engineering_College_logo.png"
            alt="Easwari Engineering College logo"
            className="w-full h-full object-contain"
          />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          NEXORA
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-600 font-medium">
          A Centralized AI & Data Science Student Coding and Project Progress
          Tracking Platform
        </p>
        <p className="text-[11px] text-slate-500 mt-1">
          Easwari Engineering College (SRM RMP Campus)
        </p>
      </div>

      {/* Main Neumorphic Login Box */}
      <div className="w-full max-w-md">
        <div className="neu-card rounded-2xl p-6 sm:p-8 space-y-6">
          {/* Role Selection Tabs */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Institutional Portal
            </label>
            <div className="grid grid-cols-3 gap-2 p-1.5 rounded-xl neu-inset">
              {(["Student", "Faculty", "HOD"] as UserRole[]).map((role) => {
                const isSelected = selectedRole === role;
                const Icon =
                  role === "Student"
                    ? GraduationCap
                    : role === "Faculty"
                      ? Users
                      : ShieldCheck;

                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? "neu-card text-blue-700 shadow-[3px_3px_7px_#d1d9e6,-3px_-3px_7px_#ffffff] border border-blue-200/50"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{role}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Register Number Field */}
            {selectedRole === "Student" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Register Number</span>
                  <span className="text-[10px] text-slate-500 font-normal">
                    12-Digit Register No.
                  </span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Hash className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 310625243220"
                    value={registerNumber}
                    onChange={(e) => handleRegisterNumberChange(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl neu-input text-xs font-mono text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>
            )}

            {/* College Email Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                <span>College Email</span>
                <span className="text-[10px] text-blue-700 font-mono">
                  @eec.srmrmp.edu.in
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder={
                    selectedRole === "Student"
                      ? "310625243220@eec.srmrmp.edu.in"
                      : selectedRole === "Faculty"
                        ? "faculty.name@eec.srmrmp.edu.in"
                        : "hod.aids@eec.srmrmp.edu.in"
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl neu-input text-xs text-slate-900 placeholder-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl neu-input text-xs text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50/80 border border-red-200/80 text-xs text-red-700 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl neu-btn-primary font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to {selectedRole} Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>Department of Artificial Intelligence & Data Science</p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Secure Institutional Access Portal
          </p>
        </div>
      </div>
    </div>
  );
};

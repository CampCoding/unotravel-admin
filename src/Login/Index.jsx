import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Icon } from "@iconify/react";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "/src/assets/images/BusinessCardLogo-removebg-preview.png";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const ok = await login(form.email, form.password);
      if (ok) navigate("/");
      else setError("Invalid credentials. Please try again.");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a3a5c] via-[#1e4976] to-[#3B85C1] flex items-center justify-center p-4 font-Cairo">
      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a3a5c] to-blueMain p-8 text-center">
          <img src={logo} alt="UNO Travel" className="h-16 w-auto object-contain mx-auto mb-3 brightness-0 invert" />
          <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-white/60 text-sm mt-1">Sign in to manage your content</p>
        </div>

        {/* Form */}
        <div className="p-8">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl mb-5">
              <Icon icon="mdi:alert-circle-outline" width={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon icon="mdi:email-outline" width={18} />
                </span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@unotravel.se"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Icon icon="mdi:lock-outline" width={18} />
                </span>
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blueMain/30 focus:border-blueMain transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  <Icon icon={showPass ? "mdi:eye-off-outline" : "mdi:eye-outline"} width={18} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blueMain text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-lg shadow-blueMain/30 mt-2"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin" width={18} />
                  Signing in...
                </>
              ) : (
                <>
                  <Icon icon="mdi:login" width={18} />
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-6">
            © {new Date().getFullYear()} UNO Travel — Admin Panel
          </p>
        </div>
      </div>
    </div>
  );
}

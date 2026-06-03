"use client";

import React, { useState } from "react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (email: string) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const validateForm = () => {
    if (!email) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) return "Invalid email address";
    if (!password) return "Password is required";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (isSignUp) {
      if (!name) return "Name is required";
      if (password !== confirmPassword) return "Passwords do not match";
    }
    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errMsg = validateForm();
    if (errMsg) {
      setError(errMsg);
      return;
    }

    setError("");
    setLoading(true);

    // Simulate server request
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Give a tiny delay for success animation before logging in
      setTimeout(() => {
        onLoginSuccess(email);
        setSuccess(false);
        onClose();
        // Reset fields
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setName("");
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay with blur */}
      <div
        className="absolute inset-0 bg-background/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div className="relative w-full max-w-[440px] bg-surface-container-lowest/80 border border-outline-variant/60 backdrop-blur-xl rounded-3xl shadow-2xl p-8 overflow-hidden transition-all duration-300 scale-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-surface-container-low transition-colors rounded-full text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Success State */}
        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-4xl animate-bounce">
                check_circle
              </span>
            </div>
            <h3 className="font-headline-md text-2xl text-on-surface mb-2">
              {isSignUp ? "Account Created!" : "Welcome Back!"}
            </h3>
            <p className="font-body-md text-on-surface-variant">
              Successfully authenticated. Redirecting...
            </p>
          </div>
        ) : (
          <div>
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">school</span>
              </div>
            </div>

            {/* Header */}
            <h2 className="font-headline-md text-2xl text-center text-on-surface mb-1">
              {isSignUp ? "Join CampusCompass" : "Welcome Back"}
            </h2>
            <p className="font-body-md text-sm text-center text-on-surface-variant mb-6">
              {isSignUp
                ? "Create an account to save colleges and compare features"
                : "Sign in to access your saved college shortlists"}
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3.5 bg-error-container/40 border border-error/20 rounded-xl text-error text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-base">error</span>
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-label-md text-on-surface-variant mb-1">
                    FULL NAME
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    disabled={loading}
                    className="w-full bg-surface-container-low/50 border border-outline-variant/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-outline/70"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-label-md text-on-surface-variant mb-1">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="w-full bg-surface-container-low/50 border border-outline-variant/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-outline/70"
                />
              </div>

              <div>
                <label className="block text-xs font-label-md text-on-surface-variant mb-1">
                  PASSWORD
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="w-full bg-surface-container-low/50 border border-outline-variant/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-outline/70"
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-label-md text-on-surface-variant mb-1">
                    CONFIRM PASSWORD
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    disabled={loading}
                    className="w-full bg-surface-container-low/50 border border-outline-variant/60 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-on-surface placeholder:text-outline/70"
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-on-primary font-label-md py-3.5 rounded-xl shadow-lg active:scale-98 hover:brightness-110 transition-all flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                ) : isSignUp ? (
                  "Create Free Account"
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow h-px bg-outline-variant/30"></div>
              <span className="px-3 text-xs font-label-sm text-outline">OR CONTINUE WITH</span>
              <div className="flex-grow h-px bg-outline-variant/30"></div>
            </div>

            {/* Social Logins */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => window.location.href = "/login"}
                className="flex items-center justify-center gap-2 border border-outline-variant/50 hover:bg-surface-container-low py-3 rounded-xl transition-colors text-sm font-medium text-on-surface"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-4 h-4"
                />
                Google
              </button>
              <button
                onClick={() => alert("Social Sign-in simulated! You can type credentials directly.")}
                className="flex items-center justify-center gap-2 border border-outline-variant/50 hover:bg-surface-container-low py-3 rounded-xl transition-colors text-sm font-medium text-on-surface"
              >
                <img
                  src="https://www.svgrepo.com/show/512317/github-142.svg"
                  alt="Github"
                  className="w-4 h-4 dark:invert"
                />
                GitHub
              </button>
            </div>

            {/* Toggle Signin/Signup */}
            <div className="text-center">
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setError("");
                }}
                className="text-sm font-semibold text-primary hover:underline"
              >
                {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create one"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

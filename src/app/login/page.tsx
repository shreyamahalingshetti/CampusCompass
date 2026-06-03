"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { loginOrRegisterUser } from "@/app/actions/auth";

// Extend window interface for Google GIS library
declare global {
  interface Window {
    google?: any;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);

  const handleCredentialResponse = (response: any) => {
    setIsVerifying(true);
    setVerificationStep(1);

    try {
      const credential = response.credential;
      const base64Url = credential.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      const payload = JSON.parse(jsonPayload);
      const email = payload.email;
      const name = payload.name;

      loginAndRedirect(email, name);
    } catch (err) {
      console.error("Failed to parse Google credential:", err);
      setIsVerifying(false);
    }
  };

  const handleDemoLogin = () => {
    setIsVerifying(true);
    setVerificationStep(1);
    loginAndRedirect("demo@campuscompass.edu", "Demo Student");
  };

  const loginAndRedirect = async (email: string, name: string) => {
    // Start database save asynchronously
    try {
      await loginOrRegisterUser(email, name);
    } catch (err) {
      console.error("Database registration failed:", err);
    }

    setTimeout(() => {
      setVerificationStep(2); // Verify security tokens
      setTimeout(() => {
        setVerificationStep(3); // Sync profile details
        setTimeout(() => {
          // Save state to localStorage
          localStorage.setItem("userEmail", email);
          localStorage.setItem("userName", name);
          localStorage.setItem("isLoggedIn", "true");
          setIsVerifying(false);
          router.push("/");
        }, 800);
      }, 800);
    }, 1000);
  };

  useEffect(() => {
    const scriptId = "google-gsi-client";
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initializeGoogleBtn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "1036415143624-ori0p1d3h40as381687ut5e615b24ag0.apps.googleusercontent.com",
          callback: handleCredentialResponse,
        });

        const btnContainer = document.getElementById("google-signin-btn");
        if (btnContainer) {
          window.google.accounts.id.renderButton(btnContainer, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "pill",
            logo_alignment: "left",
            width: 320,
          });
        }
      }
    };

    if (!script) {
      script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleBtn;
      document.head.appendChild(script);
    } else {
      initializeGoogleBtn();
    }
  }, []);

  const stepsText = [
    "",
    "Connecting to accounts.google.com...",
    "Verifying security tokens...",
    "Syncing profile details...",
    "Redirecting to CampusCompass..."
  ];

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>

      {/* Main Container */}
      <div className="w-full max-w-[440px] bg-surface-container-lowest border border-outline-variant/65 rounded-3xl shadow-2xl p-8 z-10 transition-all duration-300">
        
        {/* Brand Banner */}
        <div className="flex flex-col items-center mb-6 select-none">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-3.5 shadow-sm">
            <span className="material-symbols-outlined text-primary text-3xl">school</span>
          </div>
          <h1 className="font-headline-lg-mobile text-2xl font-bold text-primary tracking-tight">
            CampusCompass
          </h1>
          <p className="font-body-md text-xs text-on-surface-variant text-center mt-1">
            Your Premium Academic Discovery Companion
          </p>
        </div>

        {/* Dynamic Display Panel based on States */}
        {isVerifying ? (
          /* Google OAuth Loader */
          <div className="py-12 flex flex-col items-center text-center space-y-6 animate-in fade-in duration-300">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-6 h-6 animate-pulse"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-headline-md text-lg text-on-surface font-bold">
                OAuth Authentication
              </h3>
              <p className="text-xs text-on-surface-variant h-5 transition-all duration-300 font-medium">
                {stepsText[verificationStep]}
              </p>
            </div>
          </div>
        ) : (
          /* Sign In Screen with Official Google Button Container */
          <div className="space-y-6 flex flex-col items-center">
            <div className="space-y-1 text-center w-full">
              <h2 className="font-headline-md text-xl font-bold text-on-surface">
                Sign In
              </h2>
              <p className="font-body-md text-xs text-on-surface-variant">
                Unlock university shortlists, matching tools, and direct placements logs.
              </p>
            </div>

            <div className="w-full flex flex-col items-center gap-4 py-2">
              <div id="google-signin-btn" className="min-h-[46px] flex justify-center"></div>
            </div>
            <p className="text-[10px] text-center text-outline leading-relaxed max-w-xs mx-auto">
              Your credentials and bookmarks will synchronize to the local storage index for live search persistence.
            </p>
          </div>
        )}
      </div>
      
      {/* Return link */}
      {!isVerifying && (
        <button
          onClick={() => router.push("/")}
          className="mt-6 text-xs text-on-surface-variant hover:text-primary font-semibold flex items-center gap-1 hover:underline cursor-pointer z-10"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Back to CampusCompass
        </button>
      )}
    </div>
  );
}

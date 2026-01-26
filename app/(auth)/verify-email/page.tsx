"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/lib/firebase";
import Link from "next/link";

function VerifyEmailContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");
  const isPending = searchParams.get("pending") === "true";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push("/signin");
        return;
      }

      setUser(currentUser);

      // Check Firestore for verification status
      try {
        const userDocRef = doc(firestore, "users", currentUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.emailVerified) {
            setEmailVerified(true);
            // If already verified, redirect to home portal after a short delay
            setTimeout(() => {
              router.push("/home-portal");
            }, 2000);
          }
        }
      } catch (err) {
        console.error("Error checking verification status:", err);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Auto-verify if token is in URL
  useEffect(() => {
    if (token && !loading && user) {
      handleVerifyToken(token);
    }
  }, [token, loading, user]);

  const handleVerifyToken = async (verificationToken: string) => {
    setVerifying(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to verify email");
        setVerifying(false);
        return;
      }

      setSuccess("Email verified successfully! Redirecting...");
      setEmailVerified(true);

      // Redirect to home portal after successful verification
      setTimeout(() => {
        router.push("/home-portal");
      }, 2000);
    } catch (err) {
      setError("Failed to verify email. Please try again.");
      setVerifying(false);
    }
  };

  const handleResendEmail = async () => {
    if (!user) return;

    setResending(true);
    setError("");
    setSuccess("");

    try {
      const idToken = await user.getIdToken();

      const response = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          uid: user.uid,
          name: user.displayName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Failed to resend verification email");
        setResending(false);
        return;
      }

      setSuccess("Verification email sent! Please check your inbox.");
      setResending(false);
    } catch (err) {
      setError("Failed to resend verification email. Please try again.");
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  if (verifying) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Verifying your email...</p>
      </div>
    );
  }

  if (emailVerified) {
    return (
      <div className="text-center">
        <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Email Verified!
        </h1>
        <p className="text-gray-600 mb-4">
          Your email has been verified successfully.
        </p>
        <p className="text-sm text-gray-500">Redirecting to your dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 text-center">
        <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <svg
            className="h-8 w-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold">Verify Your Email</h1>
        <p className="mt-2 text-gray-600">
          {isPending
            ? "We've sent a verification link to your email address."
            : "Please verify your email to access your account."}
        </p>
        {user?.email && (
          <p className="mt-1 text-sm text-blue-600 font-medium">{user.email}</p>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded text-sm">
          {success}
        </div>
      )}

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>Check your email inbox (and spam folder)</li>
            <li>Click the verification link in the email</li>
            <li>You'll be redirected to your dashboard</li>
          </ol>
        </div>

        <div className="text-center pt-4">
          <p className="text-sm text-gray-500 mb-3">
            Didn't receive the email?
          </p>
          <button
            onClick={handleResendEmail}
            disabled={resending}
            className="btn w-full bg-gradient-to-t from-blue-600 to-blue-500 bg-[length:100%_100%] bg-[bottom] text-white shadow hover:bg-[length:100%_150%] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {resending ? "Sending..." : "Resend Verification Email"}
          </button>
        </div>

        <div className="text-center pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Wrong email?{" "}
            <Link
              href="/signin"
              className="text-blue-600 hover:underline"
            >
              Sign in with a different account
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading...</p>
    </div>
  );
}

export default function VerifyEmail() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}

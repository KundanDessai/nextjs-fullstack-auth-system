
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const buttonDisabled =
    !user.email.trim() || !user.password || loading;

  const onLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (buttonDisabled) return;

    try {
      setLoading(true);

      const response = await axios.post("/api/users/login", {
        email: user.email.trim(),
        password: user.password,
      });

      console.log("Login successful:", response.data);

      toast.success("Welcome back!");
      router.push("/profile");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error
        : undefined;

      toast.error(
        typeof message === "string"
          ? message
          : "Unable to log in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070816] text-white">
      {/* Background gradients */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-20 h-96 w-96 rounded-full bg-blue-600/20 blur-[120px]" />

      {/* Navigation */}
      <header className="relative z-10 border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/40 bg-violet-500/10 text-xl font-bold text-violet-300">
              NA
            </div>

            <span className="text-xl font-bold tracking-tight sm:text-2xl">
              Next<span className="text-violet-400">Auth</span>
            </span>
          </Link>

          <Link
            href="/signup"
            className="rounded-xl border border-violet-400/50 px-4 py-2 text-sm font-medium text-violet-300 transition hover:border-violet-300 hover:bg-violet-500/10 sm:text-base"
          >
            Create account <span aria-hidden="true">→</span>
          </Link>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-16">
        {/* Left hero section */}
        <section className="hidden lg:block">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-4 py-2 text-sm text-violet-200">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Your secure space awaits
          </div>

          <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
            Welcome
            <br />
            <span className="text-violet-400">back.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-400">
            Sign in to access your account and continue where you left off.
            Your workspace is just one step away.
          </p>

          <div className="mt-12 space-y-7">
            {[
              {
                number: "01",
                title: "Secure sign-in",
                description:
                  "Passwords are verified securely on the server.",
              },
              {
                number: "02",
                title: "Private sessions",
                description:
                  "Authentication tokens are stored in an HTTP-only cookie.",
              },
              {
                number: "03",
                title: "Simple and reliable",
                description:
                  "A clean experience across desktop and mobile devices.",
              },
            ].map((item) => (
              <div key={item.number} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 font-mono text-sm text-violet-300">
                  {item.number}
                </div>

                <div>
                  <h2 className="font-semibold text-white">{item.title}</h2>
                  <p className="mt-1 text-sm leading-6 text-gray-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Login card */}
        <section className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-white/10 bg-white/4 p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:p-9">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-linear-to-br from-violet-500/20 to-blue-500/20 text-3xl text-violet-300">
                ✦
              </div>

              <h2 className="text-3xl font-bold tracking-tight">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={onLogin} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-200"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  value={user.email}
                  onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  placeholder="you@example.com"
                  disabled={loading}
                  className="w-full rounded-xl border border-white/10 bg-[#0b0d20] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 hover:border-white/20 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60"
                />
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-200"
                  >
                    Password
                  </label>

                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-violet-300 transition hover:text-violet-200 hover:underline hover:underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    disabled={loading}
                    className="w-full rounded-xl border border-white/10 bg-[#0b0d20] px-4 py-3.5 pr-20 text-sm text-white outline-none transition placeholder:text-gray-500 hover:border-white/20 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute inset-y-0 right-3 my-auto rounded-lg px-2 text-xs font-medium text-violet-300 transition hover:bg-white/5 hover:text-violet-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              

              <button
                type="submit"
                disabled={buttonDisabled}
                className="group mt-3 flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-violet-600 to-blue-600 px-5 py-3.5 font-semibold text-white shadow-lg shadow-violet-900/20 transition duration-200 hover:from-violet-500 hover:to-blue-500 hover:shadow-violet-500/20 focus:outline-none focus:ring-4 focus:ring-violet-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>
            </form>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />
              <span className="text-xs uppercase tracking-widest text-gray-500">
                or
              </span>
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-center text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-semibold text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-gray-600">
            © {new Date().getFullYear()} NextAuth · Built with Next.js
          </p>
        </section>
      </div>
    </main>
  );
}

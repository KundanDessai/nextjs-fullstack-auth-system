
"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export default function SignUpPage() {
    const router = useRouter();

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const buttonDisabled =
        !user.username.trim() ||
        !user.email.trim() ||
        !user.password ||
        loading;

    const onSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (buttonDisabled) return;

        try {
            setLoading(true);

            const response = await axios.post("/api/users/signup", {
                username: user.username.trim(),
                email: user.email.trim(),
                password: user.password,
            });

            console.log("Signup success:", response.data);
            toast.success("Account created successfully!");

            router.push("/login");
        } catch (error: unknown) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.error
                : undefined;

            toast.error(
                typeof message === "string"
                    ? message
                    : "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#070816] text-white">
            {/* Background effects */}
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

                    <div className="flex items-center gap-3 text-sm sm:gap-5 sm:text-base">
                        <span className="hidden text-gray-400 sm:inline">
                            Already have an account?
                        </span>
                        <Link
                            href="/login"
                            className="rounded-xl border border-violet-400/50 px-4 py-2 font-medium text-violet-300 transition hover:border-violet-300 hover:bg-violet-500/10"
                        >
                            Login <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="relative z-10 mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12 lg:py-16">
                {/* Left section */}
                <section className="hidden lg:block">
                    <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/5 px-4 py-2 text-sm text-violet-200">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                        Simple. Secure. Reliable.
                    </div>

                    <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight xl:text-6xl">
                        Your journey
                        <br />
                        starts <span className="text-violet-400">here.</span>
                    </h1>

                    <p className="mt-6 max-w-lg text-lg leading-8 text-gray-400">
                        Create your account and experience a seamless authentication
                        experience built with modern web technologies.
                    </p>

                    <div className="mt-12 space-y-7">
                        {[
                            {
                                number: "01",
                                title: "Secure authentication",
                                description: "Passwords are hashed before being stored.",
                            },
                            {
                                number: "02",
                                title: "A seamless experience",
                                description: "Clear feedback throughout your journey.",
                            },
                            {
                                number: "03",
                                title: "Built with modern tech",
                                description: "Next.js, MongoDB and secure authentication.",
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

                {/* Signup card */}
                <section className="mx-auto w-full max-w-md">
                    <div className="rounded-3xl border border-white/10 bg-white/4 p-6 shadow-2xl shadow-violet-950/30 backdrop-blur-xl sm:p-9">
                        <div className="mb-8 text-center">
                            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-400/20 bg-linear-to-br from-violet-500/20 to-blue-500/20 text-3xl text-violet-300">
                                ✦
                            </div>

                            <h2 className="text-3xl font-bold tracking-tight">
                                Create account
                            </h2>
                            <p className="mt-3 text-sm leading-6 text-gray-400">
                                Get started by creating your account below.
                            </p>
                        </div>

                        <form onSubmit={onSignup} className="space-y-5">
                            <div>
                                <label
                                    htmlFor="username"
                                    className="mb-2 block text-sm font-medium text-gray-200"
                                >
                                    Username
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    autoComplete="username"
                                    required
                                    maxLength={50}
                                    value={user.username}
                                    onChange={(e) =>
                                        setUser({ ...user, username: e.target.value })
                                    }
                                    placeholder="Choose a username"
                                    disabled={loading}
                                    className="w-full rounded-xl border border-white/10 bg-[#0b0d20] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 hover:border-white/20 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/10 disabled:opacity-60"
                                />
                            </div>

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
                                    <span className="text-xs text-gray-500">
                                        Keep it secure
                                    </span>
                                </div>

                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="new-password"
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
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account
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
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-semibold text-violet-300 underline-offset-4 transition hover:text-violet-200 hover:underline"
                            >
                                Sign in
                            </Link>
                        </p>

                        <p className="mt-7 text-center text-xs leading-5 text-gray-500">
                            By creating an account, you agree to use this service
                            responsibly.
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

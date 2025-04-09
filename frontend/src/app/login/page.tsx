"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5264/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) {
      const data = await res.text();
      setError(data);
      return;
    }

    const result = await res.json();
    localStorage.setItem("token", result.token);
    localStorage.setItem("fullName", result.fullName);
    localStorage.setItem("userId", result.userId.toString());
    router.push("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* 🎨 Arka plan görseli */}
      <div
        className="absolute inset-0 bg-cover bg-center brightness-75 blur-sm"
        style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
      />

      {/* 🎭 Cam efekti kutu */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/30 p-8 rounded-xl shadow-xl w-full max-w-md text-white">
        <h2 className="text-3xl font-bold mb-6 text-center">FinanceAsistant Giriş</h2>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="p-3 rounded bg-white/70 text-black focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Şifre"
            className="p-3 rounded bg-white/70 text-black focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
}

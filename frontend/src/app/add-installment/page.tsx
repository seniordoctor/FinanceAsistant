"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddInstallmentPage() {
  const router = useRouter();
  const userId = localStorage.getItem("userId");

  const [title, setTitle] = useState("");
  const [monthlyAmount, setMonthlyAmount] = useState("");
  const [totalMonths, setTotalMonths] = useState("");
  const [startDate, setStartDate] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId || !monthlyAmount || !totalMonths || !startDate) {
      setError("Zorunlu alanları doldurmalısın.");
      return;
    }

    const res = await fetch("http://localhost:5264/api/installments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: parseInt(userId),
        title,
        monthlyAmount: parseFloat(monthlyAmount),
        totalMonths: parseInt(totalMonths),
        startDate,
        description,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "Taksit eklenemedi.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          📆 Taksit Ekle
        </h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="text"
          placeholder="Taksit Başlığı (ör: Telefon)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
        />

        <input
          type="number"
          placeholder="Aylık Taksit (₺)"
          value={monthlyAmount}
          onChange={(e) => setMonthlyAmount(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
        />

        <input
          type="number"
          placeholder="Toplam Ay Sayısı"
          value={totalMonths}
          onChange={(e) => setTotalMonths(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
        />

        <label className="p-1 text-sm font-medium text-gray-700">
          Başlangıç Tarihi
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800"
        />

        <input
          type="text"
          placeholder="Açıklama (opsiyonel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
        />

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}

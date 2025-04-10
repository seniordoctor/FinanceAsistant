"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditIncomePage() {
  const router = useRouter();
  const { id } = useParams();
  const userId = localStorage.getItem("userId");

  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Gelir detayını çek
    fetch(`http://localhost:5264/api/incomes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setAmount(data.amount);
        setCategoryId(data.categoryId);
        setDescription(data.description);
        setDate(data.date.substring(0, 10));
      });

    // Kategorileri çek
    fetch(`http://localhost:5264/api/categories/income/${userId}`)
      .then((res) => res.json())
      .then((data) => setCategories(data));
  }, [id, userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !categoryId || !date) {
      setError("Zorunlu alanları doldurmalısın.");
      return;
    }

    const res = await fetch(`http://localhost:5264/api/incomes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: parseInt(id as string),
        userId: parseInt(userId!),
        amount: parseFloat(amount),
        categoryId: parseInt(categoryId),
        description,
        date,
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "Güncelleme başarısız.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center">
          💰 Gelir Güncelle
        </h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="number"
          placeholder="Tutar (₺)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded placeholder-gray-500 text-gray-800"
        />

        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800"
        >
          <option value="">Kategori seçin</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name} {cat.userId ? "(Kişisel)" : "(Genel)"}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Açıklama"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded placeholder-gray-500 text-gray-800"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800"
        />

        <div className="flex justify-between gap-4">
          <button
            type="button"
            onClick={() => router.push("/dashboard")}
            className="w-1/2 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300 transition"
          >
            İptal
          </button>

          <button
            type="submit"
            className="w-1/2 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

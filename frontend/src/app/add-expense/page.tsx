"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  type: string;
  userId: number | null;
}

export default function AddExpensePage() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    fetch(`http://localhost:5264/api/categories/expense/${userId}`)
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, [userId, router]);

  const handleNewCategorySubmit = async () => {
    if (!newCategoryName.trim()) return;

    const res = await fetch("http://localhost:5264/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newCategoryName,
        type: "Expense",
        userId: parseInt(userId!)
      }),
    });

    if (res.ok) {
      const newCat: Category = await res.json();
      setCategories([...categories, newCat]);
      setCategoryId(newCat.id.toString());
      setNewCategoryName("");
    } else {
      const msg = await res.text();
      setError(msg || "Yeni kategori eklenemedi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || (!categoryId && !newCategoryName) || !date) {
      setError("Zorunlu alanları doldurmalısın.");
      return;
    }

    const res = await fetch("http://localhost:5264/api/expenses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: parseInt(userId!),
        amount: parseFloat(amount),
        categoryId: parseInt(categoryId),
        description,
        date
      }),
    });

    if (!res.ok) {
      const msg = await res.text();
      setError(msg || "Gelir eklenemedi.");
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-md w-full max-w-md space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">💸 Gider Ekle</h2>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <input
          type="number"
          placeholder="Tutar (₺)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
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
          <option value="new">+ Yeni Kategori Ekle</option>
        </select>

        {categoryId === "new" && (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Yeni kategori adı"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded placeholder-gray-500 text-gray-800"
            />
            <button
              type="button"
              onClick={handleNewCategorySubmit}
              className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700"
            >
              Ekle
            </button>
          </div>
        )}

        <input
          type="text"
          placeholder="Açıklama (opsiyonel)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800 placeholder-gray-500"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-3 bg-gray-50 border border-gray-300 rounded text-gray-800"
        />

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Kaydet
        </button>
      </form>
    </div>
  );
}

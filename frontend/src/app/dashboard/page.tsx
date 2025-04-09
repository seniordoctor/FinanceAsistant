"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Income {
  id: number;
  amount: number;
  date: string;
}

interface Expense {
  id: number;
  amount: number;
  date: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("fullName");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
      router.push("/login");
    } else {
      setFullName(name || "");
      fetchDashboardData(userId || "");
    }
  }, [router]);

  const fetchDashboardData = async (userId: string) => {
    try {
      const [incomeRes, expenseRes] = await Promise.all([
        fetch(`http://localhost:5264/api/incomes/user/${userId}`),
        fetch(`http://localhost:5264/api/expenses/user/${userId}`)
      ]);

      const incomes: Income[] = await incomeRes.json();
      const expenses: Expense[] = await expenseRes.json();

      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();

      const monthlyIncome = incomes
        .filter(i => new Date(i.date).getMonth() === thisMonth && new Date(i.date).getFullYear() === thisYear)
        .reduce((sum, i) => sum + i.amount, 0);

      const monthlyExpense = expenses
        .filter(e => new Date(e.date).getMonth() === thisMonth && new Date(e.date).getFullYear() === thisYear)
        .reduce((sum, e) => sum + e.amount, 0);

      setTotalIncome(monthlyIncome);
      setTotalExpense(monthlyExpense);
    } catch (err) {
      console.error("Veri çekilemedi:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">🎉 Hoş geldin {fullName}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Bu Ayki Toplam Gelir</h2>
          <p className="text-2xl text-green-600 font-bold">{totalIncome.toLocaleString()} ₺</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Bu Ayki Toplam Gider</h2>
          <p className="text-2xl text-red-600 font-bold">{totalExpense.toLocaleString()} ₺</p>
        </div>
      </div>
      <button
        onClick={() => {
          localStorage.clear(); // tüm token, isim, id vs. temizle
          router.push("/login"); // login sayfasına yönlendir
        }}
        className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
      >
        Çıkış Yap
      </button>
      <div className="mt-6">
        <button
          onClick={() => router.push("/add-income")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
        >
          ➕ Gelir Ekle
        </button>
      </div>
      <div className="mt-6">
        <button
          onClick={() => router.push("/add-expense")}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded"
        >
          ➕ Gider Ekle
        </button>
      </div>
    </div>
  );
}

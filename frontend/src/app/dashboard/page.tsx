"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [installment, setInstallment] = useState(0);
  const [incomeList, setIncomeList] = useState<any[]>([]);
  const [expenseList, setExpenseList] = useState<any[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpense, setMonthlyExpense] = useState(0);
  const [showInstallments, setShowInstallments] = useState(false);
  const [installmentDetails, setInstallmentDetails] = useState<any[]>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5264/api/incomes/summary/${userId}`)
      .then(res => res.json())
      .then(data => setIncome(data.totalIncome || 0));

    fetch(`http://localhost:5264/api/expenses/summary/${userId}`)
      .then(res => res.json())
      .then(data => setExpense(data.totalExpense || 0));

    fetch(`http://localhost:5264/api/installments/monthly/${userId}`)
      .then(res => res.json())
      .then(data => setInstallment(data.monthlyInstallment || 0));

    fetch(`http://localhost:5264/api/incomes/user/${userId}`)
      .then(res => res.json())
      .then(data => setIncomeList(data));

    fetch(`http://localhost:5264/api/expenses/user/${userId}`)
      .then(res => res.json())
      .then(data => setExpenseList(data));

    fetch(`http://localhost:5264/api/incomes/monthly/${userId}`)
      .then(res => res.json())
      .then(data => setMonthlyIncome(data.monthlyIncome || 0));

    fetch(`http://localhost:5264/api/expenses/monthly/${userId}`)
      .then(res => res.json())
      .then(data => setMonthlyExpense(data.monthlyExpense || 0));
  }, [userId]);

  const handleDeleteIncome = async (id: number) => {
    if (!confirm("Bu geliri silmek istediğine emin misin?")) return;
    await fetch(`http://localhost:5264/api/incomes/${id}`, { method: "DELETE" });
    setIncomeList(prev => prev.filter(x => x.id !== id));
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("Bu gideri silmek istediğine emin misin?")) return;
    await fetch(`http://localhost:5264/api/expenses/${id}`, { method: "DELETE" });
    setExpenseList(prev => prev.filter(x => x.id !== id));
  };

  const toggleInstallments = async () => {
    if (!showInstallments) {
      const res = await fetch(`http://localhost:5264/api/installments/monthly/details/${userId}`);
      const data = await res.json();
      setInstallmentDetails(data);
    }
    setShowInstallments(!showInstallments);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex">
      {/* Main content */}
      <main className="flex-1 px-6 py-10 relative">
        {/* 🔒 Logout butonu sağ üstte */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Finansal Durum</h1>

        {/* Toplam Gelir ve Gider + butonlu */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-500 text-white p-6 rounded-xl relative">
            <Link href="/add-income">
              <Plus className="absolute top-4 right-4 w-5 h-5 cursor-pointer hover:scale-110 transition" />
            </Link>
            <h2 className="text-xl font-semibold mb-2">💰 Toplam Gelir</h2>
            <p className="text-2xl font-bold">{income.toLocaleString("tr-TR")} ₺</p>
          </div>

          <div className="bg-red-500 text-white p-6 rounded-xl relative">
            <Link href="/add-expense">
              <Plus className="absolute top-4 right-4 w-5 h-5 cursor-pointer hover:scale-110 transition" />
            </Link>
            <h2 className="text-xl font-semibold mb-2">💸 Toplam Gider</h2>
            <p className="text-2xl font-bold">{expense.toLocaleString("tr-TR")} ₺</p>
          </div>
        </div>

        {/* Bu Ayın Gelir/Gider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold">📆 Bu Ayki Gelir</h3>
            <p className="text-xl font-bold">{monthlyIncome.toLocaleString("tr-TR")} ₺</p>
          </div>
          <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold">📉 Bu Ayki Gider</h3>
            <p className="text-xl font-bold">{monthlyExpense.toLocaleString("tr-TR")} ₺</p>
          </div>
        </div>

        {/* Bu Ayın Taksit */}
        <div
          className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow cursor-pointer mb-8"
          onClick={toggleInstallments}
        >
          <h3 className="flex justify-between text-lg font-semibold">
            📋 Bu Ayki Taksitler
            <span>{showInstallments ? "▲" : "▼"}</span>
          </h3>
          <p className="text-xl font-bold">{installment.toLocaleString("tr-TR")} ₺</p>
          {showInstallments && (
            <ul className="mt-4 space-y-2">
              {installmentDetails.map((item, i) => {
                const start = new Date(item.startDate);
                const now = new Date();
                const diffMonth =
                  (now.getFullYear() - start.getFullYear()) * 12 +
                  (now.getMonth() - start.getMonth()) + 1;
                const remaining = item.totalMonths - diffMonth;
                return (
                  <li key={i} className="bg-white p-3 rounded shadow flex justify-between text-sm">
                    <span>{item.title}</span>
                    <span>{item.monthlyAmount} ₺ — {remaining} ay kaldı</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* GELİR ve GİDERLER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">💰 Gelirler</h3>
            <ul className="space-y-2">
              {incomeList.map((item) => (
                <li key={item.id} className="bg-white p-4 rounded shadow flex justify-between">
                  <div>
                    <p className="font-medium">{item.categoryName}</p>
                    <p className="text-sm text-gray-500">{item.amount.toLocaleString("tr-TR")} ₺ — {new Date(item.date).toLocaleDateString("tr-TR")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/edit-income/${item.id}`)} className="text-blue-600 hover:underline text-sm">Düzenle</button>
                    <button onClick={() => handleDeleteIncome(item.id)} className="text-red-600 hover:underline text-sm">Sil</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">💸 Giderler</h3>
            <ul className="space-y-2">
              {expenseList.map((item) => (
                <li key={item.id} className="bg-white p-4 rounded shadow flex justify-between">
                  <div>
                    <p className="font-medium">{item.categoryName}</p>
                    <p className="text-sm text-gray-500">{item.amount.toLocaleString("tr-TR")} ₺ — {new Date(item.date).toLocaleDateString("tr-TR")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => router.push(`/edit-expense/${item.id}`)} className="text-blue-600 hover:underline text-sm">Düzenle</button>
                    <button onClick={() => handleDeleteExpense(item.id)} className="text-red-600 hover:underline text-sm">Sil</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}

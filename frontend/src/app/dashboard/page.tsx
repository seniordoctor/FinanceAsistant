"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  const handleDeleteIncome = async (id: number) => {
    const confirm = window.confirm("Bu geliri silmek istediğine emin misin?");
    if (!confirm) return;


    await fetch(`http://localhost:5264/api/incomes/${id}`, {
      method: "DELETE",
    });
    setIncomeList((prev) => prev.filter((x) => x.id !== id));
  };

  const handleDeleteExpense = async (id: number) => {
    const confirm = window.confirm("Bu gideri silmek istediğine emin misin?");
    if (!confirm) return;

    await fetch(`http://localhost:5264/api/expenses/${id}`, { method: "DELETE" });
    setExpenseList((prev) => prev.filter((x) => x.id !== id));
  };

  const toggleInstallments = async () => {
    if (!showInstallments) {
      const res = await fetch(`http://localhost:5264/api/installments/monthly/details/${userId}`);
      const data = await res.json();
      setInstallmentDetails(data);
    }
    setShowInstallments(!showInstallments);
  };

  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5264/api/incomes/summary/${userId}`)
      .then((res) => res.json())
      .then((data) => setIncome(data.totalIncome || 0));

    fetch(`http://localhost:5264/api/expenses/summary/${userId}`)
      .then((res) => res.json())
      .then((data) => setExpense(data.totalExpense || 0));

    fetch(`http://localhost:5264/api/installments/monthly/${userId}`)
      .then((res) => res.json())
      .then((data) => setInstallment(data.monthlyInstallment || 0));

    fetch(`http://localhost:5264/api/incomes/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setIncomeList(data));

    fetch(`http://localhost:5264/api/expenses/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setExpenseList(data));

    fetch(`http://localhost:5264/api/incomes/monthly/${userId}`)
      .then(res => res.json())
      .then(data => setMonthlyIncome(data.monthlyIncome || 0));

    fetch(`http://localhost:5264/api/expenses/monthly/${userId}`)
      .then(res => res.json())
      .then(data => setMonthlyExpense(data.monthlyExpense || 0));
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Finansal Durum</h1>

      {/* 1. Üst: Toplam Gelir / Gider */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg hover:brightness-105 transition">
          <h2 className="text-xl font-semibold mb-2">💰 Toplam Gelir</h2>
          <p className="text-2xl font-bold">{income.toLocaleString("tr-TR")} ₺</p>
        </div>

        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg hover:brightness-105 transition">
          <h2 className="text-xl font-semibold mb-2">💸 Toplam Gider</h2>
          <p className="text-2xl font-bold">{expense.toLocaleString("tr-TR")} ₺</p>
        </div>
      </div>

      {/* 2. Orta: Bu Ayki Gelir / Gider */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-1">📆 Bu Ayki Gelir</h3>
          <p className="text-xl font-bold">{monthlyIncome.toLocaleString("tr-TR")} ₺</p>
        </div>

        <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow hover:shadow-md transition">
          <h3 className="text-lg font-semibold mb-1">📉 Bu Ayki Gider</h3>
          <p className="text-xl font-bold">{monthlyExpense.toLocaleString("tr-TR")} ₺</p>
        </div>
      </div>

      {/* 3. Tek Kutu: Bu Ayki Taksitler (açılır) */}
      <div className="mb-6">
        <div
          className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer"
          onClick={toggleInstallments}
        >
          <h3 className="text-lg font-semibold mb-1 flex justify-between items-center">
            📋 Bu Ayki Taksitler
            <span className="text-sm">{showInstallments ? "▲" : "▼"}</span>
          </h3>
          <p className="text-xl font-bold">{installment.toLocaleString("tr-TR")} ₺</p>

          {showInstallments && (
            <ul className="mt-4 space-y-2 transition-all duration-300 ease-in-out">
              {installmentDetails.map((item, index) => {
                const start = new Date(item.startDate);
                const now = new Date();
                const diffMonth =
                  (now.getFullYear() - start.getFullYear()) * 12 +
                  (now.getMonth() - start.getMonth()) + 1;
                const remaining = item.totalMonths - diffMonth;

                return (
                  <li
                    key={index}
                    className="bg-white p-3 rounded shadow text-sm text-gray-800 flex justify-between"
                  >
                    <span>{item.title}</span>
                    <span>
                      {item.monthlyAmount} ₺ — {remaining} ay kaldı
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* 4. Liste: Gelir ve Gider Listesi */}
      <section className="mt-10 space-y-8">
        {/* GELİRLER */}
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4">💰 Gelirler</h3>
          <ul className="space-y-2">
            {incomeList.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div>
                  <p className="text-gray-800 font-medium">{item.categoryName}</p>
                  <p className="text-sm text-gray-500">
                    {item.amount.toLocaleString("tr-TR")} ₺ —{" "}
                    {new Date(item.date).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/edit-income/${item.id}`)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-600 hover:text-white transition"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteIncome(item.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* GİDERLER */}
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4">💸 Giderler</h3>
          <ul className="space-y-2">
            {expenseList.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div>
                  <p className="text-gray-800 font-medium">{item.categoryName}</p>
                  <p className="text-sm text-gray-500">
                    {item.amount.toLocaleString("tr-TR")} ₺ —{" "}
                    {new Date(item.date).toLocaleDateString("tr-TR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/edit-expense/${item.id}`)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-600 hover:text-white transition"
                  >
                    Düzenle
                  </button>
                  <button
                    onClick={() => handleDeleteExpense(item.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-600 hover:text-white transition"
                  >
                    Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

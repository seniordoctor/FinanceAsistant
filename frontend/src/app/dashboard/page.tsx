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
  }, [userId]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        📊 Finansal Durum
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Gelir */}
        <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg hover:brightness-105 transition duration-200">
          <h2 className="text-xl font-semibold mb-2">💰 Toplam Gelir</h2>
          <p className="text-2xl font-bold">
            {income.toLocaleString("tr-TR")} ₺
          </p>
        </div>

        {/* Gider */}
        <div className="bg-red-500 text-white p-6 rounded-xl shadow-lg hover:brightness-105 transition duration-200">
          <h2 className="text-xl font-semibold mb-2">💸 Toplam Gider</h2>
          <p className="text-2xl font-bold">
            {expense.toLocaleString("tr-TR")} ₺
          </p>
        </div>

        {/* Taksit */}
        <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition duration-200">
          <h2 className="text-xl font-semibold mb-2">📆 Bu Ayki Taksit</h2>
          <p className="text-2xl font-bold">
            {installment.toLocaleString("tr-TR")} ₺
          </p>
        </div>
      </div>
      {/* Buraya gelir/gider listeleri ve düzenleme butonları gelecek */}
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
                  <p className="text-gray-800 font-medium">
                    {item.categoryName}
                  </p>
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

        {/* GİDERLER (aynı yapı, başka state) */}
        <div>
          <h3 className="text-xl font-bold text-gray-700 mb-4">💸 Giderler</h3>
          <ul className="space-y-2">
            {expenseList.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div>
                  <p className="text-gray-800 font-medium">
                    {item.categoryName}
                  </p>
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

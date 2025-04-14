// dashboard/page.tsx (Final version with style + logout + sidebar)

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push("/login");
    }
  }, [userId]);

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
      .then((res) => res.json())
      .then((data) => setMonthlyIncome(data.monthlyIncome || 0));

    fetch(`http://localhost:5264/api/expenses/monthly/${userId}`)
      .then((res) => res.json())
      .then((data) => setMonthlyExpense(data.monthlyExpense || 0));
  }, [userId]);

  const handleDeleteIncome = async (id: number) => {
    if (!confirm("Bu geliri silmek istediğine emin misin?")) return;
    await fetch(`http://localhost:5264/api/incomes/${id}`, {
      method: "DELETE",
    });
    setIncomeList((prev) => prev.filter((x) => x.id !== id));
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("Bu gideri silmek istediğine emin misin?")) return;
    await fetch(`http://localhost:5264/api/expenses/${id}`, {
      method: "DELETE",
    });
    setExpenseList((prev) => prev.filter((x) => x.id !== id));
  };

  const toggleInstallments = async () => {
    if (!showInstallments) {
      const res = await fetch(
        `http://localhost:5264/api/installments/monthly/details/${userId}`
      );
      const data = await res.json();
      setInstallmentDetails(data);
    }
    setShowInstallments(!showInstallments);
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-gray-100 to-white">
      {/* Sidebar */}
      <aside className="bg-white shadow-md p-4 w-64 hidden md:flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">📁 Menü</h2>
          <nav className="space-y-2">
            <Link
              href="/dashboard"
              className="block text-blue-700 hover:bg-blue-100 px-4 py-2 rounded"
            >
              🏠 Dashboard
            </Link>
            <Link
              href="/analytics"
              className="block text-blue-700 hover:bg-blue-100 px-4 py-2 rounded"
            >
              📊 Analytics
            </Link>
            <Link
              href="/add-income"
              className="block text-green-700 hover:bg-green-100 px-4 py-2 rounded"
            >
              ➕ Gelir Ekle
            </Link>
            <Link
              href="/add-expense"
              className="block text-red-700 hover:bg-red-100 px-4 py-2 rounded"
            >
              ➖ Gider Ekle
            </Link>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-red-600 hover:underline"
        >
          🚪 Çıkış Yap
        </button>
      </aside>

      {/* Content */}
      <main className="flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          📊 Finansal Durum
        </h1>

        {/* Gelir & Gider */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="relative bg-green-500 text-white p-6 rounded-xl shadow-lg hover:brightness-105">
            <h2 className="text-xl font-semibold mb-2">💰 Toplam Gelir</h2>
            <p className="text-2xl font-bold">
              {income.toLocaleString("tr-TR")} ₺
            </p>
            <Link href="/add-income">
              <span className="absolute top-4 right-4 text-white text-2xl hover:scale-110 cursor-pointer">
                ＋
              </span>
            </Link>
          </div>

          <div className="relative bg-red-500 text-white p-6 rounded-xl shadow-lg hover:brightness-105">
            <h2 className="text-xl font-semibold mb-2">💸 Toplam Gider</h2>
            <p className="text-2xl font-bold">
              {expense.toLocaleString("tr-TR")} ₺
            </p>
            <Link href="/add-expense">
              <span className="absolute top-4 right-4 text-white text-2xl hover:scale-110 cursor-pointer">
                ＋
              </span>
            </Link>
          </div>
        </div>

        {/* Bu Ayki */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="bg-green-100 text-green-800 p-4 rounded-xl shadow hover:shadow-md">
            <h3 className="text-lg font-semibold mb-1">📆 Bu Ayki Gelir</h3>
            <p className="text-xl font-bold">
              {monthlyIncome.toLocaleString("tr-TR")} ₺
            </p>
          </div>
          <div className="bg-red-100 text-red-800 p-4 rounded-xl shadow hover:shadow-md">
            <h3 className="text-lg font-semibold mb-1">📉 Bu Ayki Gider</h3>
            <p className="text-xl font-bold">
              {monthlyExpense.toLocaleString("tr-TR")} ₺
            </p>
          </div>
        </div>

        {/* Taksit */}
        <div className="mb-6">
          <div
            className="bg-blue-100 text-blue-800 p-4 rounded-xl shadow hover:shadow-md cursor-pointer"
            onClick={toggleInstallments}
          >
            <h3 className="text-lg font-semibold flex justify-between">
              📋 Bu Ayki Taksitler
              <span>{showInstallments ? "▲" : "▼"}</span>
            </h3>
            <p className="text-xl font-bold">
              {installment.toLocaleString("tr-TR")} ₺
            </p>
            {showInstallments && (
              <ul className="mt-4 space-y-2">
                {installmentDetails.map((item, index) => {
                  const start = new Date(item.startDate);
                  const now = new Date();
                  const diffMonth =
                    (now.getFullYear() - start.getFullYear()) * 12 +
                    (now.getMonth() - start.getMonth()) +
                    1;
                  const remaining = item.totalMonths - diffMonth;
                  return (
                    <li
                      key={index}
                      className="bg-white p-3 rounded shadow text-sm flex justify-between"
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

        {/* Gelir ve Gider Listesi */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              💰 Gelirler
            </h3>
            <ul className="space-y-2">
              {incomeList.map((item) => (
                <li
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
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
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-600 hover:text-white"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteIncome(item.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-600 hover:text-white"
                    >
                      Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              💸 Giderler
            </h3>
            <ul className="space-y-2">
              {expenseList.map((item) => (
                <li
                  key={item.id}
                  className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">
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
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-600 hover:text-white"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDeleteExpense(item.id)}
                      className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-600 hover:text-white"
                    >
                      Sil
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}

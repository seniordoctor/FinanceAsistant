"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useRouter } from "next/navigation";
import AdviceCard from "./AdviceCard";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#00c49f",
  "#ff8042",
];

interface CategoryData {
  categoryName: string;
  totalAmount: number;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [expenseData, setExpenseData] = useState<CategoryData[]>([]);
  const [incomeData, setIncomeData] = useState<CategoryData[]>([]);
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!userId) {
      router.push("/login");
      return;
    }

    fetch(`http://localhost:5264/api/expenses/by-category/${userId}`)
      .then((res) => res.json())
      .then((data) => setExpenseData(data));

    fetch(`http://localhost:5264/api/incomes/by-category/${userId}`)
      .then((res) => res.json())
      .then((data) => setIncomeData(data));
  }, [userId, router]);

  const renderPieWithLegend = (data: CategoryData[], title: string) => (
    <div className="bg-white p-6 rounded-xl shadow-md w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            dataKey="totalAmount"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={false} // 🔕 dilim içine yazı yazma
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(val: any) => `${val.toLocaleString("tr-TR")} ₺`}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* 🟣 Legend */}
      <div className="mt-6 space-y-2">
        {data.map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-sm text-gray-700"
          >
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            ></div>
            <span className="font-medium">{entry.categoryName}</span>
            <span className="ml-auto text-gray-500">
              {entry.totalAmount.toLocaleString("tr-TR")} ₺
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white py-10 px-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        📊 Kategori Dağılımı
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {renderPieWithLegend(expenseData, "💸 Gider Dağılımı")}
        {renderPieWithLegend(incomeData, "💰 Gelir Dağılımı")}
      </div>

      {typeof window !== "undefined" && localStorage.getItem("userId") && (
        <AdviceCard userId={parseInt(localStorage.getItem("userId")!)} />
      )}
    </div>
  );
}

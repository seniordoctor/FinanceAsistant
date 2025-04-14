"use client";

import { useEffect, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

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

interface MonthlyData {
    Month: string;
    Income: number;
    Expense: number;
}

export default function AnalyticsPage() {
    const [expenseData, setExpenseData] = useState<CategoryData[]>([]);
    const [incomeData, setIncomeData] = useState<CategoryData[]>([]);
    // const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
    const [monthlyData, setMonthlyData] = useState([
        { Month: "Oct 2024", Income: 12000, Expense: 8500 },
        { Month: "Nov 2024", Income: 14000, Expense: 9100 },
        { Month: "Dec 2024", Income: 13000, Expense: 10000 },
        { Month: "Jan 2025", Income: 12500, Expense: 8200 },
        { Month: "Feb 2025", Income: 13500, Expense: 8700 },
        { Month: "Mar 2025", Income: 15000, Expense: 10500 },
    ]);

    const userId =
        typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    useEffect(() => {
        if (!userId) return;

        fetch(`http://localhost:5264/api/expenses/by-category/${userId}`)
            .then((res) => res.json())
            .then((data) => setExpenseData(data));

        fetch(`http://localhost:5264/api/incomes/by-category/${userId}`)
            .then((res) => res.json())
            .then((data) => setIncomeData(data));

        fetch(`http://localhost:5264/api/analytics/monthly-summary/${userId}`)
            .then((res) => res.json())
            .then((data) => setMonthlyData(data));
    }, [userId]);

    const renderPieChart = (data: CategoryData[], title: string) => (
        <div className="bg-white p-6 rounded-xl shadow-lg transition-all hover:shadow-xl">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="totalAmount"
                        nameKey="categoryName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={(entry) => entry.categoryName}
                    >
                        {data.map((_, index) => (
                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value.toLocaleString("tr-TR")} ₺`} />
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value) => {
                            const entry = data.find((d) => d.categoryName === value);
                            return `${value} (${entry?.totalAmount.toLocaleString("tr-TR")} ₺)`;
                        }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
    console.log("📊 Final chart data:", monthlyData);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-10">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                📊 Finansal Analizler
            </h1>

            {/* Pie Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
                {renderPieChart(expenseData, "💸 Gider Dağılımı")}
                {renderPieChart(incomeData, "💰 Gelir Dağılımı")}
            </div>

            {/* Line Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg transition hover:shadow-xl">
                <h2 className="text-xl font-bold text-gray-800 mb-4">📆 Son 6 Ay Gelir & Gider</h2>
                <div style={{ width: '100%', height: 300 }}>
                    <LineChart width={600} height={300} data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="Month" />
                        <YAxis />
                        <Tooltip formatter={(v: any) => `${v.toLocaleString("tr-TR")} ₺`} />
                        <Legend />
                        <Line type="monotone" dataKey="Income" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="Expense" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                </div>

            </div>
        </div>
    );
}

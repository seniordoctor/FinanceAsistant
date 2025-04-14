import { useEffect, useState } from "react";

interface AdviceData {
  totalIncome: number;
  totalExpense: number;
  monthlyInstallment: number;
  advice: string[];
}

export default function AdviceCard({ userId }: { userId: number }) {
  const [data, setData] = useState<AdviceData | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`http://localhost:5264/api/advice/${userId}`)
      .then((res) => res.json())
      .then(setData)
      .catch(() => setData(null));
  }, [userId]);

  if (!data) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-4xl mx-auto mt-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        🔮 Yatırım Tavsiyesi
      </h2>
      <div className="mb-4 text-gray-600">
        <p>
          <strong>Toplam Gelir:</strong>{" "}
          {data.totalIncome.toLocaleString("tr-TR")} ₺
        </p>
        <p>
          <strong>Toplam Gider:</strong>{" "}
          {data.totalExpense.toLocaleString("tr-TR")} ₺
        </p>
        <p>
          <strong>Aylık Taksit:</strong>{" "}
          {data.monthlyInstallment.toLocaleString("tr-TR")} ₺
        </p>
      </div>

      <ul className="space-y-2">
        {data.advice.map((msg, index) => (
          <li
            key={index}
            className="bg-gray-50 border-l-4 border-green-500 text-gray-800 p-3 rounded shadow-sm"
          >
            💡 {msg}
          </li>
        ))}
      </ul>
    </div>
  );
}

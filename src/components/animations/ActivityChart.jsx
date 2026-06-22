import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ActivityChart({ visibleCards }) {
  const counts = {};

  visibleCards.forEach((card) => {
    const year = new Date(card.date_sent).getFullYear();

    counts[year] = (counts[year] || 0) + 1;
  });

  const data = Object.entries(counts).map(
    ([year, count]) => ({
      year,
      count,
    })
  );

  return (
    <div className="bg-gray-50 rounded-xl p-4 mb-6">
      <h3 className="font-semibold mb-4">
        Postcard Activity Over Time
      </h3>

      <ResponsiveContainer
        width="100%"
        height={200}
      >
        <LineChart data={data}>
          <XAxis dataKey="year" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="count"
            stroke="#2563eb"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
export default function ActivityTimeline({ postcards }) {
  const years = {};

  postcards.forEach((card) => {
    const year = new Date(card.date_sent).getFullYear();

    years[year] = (years[year] || 0) + 1;
  });

  const data = Object.entries(years);

  const maxCount = Math.max(
    ...data.map(([, count]) => count),
    1
  );

  return (
    <div className="bg-gray-50 rounded-xl p-5 mb-6">

      <h3 className="font-bold mb-4">
        Activity Over Time
      </h3>

      <div className="space-y-3">

        {data.map(([year, count]) => (

          <div
            key={year}
            className="flex items-center gap-3"
          >

            <div className="w-16 font-semibold">
              {year}
            </div>

            <div
              className="bg-blue-500 h-5 rounded-full transition-all"
              style={{
                width: `${(count / maxCount) * 500}px`,
              }}
            />

            <div className="font-bold">
              {count}
            </div>

          </div>

        ))}

      </div>
    </div>
  );
}
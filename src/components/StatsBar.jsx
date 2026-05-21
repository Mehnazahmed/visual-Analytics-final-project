export default function StatsBar({
  postcards,
}) {
  const total = postcards.length;

  const avgDistance =
    total > 0
      ? Math.round(
          postcards.reduce(
            (sum, p) => sum + p.distance,
            0
          ) / total
        )
      : 0;

  const avgTime =
    total > 0
      ? Math.round(
          postcards.reduce(
            (sum, p) => sum + p.time,
            0
          ) / total
        )
      : 0;

  const maxDistance =
    total > 0
      ? Math.max(
          ...postcards.map((p) => p.distance)
        )
      : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-gray-500 text-sm">
          Total Postcards
        </p>

        <h2 className="text-2xl font-bold">
          {total}
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-gray-500 text-sm">
          Avg Distance
        </p>

        <h2 className="text-2xl font-bold">
          {avgDistance} km
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-gray-500 text-sm">
          Avg Travel Time
        </p>

        <h2 className="text-2xl font-bold">
          {avgTime} days
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <p className="text-gray-500 text-sm">
          Longest Route
        </p>

        <h2 className="text-2xl font-bold">
          {maxDistance} km
        </h2>
      </div>
    </div>
  );
}
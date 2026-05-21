export default function MapView({
  data,
  selectedCluster,
  setSelectedCluster
}) {

  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-6">

      <h2 className="text-2xl font-bold mb-4">
        Cluster View
      </h2>

      <div className="relative w-full h-[700px] bg-gray-100 rounded-xl overflow-hidden">

        {data.map((point, i) => {

          // SKIP NOISE
          if (point.cluster === -1) return null

          // SIMPLE POSITIONING
          const left =
            ((point.x + 15) / 30) * 100

          const top =
            ((point.y + 15) / 30) * 100

          const colors = [
            "#ef4444",
            "#3b82f6",
            "#10b981",
            "#f59e0b",
            "#8b5cf6",
            "#ec4899"
          ]

          const color =
            colors[
              Math.abs(point.cluster) %
              colors.length
            ]

          return (
            <div
              key={i}

              onClick={() =>
                setSelectedCluster(
                  point.cluster
                )
              }

              className={`
                absolute
                w-3
                h-3
                rounded-full
                cursor-pointer
                hover:scale-150
                transition
                border
                border-white

                ${
                  selectedCluster === point.cluster
                    ? "ring-4 ring-black z-50"
                    : ""
                }
              `}

              style={{
                left: `${left}%`,
                top: `${top}%`,
                backgroundColor: color
              }}

              title={`Cluster ${point.cluster}`}
            />
          )
        })}
      </div>

      {/* INFO */}
      {selectedCluster !== null && (
        <div className="mt-4 text-sm text-gray-600">
          Selected cluster:
          <span className="font-bold ml-2">
            {selectedCluster}
          </span>
        </div>
      )}
    </div>
  )
}
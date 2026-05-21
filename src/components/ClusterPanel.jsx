export default function ClusterPanel({
  data,
  selectedCluster,
  setSelectedCluster
}) {

  // count postcards per cluster
  const clusterCounts = {};

  data.forEach((d) => {
    if (d.cluster === -1) return;

    clusterCounts[d.cluster] =
      (clusterCounts[d.cluster] || 0) + 1;
  });

  const clusters = Object.entries(clusterCounts)
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="bg-white rounded-xl p-5 shadow mb-6">

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">
          Topic Clusters
        </h2>

        <button
          onClick={() => setSelectedCluster(null)}
          className="px-4 py-2 bg-gray-200 rounded-lg"
        >
          Show All
        </button>
      </div>

      <div className="flex flex-wrap gap-3">

        {clusters.map(([cluster, count]) => {

          const colors = [
            "bg-red-500",
            "bg-blue-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-purple-500",
            "bg-pink-500"
          ];

          const color =
            colors[
              Math.abs(cluster) %
              colors.length
            ];

          return (
            <button
              key={cluster}
              onClick={() =>
                setSelectedCluster(Number(cluster))
              }
              className={`
                ${color}
                text-white
                px-5 py-4
                rounded-xl
                shadow
                hover:scale-105
                transition
                ${
                  selectedCluster === Number(cluster)
                    ? "ring-4 ring-black"
                    : ""
                }
              `}
            >
              <div className="font-bold text-lg">
                Cluster {cluster}
              </div>

              <div className="text-sm opacity-90">
                {count} postcards
              </div>
            </button>
          );
        })}

      </div>
    </div>
  );
}
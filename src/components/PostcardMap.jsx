import {
  MapContainer,
  TileLayer,
  Polyline
} from "react-leaflet"

import "leaflet/dist/leaflet.css"

export default function PostcardMap({
  data,
  selectedCluster
}) {

  // SHOW NOTHING UNTIL USER PICKS CLUSTER
  const filtered =
    selectedCluster === null
      ? []
      : data.filter(
          d => d.cluster === selectedCluster
        )

  const colors = [
    "#ef4444",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899"
  ]

  return (
    <div className="bg-white rounded-2xl shadow p-4 mt-6">

      <h2 className="text-2xl font-bold mb-4">
        Postcard Travel Paths
      </h2>

      {/* EMPTY STATE */}
      {selectedCluster === null && (
        <div className="h-[600px] flex items-center justify-center text-gray-500 text-lg border rounded-xl">
          Select a cluster from the cluster view to explore postcard routes
        </div>
      )}

      {/* MAP */}
      {selectedCluster !== null && (
        <div className="w-full h-[600px] rounded-xl overflow-hidden">

          <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom={true}
            className="w-full h-full"
          >

            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* LIMIT ROUTES */}
            {filtered.slice(0, 300).map((card, i) => {

              if (
                !card.origin_lat ||
                !card.origin_lon ||
                !card.receiving_lat ||
                !card.receiving_lon
              ) {
                return null
              }

              const color =
                colors[
                  Math.abs(card.cluster) %
                  colors.length
                ]

              return (
                <Polyline
                  key={i}
                  positions={[
                    [
                      card.origin_lat,
                      card.origin_lon
                    ],
                    [
                      card.receiving_lat,
                      card.receiving_lon
                    ]
                  ]}
                  pathOptions={{
                    color,
                    weight: 2,
                    opacity: 0.5
                  }}
                />
              )
            })}

          </MapContainer>
        </div>
      )}

      {/* INFO */}
      {selectedCluster !== null && (
        <div className="mt-4 text-sm text-gray-600">
          Showing routes for cluster:
          <span className="font-bold ml-2">
            {selectedCluster}
          </span>
        </div>
      )}

    </div>
  )
}
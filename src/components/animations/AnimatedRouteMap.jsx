import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
} from "react-leaflet";

import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";


/* CREATE CURVED ARC */


function createArc(start, end, curvature = 0.25) {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  const dx = lng2 - lng1;
  const dy = lat2 - lat1;

  const controlLat = midLat + dx * curvature;
  const controlLng = midLng - dy * curvature;

  const points = [];

  for (let i = 0; i <= 80; i++) {
    const t = i / 80;

    const lat =
      (1 - t) * (1 - t) * lat1 +
      2 * (1 - t) * t * controlLat +
      t * t * lat2;

    const lng =
      (1 - t) * (1 - t) * lng1 +
      2 * (1 - t) * t * controlLng +
      t * t * lng2;

    points.push([lat, lng]);
  }

  return points;
}

export default function AnimatedRouteMap({ postcards }) {
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    setDotIndex(0);

    const timer = setInterval(() => {
      setDotIndex((prev) => prev + 1);
    }, 40);

    return () => clearInterval(timer);
  }, [postcards]);

  const currentCard =
    postcards.length > 0
      ? postcards[postcards.length - 1]
      : null;

  let currentArc = [];

  if (currentCard) {
    currentArc = createArc(
      [
        currentCard.origin_lat,
        currentCard.origin_lon,
      ],
      [
        currentCard.receiving_lat,
        currentCard.receiving_lon,
      ]
    );
  }

  const movingPoint =
    currentArc[
      Math.min(dotIndex, currentArc.length - 1)
    ];

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{
        height: "700px",
        width: "100%",
        borderRadius: "20px",
      }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />

      {postcards.map((card, index) => {
        const start = [
          card.origin_lat,
          card.origin_lon,
        ];

        const end = [
          card.receiving_lat,
          card.receiving_lon,
        ];

        const arc = createArc(start, end);

        const isCurrent =
          index === postcards.length - 1;

        const age = postcards.length - index;

        let opacity = 1;
        let weight = 6;

        if (age === 2) {
          opacity = 0.7;
          weight = 5;
        }

        if (age === 3) {
          opacity = 0.45;
          weight = 4;
        }

        if (age === 4) {
          opacity = 0.3;
          weight = 3;
        }

        if (age >= 5) {
          opacity = 0.15;
          weight = 2;
        }

        return (
          <div key={card.id}>
            {/* glow for current route */}
            {isCurrent && (
              <Polyline
                positions={arc}
                pathOptions={{
                  color: "#60a5fa",
                  weight: 14,
                  opacity: 0.12,
                }}
              />
            )}

            {/* route */}
            <Polyline
              positions={arc}
              pathOptions={{
                color: "#2563eb",
                weight,
                opacity,
              }}
            />

            {/* origin */}
            <CircleMarker
              center={start}
              radius={isCurrent ? 5 : 3}
              fillColor="#22c55e"
              fillOpacity={opacity}
              color="white"
              weight={1}
            >
              <Tooltip>
                {card.origin_city}, {card.origin_country}
              </Tooltip>
            </CircleMarker>

            {/* destination */}
            <CircleMarker
              center={end}
              radius={isCurrent ? 5 : 3}
              fillColor="#ef4444"
              fillOpacity={opacity}
              color="white"
              weight={1}
            >
              <Tooltip>
                {card.receiving_city}, {card.receiving_country}
              </Tooltip>
            </CircleMarker>

            {/* city labels */}
            {isCurrent && (
              <>
                <Tooltip
                  permanent
                  direction="left"
                  offset={[-8, 0]}
                  position={start}
                >
                  {card.origin_city}
                </Tooltip>

                <Tooltip
                  permanent
                  direction="right"
                  offset={[8, 0]}
                  position={end}
                >
                  {card.receiving_city}
                </Tooltip>
              </>
            )}
          </div>
        );
      })}

      {/* moving airplane */}
      {movingPoint && (
        <CircleMarker
          center={movingPoint}
          radius={8}
          color="white"
          weight={2}
          fillColor="#facc15"
          fillOpacity={1}
        >
          <Tooltip permanent direction="top">
            ✈
          </Tooltip>
        </CircleMarker>
      )}
    </MapContainer>
  );
}
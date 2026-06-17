import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
  useMap,
  Tooltip,
} from "react-leaflet";

import { useEffect } from "react";

import "leaflet/dist/leaflet.css";

/* ------------------------------------------------ */
/* AUTO FIT */
/* ------------------------------------------------ */

function FitBounds({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (!bounds) return;

    map.fitBounds(bounds, {
      padding: [80, 80],
    });
  }, [bounds, map]);

  return null;
}

/* ------------------------------------------------ */
/* CREATE BEAUTIFUL ARC */
/* ------------------------------------------------ */

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

  for (let i = 0; i <= 50; i++) {
    const t = i / 50;

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

/* ------------------------------------------------ */
/* MAIN COMPONENT */
/* ------------------------------------------------ */

export default function RouteMap({
  selectedCard,
  relatedCards,
}) {
  if (!selectedCard) return null;

  /* ------------------------------------------------ */
  /* VALIDATE */
  /* ------------------------------------------------ */

  const hasSelectedCoords =
    selectedCard.origin_lat != null &&
    selectedCard.origin_lon != null &&
    selectedCard.receiving_lat != null &&
    selectedCard.receiving_lon != null;

  if (!hasSelectedCoords) {
    return (
      <div className="p-6 bg-gray-100 rounded-xl">
        Selected postcard has missing coordinates.
      </div>
    );
  }

  /* ------------------------------------------------ */
  /* FILTER VALID RELATED CARDS */
  /* ------------------------------------------------ */

  const validRelatedCards = relatedCards.filter(
    (card) =>
      card.origin_lat != null &&
      card.origin_lon != null &&
      card.receiving_lat != null &&
      card.receiving_lon != null,
  );

  /* ------------------------------------------------ */
  /* SELECTED ROUTE */
  /* ------------------------------------------------ */

  const origin = [
    selectedCard.origin_lat,
    selectedCard.origin_lon,
  ];

  const destination = [
    selectedCard.receiving_lat,
    selectedCard.receiving_lon,
  ];

  const selectedArc = createArc(
    origin,
    destination,
    0.3,
  );

  const bounds = [origin, destination];

  return (
    <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 bg-white">
      
      {/* ------------------------------------------------ */}
      {/* LEGEND */}
      {/* ------------------------------------------------ */}

      <div className="flex flex-wrap gap-6 p-4 bg-white border-b text-sm">
        <div className="flex items-center gap-2">
          <div className="w-5 h-1 rounded bg-blue-400"></div>
          <span>Normal Routes</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-1 rounded bg-orange-400"></div>
          <span>Outliers (&gt;60 days)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-1 rounded bg-red-500"></div>
          <span>Extreme Outliers (&gt;120 days)</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-5 h-1 rounded bg-purple-500"></div>
          <span>Selected Route</span>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* MAP */}
      {/* ------------------------------------------------ */}

      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={true}
        style={{
          height: "700px",
          width: "100%",
        }}
      >
        {/* AUTO FIT */}
        <FitBounds bounds={bounds} />

        {/* LIGHT MAP */}
        <TileLayer
          attribution="&copy; CartoDB"
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* ------------------------------------------------ */}
        {/* RELATED ROUTES */}
        {/* ------------------------------------------------ */}

        {validRelatedCards.map((card) => {
          const start = [
            card.origin_lat,
            card.origin_lon,
          ];

          const end = [
            card.receiving_lat,
            card.receiving_lon,
          ];

          const arc = createArc(start, end, 0.18);

          let color = "#60a5fa";
          let weight = 1.5;
          let opacity = 0.18;

          if (card.isOutlier) {
            color = "#f59e0b";
            weight = 4;
            opacity = 0.8;
          }

          if (card.isExtremeOutlier) {
            color = "#ef4444";
            weight = 6;
            opacity = 1;
          }

          return (
            <div key={card.id}>
              
              {/* EXTREME GLOW */}
              {card.isExtremeOutlier && (
                <Polyline
                  positions={arc}
                  pathOptions={{
                    color: "#f87171",
                    weight: 14,
                    opacity: 0.2,
                  }}
                />
              )}

              {/* ROUTE */}
              <Polyline
                positions={arc}
                pathOptions={{
                  color,
                  weight,
                  opacity,
                  lineCap: "round",
                }}
              />

              {/* START DOT */}
              <CircleMarker
                center={start}
                radius={3}
                color="white"
                weight={1}
                fillColor={color}
                fillOpacity={1}
              />

              {/* END DOT */}
              <CircleMarker
                center={end}
                radius={3}
                color="white"
                weight={1}
                fillColor={color}
                fillOpacity={1}
              />
            </div>
          );
        })}

        {/* ------------------------------------------------ */}
        {/* SELECTED ROUTE GLOW */}
        {/* ------------------------------------------------ */}

        <Polyline
          positions={selectedArc}
          pathOptions={{
            color: "#c084fc",
            weight: 18,
            opacity: 0.18,
            lineCap: "round",
          }}
        />

        {/* ------------------------------------------------ */}
        {/* SELECTED ROUTE */}
        {/* ------------------------------------------------ */}

        <Polyline
          positions={selectedArc}
          pathOptions={{
            color: "#8b5cf6",
            weight: 6,
            opacity: 1,
            lineCap: "round",
          }}
        />

       {/* ------------------------------------------------ */}
{/* SELECTED ORIGIN */}
{/* ------------------------------------------------ */}

<CircleMarker
  center={origin}
  radius={11}
  weight={3}
  color="white"
  fillColor="#22c55e"
  fillOpacity={1}
>
  <Tooltip
    direction="top"
    offset={[0, -10]}
    opacity={1}
    permanent={false}
  >
    <div className="text-sm">
      <strong>Origin</strong>
      <br />
      {selectedCard.origin_city},{" "}
      {selectedCard.origin_country}
    </div>
  </Tooltip>
</CircleMarker>

{/* ------------------------------------------------ */}
{/* SELECTED DESTINATION */}
{/* ------------------------------------------------ */}

<CircleMarker
  center={destination}
  radius={11}
  weight={3}
  color="white"
  fillColor="#22a7c5"
  fillOpacity={1}
>
  <Tooltip
    direction="top"
    offset={[0, -10]}
    opacity={1}
    permanent={false}
  >
    <div className="text-sm">
      <strong>Destination</strong>
      <br />
      {selectedCard.receiving_city},{" "}
      {selectedCard.receiving_country}
    </div>
  </Tooltip>
</CircleMarker>
      </MapContainer>
    </div>
  );
}
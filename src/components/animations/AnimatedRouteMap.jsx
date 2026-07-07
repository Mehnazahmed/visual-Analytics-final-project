import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Tooltip,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import MovingArrowCanvas from "./MovingArrowCanvas";

/* ------------------------------------------------ */
/* Curved Arc                                       */
/* ------------------------------------------------ */

export function createArc(start, end, curvature = 0.25) {
  const [lat1, lng1] = start;
  const [lat2, lng2] = end;

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  const dx = lng2 - lng1;
  const dy = lat2 - lat1;

  const controlLat = midLat + dx * curvature;
  const controlLng = midLng - dy * curvature;

  const pts = [];

  for (let i = 0; i <= 80; i++) {
    const t = i / 80;

    const lat =
      (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;

    const lng =
      (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;

    pts.push([lat, lng]);
  }

  return pts;
}

/* ------------------------------------------------ */
/* Canvas Layer                                     */
/* ------------------------------------------------ */

function ArrowLayer({ postcards, playing, speed }) {
  const map = useMap();

  return (
    <MovingArrowCanvas
      map={map}
      postcards={postcards}
      playing={playing}
      speed={speed}
      createArc={createArc}
    />
  );
}

/* ------------------------------------------------ */
/* Map                                              */
/* ------------------------------------------------ */

export default function AnimatedRouteMap({
  postcards,
  playing,
  speed,
  progress,
}) {
  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{
        height: "700px",
        width: "100%",
        borderRadius: "18px",
      }}
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

      {/* Animated arrows */}
      <ArrowLayer postcards={postcards} playing={playing} speed={speed} />

      {/* Static Routes */}
      {postcards.map((card, index) => {
        if (
          card.origin_lat == null ||
          card.origin_lon == null ||
          card.receiving_lat == null ||
          card.receiving_lon == null
        ) {
          return null;
        }

        const start = [card.origin_lat, card.origin_lon];

        const end = [card.receiving_lat, card.receiving_lon];

        const arc = createArc(start, end);

        return (
          <div key={card.id ?? index}>
            <Polyline
              positions={arc}
              pathOptions={{
                color: "#2563eb",
                weight: 2,
                opacity: 0.13,
                dashArray: "10 14",
                dashOffset: `${-progress * 1500}`,
                lineCap: "round",
              }}
            />

            <CircleMarker
              center={start}
              radius={2}
              fillColor="#22c55e"
              fillOpacity={0.9}
              color="white"
              weight={0.5}
            >
              <Tooltip>
                {card.origin_city}, {card.origin_country}
              </Tooltip>
            </CircleMarker>

            <CircleMarker
              center={end}
              radius={2}
              fillColor="#ef4444"
              fillOpacity={0.9}
              color="white"
              weight={0.5}
            >
              <Tooltip>
                {card.receiving_city}, {card.receiving_country}
              </Tooltip>
            </CircleMarker>
          </div>
        );
      })}
    </MapContainer>
  );
}

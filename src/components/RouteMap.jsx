import {
  MapContainer,
  TileLayer,
  Polyline,
  CircleMarker,
  Popup,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

export default function RouteMap({
  selectedCard,
  relatedCards,
}) {
  if (!selectedCard) return null;

  // Validate selected postcard
  const selectedValid =
    selectedCard.origin_lat != null &&
    selectedCard.origin_lon != null &&
    selectedCard.receiving_lat != null &&
    selectedCard.receiving_lon != null;

  if (!selectedValid) {
    return (
      <div className="p-4 bg-yellow-100 rounded-lg">
        This postcard has missing coordinates and
        cannot be displayed on the map.
      </div>
    );
  }

  // Filter related postcards with complete coordinates
  const validRelatedCards = relatedCards.filter(
    (card) =>
      card.origin_lat != null &&
      card.origin_lon != null &&
      card.receiving_lat != null &&
      card.receiving_lon != null
  );

  // Optional debugging
  relatedCards.forEach((card) => {
    if (
      card.origin_lat == null ||
      card.origin_lon == null ||
      card.receiving_lat == null ||
      card.receiving_lon == null
    ) {
      console.warn(
        "Skipping postcard with missing coordinates:",
        card.id
      );
    }
  });

  const selectedRoute = [
    [
      selectedCard.origin_lat,
      selectedCard.origin_lon,
    ],
    [
      selectedCard.receiving_lat,
      selectedCard.receiving_lon,
    ],
  ];

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{
        height: "600px",
        width: "100%",
        borderRadius: "16px",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />

      {/* Related routes */}
      {validRelatedCards.map((card) => (
        <Polyline
          key={card.id}
          positions={[
            [
              card.origin_lat,
              card.origin_lon,
            ],
            [
              card.receiving_lat,
              card.receiving_lon,
            ],
          ]}
          pathOptions={{
            color: "#94a3b8",
            weight: 1,
            opacity: 0.2,
          }}
        />
      ))}

      {/* Selected route */}
      <Polyline
        positions={selectedRoute}
        pathOptions={{
          color: "#ef4444",
          weight: 5,
          opacity: 1,
        }}
      />

      {/* Origin marker */}
      <CircleMarker
        center={[
          selectedCard.origin_lat,
          selectedCard.origin_lon,
        ]}
        radius={8}
        pathOptions={{
          color: "#22c55e",
          fillColor: "#22c55e",
          fillOpacity: 1,
        }}
      >
        <Popup>
          <strong>Origin</strong>
          <br />
          {selectedCard.origin_city},{" "}
          {selectedCard.origin_country}
        </Popup>
      </CircleMarker>

      {/* Destination marker */}
      <CircleMarker
        center={[
          selectedCard.receiving_lat,
          selectedCard.receiving_lon,
        ]}
        radius={8}
        pathOptions={{
          color: "#ef4444",
          fillColor: "#ef4444",
          fillOpacity: 1,
        }}
      >
        <Popup>
          <strong>Destination</strong>
          <br />
          {selectedCard.receiving_city},{" "}
          {selectedCard.receiving_country}
        </Popup>
      </CircleMarker>
    </MapContainer>
  );
}
// import {
//   MapContainer,
//   TileLayer,
//   Polyline,
//   CircleMarker,
//   Tooltip,
//   useMap,
// } from "react-leaflet";

// import "leaflet/dist/leaflet.css";
// import MovingArrowCanvas from "./MovingArrowCanvas";

// function MovingArrowLayer({ postcards, playing, speed, createArc }) {
//   const map = useMap();

//   return (
//     <MovingArrowCanvas
//       map={map}
//       postcards={postcards}
//       playing={playing}
//       speed={speed}
//       createArc={createArc}
//     />
//   );
// }

// /* ------------------------------------------------ */
// /* Create Curved Arc                                */
// /* ------------------------------------------------ */

// export function createArc(start, end, curvature = 0.25) {
//   const [lat1, lng1] = start;
//   const [lat2, lng2] = end;

//   const midLat = (lat1 + lat2) / 2;
//   const midLng = (lng1 + lng2) / 2;

//   const dx = lng2 - lng1;
//   const dy = lat2 - lat1;

//   const controlLat = midLat + dx * curvature;
//   const controlLng = midLng - dy * curvature;

//   const points = [];

//   for (let i = 0; i <= 80; i++) {
//     const t = i / 80;

//     const lat =
//       (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;

//     const lng =
//       (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;

//     points.push([lat, lng]);
//   }

//   return points;
// }

// /* ------------------------------------------------ */
// /* Canvas Animation Layer                           */
// /* ------------------------------------------------ */

// /* ------------------------------------------------ */
// /* Animated Route Map                               */
// /* ------------------------------------------------ */

// export default function AnimatedRouteMap({ postcards, playing, speed }) {
//   return (
//     <MapContainer
//       center={[20, 0]}
//       zoom={2.3}
//       scrollWheelZoom={true}
//       style={{
//         height: "700px",
//         width: "100%",
//         borderRadius: "20px",
//       }}
//     >
//       <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />

//       <MovingArrowLayer
//         postcards={postcards}
//         playing={playing}
//         speed={speed}
//         createArc={createArc}
//       />

//       {postcards.map((card, index) => {
//         if (
//           card.origin_lat == null ||
//           card.origin_lon == null ||
//           card.receiving_lat == null ||
//           card.receiving_lon == null
//         ) {
//           return null;
//         }

//         const start = [card.origin_lat, card.origin_lon];

//         const end = [card.receiving_lat, card.receiving_lon];

//         const arc = createArc(start, end);

//         return (
//           <div key={card.id ?? index}>
//             {/* Route */}

//             <Polyline
//               positions={arc}
//               pathOptions={{
//                 color: "#3b82f6",
//                 weight: 1,
//                 opacity: 0.15,
//               }}
//             />

//             {/* Origin */}

//             <CircleMarker
//               center={start}
//               radius={1.2}
//               color="white"
//               weight={0.5}
//               fillColor="#22c55e"
//               fillOpacity={0.9}
//             >
//               <Tooltip>
//                 {card.origin_city}, {card.origin_country}
//               </Tooltip>
//             </CircleMarker>

//             {/* Destination */}

//             <CircleMarker
//               center={end}
//               radius={1.2}
//               color="white"
//               weight={0.5}
//               fillColor="#ef4444"
//               fillOpacity={0.9}
//             >
//               <Tooltip>
//                 {card.receiving_city}, {card.receiving_country}
//               </Tooltip>
//             </CircleMarker>
//           </div>
//         );
//       })}
//     </MapContainer>
//   );
// }

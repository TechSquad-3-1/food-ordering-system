// "use client";

// import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import L from "leaflet";

// interface Props {
//   pickup: { lat: number; lng: number };
//   dropoff: { lat: number; lng: number };
//   driver: { lat: number; lng: number };
//   showPickupRoute: boolean;
//   showDropoffRoute: boolean;
// }

// // Custom Icons
// const pickupIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
//   iconSize: [32, 32],
// });

// const dropoffIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/484/484167.png",
//   iconSize: [32, 32],
// });

// const driverIcon = new L.Icon({
//   iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
//   iconSize: [32, 32],
// });

// export default function DeliveryMap({ pickup, dropoff, driver, showPickupRoute, showDropoffRoute }: Props) {
  
//   if (!pickup || !dropoff || !driver || !pickup.lat || !pickup.lng || !dropoff.lat || !dropoff.lng || !driver.lat || !driver.lng) {
//     return (
//       <div className="flex justify-center items-center h-40">
//         Loading map...
//       </div>
//     );
//   }

//   const pickupRoute = [
//     [driver.lat, driver.lng],
//     [pickup.lat, pickup.lng],
//   ] as [number, number][];

//   const dropoffRoute = [
//     [pickup.lat, pickup.lng],
//     [dropoff.lat, dropoff.lng],
//   ] as [number, number][];

//   return (
//     <MapContainer
//       center={[driver.lat, driver.lng]}
//       zoom={13}
//       scrollWheelZoom={true}
//       style={{ height: "400px", width: "100%", borderRadius: "8px" }}
//     >
//       <TileLayer
//         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         attribution="&copy; OpenStreetMap contributors"
//       />

//       {/* Markers */}
//       <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon}>
//         <Popup>Restaurant Location</Popup>
//       </Marker>

//       <Marker position={[dropoff.lat, dropoff.lng]} icon={dropoffIcon}>
//         <Popup>Customer Location</Popup>
//       </Marker>

//       <Marker position={[driver.lat, driver.lng]} icon={driverIcon}>
//         <Popup>Your Current Location</Popup>
//       </Marker>

//       {/* Routes */}
//       {showPickupRoute && pickupRoute.length > 1 && (
//         <Polyline positions={pickupRoute} pathOptions={{ color: "blue", weight: 5 }} />
//       )}
//       {showDropoffRoute && dropoffRoute.length > 1 && (
//         <Polyline positions={dropoffRoute} pathOptions={{ color: "green", weight: 5 }} />
//       )}
//     </MapContainer>
//   );
// }

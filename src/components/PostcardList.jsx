export default function PostcardList({ postcards }) {
  return (
    <div className="h-screen overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
        {postcards.map((card) => (
          <div
            key={card.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <img
              src={`/data/images/${card.name}`}
              alt={card.id}
              className="w-full h-56 object-cover"
            />

            <div className="p-4 space-y-2">
              <h2 className="font-bold text-lg">
                {card.id}
              </h2>

              <p>
                <strong>From:</strong>{" "}
                {card.origin_city},{" "}
                {card.origin_country}
              </p>

              <p>
                <strong>To:</strong>{" "}
                {card.receiving_city},{" "}
                {card.receiving_country}
              </p>

              <p>
                <strong>Distance:</strong>{" "}
                {card.distance} km
              </p>

              <p>
                <strong>Travel Time:</strong>{" "}
                {card.time} days
              </p>

              <p className="text-sm text-gray-500">
                {card.date_sent} → {card.date_received}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
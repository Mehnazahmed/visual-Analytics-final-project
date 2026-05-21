export default function PostcardCard({ card }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white">
      <img
        src={`/data/images/${card.name}`}
        alt={card.id}
        className="w-full h-56 object-cover"
      />

      <div className="p-4 space-y-1">
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

        <p>
          <strong>Sent:</strong>{" "}
          {card.date_sent}
        </p>

        <p>
          <strong>Received:</strong>{" "}
          {card.date_received}
        </p>
      </div>
    </div>
  );
}
import clusterNames from "../data/clusterNames";
import PostcardMap from "./PostcardMap";

export default function SelectedPostcardPanel({
  selectedCard,
  postcards,
  mapData,
  onSelectCard,
}) {
  if (!selectedCard) return null;

  const relatedPostcards = postcards.filter(
    (card) =>
      card.cluster === selectedCard.cluster &&
      card.id !== selectedCard.id
  );

  return (
    <div className="mt-10 bg-white rounded-2xl shadow-xl p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          Selected Postcard
        </h2>

        <p className="text-gray-600 mt-2">
          Explore visually similar postcards
          and their travel routes.
        </p>
      </div>

      {/* MAIN SECTION */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* IMAGE */}
        <img
          src={`/data/images/${selectedCard.name}`}
          alt={selectedCard.name}
          className="w-80 rounded-xl shadow-lg"
        />

        {/* DETAILS */}
        <div className="space-y-4">
          <p>
            <span className="font-bold">
              Postcard ID:
            </span>{" "}
            {selectedCard.id}
          </p>

          <p>
            <span className="font-bold">
              Topic:
            </span>{" "}
            {clusterNames[selectedCard.cluster] ||
              `Topic Group ${selectedCard.cluster}`}
          </p>

          <p>
            <span className="font-bold">
              From:
            </span>{" "}
            {selectedCard.origin_city},{" "}
            {selectedCard.origin_country}
          </p>

          <p>
            <span className="font-bold">
              To:
            </span>{" "}
            {selectedCard.receiving_city},{" "}
            {selectedCard.receiving_country}
          </p>

          <p>
            <span className="font-bold">
              Distance:
            </span>{" "}
            {selectedCard.distance} km
          </p>

          <p>
            <span className="font-bold">
              Travel Time:
            </span>{" "}
            {selectedCard.travel_days} days
          </p>
        </div>
      </div>

      {/* RELATED POSTCARDS */}
      <div className="mt-10">
        <h3 className="text-2xl font-bold mb-4">
          Related Postcards
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {relatedPostcards.slice(0, 10).map((card) => (
            <img
              key={card.id}
              src={`/data/images/${card.name}`}
              alt={card.name}
              className="rounded-xl cursor-pointer hover:scale-105 transition shadow"
              onClick={() => onSelectCard(card)}
            />
          ))}
        </div>
      </div>

      {/* MAP */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-2">
          Postcard Travel Paths
        </h3>

        <p className="text-gray-600 mb-6">
          This map shows travel routes for
          postcards that belong to the same
          visual topic group.
        </p>

        <PostcardMap
          data={mapData}
          selectedCluster={selectedCard.cluster}
        />
      </div>
    </div>
  );
}
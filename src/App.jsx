import { useEffect, useMemo, useState } from "react";

import usePostcards from "./hooks/usePostcards";

import PostcardList from "./components/PostcardList";
import FilterBar from "./components/FilterBar";
import StatsBar from "./components/StatsBar";
import SelectedPostcardPanel from "./components/SelectedPostcardPanel";
import clusterNames from "./data/clusterNames";
export default function App() {
  const postcards = usePostcards();

  const [clusterData, setClusterData] = useState([]);
  const [mapData, setMapData] = useState([]);

  const [selectedCard, setSelectedCard] = useState(null);
  //search
  const [searchTerm, setSearchTerm] = useState("");

  // FILTERS
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const [originCountry, setOriginCountry] = useState("");

  const [destinationCountry, setDestinationCountry] = useState("");

  const [maxDistance, setMaxDistance] = useState("");

  const [sortBy, setSortBy] = useState("");

  // COUNTRIES
  const countries = useMemo(() => {
    return [
      ...new Set([
        ...postcards.map((p) => p.origin_country),
        ...postcards.map((p) => p.receiving_country),
      ]),
    ].sort();
  }, [postcards]);

  // LOAD CLUSTER DATA
  useEffect(() => {
    fetch("/data/clustered_postcards.json")
      .then((res) => res.json())
      .then((data) => setClusterData(data));
  }, []);

  // LOAD MAP DATA
  useEffect(() => {
    fetch("/data/final_postcards.json")
      .then((res) => res.json())
      .then(setMapData);
  }, []);

  // MERGE POSTCARDS WITH CLUSTER DATA
  const postcardsWithClusters = useMemo(() => {
    return postcards.map((card) => {
      const clusterInfo = clusterData.find((c) => c.image === card.name);
      const isOutlier = Number(card.time) > 60;
      const isExtremeOutlier = Number(card.time) > 120;
      return {
        ...card,
        cluster: clusterInfo?.cluster ?? -1,
        x: clusterInfo?.x,
        y: clusterInfo?.y,
        isOutlier,
        isExtremeOutlier,
      };
    });
  }, [postcards, clusterData]);

  // FILTERING
  const filteredPostcards = useMemo(() => {
    let filtered = [...postcardsWithClusters].filter((card) => {
      const topic = clusterNames[card.cluster]?.toLowerCase() || "";

      const matchesTopic =
        !searchTerm || topic.includes(searchTerm.toLowerCase());

      const matchesSearch = card.id
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesOrigin =
        !originCountry || card.origin_country === originCountry;

      const matchesDestination =
        !destinationCountry || card.receiving_country === destinationCountry;

      const matchesDistance =
        !maxDistance || Number(card.distance) <= Number(maxDistance);

      const sentDate = new Date(card.date_sent);

      const matchesStartDate = !startDate || sentDate >= new Date(startDate);

      const matchesEndDate = !endDate || sentDate <= new Date(endDate);

      return (
        matchesTopic &&
        matchesSearch &&
        matchesOrigin &&
        matchesDestination &&
        matchesDistance &&
        matchesStartDate &&
        matchesEndDate
      );
    });

    switch (sortBy) {
      case "distanceAsc":
        filtered.sort((a, b) => Number(a.distance) - Number(b.distance));
        break;

      case "distanceDesc":
        filtered.sort((a, b) => Number(b.distance) - Number(a.distance));
        break;

      case "timeAsc":
        filtered.sort((a, b) => Number(a.time) - Number(b.time));
        break;

      case "timeDesc":
        filtered.sort((a, b) => Number(b.time) - Number(a.time));
        break;

      default:
        break;
    }

    return filtered;
  }, [
    postcards,
    search,
    searchTerm,
    originCountry,
    destinationCountry,
    maxDistance,
    sortBy,
    startDate,
    endDate,
    postcardsWithClusters,
  ]);

  if (!postcards.length) {
    return <div className="p-10 text-xl">Loading postcards...</div>;
  }

  //searchTopic
  const topics = [...new Set(Object.values(clusterNames))];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6">Postcrossing Explorer</h1>
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search topics (mountain, animal, city...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="
      w-full
      px-5
      py-3
      border
      border-gray-300
      rounded-xl
      shadow-sm
      focus:outline-none
      focus:ring-2
      focus:ring-blue-500
    "
        />
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        {topics.slice(0, 20).map((topic) => (
          <button
            key={topic}
            onClick={() => setSearchTerm(topic)}
            className="
        px-3
        py-1
        rounded-full
        bg-blue-50
        text-blue-700
        hover:bg-blue-100
        transition
      "
          >
            {topic}
          </button>
        ))}
      </div>
      <p className="text-gray-500 mt-2 mb-8">
        Showing {filteredPostcards.length} postcards
      </p>
      <FilterBar
        search={search}
        setSearch={setSearch}
        originCountry={originCountry}
        setOriginCountry={setOriginCountry}
        destinationCountry={destinationCountry}
        setDestinationCountry={setDestinationCountry}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
        sortBy={sortBy}
        setSortBy={setSortBy}
        countries={countries}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
      />

      <StatsBar postcards={filteredPostcards} />

      <PostcardList
        postcards={filteredPostcards}
        onSelectPostcard={setSelectedCard}
      />

      <SelectedPostcardPanel
        selectedCard={selectedCard}
        postcards={filteredPostcards}
        mapData={mapData}
        onSelectCard={setSelectedCard}
      />
    </div>
  );
}

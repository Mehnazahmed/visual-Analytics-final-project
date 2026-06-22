import { useMemo, useEffect, useState } from "react";
import AnimatedRouteMap from "./AnimatedRouteMap";
import ActivityTimeline from "./ActivityTimeline";

export default function AnimatedJourneyPanel({ postcards }) {
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sort postcards chronologically
  const sortedCards = useMemo(() => {
    return [...postcards]
      .filter(
        (p) =>
          p &&
          p.date_sent &&
          p.origin_lat != null &&
          p.origin_lon != null &&
          p.receiving_lat != null &&
          p.receiving_lon != null
      )
      .sort(
        (a, b) =>
          new Date(a.date_sent) - new Date(b.date_sent)
      );
  }, [postcards]);

  //clg
  console.log(
    "Current index:",
    currentIndex,
    "Total cards:",
    sortedCards.length
  );

  // Animation
  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= sortedCards.length) {
          setPlaying(false);
          return prev;
        }

        return prev + speed;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [playing, speed, sortedCards]);

  // Keep only recent routes visible
  const TRAIL_LENGTH = 10;

  const visibleCards = sortedCards.slice(
    Math.max(0, currentIndex - TRAIL_LENGTH),
    Math.min(currentIndex, sortedCards.length)
  );

  // Current postcard
  const currentCard =
    sortedCards[Math.max(currentIndex - 1, 0)];

  const currentDate = currentCard?.date_sent || "-";

  const currentYear =
    currentDate !== "-"
      ? new Date(currentDate).getFullYear()
      : "-";

  const progress =
    sortedCards.length > 0
      ? Math.round((currentIndex / sortedCards.length) * 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">

      <h2 className="text-2xl font-bold mb-6">
        Animated Postcard Journeys
      </h2>

      {/* Controls */}
      <div className="flex gap-4 mb-6">

        <button
          className="px-5 py-2 bg-blue-600 text-white rounded-xl"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <button
          className="px-5 py-2 bg-gray-200 rounded-xl"
          onClick={() => {
            setPlaying(false);
            setCurrentIndex(0);
          }}
        >
          Reset
        </button>

        <select
          value={speed}
          className="border px-4 rounded-xl"
          onChange={(e) => setSpeed(Number(e.target.value))}
        >
          <option value={1}>1x</option>
          <option value={2}>2x</option>
          <option value={5}>5x</option>
          <option value={10}>10x</option>
        </select>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={0}
        max={sortedCards.length}
        value={currentIndex}
        className="w-full"
        onChange={(e) =>
          setCurrentIndex(Number(e.target.value))
        }
      />

      <div className="flex justify-between text-sm text-gray-500 mb-8 mt-2">
        <span>{sortedCards[0]?.date_sent}</span>
        <span>{currentDate}</span>
        <span>{sortedCards.at(-1)?.date_sent}</span>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-10 mb-8">

        <div>
          <div className="text-gray-500">
            Current Year
          </div>

          <div className="text-4xl font-bold text-blue-600">
            {currentYear}
          </div>
        </div>

        <div>
          <div className="text-gray-500">
            Current Card
          </div>

          <div className="text-2xl font-bold text-red-500">
            {currentCard?.id || "-"}
          </div>
        </div>

        <div>
          <div className="text-gray-500">
            Trail Length
          </div>

          <div className="text-4xl font-bold text-purple-600">
            {visibleCards.length}
          </div>
        </div>

        <div>
          <div className="text-gray-500">
            Progress
          </div>

          <div className="text-4xl font-bold text-green-600">
            {progress}%
          </div>
        </div>
      </div>

      {/* Activity graph */}
      <ActivityTimeline postcards={visibleCards} />

      {/* Animated map */}
      <AnimatedRouteMap postcards={visibleCards} />
    </div>
  );
}
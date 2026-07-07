import { useEffect, useMemo, useState } from "react";
import AnimatedRouteMap from "./AnimatedRouteMap";

export default function AnimatedJourneyPanel({ postcards }) {
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [progress, setProgress] = useState(0);

  const sortedCards = useMemo(() => {
    return [...postcards]
      .filter(
        (p) =>
          p.origin_lat != null &&
          p.origin_lon != null &&
          p.receiving_lat != null &&
          p.receiving_lon != null &&
          p.date_sent,
      )
      .sort((a, b) => new Date(a.date_sent) - new Date(b.date_sent));
  }, [postcards]);

  useEffect(() => {
    if (!playing) return;

    let animation;

    let last = performance.now();

    const animate = (now) => {
      const delta = now - last;
      last = now;

      setProgress((p) => {
        let next = p + delta * 0.00004 * speed;

        if (next > 1) next -= 1;

        return next;
      });

      animation = requestAnimationFrame(animate);
    };

    animation = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animation);
  }, [playing, speed]);

  const currentIndex = Math.floor(progress * (sortedCards.length - 1));

  const currentYear = sortedCards[currentIndex]
    ? new Date(sortedCards[currentIndex].date_sent).getFullYear()
    : "-";

  return (
    <div className="bg-white rounded-2xl shadow-xl p-5">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-3xl font-bold">Animated Postcard Journeys</h2>

          <p className="text-gray-500">
            All postcard routes animate in parallel
          </p>
        </div>

        <div className="flex gap-10 items-center">
          <button
            onClick={() => setPlaying(!playing)}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {playing ? "Pause" : "Play"}
          </button>

          <button
            className="border rounded-xl px-6 py-3"
            onClick={() => setProgress(0)}
          >
            Reset
          </button>

          <div>
            <div className="text-gray-500 text-sm">Speed</div>

            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="border rounded-lg p-2"
            >
              <option value={0.5}>0.5x</option>
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={4}>4x</option>
              <option value={8}>8x</option>
            </select>
          </div>

          <div className="w-80">
            <div className="flex justify-between text-sm">
              <span>Progress</span>

              <span className="font-semibold text-blue-600">
                {Math.round(progress * 100)}%
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <div className="text-gray-500 text-sm">Current Year</div>

            <div className="text-4xl font-bold text-blue-600">
              {currentYear}
            </div>
          </div>

          <div>
            <div className="text-gray-500 text-sm">Total Routes</div>

            <div className="text-4xl font-bold text-purple-600">
              {sortedCards.length.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <AnimatedRouteMap postcards={sortedCards} progress={progress} />
    </div>
  );
}

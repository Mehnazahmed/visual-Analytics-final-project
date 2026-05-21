import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";

import PostcardMap from "./PostcardMap";
import clusterNames from "../data/clusterNames";

export default function ClusterView({
  data,
  mapData,
}) {
  const svgRef = useRef();

  const [selectedCard, setSelectedCard] =
    useState(null);

  // CREATE UNIQUE CLUSTER LIST
  const clusters = useMemo(() => {
    return [
      ...new Set(
        data.map((d) => d.cluster)
      ),
    ];
  }, [data]);

  useEffect(() => {
    if (!data.length) return;

    const width = 1200;
    const height = 800;

    // CLEAR SVG
    d3.select(svgRef.current)
      .selectAll("*")
      .remove();

    // CREATE SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "#f8fafc")
      .style("border-radius", "12px");

    const g = svg.append("g");

    // ZOOM + PAN
    svg.call(
      d3
        .zoom()
        .scaleExtent([0.5, 10])
        .on("zoom", (event) => {
          g.attr(
            "transform",
            event.transform
          );
        })
    );

    // COLOR SCALE
    const color =
      d3.scaleOrdinal(
        d3.schemeCategory10
      );

    // X SCALE
    const xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, (d) => d.x)
      )
      .range([50, width - 50]);

    // Y SCALE
    const yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(data, (d) => d.y)
      )
      .range([50, height - 50]);

    // DRAW POSTCARD IMAGES
    g.selectAll("image")
      .data(data)
      .enter()
      .append("image")
      .attr(
        "xlink:href",
        (d) =>
          `/data/images/${d.image}`
      )
      .attr(
        "x",
        (d) =>
          xScale(d.x) - 15
      )
      .attr(
        "y",
        (d) =>
          yScale(d.y) - 15
      )
      .attr("width", 30)
      .attr("height", 30)
      .attr("opacity", 0.9)
      .style("cursor", "pointer")
      .style(
        "outline",
        (d) =>
          `2px solid ${color(
            d.cluster
          )}`
      )
      .style(
        "border-radius",
        "6px"
      )
      .on(
        "click",
        (event, d) => {
          setSelectedCard(d);
        }
      );
  }, [data]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mt-8">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold">
          AI Topic Clusters
        </h2>

        <p className="text-gray-600 mt-2">
          Similar postcards are grouped
          together based on visual
          themes using AI image
          clustering. Click a postcard
          to explore related postcards
          and their travel routes.
        </p>
      </div>

      {/* STATS */}
      <div className="flex gap-6 mb-6 text-sm text-gray-600">

        <p>
          Total postcards:{" "}
          <span className="font-bold">
            {data.length}
          </span>
        </p>

        <p>
          Topic groups:{" "}
          <span className="font-bold">
            {clusters.length}
          </span>
        </p>

      </div>

      {/* CLUSTER VISUALIZATION */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <svg ref={svgRef}></svg>
      </div>

      {/* SELECTED POSTCARD */}
      {selectedCard && (
        <div className="mt-8 p-6 border rounded-2xl bg-gray-50">

          <h3 className="text-2xl font-bold mb-6">
            Selected Postcard
          </h3>

          <div className="flex flex-col lg:flex-row gap-8">

            {/* IMAGE */}
            <img
              src={`/data/images/${selectedCard.image}`}
              alt={selectedCard.image}
              className="w-80 rounded-xl shadow-lg"
            />

            {/* DETAILS */}
            <div className="space-y-4">

              <p>
                <span className="font-bold">
                  Image:
                </span>{" "}
                {selectedCard.image}
              </p>

              {/* TOPIC + COLOR */}
              <p className="flex items-center gap-3">

                <span className="font-bold">
                  Topic:
                </span>

                <span
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor:
                      d3.schemeCategory10[
                        Math.abs(
                          selectedCard.cluster
                        ) % 10
                      ],
                  }}
                ></span>

                {clusterNames[
                  selectedCard.cluster
                ] ||
                  `Topic Group ${selectedCard.cluster}`}
              </p>

              <p className="text-gray-600">
                This postcard belongs to
                a visually similar topic
                group identified using
                AI clustering.
              </p>

            </div>
          </div>

          {/* RELATED POSTCARDS */}
          <div className="mt-8">

            <h4 className="text-xl font-bold mb-4">
              Related Postcards
            </h4>

            <p className="text-gray-600 mb-4">
              These postcards belong to
              the same visual topic
              group.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

              {data
                .filter(
                  (d) =>
                    d.cluster ===
                      selectedCard.cluster &&
                    d.image !==
                      selectedCard.image
                )
                .slice(0, 10)
                .map((card) => (
                  <img
                    key={card.image}
                    src={`/data/images/${card.image}`}
                    alt={card.image}
                    className="rounded-xl cursor-pointer hover:scale-105 transition shadow"
                    onClick={() =>
                      setSelectedCard(card)
                    }
                  />
                ))}

            </div>
          </div>

          {/* MAP SECTION */}
          <div className="mt-10">

            <h4 className="text-2xl font-bold mb-2">
              Travel Routes for Similar
              Postcards
            </h4>

            <p className="text-gray-600 mb-6">
              The map below visualizes
              postcard travel paths for
              postcards belonging to the
              same visual topic group.
              Routes are color-coded by
              cluster to help users
              identify related postcard
              journeys.
            </p>

            <PostcardMap
              data={mapData}
              selectedCluster={
                selectedCard.cluster
              }
            />

          </div>
        </div>
      )}
    </div>
  );
}
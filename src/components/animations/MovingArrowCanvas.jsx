import { useEffect, useRef } from "react";

export default function MovingArrowCanvas({
  map,
  postcards,
  playing,
  speed,
  createArc,
}) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const progressRef = useRef(0);

  useEffect(() => {
    if (!map) return;

    //------------------------------------
    // Create Canvas
    //------------------------------------

    const canvas = document.createElement("canvas");

    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = 500;

    map.getPanes().overlayPane.appendChild(canvas);

    canvasRef.current = canvas;

    const ctx = canvas.getContext("2d");

    //------------------------------------
    // Resize
    //------------------------------------

    function resize() {
      const size = map.getSize();

      canvas.width = size.x;
      canvas.height = size.y;

      canvas.style.width = size.x + "px";
      canvas.style.height = size.y + "px";
    }

    resize();

    map.on("zoom move resize", resize);

    //------------------------------------
    // Draw one frame
    //------------------------------------

    function drawFrame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // advance animation
      progressRef.current += 0.002 * speed;

      if (progressRef.current > 1) {
        progressRef.current = 0;
      }

      //------------------------------------
      // Draw every postcard
      //------------------------------------

      postcards.forEach((card, index) => {
        if (
          card.origin_lat == null ||
          card.origin_lon == null ||
          card.receiving_lat == null ||
          card.receiving_lon == null
        ) {
          return;
        }

        const arc = createArc(
          [card.origin_lat, card.origin_lon],
          [card.receiving_lat, card.receiving_lon],
        );

        if (arc.length < 2) return;

        // Each route has a different phase
        const phase = (progressRef.current + index * 0.0007) % 1;

        const i = Math.floor(phase * (arc.length - 2));

        const A = map.latLngToContainerPoint(arc[i]);
        const B = map.latLngToContainerPoint(arc[i + 1]);

        const angle = Math.atan2(B.y - A.y, B.x - A.x);

        //------------------------------------
        // Draw arrow
        //------------------------------------

        ctx.save();

        ctx.translate(A.x, A.y);

        ctx.rotate(angle);

        ctx.beginPath();

        ctx.moveTo(8, 0);

        ctx.lineTo(-6, -4);

        ctx.lineTo(-6, 4);

        ctx.closePath();

        ctx.fillStyle = "#2563eb";

        ctx.fill();

        ctx.restore();
      });

      if (playing) {
        animationRef.current = requestAnimationFrame(drawFrame);
      }
    }

    //------------------------------------
    // Start animation
    //------------------------------------

    if (playing) {
      drawFrame();
    }

    //------------------------------------
    // Cleanup
    //------------------------------------

    return () => {
      cancelAnimationFrame(animationRef.current);

      map.off("zoom move resize", resize);

      canvas.remove();
    };
  }, [map, postcards, playing, speed, createArc]);

  return null;
}

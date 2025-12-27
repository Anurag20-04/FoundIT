import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";

export default function SphereBackground() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="tsparticles"
       style={{
      pointerEvents: "none",   // 🔑 CRITICAL FIX
      position: "absolute",
      inset: 0,
      zIndex: 0,
       }}
      options={{
        fullScreen: { enable: false },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: "attract", 
            },
          },
          modes: {
            attract: {
              distance: 200, // Small range: only attracts when cursor is near the ring
              duration: 0.3,
              speed: 15,
            },
          },
        },
        particles: {
          number: { value: 130, density: { enable: false } },
          color: { value: "#38bdf8" },
          shape: { type: "circle" },
          opacity: { value: 0.8 },
          size: { value: { min: 1, max: 2 } },
          // THE LINKS (Staying Enabled)
          links: {
            enable: true,
            distance: 90,
            color: "#38bdf8",
            opacity: 0.3,
            width: 1,
            // THIS PREVENTS THE LAG: 
            // It stops the "web" from getting too complex in the center
            maxLinks: 2 
          },
          move: {
            enable: true,
            speed: 1.2,
            direction: "none",
            outModes: { default: "out" }, // Fixes the "hitting a wall" feeling
            attract: {
              enable: true,
              // Negative values push them OUT to form the hollow circle
              rotate: { x: -5000, y: -5000 } 
            }
          },
        },
        detectRetina: true,
      }}
    />
  );
}
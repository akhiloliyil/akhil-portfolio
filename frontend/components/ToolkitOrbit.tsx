import { ToolIcon } from "./ToolIcon";

// Angle (degrees, 0 = right, clockwise), radius (fraction of the ring's
// max reach) and tile size — hand-tuned once for an organic, non-grid
// scatter rather than an evenly-spaced circle. Deterministic (no RNG) so
// server and client render identically.
const ORBIT: { name: string; angle: number; radius: number; size: number }[] = [
  { name: "Figma", angle: 208, radius: 0.95, size: 68 },
  { name: "Adobe XD", angle: 165, radius: 0.62, size: 52 },
  { name: "Illustrator", angle: 128, radius: 0.92, size: 56 },
  { name: "Photoshop", angle: 82, radius: 0.68, size: 52 },
  { name: "ReactJS", angle: 42, radius: 0.9, size: 60 },
  { name: "Next.js", angle: 8, radius: 0.6, size: 52 },
  { name: "Node.js", angle: 340, radius: 0.9, size: 56 },
  { name: "Tailwind CSS", angle: 300, radius: 0.62, size: 52 },
  { name: "ChatGPT", angle: 260, radius: 0.9, size: 56 },
  { name: "Claude", angle: 232, radius: 0.36, size: 48 },
  { name: "GSAP", angle: 20, radius: 0.34, size: 44 },
  { name: "Midjourney", angle: 105, radius: 0.33, size: 44 },
  { name: "WordPress", angle: 320, radius: 0.34, size: 44 },
  { name: "Framer Motion", angle: 185, radius: 0.34, size: 44 },
];

const DURATIONS = [6, 7.5, 5.5, 8, 6.5, 7, 5, 8.5];

export default function ToolkitOrbit() {
  return (
    <div
      aria-hidden
      className="relative mx-auto aspect-square w-full max-w-[440px]"
    >
      <div className="absolute inset-[8%] rounded-full border border-accent/15" />
      <div className="absolute inset-[26%] rounded-full border border-accent/10" />

      {ORBIT.map((tool, i) => {
        const rad = (tool.angle * Math.PI) / 180;
        const maxReach = 50 - (tool.size / 440) * 50 - 2;
        const x = 50 + tool.radius * maxReach * Math.cos(rad);
        const y = 50 + tool.radius * maxReach * Math.sin(rad);
        return (
          <div
            key={tool.name}
            className="toolkit-orbit-tile"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDuration: `${DURATIONS[i % DURATIONS.length]}s`,
              animationDelay: `${(i % DURATIONS.length) * -0.7}s`,
            }}
          >
            <ToolIcon name={tool.name} size={tool.size} variant="glow" />
          </div>
        );
      })}
    </div>
  );
}

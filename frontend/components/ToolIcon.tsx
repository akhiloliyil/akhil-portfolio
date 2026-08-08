import type { ComponentType, SVGProps } from "react";
import {
  SiFigma,
  SiHtml5,
  SiSass,
  SiJavascript,
  SiJquery,
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiTailwindcss,
  SiShadcnui,
  SiFramer,
  SiGreensock,
  SiThreedotjs,
  SiBootstrap,
  SiMui,
  SiClaude,
  SiGooglegemini,
  SiGithubcopilot,
  SiCursor,
  SiWoocommerce,
  SiWordpress,
  SiJoomla,
  SiMaterialdesign,
} from "react-icons/si";
import {
  TbBrandAdobeXd,
  TbBrandAdobePhotoshop,
  TbBrandAdobeIllustrator,
  TbBrandOpenai,
  TbBrandAdobe,
  TbBrandGoogleFilled,
} from "react-icons/tb";
import { FaMagento } from "react-icons/fa6";
import {
  PenSquare,
  ShoppingCart,
  Waves,
  Sparkles,
  Accessibility,
  LayoutGrid,
  Smartphone,
  Globe,
  Users,
  Clock,
  Puzzle,
  Shuffle,
  ScanSearch,
  Layers,
  Handshake,
} from "lucide-react";

type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

// "auto" = the brand mark is itself black/near-black, so it's rendered in
// the theme's ink colour instead of a fixed hex (otherwise it vanishes on
// dark backgrounds). "accent" = no public brand mark exists for this tool,
// so it borrows the site's own accent colour rather than inventing one.
type ToolVisual =
  | { kind: "icon"; Icon: IconComponent; tone: string }
  | { kind: "text"; label: string; tone: string };

const AUTO = "rgb(var(--ink))";
const ACCENT = "rgb(var(--accent))";

const VISUALS: Record<string, ToolVisual> = {
  // Design
  "Adobe XD": { kind: "icon", Icon: TbBrandAdobeXd, tone: "#FF61F6" },
  Figma: { kind: "icon", Icon: SiFigma, tone: "#F24E1E" },
  Photoshop: { kind: "icon", Icon: TbBrandAdobePhotoshop, tone: "#31A8FF" },
  Illustrator: { kind: "icon", Icon: TbBrandAdobeIllustrator, tone: "#FF9A00" },
  Balsamiq: { kind: "icon", Icon: PenSquare, tone: ACCENT },
  Canva: { kind: "text", label: "Ca", tone: "#00C4CC" },
  "Google Web Designer": { kind: "icon", Icon: TbBrandGoogleFilled, tone: "#4285F4" },
  "Material Icons": { kind: "icon", Icon: SiMaterialdesign, tone: "#6750A4" },

  // Front-End
  HTML5: { kind: "icon", Icon: SiHtml5, tone: "#E34F26" },
  "CSS3 / SASS": { kind: "icon", Icon: SiSass, tone: "#CC6699" },
  "JavaScript (ES6+)": { kind: "icon", Icon: SiJavascript, tone: "#F7DF1E" },
  jQuery: { kind: "icon", Icon: SiJquery, tone: "#0769AD" },
  ReactJS: { kind: "icon", Icon: SiReact, tone: "#61DAFB" },
  "React Native": { kind: "icon", Icon: SiReact, tone: "#61DAFB" },
  "Next.js": { kind: "icon", Icon: SiNextdotjs, tone: AUTO },
  "Node.js": { kind: "icon", Icon: SiNodedotjs, tone: "#5FA04E" },
  "Tailwind CSS": { kind: "icon", Icon: SiTailwindcss, tone: "#06B6D4" },
  "shadcn/ui": { kind: "icon", Icon: SiShadcnui, tone: AUTO },
  "Framer Motion": { kind: "icon", Icon: SiFramer, tone: "#0055FF" },
  GSAP: { kind: "icon", Icon: SiGreensock, tone: "#0AE448" },
  Lenis: { kind: "icon", Icon: Waves, tone: ACCENT },
  "React Three Fiber": { kind: "icon", Icon: SiThreedotjs, tone: AUTO },
  Bootstrap: { kind: "icon", Icon: SiBootstrap, tone: "#7952B3" },
  Reactstrap: { kind: "icon", Icon: SiBootstrap, tone: "#7952B3" },
  "Material-UI": { kind: "icon", Icon: SiMui, tone: "#007FFF" },

  // AI Tools
  ChatGPT: { kind: "icon", Icon: TbBrandOpenai, tone: AUTO },
  Claude: { kind: "icon", Icon: SiClaude, tone: "#D97757" },
  Gemini: { kind: "icon", Icon: SiGooglegemini, tone: "#8E75B2" },
  "Google Stitch": { kind: "icon", Icon: TbBrandGoogleFilled, tone: "#4285F4" },
  "Google Whisk": { kind: "icon", Icon: TbBrandGoogleFilled, tone: "#4285F4" },
  Midjourney: { kind: "icon", Icon: Sparkles, tone: ACCENT },
  "Adobe Firefly": { kind: "icon", Icon: TbBrandAdobe, tone: "#FF0000" },
  "Figma AI": { kind: "icon", Icon: SiFigma, tone: "#F24E1E" },
  "GitHub Copilot": { kind: "icon", Icon: SiGithubcopilot, tone: AUTO },
  Cursor: { kind: "icon", Icon: SiCursor, tone: AUTO },
  v0: { kind: "text", label: "v0", tone: AUTO },

  // Platforms
  Magento: { kind: "icon", Icon: FaMagento, tone: "#F26322" },
  WooCommerce: { kind: "icon", Icon: SiWoocommerce, tone: "#96588A" },
  "Zen Cart": { kind: "icon", Icon: ShoppingCart, tone: ACCENT },
  WordPress: { kind: "icon", Icon: SiWordpress, tone: "#21759B" },
  Joomla: { kind: "icon", Icon: SiJoomla, tone: "#5091CD" },

  // Practice
  "Responsive / Mobile-first": { kind: "icon", Icon: Smartphone, tone: ACCENT },
  "Cross-browser Compatibility": { kind: "icon", Icon: Globe, tone: ACCENT },
  "WCAG Accessibility": { kind: "icon", Icon: Accessibility, tone: ACCENT },
  "Design Systems": { kind: "icon", Icon: LayoutGrid, tone: ACCENT },

  // Soft Skills
  "Team Collaboration": { kind: "icon", Icon: Users, tone: ACCENT },
  "Time Management": { kind: "icon", Icon: Clock, tone: ACCENT },
  "Problem Solving": { kind: "icon", Icon: Puzzle, tone: ACCENT },
  Adaptability: { kind: "icon", Icon: Shuffle, tone: ACCENT },
  "Attention to Detail": { kind: "icon", Icon: ScanSearch, tone: ACCENT },
  Multitasking: { kind: "icon", Icon: Layers, tone: ACCENT },
  "Client Relations": { kind: "icon", Icon: Handshake, tone: ACCENT },

  // Languages
  English: { kind: "text", label: "🇬🇧", tone: ACCENT },
  Hindi: { kind: "text", label: "🇮🇳", tone: ACCENT },
  Malayalam: { kind: "text", label: "🇮🇳", tone: ACCENT },
};

const FALLBACK = (name: string): ToolVisual => ({
  kind: "text",
  label: name.slice(0, 2).toUpperCase(),
  tone: ACCENT,
});

// Tints a tone for use as a tile background. Hex tones (real brand colours)
// get an alpha suffix; the "rgb(var(--x))" theme tokens need the alpha
// spliced in before their own closing paren instead — a plain suffix would
// nest it inside the var() call and produce invalid, silently-dropped CSS.
function tint(tone: string, alpha: number) {
  if (tone.startsWith("#")) {
    return `${tone}${Math.round(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  }
  return `${tone.slice(0, -1)} / ${alpha})`;
}

export function ToolIcon({
  name,
  size = 28,
  variant = "chip",
}: {
  name: string;
  size?: number;
  variant?: "chip" | "glow";
}) {
  const visual = VISUALS[name] ?? FALLBACK(name);
  const isGlow = variant === "glow";
  const background = isGlow ? "#0c0f18" : tint(visual.tone, 0.14);
  const glowRing = tint(visual.tone, 0.5);
  const glowHalo = tint(visual.tone, 0.35);

  return (
    <span
      aria-hidden
      className={
        isGlow
          ? "inline-flex shrink-0 items-center justify-center rounded-2xl"
          : "inline-flex shrink-0 items-center justify-center rounded-xl border border-line"
      }
      style={{
        width: size,
        height: size,
        background,
        boxShadow: isGlow
          ? `0 0 0 1px ${glowRing}, 0 0 ${size * 0.6}px ${glowHalo}`
          : undefined,
      }}
    >
      {visual.kind === "icon" ? (
        <visual.Icon
          style={{ color: visual.tone, width: size * 0.5, height: size * 0.5 }}
        />
      ) : (
        <span
          className="font-mono font-semibold leading-none"
          style={{ color: visual.tone, fontSize: size * 0.35 }}
        >
          {visual.label}
        </span>
      )}
    </span>
  );
}

export function allToolNames(toolkit: { tools: string[] }[]) {
  return toolkit.flatMap((group) => group.tools);
}

import { ToolIcon } from "./ToolIcon";

const COLUMN_COUNT = 4;
const DURATIONS = [26, 34, 22, 30];

function distribute(tools: string[], columns: number) {
  const buckets: string[][] = Array.from({ length: columns }, () => []);
  tools.forEach((tool, i) => buckets[i % columns].push(tool));
  return buckets;
}

export default function ToolkitMarquee({ tools }: { tools: string[] }) {
  const columns = distribute(tools, COLUMN_COUNT);

  return (
    <div
      aria-hidden
      className="toolkit-marquee relative grid h-[360px] grid-cols-2 gap-3 overflow-hidden sm:h-[420px] sm:grid-cols-4"
    >
      {columns.map((column, i) => (
        <div key={i} className={i >= 2 ? "hidden sm:block" : undefined}>
          <div className="relative h-full overflow-hidden rounded-lg">
            <div
              className={`toolkit-column flex flex-col gap-3 ${
                i % 2 === 1 ? "toolkit-column--reverse" : ""
              }`}
              style={{ animationDuration: `${DURATIONS[i % DURATIONS.length]}s` }}
            >
              {[...column, ...column].map((tool, j) => (
                <div key={`${tool}-${j}`} className="flex items-center justify-center">
                  <ToolIcon name={tool} size={56} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

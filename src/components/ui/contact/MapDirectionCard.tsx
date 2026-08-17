import { MapPin, Navigation } from "lucide-react";
import { MapDetails } from "@/types/contact";

export function MapDirectionCard({ map }: { map: MapDetails }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/55 p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)] backdrop-blur-md">
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-peach)]/12 text-[var(--accent-peach)]">
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-[family:var(--font-serif)] text-lg font-bold uppercase tracking-tight text-[var(--text-primary)]">
            {map.restaurantName}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--text-body)]">
            {map.description}
          </p>
          <a
            href={map.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="group/dir mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--accent-peach)] transition-colors duration-300 hover:text-[var(--accent-orange)]"
          >
            Get Directions
            <Navigation
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover/dir:-translate-y-0.5 group-hover/dir:translate-x-1"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

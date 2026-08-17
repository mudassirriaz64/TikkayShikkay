import { MapPin } from "lucide-react";
import { MapDirectionCard } from "@/components/ui/contact/MapDirectionCard";
import { MapDetails } from "@/types/contact";

function MapGraphic() {
  return (
    <svg
      viewBox="0 0 800 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <pattern
          id="ts-map-grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M48 0H0V48"
            fill="none"
            stroke="rgba(255,255,255,0.035)"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="#201f1f" />
      <rect width="800" height="600" fill="url(#ts-map-grid)" />

      <rect x="540" y="110" width="150" height="118" rx="24" fill="rgba(244,190,84,0.05)" />
      <rect x="110" y="352" width="180" height="132" rx="24" fill="rgba(255,180,162,0.045)" />
      <circle cx="400" cy="300" r="270" fill="rgba(255,86,42,0.035)" />

      <path
        d="M-20 500 C 180 460, 300 380, 420 300 S 720 130, 830 90"
        fill="none"
        stroke="#2c2b2b"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <path
        d="M120 -20 C 180 140, 260 300, 200 620"
        fill="none"
        stroke="#2c2b2b"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M700 -20 C 640 140, 660 360, 760 620"
        fill="none"
        stroke="#2c2b2b"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M0 150 C 220 170, 420 130, 820 180"
        fill="none"
        stroke="#2c2b2b"
        strokeWidth="3"
        strokeDasharray="2 14"
        strokeLinecap="round"
      />

      <text
        x="596"
        y="200"
        fill="rgba(255,255,255,0.12)"
        fontSize="11"
        letterSpacing="2"
        textAnchor="middle"
      >
        FOOD DISTRICT
      </text>
      <text
        x="240"
        y="520"
        fill="rgba(255,255,255,0.1)"
        fontSize="10"
        letterSpacing="2"
      >
        CHARCOAL LN
      </text>
      <text
        x="620"
        y="70"
        fill="rgba(255,255,255,0.1)"
        fontSize="10"
        letterSpacing="2"
      >
        SPICE AVE
      </text>
    </svg>
  );
}

export function ContactMap({ map }: { map: MapDetails }) {
  return (
    <div className="group/map relative h-full min-h-[460px] overflow-hidden rounded-[28px] border border-[var(--border-warm)] bg-[var(--bg-surface)] shadow-[0_30px_60px_rgba(0,0,0,0.35)] lg:min-h-[560px]">
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-out-soft)] group-hover/map:scale-[1.045]">
        <MapGraphic />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,86,42,0.14),transparent_60%)]"
      />

      <div className="absolute left-[62%] top-[44%] -translate-x-1/2 -translate-y-full">
        <div className="relative" aria-hidden="true">
          <span className="absolute -inset-3 animate-ping rounded-full bg-[var(--accent-orange)]/20 motion-reduce:animate-none" />
          <MapPin
            className="relative h-10 w-10 text-[var(--accent-orange)]"
            strokeWidth={1.5}
          />
        </div>
      </div>

      <div className="absolute inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-sm">
        <MapDirectionCard map={map} />
      </div>
    </div>
  );
}

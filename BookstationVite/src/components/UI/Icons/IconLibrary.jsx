import React from "react";
//this is an icon library all icons must exist here and be imported as components

export const StarIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

export const EyeIcon = (props) => (
  <svg viewBox="0 0 24 24" {...props}>
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const SparklesIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

export const CoinsIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="8" cy="8" r="6" />
    <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
    <path d="M7 6h1v4" />
    <path d="m16.71 13.88.7.71-2.82 2.82" />
  </svg>
);

export const BookOpenIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

export const BookLogo = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

export const SearchButton = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

export const NotifButton = (props) => (
  <svg

    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10.268 21a2 2 0 0 0 3.464 0" />
    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
  </svg>
);

export const ArrowUpIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

export const LockedIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z" />
    </svg>
  );
};

export const UnlockedIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
};

export const WalletIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="25"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-wallet-icon lucide-wallet"
      {...props}
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
};





//---------------------------------------------------------------------------------------

// 1. Action: Sharp angles, aggressive diagonals, dynamic tension
export const ActionGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff416c"/>
        <stop offset="100%" stopColor="#ff4b2b"/>
      </linearGradient>
      <radialGradient id="glow1">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#g1)" />

    <path d="M-200 320L1200 -100" stroke="#fff" strokeWidth="6" opacity="0.15"/>
    <path d="M-100 350L1100 -50" stroke="#fff" strokeWidth="2" opacity="0.25"/>

    <circle cx="700" cy="80" r="180" fill="url(#glow1)" />

    <path d="M0 320L1000 220V320Z" fill="#000" opacity="0.2"/>
  </svg>
);




// 2. Fantasy: Ethereal flowing ribbons, sweeping magical curves, subtle stardust
export const FantasyGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#654ea3"/>
        <stop offset="100%" stopColor="#eaafc8"/>
      </linearGradient>
      <radialGradient id="glow2">
        <stop offset="0%" stopColor="#a18cd1" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#g2)" />

    <path d="M0 240C200 180 400 300 700 200C850 150 950 260 1000 220V320H0Z" fill="#fff" opacity="0.08"/>
    <path d="M0 200C250 260 400 120 700 180C850 220 950 160 1000 150V320H0Z" fill="#fff" opacity="0.05"/>

    <circle cx="300" cy="100" r="150" fill="url(#glow2)" />

    {/* stars */}
    <circle cx="200" cy="80" r="3" fill="#fff" opacity="0.8"/>
    <circle cx="600" cy="60" r="2" fill="#fff" opacity="0.6"/>
    <circle cx="850" cy="120" r="3" fill="#fff" opacity="0.7"/>
  </svg>
);



// 3. Romance: Smooth, enveloping, intertwined silky waves
export const RomanceGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff758c"/>
        <stop offset="100%" stopColor="#ff7eb3"/>
      </linearGradient>
      <radialGradient id="glow3">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.5"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#g3)" />

    <path d="M0 320V200C200 260 400 140 600 180C800 220 900 180 1000 220V320Z" fill="#fff" opacity="0.08"/>
    <path d="M0 320V240C300 200 500 120 700 160C900 200 950 260 1000 260V320Z" fill="#fff" opacity="0.05"/>

    <circle cx="500" cy="120" r="200" fill="url(#glow3)" />
  </svg>
);



// 4. SciFi: Structured grids, data streams, digital horizon
export const ScifiGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="g4" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f2027"/>
        <stop offset="100%" stopColor="#2c5364"/>
      </linearGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#g4)" />

    {/* grid */}
    <g stroke="#00f2fe" opacity="0.15">
      <path d="M0 280H1000"/>
      <path d="M0 250H1000"/>
      <path d="M0 220H1000"/>
    </g>

    {/* perspective lines */}
    <g stroke="#00f2fe" opacity="0.2">
      <path d="M500 320L100 150"/>
      <path d="M500 320L900 150"/>
    </g>

    {/* glow */}
    <circle cx="500" cy="180" r="120" fill="#00f2fe" opacity="0.08"/>
  </svg>
);




// 5. Horror: Erratic, jagged peaks, creeping asymmetric shadows
export const HorrorGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="g5" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f0c29"/>
        <stop offset="100%" stopColor="#302b63"/>
      </linearGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#g5)" />

    <path d="M0 320L100 200L200 260L300 150L400 270L500 120L600 260L700 180L800 280L900 150L1000 240V320Z" fill="#000" opacity="0.4"/>

    {/* red hint */}
    <circle cx="700" cy="100" r="100" fill="#ff0000" opacity="0.1"/>

    {/* glitch */}
    <line x1="200" y1="80" x2="300" y2="80" stroke="#fff" opacity="0.2"/>
  </svg>
);

// 6. Comedy: Bouncy, upbeat, overlapping rhythmic circles and arcs
export const ComedyGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="g6" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f7971e"/>
        <stop offset="100%" stopColor="#ffd200"/>
      </linearGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#g6)" />

    <circle cx="200" cy="300" r="120" fill="#fff" opacity="0.1"/>
    <circle cx="500" cy="320" r="160" fill="#fff" opacity="0.08"/>
    <circle cx="800" cy="280" r="100" fill="#fff" opacity="0.12"/>

    {/* floating accents */}
    <circle cx="300" cy="100" r="10" fill="#fff" opacity="0.6"/>
    <circle cx="700" cy="80" r="15" fill="#fff" opacity="0.5"/>
  </svg>
);

// 7. Mystery: Hypnotic ripples, fog layers, obscured focus
export const MysteryGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="g7" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#232526"/>
        <stop offset="100%" stopColor="#414345"/>
      </linearGradient>
      <radialGradient id="glow7">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.15"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#g7)" />

    {/* fog layers */}
    <path d="M0 320V260C200 240 400 280 600 250C800 220 900 260 1000 240V320Z" fill="#fff" opacity="0.08"/>
    <path d="M0 320V280C300 260 500 300 800 270C900 260 950 280 1000 260V320Z" fill="#fff" opacity="0.12"/>

    {/* subtle focus light */}
    <circle cx="750" cy="150" r="200" fill="url(#glow7)" />
  </svg>
);

export const ThrillerGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="thrillGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#141e30"/>
        <stop offset="100%" stopColor="#243b55"/>
      </linearGradient>

      <radialGradient id="thrillGlow">
        <stop offset="0%" stopColor="#ff4d4d" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#ff0000" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#thrillGrad)" />

    {/* fractured shards */}
    <g fill="#fff" opacity="0.08">
      <polygon points="100,50 300,120 180,200" />
      <polygon points="400,20 600,140 450,220" />
      <polygon points="750,60 950,180 780,240" />
    </g>

    {/* sharp cuts */}
    <path d="M0 200L1000 120" stroke="#fff" strokeWidth="2" opacity="0.2"/>
    <path d="M200 320L800 0" stroke="#fff" strokeWidth="1" opacity="0.15"/>

    {/* danger focal point */}
    <circle cx="700" cy="100" r="120" fill="url(#thrillGlow)" />
  </svg>
);

export const HistoricalGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="histGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#c2b280"/>
        <stop offset="100%" stopColor="#8e793e"/>
      </linearGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#histGrad)" />

    {/* arches */}
    <g fill="#fff" opacity="0.08">
      <path d="M100 320V180A80 80 0 0 1 260 180V320Z"/>
      <path d="M350 320V150A100 100 0 0 1 550 150V320Z"/>
      <path d="M650 320V180A80 80 0 0 1 810 180V320Z"/>
    </g>

    {/* column lines */}
    <g stroke="#fff" opacity="0.1">
      <line x1="180" y1="0" x2="180" y2="320"/>
      <line x1="450" y1="0" x2="450" y2="320"/>
      <line x1="730" y1="0" x2="730" y2="320"/>
    </g>

    {/* worn overlay */}
    <rect width="1000" height="320" fill="#000" opacity="0.1"/>
  </svg>
);

export const ScifiAdvancedGenreBg = (props) => (
  <svg viewBox="0 0 1000 320" preserveAspectRatio="none" {...props}>
    <defs>
      <linearGradient id="sciGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f2027"/>
        <stop offset="100%" stopColor="#203a43"/>
      </linearGradient>

      <radialGradient id="sciGlow">
        <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.4"/>
        <stop offset="100%" stopColor="#00f2fe" stopOpacity="0"/>
      </radialGradient>
    </defs>

    <rect width="1000" height="320" fill="url(#sciGrad)" />

    {/* orbital rings */}
    <g stroke="#00f2fe" fill="none" opacity="0.2">
      <ellipse cx="750" cy="160" rx="200" ry="100"/>
      <ellipse cx="750" cy="160" rx="150" ry="70"/>
      <ellipse cx="750" cy="160" rx="100" ry="40"/>
    </g>

    {/* rotating segments feel */}
    <g stroke="#00f2fe" opacity="0.4">
      <line x1="750" y1="60" x2="750" y2="20"/>
      <line x1="850" y1="160" x2="900" y2="160"/>
      <line x1="750" y1="260" x2="750" y2="300"/>
      <line x1="650" y1="160" x2="600" y2="160"/>
    </g>

    {/* energy core */}
    <circle cx="750" cy="160" r="80" fill="url(#sciGlow)" />

    {/* grid horizon */}
    <g stroke="#00f2fe" opacity="0.1">
      <path d="M0 280H1000"/>
      <path d="M0 250H1000"/>
    </g>
  </svg>
);
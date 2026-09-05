import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public');

// 14 Level SVG definitions matching the cyberpunk neon automotive aesthetic
const svgs = {
  1: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#080c14"/>
    <!-- Subtle background grid -->
    <circle cx="256" cy="256" r="230" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#06b6d4" fill-opacity="0.04"/>
    <!-- Outer Nut Hexagon with Neon Glow -->
    <polygon points="256,70 420,165 420,355 256,450 92,355 92,165" stroke="#06b6d4" stroke-width="14" stroke-linejoin="round" fill="#0f172a"/>
    <polygon points="256,95 395,178 395,342 256,425 117,342 117,178" stroke="#22d3ee" stroke-width="5" stroke-linejoin="round" fill="#0b1120"/>
    <!-- Inner Thread Rings -->
    <circle cx="256" cy="260" r="90" stroke="#67e8f9" stroke-width="10" fill="#030712"/>
    <circle cx="256" cy="260" r="68" stroke="#a5f3fc" stroke-width="6" stroke-dasharray="16 8"/>
    <circle cx="256" cy="260" r="42" fill="#06b6d4" fill-opacity="0.3"/>
    <circle cx="256" cy="260" r="16" fill="#a5f3fc"/>
    <!-- Hexagon Corner Rivets -->
    <circle cx="256" cy="70" r="9" fill="#a5f3fc"/>
    <circle cx="420" cy="165" r="9" fill="#a5f3fc"/>
    <circle cx="420" cy="355" r="9" fill="#a5f3fc"/>
    <circle cx="256" cy="450" r="9" fill="#a5f3fc"/>
    <circle cx="92" cy="355" r="9" fill="#a5f3fc"/>
    <circle cx="92" cy="165" r="9" fill="#a5f3fc"/>
  </svg>`,

  2: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#080c14"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#38bdf8" fill-opacity="0.04"/>
    <!-- Industrial Gear Outer Teeth -->
    <path d="M230,60 L282,60 L292,110 C312,115 332,125 348,140 L393,105 L430,142 L395,187 C410,203 420,223 425,243 L475,253 L475,305 L425,315 C420,335 410,355 395,371 L430,416 L393,453 L348,418 C332,433 312,443 292,448 L282,498 L230,498 L220,448 C200,443 180,433 164,418 L119,453 L82,416 L117,371 C102,355 92,335 87,315 L37,305 L37,253 L87,243 C92,223 102,203 117,187 L82,142 L119,105 L164,140 C180,125 200,115 220,110 Z"
      stroke="#38bdf8" stroke-width="12" stroke-linejoin="round" fill="#0f172a"/>
    <!-- Inner Rim -->
    <circle cx="256" cy="279" r="105" stroke="#7dd3fc" stroke-width="8" fill="#0b1120"/>
    <circle cx="256" cy="279" r="50" stroke="#bae6fd" stroke-width="9" fill="#030712"/>
    <circle cx="256" cy="279" r="22" fill="#38bdf8"/>
    <!-- Satellite lightning cutouts -->
    <circle cx="256" cy="205" r="16" stroke="#38bdf8" stroke-width="5" fill="none"/>
    <circle cx="256" cy="353" r="16" stroke="#38bdf8" stroke-width="5" fill="none"/>
    <circle cx="182" cy="279" r="16" stroke="#38bdf8" stroke-width="5" fill="none"/>
    <circle cx="330" cy="279" r="16" stroke="#38bdf8" stroke-width="5" fill="none"/>
  </svg>`,

  3: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#0c0a06"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#f59e0b" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#f59e0b" fill-opacity="0.04"/>
    <!-- Racing Steering Wheel Rim -->
    <circle cx="256" cy="256" r="185" stroke="#f59e0b" stroke-width="18" fill="#181510"/>
    <circle cx="256" cy="256" r="155" stroke="#fbbf24" stroke-width="6" fill="#0f0c08"/>
    <!-- Three Spoke Assembly -->
    <rect x="95" y="244" width="95" height="24" rx="6" fill="#f59e0b"/>
    <rect x="322" y="244" width="95" height="24" rx="6" fill="#f59e0b"/>
    <rect x="244" y="320" width="24" height="95" rx="6" fill="#f59e0b"/>
    <!-- Lower Spoke Bracing -->
    <path d="M190,268 L220,335 L292,335 L322,268" stroke="#d97706" stroke-width="8" stroke-linejoin="round" fill="none"/>
    <!-- Center Horn Hub with Emblem -->
    <circle cx="256" cy="256" r="62" stroke="#fde68a" stroke-width="10" fill="#1c1917"/>
    <circle cx="256" cy="256" r="30" fill="#f59e0b"/>
    <!-- Top 12 o'clock racing stripe -->
    <rect x="246" y="65" width="20" height="30" rx="3" fill="#ef4444"/>
  </svg>`,

  4: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#040d0a"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#10b981" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#10b981" fill-opacity="0.04"/>
    <!-- Chassis Side Rails -->
    <line x1="150" y1="80" x2="150" y2="432" stroke="#10b981" stroke-width="16" stroke-linecap="round"/>
    <line x1="362" y1="80" x2="362" y2="432" stroke="#10b981" stroke-width="16" stroke-linecap="round"/>
    <!-- Crossmembers -->
    <line x1="120" y1="120" x2="392" y2="120" stroke="#34d399" stroke-width="12" stroke-linecap="round"/>
    <line x1="150" y1="215" x2="362" y2="215" stroke="#6ee7b7" stroke-width="9" stroke-dasharray="18 10"/>
    <line x1="150" y1="297" x2="362" y2="297" stroke="#6ee7b7" stroke-width="9" stroke-dasharray="18 10"/>
    <line x1="120" y1="392" x2="392" y2="392" stroke="#34d399" stroke-width="12" stroke-linecap="round"/>
    <!-- Torsional X-Bracing -->
    <line x1="150" y1="215" x2="362" y2="297" stroke="#059669" stroke-width="8"/>
    <line x1="362" y1="215" x2="150" y2="297" stroke="#059669" stroke-width="8"/>
    <!-- 4 Suspension Control Arms -->
    <rect x="90" y="100" width="40" height="40" rx="10" stroke="#a7f3d0" stroke-width="7" fill="#064e3b"/>
    <rect x="382" y="100" width="40" height="40" rx="10" stroke="#a7f3d0" stroke-width="7" fill="#064e3b"/>
    <rect x="90" y="372" width="40" height="40" rx="10" stroke="#a7f3d0" stroke-width="7" fill="#064e3b"/>
    <rect x="382" y="372" width="40" height="40" rx="10" stroke="#a7f3d0" stroke-width="7" fill="#064e3b"/>
    <!-- Center Transmission Tunnel -->
    <rect x="238" y="140" width="36" height="232" rx="18" stroke="#10b981" stroke-width="5" fill="#022c22"/>
  </svg>`,

  6: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#0d0904"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#f97316" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#f97316" fill-opacity="0.04"/>
    <!-- Automotive Engineering Workshop / Body Shell Framework -->
    <polygon points="256,90 430,195 430,410 82,410 82,195" stroke="#f97316" stroke-width="14" stroke-linejoin="round" fill="#1c130b"/>
    <!-- Roof truss lines -->
    <line x1="256" y1="90" x2="256" y2="410" stroke="#fdba74" stroke-width="7" stroke-dasharray="14 14"/>
    <line x1="82" y1="195" x2="430" y2="195" stroke="#ea580c" stroke-width="9"/>
    <!-- Crossed Precision Wrench Tools -->
    <line x1="160" y1="330" x2="352" y2="220" stroke="#fed7aa" stroke-width="15" stroke-linecap="round"/>
    <line x1="160" y1="220" x2="352" y2="330" stroke="#fed7aa" stroke-width="15" stroke-linecap="round"/>
    <circle cx="150" cy="335" r="25" stroke="#f97316" stroke-width="10" fill="#0f0a05"/>
    <circle cx="362" cy="215" r="25" stroke="#f97316" stroke-width="10" fill="#0f0a05"/>
    <circle cx="150" cy="215" r="25" stroke="#f97316" stroke-width="10" fill="#0f0a05"/>
    <circle cx="362" cy="335" r="25" stroke="#f97316" stroke-width="10" fill="#0f0a05"/>
    <!-- Heavy Duty Foundation Base -->
    <line x1="110" y1="410" x2="402" y2="410" stroke="#ea580c" stroke-width="20" stroke-linecap="round"/>
  </svg>`,

  8: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#120404"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#ef4444" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#ef4444" fill-opacity="0.04"/>
    <!-- V8 Engine Block in Red Glow -->
    <path d="M256,399 L133,225 L194,153 L256,246 L317,153 L379,225 Z" stroke="#ef4444" stroke-width="14" stroke-linejoin="round" fill="#1f0a0a"/>
    <!-- Left 4 Cylinders -->
    <circle cx="164" cy="205" r="17" stroke="#fca5a5" stroke-width="9" fill="#0d0404"/>
    <circle cx="194" cy="251" r="17" stroke="#fca5a5" stroke-width="9" fill="#0d0404"/>
    <circle cx="225" cy="297" r="17" stroke="#fca5a5" stroke-width="9" fill="#0d0404"/>
    <circle cx="256" cy="343" r="17" stroke="#fca5a5" stroke-width="9" fill="#0d0404"/>
    <!-- Right 4 Cylinders -->
    <circle cx="348" cy="205" r="17" stroke="#fca5a5" stroke-width="9" fill="#0d0404"/>
    <circle cx="317" cy="251" r="17" stroke="#fca5a5" stroke-width="9" fill="#0d0404"/>
    <circle cx="287" cy="297" r="17" stroke="#fca5a5" stroke-width="9" fill="#0d0404"/>
    <!-- High-Flow Blower / Intake Manifold -->
    <rect x="215" y="102" width="82" height="52" rx="14" stroke="#f87171" stroke-width="10" fill="#360f0f"/>
    <line x1="256" y1="82" x2="256" y2="102" stroke="#fca5a5" stroke-width="10" stroke-linecap="round"/>
    <!-- Crankshaft Harmonic Damper -->
    <circle cx="256" cy="399" r="30" stroke="#ef4444" stroke-width="12" fill="#0d0404"/>
    <circle cx="256" cy="399" r="12" fill="#fca5a5"/>
  </svg>`,

  10: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#0b0614"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#c084fc" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#c084fc" fill-opacity="0.04"/>
    <!-- Aerodynamic Carbon Fiber Wing / Spoiler -->
    <path d="M72,164 C143,133 369,133 440,164 L450,205 C369,174 143,174 62,205 Z" stroke="#c084fc" stroke-width="14" stroke-linejoin="round" fill="#1d112b"/>
    <!-- Dual Vortex Endplates -->
    <path d="M51,123 L82,246 L51,256 Z" stroke="#e9d5ff" stroke-width="9" stroke-linejoin="round" fill="#3b0764"/>
    <path d="M461,123 L430,246 L461,256 Z" stroke="#e9d5ff" stroke-width="9" stroke-linejoin="round" fill="#3b0764"/>
    <!-- Swan Neck Pylon Mounts -->
    <path d="M194,184 L184,338 L215,338 L225,184" stroke="#a855f7" stroke-width="9" fill="#140822"/>
    <path d="M318,184 L328,338 L297,338 L287,184" stroke="#a855f7" stroke-width="9" fill="#140822"/>
    <!-- Trunk Base Mounting Bar -->
    <line x1="154" y1="338" x2="358" y2="338" stroke="#c084fc" stroke-width="12" stroke-linecap="round"/>
  </svg>`,

  12: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#070714"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#818cf8" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#818cf8" fill-opacity="0.04"/>
    <!-- Competition Racing Slick Tire -->
    <circle cx="256" cy="256" r="190" stroke="#818cf8" stroke-width="16" fill="#13132b"/>
    <circle cx="256" cy="256" r="144" stroke="#a5b4fc" stroke-width="10" fill="#0a0a1a"/>
    <circle cx="256" cy="256" r="92" stroke="#c7d2fe" stroke-width="12" fill="#1e1b4b"/>
    <circle cx="256" cy="256" r="41" fill="#818cf8"/>
    <!-- Grip Grooves & Tread Marks -->
    <line x1="256" y1="66" x2="256" y2="112" stroke="#818cf8" stroke-width="10" stroke-linecap="round"/>
    <line x1="256" y1="400" x2="256" y2="446" stroke="#818cf8" stroke-width="10" stroke-linecap="round"/>
    <line x1="66" y1="256" x2="112" y2="256" stroke="#818cf8" stroke-width="10" stroke-linecap="round"/>
    <line x1="400" y1="256" x2="446" y2="256" stroke="#818cf8" stroke-width="10" stroke-linecap="round"/>
    <line x1="122" y1="122" x2="154" y2="154" stroke="#818cf8" stroke-width="10" stroke-linecap="round"/>
    <line x1="390" y1="390" x2="358" y2="358" stroke="#818cf8" stroke-width="10" stroke-linecap="round"/>
    <line x1="390" y1="122" x2="358" y2="154" stroke="#818cf8" stroke-width="10" stroke-linecap="round"/>
    <line x1="122" y1="390" x2="154" y2="358" stroke="#818cf8" stroke-width="10" stroke-linecap="round"/>
  </svg>`,

  13: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#130414"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#e879f9" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#e879f9" fill-opacity="0.04"/>
    <!-- Conceptual Alien Hypercar in Neon Fuchsia -->
    <path d="M41,332 Q123,317 174,246 Q235,164 327,164 Q399,164 450,246 L481,317 Q256,338 41,332 Z"
      stroke="#e879f9" stroke-width="14" stroke-linejoin="round" fill="#2d0a2e"/>
    <!-- Cockpit Canopy -->
    <circle cx="256" cy="246" r="82" stroke="#f5d0fe" stroke-width="8" stroke-dasharray="20 10" fill="#1a041c"/>
    <line x1="61" y1="332" x2="461" y2="332" stroke="#e879f9" stroke-width="10"/>
    <!-- Twin Plasma Thrusters -->
    <ellipse cx="140" cy="350" rx="35" ry="15" fill="#f43f5e"/>
    <ellipse cx="372" cy="350" rx="35" ry="15" fill="#f43f5e"/>
  </svg>`,

  14: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#0d0a02"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#fde047" stroke-width="1.5" stroke-opacity="0.2"/>
    <circle cx="256" cy="256" r="210" fill="#fde047" fill-opacity="0.04"/>
    <!-- Interdimensional Hypership / Ultimate Cosmic Craft -->
    <polygon points="256,61 450,348 338,317 256,440 174,317 61,348"
      stroke="#fde047" stroke-width="14" stroke-linejoin="round" fill="#2a2305"/>
    <circle cx="256" cy="256" r="72" stroke="#fef08a" stroke-width="10" stroke-dasharray="16 10" fill="#171302"/>
    <circle cx="256" cy="256" r="25" fill="#fde047"/>
    <!-- Singularity Propulsion Beams -->
    <line x1="174" y1="317" x2="120" y2="440" stroke="#fde047" stroke-width="8" stroke-dasharray="10 6"/>
    <line x1="338" y1="317" x2="392" y2="440" stroke="#fde047" stroke-width="8" stroke-dasharray="10 6"/>
  </svg>`,

  15: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#060814"/>
    <!-- Ambient Studio Stage Lighting -->
    <circle cx="256" cy="256" r="230" fill="none" stroke="#06b6d4" stroke-width="1.5" stroke-opacity="0.2"/>
    <ellipse cx="256" cy="400" rx="210" ry="45" fill="#06b6d4" fill-opacity="0.08"/>
    <!-- Exotic Hypercar Aerodynamic Body (3D Conceptual Render) -->
    <path d="M40,345 C70,345 110,335 140,295 C170,255 210,215 280,215 C350,215 390,255 420,295 C440,325 460,345 480,345 L470,375 C430,385 390,385 340,385 L160,385 C110,385 70,385 30,375 Z"
      stroke="#06b6d4" stroke-width="14" stroke-linejoin="round" fill="#0d1527"/>
    <!-- Aerodynamic Glass Cockpit Canopy with Magenta Edge Reflection -->
    <path d="M150,285 C190,225 230,185 280,185 C330,185 360,225 380,285 Z"
      stroke="#ec4899" stroke-width="10" fill="#09223b"/>
    <!-- Rear GT Spoiler with Endplates -->
    <path d="M60,275 L110,275 L100,315 L50,315 Z" stroke="#ec4899" stroke-width="8" fill="#4a0429"/>
    <line x1="30" y1="265" x2="130" y2="265" stroke="#f43f5e" stroke-width="12" stroke-linecap="round"/>
    <!-- Front Carbon Splitter and Air Intake -->
    <path d="M360,315 L440,325 L430,355 L350,345 Z" stroke="#06b6d4" stroke-width="8" fill="#064e3b"/>
    <line x1="430" y1="315" x2="480" y2="335" stroke="#67e8f9" stroke-width="8" stroke-linecap="round"/>
    <!-- High Performance Wheels with Dual Neon Rings -->
    <circle cx="130,365" r="50" stroke="#06b6d4" stroke-width="12" fill="#030712"/>
    <circle cx="130,365" r="25" stroke="#67e8f9" stroke-width="8" fill="#082f49"/>
    <circle cx="380,365" r="50" stroke="#ec4899" stroke-width="12" fill="#030712"/>
    <circle cx="380,365" r="25" stroke="#f472b6" stroke-width="8" fill="#500724"/>
    <!-- Neon Accent Side Stripe -->
    <line x1="180,295" x2="340,295" stroke="#f0abfc" stroke-width="7" stroke-dasharray="14 8"/>
  </svg>`,

  16: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#090514"/>
    <!-- Cyberpunk Gotham Atmosphere Grid -->
    <circle cx="256" cy="256" r="230" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-opacity="0.2"/>
    <ellipse cx="256" cy="410" rx="220" ry="40" fill="#a855f7" fill-opacity="0.06"/>
    <!-- Rear Violet Jet Rocket Turbine Afterburner Flame -->
    <polygon points="20,310 95,280 95,340" fill="#a855f7"/>
    <polygon points="10,310 70,290 70,330" fill="#e879f9"/>
    <line x1="5" y1="310" x2="80" y2="310" stroke="#ffffff" stroke-width="10" stroke-linecap="round"/>
    <!-- Turbine Exhaust Nozzle Ring -->
    <rect x="90" y="275" width="35" height="70" rx="10" fill="#3b0764" stroke="#c084fc" stroke-width="8"/>
    <!-- Heavy Stealth Batmobile Chassis with Angled Armor Plates -->
    <polygon points="120,280 190,200 320,200 410,270 470,310 440,360 320,370 220,370 120,350"
      stroke="#c084fc" stroke-width="14" stroke-linejoin="round" fill="#170d2b"/>
    <!-- Stealth Facets and Armor Seams -->
    <line x1="190" y1="200" x2="260" y2="290" stroke="#a855f7" stroke-width="8"/>
    <line x1="320" y1="200" x2="260" y2="290" stroke="#a855f7" stroke-width="8"/>
    <line x1="260" y1="290" x2="260" y2="370" stroke="#a855f7" stroke-width="8"/>
    <!-- Reinforced Stealth Cockpit Canopy -->
    <polygon points="220,210 300,210 330,250 200,250" stroke="#e9d5ff" stroke-width="7" fill="#3b0764"/>
    <!-- Bat-Wing Dorsal Rear Aero Fins -->
    <polygon points="130,270 160,160 200,200" stroke="#d8b4fe" stroke-width="10" fill="#2e1065"/>
    <polygon points="100,290 120,220 150,260" stroke="#a855f7" stroke-width="8" fill="#1e1b4b"/>
    <!-- Armored Dual Combat Wheels -->
    <rect x="160" y="330" width="80" height="60" rx="20" stroke="#c084fc" stroke-width="10" fill="#030712"/>
    <circle cx="200" cy="360" r="16" fill="#a855f7"/>
    <rect x="350" y="330" width="80" height="60" rx="20" stroke="#c084fc" stroke-width="10" fill="#030712"/>
    <circle cx="390" cy="360" r="16" fill="#a855f7"/>
    <!-- Cybernetic Sensor Nodes -->
    <circle cx="455" cy="310" r="12" fill="#f0abfc"/>
  </svg>`,

  17: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#05101a"/>
    <circle cx="256" cy="256" r="230" fill="none" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.2"/>
    <!-- Levitating Antimatter Ion Trails -->
    <line x1="20" y1="230" x2="140" y2="230" stroke="#38bdf8" stroke-width="10" stroke-dasharray="25 15" stroke-linecap="round"/>
    <line x1="40" y1="270" x2="110" y2="270" stroke="#7dd3fc" stroke-width="8" stroke-dasharray="20 10" stroke-linecap="round"/>
    <!-- Aerodynamic Floating Supercar Fuselage -->
    <path d="M100,270 C130,260 180,190 260,190 C340,190 390,240 430,260 L470,280 C450,310 410,320 370,320 L160,320 C120,320 90,300 80,280 Z"
      stroke="#38bdf8" stroke-width="14" stroke-linejoin="round" fill="#0c2d48"/>
    <!-- Sky Canopy with Neon Blue Reflections -->
    <path d="M170,240 C210,200 250,170 300,170 C340,170 370,200 390,240 Z"
      stroke="#bae6fd" stroke-width="9" fill="#0369a1"/>
    <!-- Winglet Stabilizers -->
    <polygon points="90,260 140,200 160,240" stroke="#7dd3fc" stroke-width="8" fill="#075985"/>
    <line x1="360" y1="260" x2="440" y2="260" stroke="#e0f2fe" stroke-width="10" stroke-linecap="round"/>
    <!-- 4 Neon Cyan Antigravity Ring Thrusters with Downward Plasma Columns -->
    <!-- Front Left/Right Pair -->
    <ellipse cx="160,340" rx="45" ry="20" stroke="#38bdf8" stroke-width="12" fill="#082f49"/>
    <ellipse cx="160,340" rx="25" ry="10" stroke="#e0f2fe" stroke-width="7" fill="#0369a1"/>
    <line x1="160" y1="360" x2="160" y2="440" stroke="#38bdf8" stroke-width="14" stroke-linecap="round"/>
    <line x1="140" y1="360" x2="130" y2="420" stroke="#7dd3fc" stroke-width="8" stroke-linecap="round"/>
    <line x1="180" y1="360" x2="190" y2="420" stroke="#7dd3fc" stroke-width="8" stroke-linecap="round"/>
    <!-- Rear Left/Right Pair -->
    <ellipse cx="370,340" rx="45" ry="20" stroke="#38bdf8" stroke-width="12" fill="#082f49"/>
    <ellipse cx="370,340" rx="25" ry="10" stroke="#e0f2fe" stroke-width="7" fill="#0369a1"/>
    <line x1="370" y1="360" x2="370" y2="440" stroke="#38bdf8" stroke-width="14" stroke-linecap="round"/>
    <line x1="350" y1="360" x2="340" y2="420" stroke="#7dd3fc" stroke-width="8" stroke-linecap="round"/>
    <line x1="390" y1="360" x2="400" y2="420" stroke="#7dd3fc" stroke-width="8" stroke-linecap="round"/>
  </svg>`,

  18: `<svg viewBox="0 0 512 512" width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" fill="#0c0a02"/>
    <!-- Massive Cybernetic Garage Gantry -->
    <polygon points="60,90 256,40 452,90 472,430 40,430" stroke="#fbbf24" stroke-width="12" stroke-linejoin="round" fill="#1c1605"/>
    <line x1="60" y1="90" x2="130" y2="430" stroke="#fde047" stroke-width="7" stroke-opacity="0.6"/>
    <line x1="452" y1="90" x2="382" y2="430" stroke="#fde047" stroke-width="7" stroke-opacity="0.6"/>
    <!-- Concentric Cosmic Stargate Acceleration Rings -->
    <circle cx="256" cy="240" r="180" stroke="#fde047" stroke-width="14" stroke-dasharray="35 15"/>
    <circle cx="256" cy="240" r="140" stroke="#38bdf8" stroke-width="12" stroke-dasharray="25 12"/>
    <circle cx="256" cy="240" r="100" stroke="#c084fc" stroke-width="10" stroke-dasharray="18 8"/>
    <!-- Singularity Event Horizon Core -->
    <circle cx="256" cy="240" r="70" fill="#fef08a"/>
    <circle cx="256" cy="240" r="35" fill="#ffffff"/>
    <!-- Garage Launch Stage Platform for Exotic Hypercar -->
    <polygon points="130,430 180,340 332,340 382,430" stroke="#38bdf8" stroke-width="10" fill="#0369a1"/>
    <line x1="180" y1="340" x2="332" y2="340" stroke="#fde047" stroke-width="12"/>
    <!-- Hyperdrive Tachyon Vectors -->
    <line x1="256" y1="50" x2="256" y2="170" stroke="#fef08a" stroke-width="10" stroke-dasharray="14 14"/>
    <line x1="100" y1="240" x2="180" y2="240" stroke="#38bdf8" stroke-width="9"/>
    <line x1="332" y1="240" x2="412" y2="240" stroke="#38bdf8" stroke-width="9"/>
  </svg>`,
};

async function run() {
  for (const [level, svgString] of Object.entries(svgs)) {
    const targetFile = path.join(outDir, `${level}.png`);
    // If it's 5, 7, 9, 11, 14 and file already exists, don't overwrite if existing file is bigger than 5KB
    if (Number(level) <= 14 && fs.existsSync(targetFile) && fs.statSync(targetFile).size > 5000) {
      console.log(`Keeping existing car image for level ${level}: ${targetFile}`);
      continue;
    }
    const buffer = Buffer.from(svgString);
    await sharp(buffer)
      .resize(512, 512)
      .png({ quality: 100 })
      .toFile(targetFile);
    console.log(`Generated ${targetFile}`);
  }
  console.log('All 18 levels generated successfully!');
}

run();

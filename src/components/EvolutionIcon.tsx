import React from 'react';

interface EvolutionIconProps {
  level: number;
  className?: string;
}

export const EvolutionIcon: React.FC<EvolutionIconProps> = ({ level, className = 'w-full h-full' }) => {
  switch (level) {
    case 1:
      // Nivel 1: Tuerca (Diseño Neón Cian Minimalista Abstracto)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.8" />
            </filter>
            <linearGradient id="tuercaNeonGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
              <stop stopColor="#67e8f9" />
              <stop offset="0.5" stopColor="#06b6d4" />
              <stop offset="1" stopColor="#0e7490" />
            </linearGradient>
          </defs>
          {/* Hexágono exterior de neón */}
          <polygon
            points="50,14 84,33 84,71 50,90 16,71 16,33"
            stroke="url(#tuercaNeonGrad)"
            strokeWidth="3.5"
            strokeLinejoin="round"
            filter="url(#neonGlowCyan)"
          />
          {/* Borde biselado interior */}
          <polygon
            points="50,22 76,37 76,67 50,82 24,67 24,37"
            stroke="#22d3ee"
            strokeWidth="1.5"
            strokeOpacity="0.6"
          />
          {/* Orificio circular de rosca métrica */}
          <circle cx="50" cy="52" r="18" stroke="#67e8f9" strokeWidth="2.5" filter="url(#neonGlowCyan)" />
          <circle cx="50" cy="52" r="13" stroke="#a5f3fc" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="50" cy="52" r="7" fill="#06b6d4" fillOpacity="0.25" />
          {/* Puntos de fijación en vértices */}
          <circle cx="50" cy="14" r="2" fill="#a5f3fc" />
          <circle cx="84" cy="33" r="2" fill="#a5f3fc" />
          <circle cx="84" cy="71" r="2" fill="#a5f3fc" />
          <circle cx="50" cy="90" r="2" fill="#a5f3fc" />
          <circle cx="16" cy="71" r="2" fill="#a5f3fc" />
          <circle cx="16" cy="33" r="2" fill="#a5f3fc" />
        </svg>
      );

    case 2:
      // Nivel 2: Engranaje (Diseño Neón Celeste/Turquesa Abstracto)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowSky" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38bdf8" floodOpacity="0.85" />
            </filter>
          </defs>
          {/* Corona dentada geométrica precisa */}
          <path
            d="M45,12 L55,12 L57,22 C61,23 65,25 68,28 L77,21 L84,28 L77,37 C80,40 82,44 83,48 L93,50 L93,60 L83,62 C82,66 80,70 77,73 L84,82 L77,89 L68,82 C65,85 61,87 57,88 L55,98 L45,98 L43,88 C39,87 35,85 32,82 L23,89 L16,82 L23,73 C20,70 18,66 17,62 L7,60 L7,50 L17,48 C18,44 20,40 23,37 L16,28 L23,21 L32,28 C35,25 39,23 43,22 Z"
            stroke="#38bdf8"
            strokeWidth="2.5"
            strokeLinejoin="round"
            filter="url(#neonGlowSky)"
          />
          {/* Aro central y orificios de aligeramiento */}
          <circle cx="50" cy="55" r="21" stroke="#7dd3fc" strokeWidth="2" />
          <circle cx="50" cy="55" r="10" stroke="#bae6fd" strokeWidth="2.5" filter="url(#neonGlowSky)" />
          <circle cx="50" cy="55" r="4" fill="#38bdf8" />
          {/* Orificios circulares satélite */}
          <circle cx="50" cy="40" r="3" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="50" cy="70" r="3" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="35" cy="55" r="3" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="65" cy="55" r="3" stroke="#38bdf8" strokeWidth="1.5" />
        </svg>
      );

    case 3:
      // Nivel 3: Volante (Diseño Neón Ámbar Minimalista Abstracto)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowAmber" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Aro exterior de control */}
          <circle cx="50" cy="50" r="36" stroke="#f59e0b" strokeWidth="3.5" filter="url(#neonGlowAmber)" />
          <circle cx="50" cy="50" r="30" stroke="#fbbf24" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Núcleo central del volante */}
          <circle cx="50" cy="50" r="12" stroke="#fde68a" strokeWidth="2.5" filter="url(#neonGlowAmber)" />
          <circle cx="50" cy="50" r="6" fill="#f59e0b" />
          {/* Tres radios simétricos */}
          <line x1="20" y1="50" x2="38" y2="50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="62" y1="50" x2="80" y2="50" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <line x1="50" y1="62" x2="50" y2="80" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          {/* Acentos angulares */}
          <path d="M38,50 L42,60 L50,62 L58,60 L62,50" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );

    case 4:
      // Nivel 4: Chasis (Diseño Neón Esmeralda Abstracto)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowEmerald" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#10b981" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Largueros longitudinales */}
          <line x1="30" y1="16" x2="30" y2="84" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" filter="url(#neonGlowEmerald)" />
          <line x1="70" y1="16" x2="70" y2="84" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" filter="url(#neonGlowEmerald)" />
          {/* Travesaños de rigidez */}
          <line x1="24" y1="24" x2="76" y2="24" stroke="#34d399" strokeWidth="2.5" />
          <line x1="30" y1="42" x2="70" y2="42" stroke="#6ee7b7" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="30" y1="58" x2="70" y2="58" stroke="#6ee7b7" strokeWidth="2" strokeDasharray="4 2" />
          <line x1="24" y1="76" x2="76" y2="76" stroke="#34d399" strokeWidth="2.5" />
          {/* Tirantes en X de refuerzo torsional */}
          <line x1="30" y1="42" x2="70" y2="58" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.7" />
          <line x1="70" y1="42" x2="30" y2="58" stroke="#059669" strokeWidth="1.5" strokeOpacity="0.7" />
          {/* Ejes y anclajes de suspensión */}
          <rect x="18" y="20" width="8" height="8" rx="2" stroke="#a7f3d0" strokeWidth="1.5" />
          <rect x="74" y="20" width="8" height="8" rx="2" stroke="#a7f3d0" strokeWidth="1.5" />
          <rect x="18" y="72" width="8" height="8" rx="2" stroke="#a7f3d0" strokeWidth="1.5" />
          <rect x="74" y="72" width="8" height="8" rx="2" stroke="#a7f3d0" strokeWidth="1.5" />
        </svg>
      );

    case 5:
      // Nivel 5: Auto Clásico 20s (Auto vintage isométrico con contornos neón dorados sobre fondo oscuro)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowGoldCar" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#fbbf24" floodOpacity="0.85" />
            </filter>
          </defs>
          {/* Sombra y resplandor inferior */}
          <ellipse cx="50" cy="74" rx="34" ry="12" fill="#fbbf24" fillOpacity="0.12" />
          
          {/* Paneles de carrocería en gris grafito oscuro */}
          <path d="M44,22 L72,25 L75,38 L54,36 Z" fill="#1e2430" />
          <path d="M44,22 L54,36 L52,48 L35,46 L36,34 Z" fill="#181e28" />
          <path d="M54,36 L75,38 L72,55 L42,52 L35,46 Z" fill="#202735" />
          <path d="M35,46 L52,48 L46,65 L22,60 Z" fill="#151b24" />

          {/* Silueta y contornos dorados de neón del Auto 20s */}
          {/* Techo y cabina clásica */}
          <path d="M44,22 L72,25 L74,38 L36,34 Z" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" filter="url(#neonGlowGoldCar)" />
          {/* Ventanas laterales y parabrisas */}
          <path d="M45,24 L56,25 L54,34 L44,33 Z" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.8" />
          <path d="M58,25 L70,26 L68,36 L56,35 Z" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.8" />
          {/* Capó largo y parrilla frontal */}
          <path d="M36,34 L52,36 L46,55 L24,51 Z" stroke="#fbbf24" strokeWidth="2.2" strokeLinejoin="round" filter="url(#neonGlowGoldCar)" />
          {/* Radiador frontal clásico vertical */}
          <rect x="28" y="44" width="8" height="15" rx="2" stroke="#fef08a" strokeWidth="2" fill="#0f172a" filter="url(#neonGlowGoldCar)" />
          <line x1="30" y1="46" x2="34" y2="46" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="30" y1="49" x2="34" y2="49" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="30" y1="52" x2="34" y2="52" stroke="#fbbf24" strokeWidth="1.5" />
          <line x1="30" y1="55" x2="34" y2="55" stroke="#fbbf24" strokeWidth="1.5" />
          {/* Mascota / ornamento del radiador */}
          <circle cx="32" cy="42" r="2" fill="#fef08a" />
          {/* Guardabarros curvados vintage */}
          <path d="M20,54 C20,48 26,45 36,49 L42,62" stroke="#f59e0b" strokeWidth="2" />
          <path d="M60,46 C60,40 68,38 78,44 L80,56" stroke="#f59e0b" strokeWidth="2" />
          {/* Faros delanteros redondos de neón */}
          <circle cx="25" cy="51" r="3.5" stroke="#fef08a" strokeWidth="2" fill="#fef08a" fillOpacity="0.6" filter="url(#neonGlowGoldCar)" />
          {/* Estribo lateral */}
          <line x1="42" y1="62" x2="64" y2="60" stroke="#fbbf24" strokeWidth="2.5" />
          {/* Rueda delantera con radios de alambre dorados */}
          <ellipse cx="38" cy="67" rx="9" ry="11" stroke="#fbbf24" strokeWidth="2.5" filter="url(#neonGlowGoldCar)" />
          <ellipse cx="38" cy="67" rx="4" ry="5" stroke="#fef08a" strokeWidth="1.5" />
          <line x1="38" y1="58" x2="38" y2="76" stroke="#fef08a" strokeWidth="1" />
          <line x1="31" y1="67" x2="45" y2="67" stroke="#fef08a" strokeWidth="1" />
          {/* Rueda trasera con radios dorados */}
          <ellipse cx="72" cy="55" rx="8" ry="10" stroke="#fbbf24" strokeWidth="2.5" filter="url(#neonGlowGoldCar)" />
          <ellipse cx="72" cy="55" rx="3.5" ry="4.5" stroke="#fef08a" strokeWidth="1.5" />
          {/* Rueda de repuesto trasera montada */}
          <ellipse cx="78" cy="40" rx="4" ry="7" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
        </svg>
      );

    case 6:
      // Nivel 6: Taller (Diseño Neón Naranja/Dorado Abstracto)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowOrange" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f97316" floodOpacity="0.8" />
            </filter>
          </defs>
          {/* Silueta de Hangar de Ingeniería */}
          <polygon points="50,18 84,38 84,80 16,80 16,38" stroke="#f97316" strokeWidth="3" strokeLinejoin="round" filter="url(#neonGlowOrange)" />
          {/* Línea de cumbrera y estructura interior */}
          <line x1="50" y1="18" x2="50" y2="80" stroke="#fdba74" strokeWidth="1.5" strokeDasharray="3 3" />
          {/* Llave de tuercas cruzada minimalista */}
          <line x1="32" y1="64" x2="68" y2="42" stroke="#fed7aa" strokeWidth="3" strokeLinecap="round" />
          <circle cx="30" cy="65" r="5" stroke="#f97316" strokeWidth="2" />
          <circle cx="70" cy="41" r="5" stroke="#f97316" strokeWidth="2" />
          {/* Banco de trabajo base */}
          <line x1="22" y1="80" x2="78" y2="80" stroke="#fb923c" strokeWidth="4" />
        </svg>
      );

    case 7:
      // Nivel 7: Sedán 50s / Deportivo Neón Cian (Superdeportivo isométrico con contornos neón cian/celeste eléctrico)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowCyanCar" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#38bdf8" floodOpacity="0.9" />
            </filter>
          </defs>
          {/* Reflejo y resplandor inferior cian sobre asfalto negro */}
          <ellipse cx="52" cy="74" rx="36" ry="12" fill="#38bdf8" fillOpacity="0.14" />

          {/* Paneles de carrocería en grafito ultra oscuro facetado */}
          <path d="M48,24 L72,32 L64,44 L32,38 Z" fill="#141c2b" />
          <path d="M32,38 L64,44 L60,56 L20,48 Z" fill="#0f1622" />
          <path d="M20,48 L60,56 L54,68 L14,58 Z" fill="#182234" />
          <path d="M14,58 L54,68 L48,74 L12,62 Z" fill="#0a0f18" />

          {/* Contornos facetados de neón cian (Huracan style) */}
          {/* Morro bajo en cuña afilada */}
          <path d="M12,60 L24,66 L46,72 L54,68 L42,54 L20,50 Z" stroke="#38bdf8" strokeWidth="2.2" strokeLinejoin="round" filter="url(#neonGlowCyanCar)" />
          {/* Faros angulares Y-LED en cian brillante */}
          <path d="M16,59 L22,62 L20,58" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" filter="url(#neonGlowCyanCar)" />
          <path d="M32,67 L38,66 L34,63" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" filter="url(#neonGlowCyanCar)" />
          {/* Parabrisas facetado y techo aerodinámico bajo */}
          <path d="M24,46 L48,24 L68,30 L52,44 Z" stroke="#38bdf8" strokeWidth="2" strokeLinejoin="round" filter="url(#neonGlowCyanCar)" />
          <line x1="48" y1="24" x2="36" y2="44" stroke="#7dd3fc" strokeWidth="1.2" strokeOpacity="0.7" />
          {/* Ventanilla lateral en cuña */}
          <path d="M52,44 L68,30 L74,38 L58,48 Z" stroke="#bae6fd" strokeWidth="1.2" strokeOpacity="0.8" />
          {/* Entrada de aire lateral prominente */}
          <path d="M58,48 L76,40 L84,46 L68,56 Z" stroke="#38bdf8" strokeWidth="1.8" />
          {/* Línea de cintura y carrocería inferior */}
          <line x1="20" y1="62" x2="44" y2="69" stroke="#0ea5e9" strokeWidth="2.5" />
          {/* Rueda delantera con rin de aleación cian de 10 brazos */}
          <ellipse cx="48" cy="69" rx="10" ry="12" stroke="#38bdf8" strokeWidth="2.5" filter="url(#neonGlowCyanCar)" />
          <ellipse cx="48" cy="69" rx="4.5" ry="5.5" stroke="#bae6fd" strokeWidth="1.8" />
          {/* Rueda trasera cian */}
          <ellipse cx="80" cy="50" rx="9" ry="11" stroke="#38bdf8" strokeWidth="2.5" filter="url(#neonGlowCyanCar)" />
          <ellipse cx="80" cy="50" rx="4" ry="5" stroke="#bae6fd" strokeWidth="1.8" />
          {/* Espejo retrovisor aerodinámico */}
          <path d="M32,41 L28,40 L30,44 Z" stroke="#7dd3fc" strokeWidth="1.5" />
        </svg>
      );

    case 8:
      // Nivel 8: Motor V8 (Diseño Neón Carmesí Abstracto)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#ef4444" floodOpacity="0.85" />
            </filter>
          </defs>
          {/* Bloque motor en V simétrico */}
          <path d="M50,78 L26,44 L38,30 L50,48 L62,30 L74,44 Z" stroke="#ef4444" strokeWidth="3" strokeLinejoin="round" filter="url(#neonGlowRed)" />
          {/* Bancada izquierda (4 cilindros) */}
          <circle cx="32" cy="40" r="3.5" stroke="#fca5a5" strokeWidth="2" />
          <circle cx="38" cy="49" r="3.5" stroke="#fca5a5" strokeWidth="2" />
          <circle cx="44" cy="58" r="3.5" stroke="#fca5a5" strokeWidth="2" />
          {/* Bancada derecha (4 cilindros) */}
          <circle cx="68" cy="40" r="3.5" stroke="#fca5a5" strokeWidth="2" />
          <circle cx="62" cy="49" r="3.5" stroke="#fca5a5" strokeWidth="2" />
          <circle cx="56" cy="58" r="3.5" stroke="#fca5a5" strokeWidth="2" />
          {/* Colector de admisión superior */}
          <rect x="42" y="20" width="16" height="10" rx="3" stroke="#f87171" strokeWidth="2" />
          <line x1="50" y1="16" x2="50" y2="20" stroke="#fca5a5" strokeWidth="2" />
          {/* Polea del cigüeñal inferior */}
          <circle cx="50" cy="78" r="6" stroke="#ef4444" strokeWidth="2.5" />
        </svg>
      );

    case 9:
      // Nivel 9: Muscle Car 70s (Dodge Challenger isométrico con contornos neón naranja vibrante y toma de aire)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowOrangeCar" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f97316" floodOpacity="0.88" />
            </filter>
          </defs>
          {/* Reflejo y resplandor inferior naranja / amber underglow */}
          <ellipse cx="50" cy="74" rx="36" ry="12" fill="#f97316" fillOpacity="0.18" />

          {/* Paneles de carrocería en grafito mate oscuro */}
          <path d="M42,26 L76,34 L68,46 L32,38 Z" fill="#202228" />
          <path d="M32,38 L68,46 L60,60 L18,50 Z" fill="#181a20" />
          <path d="M18,50 L60,60 L52,72 L12,62 Z" fill="#111317" />

          {/* Contornos naranja de neón del Muscle Car */}
          {/* Techo y montante trasero fastback */}
          <path d="M38,26 L74,32 L68,44 L28,38 Z" stroke="#f97316" strokeWidth="2.2" strokeLinejoin="round" filter="url(#neonGlowOrangeCar)" />
          {/* Parabrisas y ventanilla lateral */}
          <path d="M28,38 L38,26 L56,30 L46,42 Z" stroke="#fdba74" strokeWidth="1.2" strokeOpacity="0.8" />
          <path d="M48,42 L56,30 L72,34 L64,44 Z" stroke="#fdba74" strokeWidth="1.2" strokeOpacity="0.8" />
          {/* Capó largo con relieve */}
          <path d="M18,50 L46,42 L60,58 L24,66 Z" stroke="#f97316" strokeWidth="2" filter="url(#neonGlowOrangeCar)" />
          {/* Shaker hood scoop (Toma de aire elevada en el capó) */}
          <polygon points="32,48 44,46 42,52 30,54" stroke="#fb923c" strokeWidth="2" fill="#0c0d10" filter="url(#neonGlowOrangeCar)" />
          {/* Parrilla frontal rectangular horizontal */}
          <polygon points="14,58 24,66 22,70 12,62" stroke="#ea580c" strokeWidth="2" fill="#050608" />
          {/* Cuatro faros redondos cuádruples característicos iluminados */}
          <circle cx="16" cy="62" r="2.2" stroke="#fed7aa" strokeWidth="1.5" fill="#f97316" filter="url(#neonGlowOrangeCar)" />
          <circle cx="19" cy="64" r="2.2" stroke="#fed7aa" strokeWidth="1.5" fill="#f97316" filter="url(#neonGlowOrangeCar)" />
          {/* Alerón trasero Ducktail / spoiler */}
          <line x1="72" y1="32" x2="80" y2="34" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round" filter="url(#neonGlowOrangeCar)" />
          {/* Línea lateral de hombro y escape */}
          <line x1="22" y1="68" x2="44" y2="73" stroke="#f97316" strokeWidth="2.5" />
          {/* Rueda delantera ancha con rin de 5 radios dobles naranja */}
          <ellipse cx="48" cy="70" rx="10" ry="12" stroke="#f97316" strokeWidth="2.5" filter="url(#neonGlowOrangeCar)" />
          <ellipse cx="48" cy="70" rx="4.5" ry="5.5" stroke="#fed7aa" strokeWidth="1.8" />
          {/* Rueda trasera ancha */}
          <ellipse cx="76" cy="52" rx="9" ry="11" stroke="#f97316" strokeWidth="2.5" filter="url(#neonGlowOrangeCar)" />
          <ellipse cx="76" cy="52" rx="4" ry="5" stroke="#fed7aa" strokeWidth="1.8" />
        </svg>
      );

    case 10:
      // Nivel 10: Alerón (Diseño Neón Púrpura Abstracto)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowPurple" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#c084fc" floodOpacity="0.85" />
            </filter>
          </defs>
          {/* Ala aerodinámica superior de competición */}
          <path
            d="M14,32 C28,26 72,26 86,32 L88,40 C72,34 28,34 12,40 Z"
            stroke="#c084fc"
            strokeWidth="3"
            strokeLinejoin="round"
            filter="url(#neonGlowPurple)"
          />
          {/* Endplates laterales de vórtice */}
          <path d="M10,24 L16,48 L10,50 Z" stroke="#e9d5ff" strokeWidth="2" strokeLinejoin="round" />
          <path d="M90,24 L84,48 L90,50 Z" stroke="#e9d5ff" strokeWidth="2" strokeLinejoin="round" />
          {/* Soportes verticales de cuello de cisne */}
          <path d="M38,36 L36,66 L42,66 L44,36" stroke="#a855f7" strokeWidth="2" />
          <path d="M62,36 L64,66 L58,66 L56,36" stroke="#a855f7" strokeWidth="2" />
          {/* Base de fijación en maletero */}
          <line x1="30" y1="66" x2="70" y2="66" stroke="#c084fc" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );

    case 11:
      // Nivel 11: Superdeportivo Moderno / 2048 (Lamborghini Aventador SVJ isométrico con contornos neón magenta brillante y gran alerón)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowMagentaCar" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#f43f5e" floodOpacity="0.92" />
            </filter>
          </defs>
          {/* Reflejo y resplandor inferior magenta sobre asfalto negro */}
          <ellipse cx="50" cy="74" rx="38" ry="13" fill="#f43f5e" fillOpacity="0.18" />

          {/* Paneles de carrocería en fibra de carbono / grafito oscuro facetado */}
          <path d="M46,26 L70,33 L62,45 L30,39 Z" fill="#1c121e" />
          <path d="M30,39 L62,45 L58,57 L16,49 Z" fill="#150d18" />
          <path d="M16,49 L58,57 L52,69 L10,59 Z" fill="#201323" />
          <path d="M10,59 L52,69 L46,75 L8,63 Z" fill="#0c070e" />

          {/* Gran Alerón de Competición SVJ en magenta neón */}
          {/* Soportes de cuello de cisne del alerón */}
          <line x1="72" y1="36" x2="70" y2="21" stroke="#f43f5e" strokeWidth="2.5" filter="url(#neonGlowMagentaCar)" />
          <line x1="80" y1="39" x2="78" y2="23" stroke="#f43f5e" strokeWidth="2.5" filter="url(#neonGlowMagentaCar)" />
          {/* Plano alar superior aerodinámico */}
          <path d="M64,20 L86,24 L84,28 L62,24 Z" stroke="#f43f5e" strokeWidth="2.5" fill="#2d0b1a" filter="url(#neonGlowMagentaCar)" />
          {/* Endplates laterales del alerón */}
          <line x1="62" y1="18" x2="62" y2="26" stroke="#fda4af" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="86" y1="22" x2="86" y2="30" stroke="#fda4af" strokeWidth="2.5" strokeLinecap="round" />

          {/* Morro bajo súper afilado y splitter frontal */}
          <path d="M8,61 L22,67 L44,73 L52,69 L40,55 L16,51 Z" stroke="#f43f5e" strokeWidth="2.2" strokeLinejoin="round" filter="url(#neonGlowMagentaCar)" />
          {/* Splitter aerodinámico inferior delantero */}
          <path d="M6,63 L20,69 L40,75" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" filter="url(#neonGlowMagentaCar)" />
          {/* Faros angulares LED magenta brillante */}
          <path d="M14,60 L20,63 L18,59" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" filter="url(#neonGlowMagentaCar)" />
          <path d="M30,68 L36,67 L32,64" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" filter="url(#neonGlowMagentaCar)" />

          {/* Cockpit / techo bajo y parabrisas en cuña agresiva */}
          <path d="M22,47 L46,26 L66,32 L50,45 Z" stroke="#f43f5e" strokeWidth="2" strokeLinejoin="round" filter="url(#neonGlowMagentaCar)" />
          <line x1="46" y1="26" x2="34" y2="45" stroke="#fb7185" strokeWidth="1.2" strokeOpacity="0.7" />
          {/* Ventanilla lateral triangular */}
          <path d="M50,45 L66,32 L72,39 L56,49 Z" stroke="#fecdd3" strokeWidth="1.2" strokeOpacity="0.8" />
          {/* Enorme toma de aire lateral con conductos */}
          <path d="M56,49 L74,41 L82,47 L66,57 Z" stroke="#f43f5e" strokeWidth="1.8" />

          {/* Rueda delantera con rin de competición magenta */}
          <ellipse cx="46" cy="70" rx="10" ry="12" stroke="#f43f5e" strokeWidth="2.5" filter="url(#neonGlowMagentaCar)" />
          <ellipse cx="46" cy="70" rx="4.5" ry="5.5" stroke="#fecdd3" strokeWidth="1.8" />
          {/* Rueda trasera con rin magenta */}
          <ellipse cx="78" cy="51" rx="9" ry="11" stroke="#f43f5e" strokeWidth="2.5" filter="url(#neonGlowMagentaCar)" />
          <ellipse cx="78" cy="51" rx="4" ry="5" stroke="#fecdd3" strokeWidth="1.8" />

          {/* Salida de escape y destello posterior */}
          <circle cx="84" cy="45" r="2.5" fill="#fda4af" filter="url(#neonGlowMagentaCar)" />
        </svg>
      );

    case 12:
      // Nivel 12: Neumático (Diseño Neón Índigo/Azul Abstracto)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowIndigo" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#818cf8" floodOpacity="0.85" />
            </filter>
          </defs>
          {/* Perfil exterior de la banda de rodadura */}
          <circle cx="50" cy="50" r="37" stroke="#818cf8" strokeWidth="3" filter="url(#neonGlowIndigo)" />
          {/* Flanco interior */}
          <circle cx="50" cy="50" r="28" stroke="#a5b4fc" strokeWidth="2" />
          {/* Rin central de competición */}
          <circle cx="50" cy="50" r="18" stroke="#c7d2fe" strokeWidth="2.5" />
          <circle cx="50" cy="50" r="8" fill="#818cf8" />
          {/* Surcos de agarre radiales en la banda de rodadura */}
          <line x1="50" y1="13" x2="50" y2="22" stroke="#818cf8" strokeWidth="2" />
          <line x1="50" y1="78" x2="50" y2="87" stroke="#818cf8" strokeWidth="2" />
          <line x1="13" y1="50" x2="22" y2="50" stroke="#818cf8" strokeWidth="2" />
          <line x1="78" y1="50" x2="87" y2="50" stroke="#818cf8" strokeWidth="2" />
          <line x1="24" y1="24" x2="30" y2="30" stroke="#818cf8" strokeWidth="2" />
          <line x1="76" y1="76" x2="70" y2="70" stroke="#818cf8" strokeWidth="2" />
          <line x1="76" y1="24" x2="70" y2="30" stroke="#818cf8" strokeWidth="2" />
          <line x1="24" y1="76" x2="30" y2="70" stroke="#818cf8" strokeWidth="2" />
        </svg>
      );

    case 13:
      // Nivel 13: Hipercoche Conceptual (4096)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowFuchsia" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#e879f9" floodOpacity="0.9" />
            </filter>
          </defs>
          <path
            d="M8,65 Q24,62 34,48 Q46,32 64,32 Q78,32 88,48 L94,62 Q50,66 8,65 Z"
            stroke="#e879f9"
            strokeWidth="3"
            strokeLinejoin="round"
            filter="url(#neonGlowFuchsia)"
          />
          <circle cx="50" cy="48" r="16" stroke="#f5d0fe" strokeWidth="1.5" strokeDasharray="4 2" />
          <line x1="12" y1="65" x2="90" y2="65" stroke="#e879f9" strokeWidth="2" />
        </svg>
      );

    case 14:
      // Nivel 14: Nave Espacial / Primer Vehículo Volador (16,384)
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="neonGlowGold14" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#fde047" floodOpacity="0.95" />
            </filter>
          </defs>
          <polygon points="50,10 88,66 66,60 50,86 34,60 12,66" stroke="#fde047" strokeWidth="3" strokeLinejoin="round" filter="url(#neonGlowGold14)" fill="#1c1602" fillOpacity="0.6" />
          <line x1="50" y1="10" x2="50" y2="70" stroke="#fef08a" strokeWidth="2" />
          <circle cx="50" cy="46" r="14" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 2" />
          <circle cx="50" cy="46" r="5" fill="#fde047" />
          <polygon points="50,86 42,96 58,96" fill="#f97316" filter="url(#neonGlowGold14)" />
        </svg>
      );

    case 15:
      // Nivel 15: Hipercoche Conceptual Render 3D (32,768)
      // Superdeportivo exótico con contornos luminosos cian y magenta
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="hyperGlowCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#06b6d4" floodOpacity="0.9" />
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ec4899" floodOpacity="0.6" />
            </filter>
            <linearGradient id="hyperGrad15" x1="0" y1="0" x2="100" y2="100">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#d946ef" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* Silueta de carrocería baja y aerodinámica */}
          <path
            d="M8,68 C14,68 22,66 28,58 C34,50 42,42 56,42 C70,42 78,50 84,58 C88,64 92,68 96,68 L94,74 C86,76 78,76 68,76 L32,76 C22,76 14,76 6,74 Z"
            stroke="url(#hyperGrad15)"
            strokeWidth="2.8"
            strokeLinejoin="round"
            fill="#090514"
            fillOpacity="0.75"
            filter="url(#hyperGlowCyan)"
          />
          {/* Cabina cúpula de policarbonato con reflejo neón */}
          <path
            d="M30,56 C38,44 46,36 56,36 C66,36 72,44 76,56 Z"
            stroke="#22d3ee"
            strokeWidth="2.2"
            fill="#082f49"
            fillOpacity="0.5"
          />
          {/* Alerón aerodinámico GT trasero y difusor */}
          <path d="M12,54 L22,54 L20,62 L10,62 Z" stroke="#ec4899" strokeWidth="2" fill="#831843" />
          <line x1="6" y1="52" x2="26" y2="52" stroke="#f43f5e" strokeWidth="2.5" strokeLinecap="round" />
          {/* Tomas de aire y divisores angulares */}
          <path d="M72,62 L88,64 L86,70 L70,68 Z" stroke="#06b6d4" strokeWidth="1.8" />
          {/* Ruedas iluminadas con aros de neón cian y magenta */}
          <circle cx="26" cy="72" r="10" stroke="#06b6d4" strokeWidth="2.5" fill="#030712" />
          <circle cx="26" cy="72" r="5" stroke="#67e8f9" strokeWidth="1.5" />
          <circle cx="76" cy="72" r="10" stroke="#ec4899" strokeWidth="2.5" fill="#030712" />
          <circle cx="76" cy="72" r="5" stroke="#f472b6" strokeWidth="1.5" />
          {/* Tiras LED de faros y divisor delantero */}
          <line x1="86" y1="62" x2="96" y2="66" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="46" x2="68" y2="46" stroke="#f0abfc" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
      );

    case 16:
      // Nivel 16: Súper Auto Legendario Estilo Batimóvil Cyberpunk (65,536)
      // Blindaje angular stealth, doble alerón vertical y reactor jet violeta
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="batGlowPurple" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#a855f7" floodOpacity="0.95" />
              <feDropShadow dx="0" dy="0" stdDeviation="7" floodColor="#7e22ce" floodOpacity="0.7" />
            </filter>
            <radialGradient id="batJetFlame" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="40%" stopColor="#e879f9" />
              <stop offset="70%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b0764" />
            </radialGradient>
          </defs>
          {/* Llamarada de la turbina reactor trasera violeta */}
          <polygon points="6,62 18,57 18,67" fill="url(#batJetFlame)" filter="url(#batGlowPurple)" />
          <line x1="2" y1="62" x2="16" y2="62" stroke="#f5d0fe" strokeWidth="2.5" strokeLinecap="round" />
          {/* Boquilla de la turbina central */}
          <rect x="18" y="56" width="7" height="12" rx="2" fill="#4c1d95" stroke="#c084fc" strokeWidth="1.5" />
          {/* Blindaje angular estilo Tumbler / Batimóvil */}
          <polygon
            points="24,56 38,40 64,40 82,54 94,62 88,72 64,74 44,74 24,70"
            stroke="#c084fc"
            strokeWidth="2.8"
            strokeLinejoin="round"
            fill="#090514"
            filter="url(#batGlowPurple)"
          />
          {/* Placas facetadas de fibra de carbono blindada */}
          <line x1="38" y1="40" x2="52" y2="58" stroke="#a855f7" strokeWidth="1.8" />
          <line x1="64" y1="40" x2="52" y2="58" stroke="#a855f7" strokeWidth="1.8" />
          <line x1="52" y1="58" x2="52" y2="74" stroke="#a855f7" strokeWidth="1.8" />
          {/* Parabrisas angular furtivo reforzado */}
          <polygon points="44,42 60,42 66,50 40,50" stroke="#e9d5ff" strokeWidth="1.5" fill="#3b0764" fillOpacity="0.7" />
          {/* Alerones dorsales en punta estilo murciélago / bat-wings */}
          <polygon points="26,54 32,32 40,40" stroke="#d8b4fe" strokeWidth="2" fill="#2e1065" />
          <polygon points="20,58 24,44 30,52" stroke="#a855f7" strokeWidth="1.5" fill="#1e1b4b" />
          {/* Ruedas pesadas todoterreno con centros blindados */}
          <rect x="32" y="66" width="16" height="12" rx="4" stroke="#c084fc" strokeWidth="2.2" fill="#030712" />
          <circle cx="40" cy="72" r="3" fill="#a855f7" />
          <rect x="70" y="66" width="16" height="12" rx="4" stroke="#c084fc" strokeWidth="2.2" fill="#030712" />
          <circle cx="78" cy="72" r="3" fill="#a855f7" />
          {/* Faros tácticos cibernéticos de neón */}
          <circle cx="91" cy="62" r="2.5" fill="#f0abfc" filter="url(#batGlowPurple)" />
        </svg>
      );

    case 17:
      // Nivel 17: Auto Volador con Propulsores de Neón (131,072)
      // Vehículo volador con 4 propulsores de neón cian en anillo y estelas gravitatorias
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="hoverGlowSky" x="-25%" y="-25%" width="150%" height="150%">
              <feDropShadow dx="0" dy="0" stdDeviation="4.5" floodColor="#38bdf8" floodOpacity="0.95" />
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#0284c7" floodOpacity="0.6" />
            </filter>
            <linearGradient id="streamTrail17" x1="0" y1="50" x2="100" y2="50" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0284c7" stopOpacity="0" />
              <stop offset="60%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
          </defs>
          {/* Estelas horizontales de energía antigravitatoria */}
          <line x1="4" y1="46" x2="28" y2="46" stroke="#38bdf8" strokeWidth="2" strokeDasharray="6 3" strokeOpacity="0.8" />
          <line x1="8" y1="54" x2="22" y2="54" stroke="#7dd3fc" strokeWidth="1.8" strokeDasharray="4 2" strokeOpacity="0.7" />
          {/* Carrocería aerodinámica flotante del superauto */}
          <path
            d="M20,54 C26,52 36,38 52,38 C68,38 78,48 86,52 L94,56 C90,62 82,64 74,64 L32,64 C24,64 18,60 16,56 Z"
            stroke="#38bdf8"
            strokeWidth="2.8"
            strokeLinejoin="round"
            fill="#082f49"
            fillOpacity="0.8"
            filter="url(#hoverGlowSky)"
          />
          {/* Cabina panorámica aeroespacial */}
          <path
            d="M34,48 C42,40 50,34 60,34 C68,34 74,40 78,48 Z"
            stroke="#bae6fd"
            strokeWidth="2"
            fill="#0369a1"
            fillOpacity="0.5"
          />
          {/* Alerones de sustentación cuántica */}
          <polygon points="18,52 28,40 32,48" stroke="#7dd3fc" strokeWidth="1.8" fill="#075985" />
          <line x1="72" y1="52" x2="88" y2="52" stroke="#e0f2fe" strokeWidth="2.2" strokeLinecap="round" />
          {/* 4 Propulsores de Neón Cian en Anillo (Antigravedad) */}
          {/* Propulsor Izquierdo Delantero / Trasero */}
          <ellipse cx="32" cy="68" rx="9" ry="4" stroke="#38bdf8" strokeWidth="2.5" fill="#0c4a6e" filter="url(#hoverGlowSky)" />
          <ellipse cx="32" cy="68" rx="5" ry="2" stroke="#e0f2fe" strokeWidth="1.5" />
          <line x1="32" y1="72" x2="32" y2="82" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <line x1="28" y1="72" x2="26" y2="80" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="36" y1="72" x2="38" y2="80" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
          {/* Propulsor Derecho Delantero / Trasero */}
          <ellipse cx="74" cy="68" rx="9" ry="4" stroke="#38bdf8" strokeWidth="2.5" fill="#0c4a6e" filter="url(#hoverGlowSky)" />
          <ellipse cx="74" cy="68" rx="5" ry="2" stroke="#e0f2fe" strokeWidth="1.5" />
          <line x1="74" y1="72" x2="74" y2="82" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
          <line x1="70" y1="72" x2="68" y2="80" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
          <line x1="78" y1="72" x2="80" y2="80" stroke="#7dd3fc" strokeWidth="1.5" opacity="0.7" />
        </svg>
      );

    case 18:
    default:
      // Nivel 18: Portal de Hiperviaje Automotriz de la Cochera (262,144 en adelante / Modo Infinito)
      // Stargate de la cochera espacial con anillos de energía y plataforma de lanzamiento
      return (
        <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="portalGlowGold18" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#fde047" floodOpacity="0.95" />
              <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#38bdf8" floodOpacity="0.8" />
            </filter>
            <radialGradient id="portalCore18" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#fef08a" />
              <stop offset="60%" stopColor="#38bdf8" />
              <stop offset="85%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#0f172a" />
            </radialGradient>
          </defs>
          {/* Estructura gantry de la cochera / Stargate industrial */}
          <polygon points="12,18 50,8 88,18 92,86 8,86" stroke="#fbbf24" strokeWidth="2.5" strokeLinejoin="round" fill="#171104" fillOpacity="0.8" />
          <line x1="12" y1="18" x2="26" y2="86" stroke="#fde047" strokeWidth="1.5" strokeOpacity="0.6" />
          <line x1="88" y1="18" x2="74" y2="86" stroke="#fde047" strokeWidth="1.5" strokeOpacity="0.6" />
          {/* Anillos de aceleración de hiperviaje concéntricos */}
          <circle cx="50" cy="48" r="36" stroke="#fde047" strokeWidth="3" strokeDasharray="8 4" filter="url(#portalGlowGold18)" />
          <circle cx="50" cy="48" r="28" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="5 3" />
          <circle cx="50" cy="48" r="20" stroke="#c084fc" strokeWidth="2" strokeDasharray="4 2" />
          {/* Vórtice central de singularidad dimensional */}
          <circle cx="50" cy="48" r="14" fill="url(#portalCore18)" filter="url(#portalGlowGold18)" />
          {/* Plataforma de lanzamiento para el automóvil en la cochera */}
          <polygon points="26,86 36,68 64,68 74,86" stroke="#38bdf8" strokeWidth="2" fill="#0369a1" fillOpacity="0.7" />
          <line x1="36" y1="68" x2="64" y2="68" stroke="#fde047" strokeWidth="2.5" />
          {/* Haz de proyección hacia el hiperespacio */}
          <line x1="50" y1="10" x2="50" y2="34" stroke="#fef08a" strokeWidth="2" strokeDasharray="3 3" />
          <line x1="20" y1="48" x2="36" y2="48" stroke="#38bdf8" strokeWidth="1.8" />
          <line x1="64" y1="48" x2="80" y2="48" stroke="#38bdf8" strokeWidth="1.8" />
        </svg>
      );
  }
};

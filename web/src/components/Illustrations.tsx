import React from 'react';

// House with Mango Leaf Toranam and Kalash (Gruhapravesam)
export const HouseIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#F7DC98" />
    <path d="M0 165 C80 155 240 155 320 165 L320 200 L0 200 Z" fill="#EBC877" />
    <rect x="75" y="85" width="170" height="90" fill="#FFFFFF" rx="4" />
    <path d="M60 85 L160 30 L260 85 Z" fill="#932838" />
    <path d="M55 85 L160 26 L265 85 L260 92 L160 36 L60 92 Z" fill="#7D1E2D" />
    <path d="M75 92 L245 92" stroke="#688F4E" strokeWidth="3" />
    {[85, 105, 125, 145, 165, 185, 205, 225, 235].map((x, i) => (
      <path key={i} d={`M${x} 92 L${x + 5} 106 L${x + 10} 92 Z`} fill="#558B2F" />
    ))}
    <rect x="135" y="115" width="50" height="60" fill="#6B1824" rx="2" />
    <circle cx="175" cy="145" r="3" fill="#F7DC98" />
    <rect x="90" y="112" width="28" height="28" fill="#F4B447" rx="3" />
    <rect x="202" y="112" width="28" height="28" fill="#F4B447" rx="3" />
    <path d="M104 112 L104 140 M90 126 L118 126" stroke="#FFFFFF" strokeWidth="2" />
    <path d="M216 112 L216 140 M202 126 L230 126" stroke="#FFFFFF" strokeWidth="2" />
    <g transform="translate(230, 145)">
      <ellipse cx="18" cy="22" rx="14" ry="10" fill="#C57D28" />
      <path d="M10 14 Q18 8 26 14" stroke="#9A5E1A" strokeWidth="3" fill="none" />
      <path d="M8 12 L18 2 L14 12 Z" fill="#4CAF50" />
      <path d="M28 12 L18 2 L22 12 Z" fill="#4CAF50" />
      <path d="M18 12 L18 0 L18 12 Z" fill="#388E3C" />
      <circle cx="18" cy="5" r="7" fill="#795548" />
    </g>
  </svg>
);

// Vastu Mandala Grid
export const VastuIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#FCEAC3" />
    <ellipse cx="160" cy="180" rx="140" ry="20" fill="#EED59B" />
    <rect x="95" y="25" width="130" height="130" fill="#FFFDF8" stroke="#7A1D2B" strokeWidth="4" />
    <line x1="138" y1="25" x2="138" y2="155" stroke="#7A1D2B" strokeWidth="2.5" />
    <line x1="182" y1="25" x2="182" y2="155" stroke="#7A1D2B" strokeWidth="2.5" />
    <line x1="95" y1="68" x2="225" y2="68" stroke="#7A1D2B" strokeWidth="2.5" />
    <line x1="95" y1="112" x2="225" y2="112" stroke="#7A1D2B" strokeWidth="2.5" />
    <circle cx="160" cy="90" r="10" fill="#A82838" />
    <circle cx="160" cy="90" r="4" fill="#F4B447" />
    <path d="M160 12 L150 25 L170 25 Z" fill="#A82838" />
    <path d="M160 168 L150 155 L170 155 Z" fill="#A82838" />
    <path d="M82 90 L95 80 L95 100 Z" fill="#A82838" />
    <path d="M238 90 L225 80 L225 100 Z" fill="#A82838" />
    <ellipse cx="60" cy="165" rx="14" ry="6" fill="#C57D28" />
    <path d="M60 150 C65 158 66 162 60 164 C54 162 55 158 60 150 Z" fill="#FFB703" />
    <ellipse cx="260" cy="165" rx="14" ry="6" fill="#C57D28" />
    <path d="M260 150 C265 158 266 162 260 164 C254 162 255 158 260 150 Z" fill="#FFB703" />
  </svg>
);

// Bhoomi Pooja (Earth/Soil, Sprout, Spade, Bricks)
export const BhoomiIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#F7DC98" />
    <ellipse cx="160" cy="170" rx="110" ry="75" fill="#8D5B28" />
    <ellipse cx="160" cy="170" rx="95" ry="60" fill="#A46E35" />
    <path d="M160 120 C160 90 140 75 125 70 C135 85 145 98 152 118" fill="#5BA647" />
    <path d="M156 120 C162 90 195 72 210 65 C195 85 180 102 165 120" fill="#74BF5D" />
    <rect x="90" y="145" width="28" height="15" fill="#BC4732" rx="2" stroke="#8D3424" strokeWidth="1.5" />
    <rect x="122" y="145" width="28" height="15" fill="#BC4732" rx="2" stroke="#8D3424" strokeWidth="1.5" />
    <rect x="106" y="130" width="28" height="15" fill="#C95540" rx="2" stroke="#8D3424" strokeWidth="1.5" />
    <line x1="215" y1="95" x2="255" y2="160" stroke="#6D4C41" strokeWidth="6" strokeLinecap="round" />
    <path d="M245 150 L268 180 L250 188 L235 160 Z" fill="#90A4AE" stroke="#607D8B" strokeWidth="1.5" />
  </svg>
);

// Namakaranam (Infant in swinging cradle with marigolds)
export const NamakaranamIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#FCEAE6" />
    <line x1="110" y1="20" x2="120" y2="90" stroke="#C57D28" strokeWidth="3" />
    <line x1="210" y1="20" x2="200" y2="90" stroke="#C57D28" strokeWidth="3" />
    <path d="M105 88 Q160 110 215 88" stroke="#FF9800" strokeWidth="6" fill="none" />
    {[110, 125, 140, 155, 170, 185, 200, 210].map((x, i) => (
      <circle key={i} cx={x} cy={88 + Math.sin((i / 7) * Math.PI) * 14} r="5" fill="#F59E0B" />
    ))}
    <path d="M110 90 Q160 155 210 90 Z" fill="#B94A48" />
    <path d="M118 92 Q160 145 202 92 Z" fill="#FFF3E0" />
    <circle cx="140" cy="105" r="12" fill="#FFCCBC" />
    <ellipse cx="160" cy="115" rx="20" ry="12" fill="#FFFFFF" />
    <ellipse cx="90" cy="165" rx="12" ry="5" fill="#C57D28" />
    <path d="M90 152 C94 158 95 161 90 163 C85 161 86 158 90 152 Z" fill="#FFB703" />
    <ellipse cx="230" cy="165" rx="12" ry="5" fill="#C57D28" />
    <path d="M230 152 C234 158 235 161 230 163 C225 161 226 158 230 152 Z" fill="#FFB703" />
  </svg>
);

// Annaprasana (Bowl of golden Payasam/Kheer with spoon & Tulasi)
export const AnnaprasanaIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#E8F4F0" />
    <path d="M75 165 C70 140 60 125 50 115 C60 128 70 142 75 165" fill="#4CAF50" />
    <path d="M245 165 C250 140 260 125 270 115 C260 128 250 142 245 165" fill="#4CAF50" />
    <path d="M110 115 Q160 170 210 115 Z" fill="#FFFFFF" stroke="#CFD8DC" strokeWidth="2" />
    <ellipse cx="160" cy="118" rx="46" ry="14" fill="#FFF9C4" />
    <circle cx="150" cy="116" r="3" fill="#D4A017" />
    <circle cx="170" cy="119" r="3" fill="#8D5524" />
    <circle cx="162" cy="122" r="2.5" fill="#D4A017" />
    <path d="M190 90 L235 45 L242 52 L198 97 Z" fill="#90A4AE" />
    <ellipse cx="192" cy="95" rx="10" ry="7" fill="#B0BEC5" transform="rotate(-30 192 95)" />
  </svg>
);

// Aksharabhyasam (Slate, Chalk, Sacred Plate with Aksharas)
export const AksharabhyasamIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#FCEAE6" />
    <rect x="180" y="55" width="85" height="65" rx="4" fill="#5D4037" stroke="#4E342E" strokeWidth="3" />
    <rect x="186" y="61" width="73" height="53" fill="#263238" />
    <line x1="194" y1="74" x2="230" y2="74" stroke="#ECEFF1" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="194" y1="86" x2="245" y2="86" stroke="#ECEFF1" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="194" y1="98" x2="220" y2="98" stroke="#ECEFF1" strokeWidth="2.5" strokeLinecap="round" />
    <ellipse cx="115" cy="125" rx="55" ry="24" fill="#C58925" />
    <ellipse cx="115" cy="125" rx="50" ry="20" fill="#FFF3E0" />
    <path d="M105 125 C105 120 115 116 122 121 C128 126 124 132 115 131" stroke="#C62828" strokeWidth="3" fill="none" />
    <circle cx="126" cy="118" r="2.5" fill="#C62828" />
    <line x1="150" y1="120" x2="190" y2="95" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

// Upanayanam (Brahmachari with Yajnopavita thread, Danda staff & Kamandalam)
export const UpanayanamIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#FCEAE6" />
    <circle cx="150" cy="70" r="18" fill="#FFCCBC" />
    <path d="M140 55 C135 48 142 42 148 45" stroke="#3E2723" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M125 105 Q150 90 175 105 L185 170 L115 170 Z" fill="#FFFFFF" />
    <line x1="135" y1="92" x2="175" y2="155" stroke="#C57D28" strokeWidth="2.5" strokeDasharray="3 2" />
    <line x1="205" y1="40" x2="205" y2="175" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
    <path d="M200 45 Q205 35 210 45" stroke="#3E2723" strokeWidth="3" fill="none" />
    <g transform="translate(90, 115)">
      <ellipse cx="14" cy="24" rx="12" ry="16" fill="#D49A24" />
      <path d="M6 14 Q14 2 22 14" stroke="#A86E12" strokeWidth="3" fill="none" />
    </g>
  </svg>
);

// Shashtipoorthi (Double figure-8 garland, Kalash, Big "60")
export const ShashtipoorthiIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#FCEAE6" />
    <ellipse cx="120" cy="95" rx="36" ry="32" fill="none" stroke="#F59E0B" strokeWidth="12" strokeDasharray="6 6" />
    <ellipse cx="200" cy="95" rx="36" ry="32" fill="none" stroke="#E91E63" strokeWidth="12" strokeDasharray="6 6" />
    <g transform="translate(142, 65)">
      <ellipse cx="18" cy="28" rx="14" ry="12" fill="#D49A24" />
      <circle cx="18" cy="14" r="8" fill="#8D5524" />
      <path d="M10 18 L18 8 L14 18 Z" fill="#4CAF50" />
      <path d="M26 18 L18 8 L22 18 Z" fill="#4CAF50" />
    </g>
    <text x="160" y="165" textAnchor="middle" fontFamily="'DM Serif Display', Georgia, serif" fontWeight="800" fontSize="34" fill="#932838">60</text>
  </svg>
);

// Varalakshmi Vratham (Kalash on vibrant pink Lotus petals)
export const VaralakshmiIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#E8F5E9" />
    <path d="M60 20 Q160 50 260 20" stroke="#FF9800" strokeWidth="4" fill="none" />
    <path d="M160 145 C110 120 80 145 100 165 C130 170 150 155 160 145 Z" fill="#F48FB1" />
    <path d="M160 145 C210 120 240 145 220 165 C190 170 170 155 160 145 Z" fill="#F48FB1" />
    <path d="M160 150 C130 135 120 165 140 175 C155 175 160 160 160 150 Z" fill="#EC407A" />
    <path d="M160 150 C190 135 200 165 180 175 C165 175 160 160 160 150 Z" fill="#EC407A" />
    <ellipse cx="160" cy="115" rx="24" ry="20" fill="#F59E0B" />
    <circle cx="160" cy="80" r="14" fill="#C58925" />
    <polygon points="160,52 150,68 170,68" fill="#F59E0B" />
    <ellipse cx="70" cy="165" rx="10" ry="4" fill="#C57D28" />
    <path d="M70 155 C74 160 75 162 70 164 C65 162 66 160 70 155 Z" fill="#FFB703" />
    <ellipse cx="250" cy="165" rx="10" ry="4" fill="#C57D28" />
    <path d="M250 155 C254 160 255 162 250 164 C245 162 246 160 250 155 Z" fill="#FFB703" />
  </svg>
);

// Rudrabhishekam (Shiva Linga on Peetham with Abhishekam stream)
export const RudrabhishekamIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#E8F4F0" />
    <polygon points="80,140 120,80 160,140" fill="#B0BEC5" opacity={0.4} />
    <polygon points="200,140 240,75 280,140" fill="#B0BEC5" opacity={0.4} />
    <ellipse cx="160" cy="148" rx="60" ry="18" fill="#455A64" />
    <rect x="130" y="148" width="60" height="15" fill="#37474F" rx="3" />
    <path d="M142 148 L142 95 C142 80 178 80 178 95 L178 148 Z" fill="#263238" />
    <line x1="150" y1="96" x2="170" y2="96" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="150" y1="100" x2="170" y2="100" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <line x1="150" y1="104" x2="170" y2="104" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <circle cx="160" cy="100" r="2" fill="#D32F2F" />
    <ellipse cx="160" cy="35" rx="16" ry="8" fill="#C57D28" />
    <line x1="160" y1="42" x2="160" y2="85" stroke="#81D4FA" strokeWidth="3" strokeDasharray="4 2" />
  </svg>
);

// Navagraha Homam (Flames with 9 colored celestial graha orbs)
export const NavagrahaIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#6E281F" />
    {[
      { x: 90, y: 135, col: '#FF5722' },
      { x: 95, y: 100, col: '#FFFFFF' },
      { x: 110, y: 70, col: '#D32F2F' },
      { x: 135, y: 50, col: '#4CAF50' },
      { x: 160, y: 40, col: '#FFEB3B' },
      { x: 185, y: 50, col: '#ECEFF1' },
      { x: 210, y: 70, col: '#212121' },
      { x: 225, y: 100, col: '#3F51B5' },
      { x: 230, y: 135, col: '#795548' },
    ].map((g, idx) => (
      <circle key={idx} cx={g.x} cy={g.y} r="7" fill={g.col} stroke="#FFF" strokeWidth="1.5" />
    ))}
    <rect x="120" y="145" width="80" height="20" fill="#8B331E" rx="3" />
    <rect x="130" y="132" width="60" height="15" fill="#692211" rx="2" />
    <path d="M160 75 C175 105 180 120 160 132 C140 120 145 105 160 75 Z" fill="#FFA000" />
    <path d="M160 90 C170 110 172 122 160 132 C148 122 150 110 160 90 Z" fill="#FFF59D" />
  </svg>
);

// Devi Navaratri Chandi Pooja (Golden Trishula on Lotus with Diyas)
export const ChandiPoojaIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#3E1A24" />
    <g transform="translate(160, 45)">
      <line x1="0" y1="0" x2="0" y2="105" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
      <polygon points="0,-10 -6,5 6,5" fill="#F59E0B" />
      <path d="M0 45 C-35 45 -35 10 -30 0" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" />
      <polygon points="-30,-10 -36,5 -24,5" fill="#F59E0B" />
      <path d="M0 45 C35 45 35 10 30 0" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" />
      <polygon points="30,-10 24,5 36,5" fill="#F59E0B" />
    </g>
    <ellipse cx="160" cy="155" rx="55" ry="18" fill="#C2185B" />
    <path d="M110 155 C130 140 160 140 160 155 Z" fill="#E91E63" />
    <path d="M210 155 C190 140 160 140 160 155 Z" fill="#E91E63" />
    {[80, 120, 200, 240].map((x, i) => (
      <ellipse key={i} cx={x} cy={165} rx="8" ry="3" fill="#D97706" />
    ))}
  </svg>
);

// Sudarshana Homam (Sudarshana Chakra wheel with glowing spokes & fire)
export const SudarshanaIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#6E281F" />
    <circle cx="160" cy="85" r="42" stroke="#F59E0B" strokeWidth="7" fill="none" />
    <circle cx="160" cy="85" r="32" stroke="#D97706" strokeWidth="2" fill="none" />
    {[0, 45, 90, 135].map((ang, i) => (
      <line 
        key={i} 
        x1={160 - 42 * Math.cos((ang * Math.PI) / 180)} 
        y1={85 - 42 * Math.sin((ang * Math.PI) / 180)} 
        x2={160 + 42 * Math.cos((ang * Math.PI) / 180)} 
        y2={85 + 42 * Math.sin((ang * Math.PI) / 180)} 
        stroke="#F59E0B" 
        strokeWidth="3" 
      />
    ))}
    <rect x="120" y="148" width="80" height="20" fill="#8B331E" rx="3" />
    <path d="M160 70 C170 95 174 110 160 120 C146 110 150 95 160 70 Z" fill="#FFA000" />
    <path d="M160 85 C166 100 168 110 160 120 C152 110 154 100 160 85 Z" fill="#FFF59D" />
  </svg>
);

// Vinayaka Chavithi Pooja (Modakam sweets pyramid under sacred umbrella)
export const VinayakaChavithiIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <radialGradient id="vinayakaGlow" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#4A3B66" />
        <stop offset="100%" stopColor="#251D33" />
      </radialGradient>
    </defs>
    {/* Dark violet/indigo backdrop */}
    <rect width="320" height="200" fill="url(#vinayakaGlow)" />
    
    {/* Ground layer */}
    <path d="M0 160 C80 155 240 155 320 160 L320 200 L0 200 Z" fill="#1C1628" />

    {/* Sacred Triangular Umbrella Canopy */}
    <path d="M160 38 L95 86 L225 86 Z" fill="#E86C32" />
    <path d="M160 38 L90 86 L100 86 L160 44 L220 86 L230 86 Z" fill="#D3541B" />
    {/* Central stick */}
    <rect x="158" y="86" width="4" height="66" fill="#F59E0B" rx="1" />

    {/* Brown Wooden Altar / Peetham */}
    <rect x="90" y="152" width="140" height="14" fill="#A46435" rx="3" />
    <rect x="100" y="162" width="120" height="6" fill="#844D25" rx="2" />

    {/* Sacred Modak Sweets Stacked Pyramid */}
    <g transform="translate(160, 152)">
      {/* Row 1 (Bottom 4) */}
      <path d="M-36 0 C-41 0 -44 -14 -36 -20 C-28 -14 -31 0 -36 0 Z" fill="#FFF8EB" stroke="#E6D3B3" strokeWidth="1" />
      <path d="M-12 0 C-17 0 -20 -14 -12 -20 C-4 -14 -7 0 -12 0 Z" fill="#FFF8EB" stroke="#E6D3B3" strokeWidth="1" />
      <path d="M12 0 C7 0 4 -14 12 -20 C20 -14 17 0 12 0 Z" fill="#FFF8EB" stroke="#E6D3B3" strokeWidth="1" />
      <path d="M36 0 C31 0 28 -14 36 -20 C44 -14 41 0 36 0 Z" fill="#FFF8EB" stroke="#E6D3B3" strokeWidth="1" />

      {/* Row 2 (Middle 3) */}
      <path d="M-24 -15 C-29 -15 -32 -29 -24 -35 C-16 -29 -19 -15 -24 -15 Z" fill="#FFF8EB" stroke="#E6D3B3" strokeWidth="1" />
      <path d="M0 -15 C-5 -15 -8 -29 0 -35 C8 -29 5 -15 0 -15 Z" fill="#FFFDF8" stroke="#E6D3B3" strokeWidth="1" />
      <path d="M24 -15 C19 -15 16 -29 24 -35 C32 -29 29 -15 24 -15 Z" fill="#FFF8EB" stroke="#E6D3B3" strokeWidth="1" />

      {/* Row 3 (Top 2) */}
      <path d="M-12 -30 C-17 -30 -20 -44 -12 -50 C-4 -44 -7 -30 -12 -30 Z" fill="#FFFDF8" stroke="#E6D3B3" strokeWidth="1" />
      <path d="M12 -30 C7 -30 4 -44 12 -50 C20 -44 17 -30 12 -30 Z" fill="#FFFDF8" stroke="#E6D3B3" strokeWidth="1" />

      {/* Peak 1 (Top single) */}
      <path d="M0 -45 C-5 -45 -8 -59 0 -66 C8 -59 5 -45 0 -45 Z" fill="#FFFFFF" stroke="#E6D3B3" strokeWidth="1.2" />
    </g>

    {/* Sacred Green Garika/Patri Grass Stalks flanking both sides */}
    {/* Left Stalks */}
    <line x1="60" y1="165" x2="52" y2="125" stroke="#689F38" strokeWidth="3" strokeLinecap="round" />
    <line x1="68" y1="165" x2="72" y2="120" stroke="#7CB342" strokeWidth="3" strokeLinecap="round" />
    <line x1="76" y1="165" x2="84" y2="132" stroke="#689F38" strokeWidth="3" strokeLinecap="round" />

    {/* Right Stalks */}
    <line x1="260" y1="165" x2="268" y2="125" stroke="#689F38" strokeWidth="3" strokeLinecap="round" />
    <line x1="252" y1="165" x2="248" y2="120" stroke="#7CB342" strokeWidth="3" strokeLinecap="round" />
    <line x1="244" y1="165" x2="236" y2="132" stroke="#689F38" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// Office Opening Pooja (Store/Office Mandapam with Green Awning, Toranam & Kalash)
export const OfficeOpeningIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#E8F4F0" />
    {/* Office Entrance Frame */}
    <rect x="90" y="65" width="140" height="115" fill="#FFFFFF" stroke="#90A4AE" strokeWidth="2" />
    {/* Green Awning / Canopy at top */}
    <path d="M80 65 L240 65 L230 45 L90 45 Z" fill="#2E7D32" />
    {/* White Scalloped Toranam */}
    <rect x="85" y="65" width="150" height="16" fill="#F4FBF7" />
    <path d="M85 81 Q100 90 115 81 Q130 90 145 81 Q160 90 175 81 Q190 90 205 81 Q220 90 235 81" fill="#C8E6C9" />
    {/* Sacred Yellow Mango Leaves Ribbon */}
    <line x1="88" y1="110" x2="232" y2="110" stroke="#F59E0B" strokeWidth="6" strokeLinecap="round" />
    <polygon points="160,110 152,118 168,118" fill="#D97706" />
    {/* Golden Kalash on entrance */}
    <g transform="translate(225, 135)">
      <ellipse cx="14" cy="22" rx="12" ry="16" fill="#C58925" />
      <circle cx="14" cy="8" r="7" fill="#8D5524" />
      <path d="M6 12 L14 2 L10 12 Z" fill="#4CAF50" />
      <path d="M22 12 L14 2 L18 12 Z" fill="#4CAF50" />
    </g>
  </svg>
);

// Vahana Pooja (Red car with festive flower garland on hood and lemon on wheels)
export const VahanaPoojaIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#E8EDF2" />
    {/* Road ground */}
    <rect x="0" y="165" width="320" height="35" fill="#CFD8DC" />
    {/* Red Car Body */}
    <path d="M85 140 L95 105 L150 90 L210 90 L235 115 L245 140 Z" fill="#C62828" rx="6" />
    {/* Car Roof & Windows */}
    <path d="M125 90 L145 70 L195 70 L215 90 Z" fill="#FFFFFF" stroke="#B71C1C" strokeWidth="2" />
    <polygon points="135,88 150,73 170,73 170,88" fill="#B0BEC5" />
    <polygon points="175,88 175,73 195,73 205,88" fill="#B0BEC5" />
    {/* Festive Marigold Garland across hood */}
    <path d="M90 120 Q160 100 230 120" stroke="#FF9800" strokeWidth="6" fill="none" />
    {[100, 120, 140, 160, 180, 200, 220].map((x, i) => (
      <circle key={i} cx={x} cy={110 + Math.sin((i / 6) * Math.PI) * 8} r="5" fill="#F59E0B" />
    ))}
    {/* Black Wheels with Silver Hubcaps */}
    <circle cx="115" cy="155" r="16" fill="#263238" />
    <circle cx="115" cy="155" r="7" fill="#ECEFF1" />
    <circle cx="215" cy="155" r="16" fill="#263238" />
    <circle cx="215" cy="155" r="7" fill="#ECEFF1" />
    {/* Lemons under tires */}
    <ellipse cx="115" cy="170" rx="5" ry="3.5" fill="#FEE500" stroke="#E6C200" strokeWidth="1" />
    <ellipse cx="215" cy="170" rx="5" ry="3.5" fill="#FEE500" stroke="#E6C200" strokeWidth="1" />
  </svg>
);

// Satyanarayana Vratham Altar & Kalash
export const SatyanarayanaIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#E2F1DB" />
    <path d="M45 190 C45 90 85 40 105 20 C95 65 75 130 75 190 Z" fill="#4CAF50" />
    <path d="M275 190 C275 90 235 40 215 20 C225 65 245 130 245 190 Z" fill="#4CAF50" />
    <rect x="90" y="155" width="140" height="20" fill="#B26A2A" rx="4" />
    <rect x="100" y="145" width="120" height="10" fill="#D98A3D" rx="2" />
    <ellipse cx="160" cy="120" rx="26" ry="20" fill="#D49A24" />
    <path d="M144 104 Q160 96 176 104" stroke="#A86E12" strokeWidth="4" fill="none" />
    <path d="M140 102 L160 82 L152 102 Z" fill="#388E3C" />
    <path d="M180 102 L160 82 L168 102 Z" fill="#388E3C" />
    <path d="M160 100 L160 76 L160 100 Z" fill="#2E7D32" stroke="#2E7D32" strokeWidth="2" />
    <circle cx="160" cy="82" r="12" fill="#8D5524" />
    <ellipse cx="120" cy="155" rx="14" ry="5" fill="#E0A938" />
    <circle cx="120" cy="152" r="4" fill="#F4511E" />
    <ellipse cx="200" cy="155" rx="10" ry="4" fill="#C57D28" />
    <path d="M200 144 C204 150 205 153 200 155 C195 153 196 150 200 144 Z" fill="#FFB703" />
  </svg>
);

// Homa Kundam with Sacred Flames
export const HomamIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#6E281F" />
    <rect x="110" y="145" width="100" height="15" fill="#A8432B" rx="2" />
    <rect x="120" y="132" width="80" height="14" fill="#8B331E" rx="2" />
    <rect x="130" y="120" width="60" height="13" fill="#692211" rx="2" />
    <rect x="135" y="112" width="50" height="8" rx="2" fill="#421E14" transform="rotate(-6 135 112)" />
    <rect x="140" y="115" width="45" height="8" rx="2" fill="#5A2A1C" transform="rotate(8 140 115)" />
    <path d="M160 45 C185 80 190 105 160 120 C130 105 135 80 160 45 Z" fill="#FFA000" />
    <path d="M160 60 C175 90 180 108 160 120 C140 108 145 90 160 60 Z" fill="#FFD54F" />
    <path d="M160 80 C168 98 170 112 160 120 C150 112 152 98 160 80 Z" fill="#FFFFFF" />
    <line x1="230" y1="90" x2="185" y2="125" stroke="#E0A938" strokeWidth="5" strokeLinecap="round" />
    <circle cx="185" cy="125" r="5" fill="#C58925" />
    <circle cx="95" cy="155" r="6" fill="#F4E9D0" />
    <circle cx="103" cy="157" r="5" fill="#F4E9D0" />
    <circle cx="100" cy="150" r="5" fill="#F4E9D0" />
  </svg>
);

// Abdikam (Tarpana Water, Kusha Grass, Pinda on Riverbank)
export const AbdikamIllustration: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 200" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="320" height="200" fill="#E8EDF2" />
    <circle cx="230" cy="70" r="28" fill="#FCEAC3" />
    <path d="M0 125 C80 110 240 110 320 125 L320 200 L0 200 Z" fill="#669BBC" />
    <path d="M0 150 C120 140 200 145 320 155 L320 200 L0 200 Z" fill="#588157" />
    <line x1="50" y1="180" x2="45" y2="135" stroke="#3A5A40" strokeWidth="3" strokeLinecap="round" />
    <line x1="60" y1="180" x2="62" y2="130" stroke="#3A5A40" strokeWidth="3" strokeLinecap="round" />
    <line x1="70" y1="180" x2="78" y2="140" stroke="#3A5A40" strokeWidth="3" strokeLinecap="round" />
    <ellipse cx="145" cy="165" rx="8" ry="6" fill="#F8F9FA" stroke="#D1D5DB" strokeWidth="1" />
    <circle cx="145" cy="163" r="1.5" fill="#1F2937" />
    <ellipse cx="165" cy="165" rx="8" ry="6" fill="#F8F9FA" stroke="#D1D5DB" strokeWidth="1" />
    <circle cx="165" cy="163" r="1.5" fill="#1F2937" />
    <ellipse cx="185" cy="165" rx="8" ry="6" fill="#F8F9FA" stroke="#D1D5DB" strokeWidth="1" />
    <circle cx="185" cy="163" r="1.5" fill="#1F2937" />
    <path d="M225 140 C220 145 220 170 235 175 C250 170 250 145 245 140 Z" fill="#B85D19" />
    <ellipse cx="235" cy="140" rx="10" ry="3" fill="#D97724" />
  </svg>
);

// Festival Arts
export const MahalayaArt: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="180" fill="#1E2738" />
    <circle cx="210" cy="50" r="18" fill="none" stroke="#64748B" strokeWidth="2" strokeDasharray="3 3" />
    {[[40, 30], [80, 50], [130, 25], [170, 70], [250, 40], [240, 90]].map(([x, y], i) => (
      <circle key={i} cx={x} cy={y} r="1.5" fill="#E2E8F0" opacity={0.7} />
    ))}
    <path d="M0 115 C80 110 180 110 280 115 L280 180 L0 180 Z" fill="#0F172A" />
    <path d="M0 135 C100 130 200 130 280 135 L280 180 L0 180 Z" fill="#1E3A5F" opacity={0.6} />
    <rect x="20" y="140" width="80" height="40" fill="#334155" rx="2" />
    <g transform="translate(100, 70)">
      <ellipse cx="28" cy="22" rx="14" ry="10" fill="#C57D28" transform="rotate(-35 28 22)" />
      <path d="M14 18 C0 35 3 60 10 75" stroke="#7DD3FC" strokeWidth="3" fill="none" strokeLinecap="round" />
      <circle cx="10" cy="77" r="2" fill="#BAE6FD" />
      <circle cx="6" cy="65" r="1.5" fill="#BAE6FD" />
    </g>
    <line x1="210" y1="165" x2="200" y2="125" stroke="#4ADE80" strokeWidth="2.5" />
    <line x1="218" y1="165" x2="222" y2="120" stroke="#4ADE80" strokeWidth="2.5" />
    <line x1="225" y1="165" x2="235" y2="130" stroke="#4ADE80" strokeWidth="2.5" />
  </svg>
);

export const NavaratriArt: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="180" fill="#4A151B" />
    <path d="M0 25 Q140 70 280 25" stroke="#FF9800" strokeWidth="6" fill="none" />
    {[15, 45, 75, 105, 140, 175, 205, 235, 265].map((x, i) => {
      const y = 25 + Math.sin((x / 280) * Math.PI) * 35;
      return (
        <g key={i}>
          <circle cx={x} cy={y} r="7" fill="#F59E0B" />
          <circle cx={x} cy={y} r="4" fill="#DC2626" />
        </g>
      );
    })}
    <g transform="translate(100, 65)">
      <circle cx="40" cy="22" r="14" fill="#8D5524" />
      <path d="M22 35 L40 5 L30 35 Z" fill="#22C55E" />
      <path d="M58 35 L40 5 L50 35 Z" fill="#22C55E" />
      <path d="M40 30 L40 0 L40 30 Z" fill="#15803D" stroke="#15803D" strokeWidth="3" />
      <ellipse cx="40" cy="55" rx="26" ry="18" fill="#F59E0B" />
      <ellipse cx="40" cy="55" rx="24" ry="16" fill="#FBBF24" />
      <circle cx="40" cy="55" r="5" fill="#B91C1C" />
    </g>
    {[60, 220].map((x, i) => (
      <g key={i} transform={`translate(${x}, 125)`}>
        <ellipse cx="0" cy="15" rx="12" ry="5" fill="#D97706" />
        <path d="M0 0 C4 7 5 10 0 13 C-5 10 -4 7 0 0 Z" fill="#FDE047" />
      </g>
    ))}
  </svg>
);

export const DeepavaliArt: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 280 180" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="280" height="180" fill="#2B163B" />
    {[[30, 40], [100, 20], [180, 50], [250, 25], [230, 80], [70, 75]].map(([x, y], i) => (
      <polygon key={i} points={`${x},${y-4} ${x+1},${y-1} ${x+4},${y} ${x+1},${y+1} ${x},${y+4} ${x-1},${y+1} ${x-4},${y} ${x-1},${y-1}`} fill="#FDE047" />
    ))}
    <g transform="translate(55, 30)">
      <polygon points="15,0 30,15 15,30 0,15" fill="#F97316" stroke="#FEF08A" strokeWidth="1.5" />
      <line x1="15" y1="30" x2="10" y2="55" stroke="#FB923C" strokeWidth="2" strokeDasharray="2 2" />
      <line x1="15" y1="30" x2="20" y2="55" stroke="#FB923C" strokeWidth="2" strokeDasharray="2 2" />
    </g>
    <ellipse cx="140" cy="155" rx="120" ry="18" fill="#1C0F27" />
    {[60, 100, 140, 180, 220].map((x, i) => (
      <g key={i} transform={`translate(${x}, 145)`}>
        <ellipse cx="0" cy="6" rx="10" ry="4" fill="#C2410C" />
        <path d="M0 -7 C3 -1 4 2 0 4 C-4 2 -3 -1 0 -7 Z" fill="#FACC15" />
        <circle cx="0" cy="0" r="1.5" fill="#FEF08A" />
      </g>
    ))}
  </svg>
);

// Hero Slide Banners
export const ZeroFeeTicketArt: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="160" cy="120" r="95" fill="#1D5B8F" />
    <g transform="translate(75, 55) rotate(-14 85 65)">
      <rect x="0" y="0" width="170" height="85" rx="8" fill="#FFF2D6" />
      <circle cx="0" cy="42" r="12" fill="#1D5B8F" />
      <circle cx="170" cy="42" r="12" fill="#1D5B8F" />
      <line x1="125" y1="5" x2="125" y2="80" stroke="#E2C99A" strokeWidth="2" strokeDasharray="4 4" />
      <text x="35" y="55" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="800" fontSize="38" fill="#1A4971">₹0</text>
      <text x="135" y="48" fontFamily="'Plus Jakarta Sans', sans-serif" fontWeight="700" fontSize="12" fill="#8A6828" letterSpacing="1">FEE</text>
    </g>
  </svg>
);

export const BhojanaluMealArt: React.FC<{ className?: string }> = ({ className = "w-full h-full" }) => (
  <svg viewBox="0 0 320 240" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="160" cy="120" r="95" fill="#1B4D24" />
    <line x1="160" y1="40" x2="160" y2="55" stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <line x1="220" y1="75" x2="210" y2="85" stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <line x1="100" y1="75" x2="110" y2="85" stroke="#FFF" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
    <ellipse cx="160" cy="145" rx="75" ry="45" fill="#388E3C" />
    <ellipse cx="160" cy="145" rx="70" ry="40" fill="#4CAF50" />
    <line x1="90" y1="145" x2="230" y2="145" stroke="#2E7D32" strokeWidth="2" />
    <circle cx="125" cy="135" r="14" fill="#8D5524" />
    <ellipse cx="170" cy="130" rx="16" ry="11" fill="#F4B447" />
    <ellipse cx="185" cy="138" rx="15" ry="10" fill="#E8B54D" />
    <circle cx="160" cy="160" r="7" fill="#E65100" />
    <circle cx="175" cy="155" r="6" fill="#D84315" />
  </svg>
);

// Comprehensive Pooja Illustration Matcher
export const getPoojaIllustration = (title?: string, type?: string, className: string = "w-full h-full") => {
  const t = (title || '').toLowerCase();
  if (t.includes('aksharabhyasam') || t.includes('akshara')) return <AksharabhyasamIllustration className={className} />;
  if (t.includes('annaprasana')) return <AnnaprasanaIllustration className={className} />;
  if (t.includes('namakaranam')) return <NamakaranamIllustration className={className} />;
  if (t.includes('upanayanam')) return <UpanayanamIllustration className={className} />;
  if (t.includes('shashti') || t.includes('60th')) return <ShashtipoorthiIllustration className={className} />;
  if (t.includes('rudra')) return <RudrabhishekamIllustration className={className} />;
  if (t.includes('varalakshmi')) return <VaralakshmiIllustration className={className} />;
  if (t.includes('satyanarayana') || t.includes('vratham')) return <SatyanarayanaIllustration className={className} />;
  if (t.includes('navagraha')) return <NavagrahaIllustration className={className} />;
  if (t.includes('chandi')) return <ChandiPoojaIllustration className={className} />;
  if (t.includes('sudarshana')) return <SudarshanaIllustration className={className} />;
  if (t.includes('ganapathi homam') || t.includes('homam')) return <HomamIllustration className={className} />;
  if (t.includes('vastu')) return <VastuIllustration className={className} />;
  if (t.includes('bhoomi')) return <BhoomiIllustration className={className} />;
  if (t.includes('abdikam') || t.includes('pitru') || t.includes('shraddha')) return <AbdikamIllustration className={className} />;
  if (t.includes('vinayaka') || t.includes('chavithi') || t.includes('ganesha')) return <VinayakaChavithiIllustration className={className} />;
  if (t.includes('office') || t.includes('opening')) return <OfficeOpeningIllustration className={className} />;
  if (t.includes('vahana') || t.includes('vehicle')) return <VahanaPoojaIllustration className={className} />;
  if (t.includes('deepavali') || t.includes('diwali') || t.includes('lakshmi pooja')) return <DeepavaliArt className={className} />;
  if (t.includes('gruha') || t.includes('house')) return <HouseIllustration className={className} />;
  
  switch (type) {
    case 'vastu': return <VastuIllustration className={className} />;
    case 'bhoomi': return <BhoomiIllustration className={className} />;
    case 'namakaranam': return <NamakaranamIllustration className={className} />;
    case 'annaprasana': return <AnnaprasanaIllustration className={className} />;
    case 'aksharabhyasam': return <AksharabhyasamIllustration className={className} />;
    case 'upanayanam': return <UpanayanamIllustration className={className} />;
    case 'satyanarayana': return <SatyanarayanaIllustration className={className} />;
    case 'homam': return <HomamIllustration className={className} />;
    case 'abdikam': return <AbdikamIllustration className={className} />;
    default: return <HouseIllustration className={className} />;
  }
};

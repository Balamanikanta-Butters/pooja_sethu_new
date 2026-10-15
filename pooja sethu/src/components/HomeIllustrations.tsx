import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Rect, Circle, Polygon, G, Line, Defs, LinearGradient, Stop, Ellipse, Text as SvgText } from 'react-native-svg';

interface IllustrationProps {
  type?: string;
  width?: number | string;
  height?: number;
}

/**
 * 2-Column Pooja Card Top Illustration matching the uploaded models
 */
export function PoojaCardIllustration({ type = 'gruhapravesam', width = '100%', height = 110 }: IllustrationProps) {
  const norm = String(type).toLowerCase();

  // 1. Vastu Shanti
  if (norm.includes('vastu')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FCECD6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FCECD6" />
              <Stop offset="100%" stopColor="#F5DDBE" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgGrad)" />
          <Line x1="10" y1="92" x2="150" y2="92" stroke="#DFBF95" strokeWidth="2" strokeLinecap="round" />
          <Path d="M 24 88 Q 30 94 36 88 Z" fill="#D49A3D" />
          <Path d="M 30 87 Q 31 80 30 78 Q 29 80 30 87 Z" fill="#F39C12" />
          <Path d="M 124 88 Q 130 94 136 88 Z" fill="#D49A3D" />
          <Path d="M 130 87 Q 131 80 130 78 Q 129 80 130 87 Z" fill="#F39C12" />
          <Polygon points="80,18 73,30 87,30" fill="#9E2A2B" />
          <Polygon points="80,86 73,74 87,74" fill="#9E2A2B" />
          <Polygon points="46,52 58,45 58,59" fill="#9E2A2B" />
          <Polygon points="114,52 102,45 102,59" fill="#9E2A2B" />
          <Polygon points="58,30 63,33 60,37" fill="#9E2A2B" />
          <Polygon points="102,30 97,33 100,37" fill="#9E2A2B" />
          <Polygon points="58,74 63,71 60,67" fill="#9E2A2B" />
          <Polygon points="102,74 97,71 100,67" fill="#9E2A2B" />
          <Rect x="58" y="30" width="44" height="44" fill="#FFFDF9" stroke="#9E2A2B" strokeWidth="2.5" rx="2" />
          <Line x1="72.6" y1="30" x2="72.6" y2="74" stroke="#9E2A2B" strokeWidth="1.5" />
          <Line x1="87.3" y1="30" x2="87.3" y2="74" stroke="#9E2A2B" strokeWidth="1.5" />
          <Line x1="58" y1="44.6" x2="102" y2="44.6" stroke="#9E2A2B" strokeWidth="1.5" />
          <Line x1="58" y1="59.3" x2="102" y2="59.3" stroke="#9E2A2B" strokeWidth="1.5" />
          <Circle cx="80" cy="52" r="4" fill="#9E2A2B" />
        </Svg>
      </View>
    );
  }

  // 2. Bhoomi Pooja
  if (norm.includes('bhoomi')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FCECD6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgBhoomi" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FCECD6" />
              <Stop offset="100%" stopColor="#F5DDBE" />
            </LinearGradient>
            <LinearGradient id="earthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#9C6634" />
              <Stop offset="100%" stopColor="#7A4B1F" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgBhoomi)" />
          <Rect x="0" y="86" width="160" height="24" fill="#DFBE92" />
          <Path d="M 28 86 Q 80 48 132 86 Z" fill="url(#earthGrad)" />
          <Rect x="36" y="74" width="22" height="7" rx="1.5" fill="#B85338" stroke="#8C351F" strokeWidth="1" />
          <Rect x="34" y="81" width="24" height="7" rx="1.5" fill="#C25A3F" stroke="#8C351F" strokeWidth="1" />
          <Line x1="108" y1="50" x2="132" y2="84" stroke="#8C6239" strokeWidth="4" strokeLinecap="round" />
          <Polygon points="128,78 138,82 131,90 123,85" fill="#7F8C8D" />
          <Path d="M 80 62 Q 81 44 80 34" stroke="#469B4B" strokeWidth="3" strokeLinecap="round" fill="none" />
          <Path d="M 80 44 Q 66 38 68 46 Q 74 48 80 44 Z" fill="#469B4B" />
          <Path d="M 80 40 Q 94 34 92 42 Q 86 44 80 40 Z" fill="#58B25D" />
        </Svg>
      </View>
    );
  }

  // 3. Varalakshmi Vratham (Kalash on pink lotus petals with garland)
  if (norm.includes('varalakshmi')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#EBF6EC', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgVara" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F1F9F0" />
              <Stop offset="100%" stopColor="#D9ECD7" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgVara)" />
          {/* Ground strip */}
          <Rect x="0" y="88" width="160" height="22" fill="#B8DCB5" />
          {/* Festive Garland Draped above */}
          <Path d="M 16 32 Q 80 48 144 32" stroke="#E5A93C" strokeWidth="1.5" strokeDasharray="3,3" fill="none" />
          {/* Pink Lotus Petals at base of Kalash */}
          <Path d="M 80 82 Q 54 82 46 68 Q 62 70 80 82 Z" fill="#F48FB1" />
          <Path d="M 80 82 Q 106 82 114 68 Q 98 70 80 82 Z" fill="#F48FB1" />
          <Path d="M 80 82 Q 68 56 80 52 Q 92 56 80 82 Z" fill="#F06292" />
          {/* Golden Kalash Pot */}
          <Path d="M 70 46 Q 64 62 80 64 Q 96 62 90 46 Z" fill="#E5A93C" />
          <Rect x="73" y="43" width="14" height="3.5" fill="#F4BA4E" rx="1" />
          <Polygon points="72,43 80,32 76,43" fill="#3D7B48" />
          <Polygon points="88,43 80,32 84,43" fill="#3D7B48" />
          <Polygon points="76,43 80,28 84,43" fill="#4CAF50" />
          <Circle cx="80" cy="36" r="5" fill="#8C582B" />
          {/* Small twin diyas on sides */}
          <Path d="M 28 86 Q 32 90 36 86 Z" fill="#E5A93C" />
          <Path d="M 32 85 Q 33 81 32 80 Z" fill="#FF7A00" />
          <Path d="M 124 86 Q 128 90 132 86 Z" fill="#E5A93C" />
          <Path d="M 128 85 Q 129 81 128 80 Z" fill="#FF7A00" />
        </Svg>
      </View>
    );
  }

  // 4. Rudrabhishekam (Shiva Lingam with water pot dripping)
  if (norm.includes('rudra') || norm.includes('abhishekam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#E9F5EB', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgRudra" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F2F9F3" />
              <Stop offset="100%" stopColor="#D9ECE0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgRudra)" />
          {/* Green grass floor */}
          <Rect x="0" y="86" width="160" height="24" fill="#9BC4A1" />
          {/* Bilva leaf bushes */}
          <Polygon points="40,86 46,74 52,86" fill="#3D7B48" />
          <Polygon points="118,86 124,76 130,86" fill="#3D7B48" />
          {/* Shiva Peetham (Yoni base) */}
          <Polygon points="44,86 116,86 104,76 56,76" fill="#4B5563" />
          {/* Shiva Lingam */}
          <Path d="M 70 76 Q 70 54 80 54 Q 90 54 90 76 Z" fill="#1F2937" />
          {/* Tripundra White Marks */}
          <Line x1="75" y1="62" x2="85" y2="62" stroke="#FFFFFF" strokeWidth="1.5" />
          <Line x1="75" y1="65" x2="85" y2="65" stroke="#FFFFFF" strokeWidth="1.5" />
          <Circle cx="80" cy="63.5" r="1.5" fill="#DC2626" />
          {/* Suspended Abhishekam Copper Pot */}
          <G transform="translate(86, 18) rotate(30 18 18)">
            <Path d="M 8 8 Q 2 22 18 24 Q 34 22 28 8 Z" fill="#B45309" />
            <Circle cx="18" cy="6" r="4" fill="#D97706" />
          </G>
          {/* Stream of milk/water falling on Lingam */}
          <Path d="M 94 38 Q 86 46 80 54" stroke="#93C5FD" strokeWidth="2.5" fill="none" strokeDasharray="4,2" />
        </Svg>
      </View>
    );
  }

  // 5. Satyanarayana Vratham
  if (norm.includes('satyanarayana')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#E9F4E7', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgSatya" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#EFF7ED" />
              <Stop offset="100%" stopColor="#DCEDD9" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgSatya)" />
          <Path d="M 12 94 Q 30 18 36 94 Z" fill="#4B954D" />
          <Path d="M 148 94 Q 130 18 124 94 Z" fill="#4B954D" />
          <Rect x="44" y="80" width="72" height="14" fill="#D3923F" rx="2" />
          <Path d="M 68 62 Q 62 76 80 78 Q 98 76 92 62 Z" fill="#E5A93C" />
          <Rect x="72" y="59" width="16" height="4" fill="#F4BA4E" rx="1" />
          <Polygon points="70,59 80,48 76,59" fill="#4B954D" />
          <Polygon points="90,59 80,48 84,59" fill="#4B954D" />
          <Polygon points="75,59 80,44 85,59" fill="#5DB15F" />
          <Circle cx="80" cy="52" r="6" fill="#8B5328" />
          <Path d="M 112 80 Q 116 84 120 80 Z" fill="#E5A93C" />
          <Path d="M 116 79 Q 117 76 116 75 Z" fill="#FF7A00" />
        </Svg>
      </View>
    );
  }

  // 6. Navagraha Homam (Flames with 9 colored planetary dots)
  if (norm.includes('navagraha')) {
    const planets = [
      { cx: 34, cy: 46, color: '#F87171' }, // Mars/Sun (Red/Pink)
      { cx: 46, cy: 36, color: '#FB923C' }, // Sun (Orange)
      { cx: 60, cy: 30, color: '#4ADE80' }, // Mercury (Green)
      { cx: 76, cy: 26, color: '#FDE047' }, // Jupiter (Yellow)
      { cx: 92, cy: 26, color: '#FFFFFF' }, // Venus (White)
      { cx: 108, cy: 30, color: '#38BDF8' }, // Saturn (Blue)
      { cx: 122, cy: 36, color: '#818CF8' }, // Rahu (Purple)
      { cx: 134, cy: 46, color: '#94A3B8' }, // Ketu (Grey)
    ];
    return (
      <View style={{ width: '100%', height, backgroundColor: '#532128', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgNava" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4A1C22" />
              <Stop offset="100%" stopColor="#6C2832" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgNava)" />
          {/* Arch of 9 planetary dots */}
          {planets.map((p, i) => (
            <Circle key={i} cx={p.cx} cy={p.cy} r="4" fill={p.color} />
          ))}
          {/* Homam Kundam */}
          <Rect x="44" y="82" width="72" height="8" fill="#8C351F" rx="1" />
          <Rect x="50" y="74" width="60" height="8" fill="#9C3C24" rx="1" />
          <Rect x="56" y="66" width="48" height="8" fill="#B3462A" rx="1" />
          {/* Holy Agni Flames */}
          <Path d="M 80 42 Q 92 56 86 66 Q 74 66 68 56 Q 74 48 80 42 Z" fill="#F39C12" />
          <Path d="M 80 48 Q 86 58 84 66 Q 76 66 74 58 Z" fill="#F1C40F" />
        </Svg>
      </View>
    );
  }

  // 7. Sudarshana Homam (Flames with glowing Sudarshana Chakra wheel)
  if (norm.includes('sudarshana')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#532128', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgSudar" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4A1C22" />
              <Stop offset="100%" stopColor="#6C2832" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgSudar)" />
          {/* Golden Sudarshana Chakra Wheel in background */}
          <Circle cx="80" cy="46" r="26" stroke="#F59E0B" strokeWidth="3" fill="#78350F" opacity={0.6} />
          <Circle cx="80" cy="46" r="22" stroke="#FBBF24" strokeWidth="1.5" fill="none" />
          {/* 8 Wheel Spokes */}
          <Line x1="80" y1="24" x2="80" y2="68" stroke="#FBBF24" strokeWidth="1.5" />
          <Line x1="58" y1="46" x2="102" y2="46" stroke="#FBBF24" strokeWidth="1.5" />
          <Line x1="64" y1="30" x2="96" y2="62" stroke="#FBBF24" strokeWidth="1.5" />
          <Line x1="96" y1="30" x2="64" y2="62" stroke="#FBBF24" strokeWidth="1.5" />
          <Circle cx="80" cy="46" r="6" fill="#F59E0B" />
          {/* Kundam base */}
          <Rect x="44" y="82" width="72" height="8" fill="#8C351F" rx="1" />
          <Rect x="50" y="74" width="60" height="8" fill="#9C3C24" rx="1" />
          <Rect x="56" y="66" width="48" height="8" fill="#B3462A" rx="1" />
          {/* Holy Agni Flames in front */}
          <Path d="M 80 44 Q 92 56 86 66 Q 74 66 68 56 Q 74 48 80 44 Z" fill="#F39C12" />
          <Path d="M 80 50 Q 86 58 84 66 Q 76 66 74 58 Z" fill="#F1C40F" />
        </Svg>
      </View>
    );
  }

  // 8. Ganapathi Homam / General Homam
  if (norm.includes('ganapathi') || norm.includes('homam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#532128', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgHomam" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4A1C22" />
              <Stop offset="100%" stopColor="#6C2832" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgHomam)" />
          <Rect x="44" y="82" width="72" height="8" fill="#8C351F" rx="1" />
          <Rect x="50" y="74" width="60" height="8" fill="#9C3C24" rx="1" />
          <Rect x="56" y="66" width="48" height="8" fill="#B3462A" rx="1" />
          <Path d="M 80 28 Q 94 48 86 66 Q 74 66 66 48 Q 74 38 80 28 Z" fill="#F39C12" />
          <Path d="M 80 38 Q 88 52 84 66 Q 76 66 72 52 Z" fill="#F1C40F" />
          <Line x1="124" y1="48" x2="106" y2="76" stroke="#D3A270" strokeWidth="3" strokeLinecap="round" />
          <Circle cx="36" cy="80" r="4" fill="#FAF0D7" />
          <Circle cx="30" cy="81" r="3.5" fill="#FAF0D7" />
          <Circle cx="33" cy="76" r="3.5" fill="#FAF0D7" />
        </Svg>
      </View>
    );
  }

  // 9. Abdikam / River offering (Pitru Karyams)
  if (norm.includes('abdikam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#E3ECF5', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgAbdikam" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#E2EBF2" />
              <Stop offset="100%" stopColor="#D4E3ED" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgAbdikam)" />
          {/* Faint pale sun in sky on left */}
          <Circle cx="36" cy="34" r="14" fill="#FCEBD6" />
          {/* River Water band */}
          <Path d="M 0 54 Q 80 48 160 54 L 160 110 L 0 110 Z" fill="#588EA9" />
          {/* Green Grass blades on left */}
          <Line x1="18" y1="74" x2="14" y2="52" stroke="#68A54E" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="23" y1="76" x2="23" y2="48" stroke="#5E9447" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="28" y1="74" x2="33" y2="52" stroke="#68A54E" strokeWidth="2.5" strokeLinecap="round" />
          {/* Green leaf mound in center */}
          <Path d="M 44 70 Q 80 58 116 70 Q 80 77 44 70 Z" fill="#4C853F" />
          {/* 3 white pinda balls with dark sesame dots */}
          <Circle cx="62" cy="64" r="5.5" fill="#FFFFFF" />
          <Circle cx="60" cy="63" r="1" fill="#1F1A18" />
          <Circle cx="63" cy="64" r="1" fill="#1F1A18" />
          <Circle cx="76" cy="63" r="5.5" fill="#FFFFFF" />
          <Circle cx="74" cy="62" r="1" fill="#1F1A18" />
          <Circle cx="77" cy="63" r="1" fill="#1F1A18" />
          <Circle cx="90" cy="64" r="5.5" fill="#FFFFFF" />
          <Circle cx="88" cy="63" r="1" fill="#1F1A18" />
          <Circle cx="91" cy="64" r="1" fill="#1F1A18" />
          {/* Terracotta Pot on right */}
          <Path d="M 124 58 Q 116 74 132 78 Q 148 74 140 58 Z" fill="#B36437" />
          <Rect x="127" y="56" width="10" height="3" rx="1" fill="#9F532A" />
        </Svg>
      </View>
    );
  }

  // Devi Navaratri Chandi Pooja (Trident rising from Pink Lotus with Diyas)
  if (norm.includes('chandi') || norm.includes('devi navaratri')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#2C1B33', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgChandi" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#2E1C37" />
              <Stop offset="100%" stopColor="#43224B" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgChandi)" />
          {/* Glowing Aura behind Trident */}
          <Circle cx="80" cy="46" r="28" fill="#FCE5A4" opacity={0.15} />
          {/* Bottom shelf line */}
          <Line x1="12" y1="92" x2="148" y2="92" stroke="#54295D" strokeWidth="2" strokeLinecap="round" />
          {/* 7 small Diya flames along bottom line */}
          {[28, 45, 62, 80, 98, 115, 132].map((x, i) => (
            <G key={i}>
              <Path d={`M ${x - 4} 92 Q ${x} 96 ${x + 4} 92 Z`} fill="#B87333" />
              <Path d={`M ${x} 91 Q ${x + 1.5} 87 ${x} 85 Q ${x - 1.5} 87 ${x} 91 Z`} fill="#F5B041" />
            </G>
          ))}
          {/* Pink Lotus Blossom at base */}
          <Path d="M 80 88 C 66 84 56 70 80 88 Z" fill="#E8597E" />
          <Path d="M 80 88 C 94 84 104 70 80 88 Z" fill="#E8597E" />
          <Path d="M 68 86 C 58 76 68 66 80 86 Z" fill="#F06292" />
          <Path d="M 92 86 C 102 76 92 66 80 86 Z" fill="#F06292" />
          <Path d="M 80 88 C 72 74 76 64 80 62 C 84 64 88 74 80 88 Z" fill="#F48FB1" />
          {/* Golden Trishulam / Trident */}
          <Line x1="80" y1="20" x2="80" y2="76" stroke="#F5C451" strokeWidth="3" strokeLinecap="round" />
          <Polygon points="80,16 76,24 84,24" fill="#F5C451" />
          {/* Left Prongs */}
          <Path d="M 80 54 C 60 54 60 28 64 24 C 63 34 72 46 80 48" fill="none" stroke="#F5C451" strokeWidth="2.8" strokeLinecap="round" />
          {/* Right Prongs */}
          <Path d="M 80 54 C 100 54 100 28 96 24 C 97 34 88 46 80 48" fill="none" stroke="#F5C451" strokeWidth="2.8" strokeLinecap="round" />
        </Svg>
      </View>
    );
  }

  // Deepavali Lakshmi Pooja (Hanging Kandil Lantern, Rangoli, Diyas)
  if (norm.includes('deepavali') || norm.includes('lakshmi')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#26183B', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgDeepavali" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#25163A" />
              <Stop offset="100%" stopColor="#3B1C52" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgDeepavali)" />
          {/* Warm center light glow */}
          <Circle cx="80" cy="56" r="32" fill="#E89F43" opacity={0.25} />
          {/* Hanging Kandil (Lantern) at top right */}
          <Line x1="126" y1="0" x2="126" y2="18" stroke="#D97706" strokeWidth="1" />
          <Polygon points="126,18 134,26 126,34 118,26" fill="#E87428" />
          <Polygon points="126,20 131,26 126,32 121,26" fill="#FBBF24" />
          <Line x1="122" y1="34" x2="120" y2="40" stroke="#FBBF24" strokeWidth="1" />
          <Line x1="126" y1="34" x2="126" y2="42" stroke="#FBBF24" strokeWidth="1" />
          <Line x1="130" y1="34" x2="132" y2="40" stroke="#FBBF24" strokeWidth="1" />
          {/* Rangoli Floral Petals radiating at bottom */}
          {[
            { cx: 52, cy: 82, fill: '#6EE7B7' },
            { cx: 62, cy: 76, fill: '#F472B6' },
            { cx: 74, cy: 72, fill: '#FDE047' },
            { cx: 86, cy: 72, fill: '#FDE047' },
            { cx: 98, cy: 76, fill: '#F472B6' },
            { cx: 108, cy: 82, fill: '#6EE7B7' },
          ].map((pt, i) => (
            <Circle key={i} cx={pt.cx} cy={pt.cy} r="4.5" fill={pt.fill} />
          ))}
          <Path d="M 44 88 Q 80 74 116 88 Z" fill="#2E1C44" />
          {/* 3 Clay Diyas */}
          <Path d="M 28 84 Q 34 89 40 84 Z" fill="#C26A38" />
          <Path d="M 34 83 Q 36 78 34 76 Q 32 78 34 83 Z" fill="#FBBF24" />
          <Path d="M 74 86 Q 80 91 86 86 Z" fill="#C26A38" />
          <Path d="M 80 85 Q 82 80 80 78 Q 78 80 80 85 Z" fill="#FBBF24" />
          <Path d="M 120 84 Q 126 89 132 84 Z" fill="#C26A38" />
          <Path d="M 126 83 Q 128 78 126 76 Q 124 78 126 83 Z" fill="#FBBF24" />
        </Svg>
      </View>
    );
  }

  // Vinayaka Chavithi Pooja (Temple Umbrella, Modaks on Peetham, Garika grass)
  if (norm.includes('vinayaka') || norm.includes('chavithi') || norm.includes('ganesha')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#26183B', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgVinayaka" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#25163A" />
              <Stop offset="100%" stopColor="#3C1A52" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgVinayaka)" />
          {/* Garika grass blades on left */}
          <Line x1="28" y1="84" x2="22" y2="68" stroke="#489945" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="33" y1="84" x2="33" y2="64" stroke="#5CB85A" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="38" y1="84" x2="43" y2="68" stroke="#489945" strokeWidth="2.5" strokeLinecap="round" />
          {/* Garika grass blades on right */}
          <Line x1="122" y1="84" x2="117" y2="68" stroke="#489945" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="127" y1="84" x2="127" y2="64" stroke="#5CB85A" strokeWidth="2.5" strokeLinecap="round" />
          <Line x1="132" y1="84" x2="138" y2="68" stroke="#489945" strokeWidth="2.5" strokeLinecap="round" />
          {/* Orange Umbrella (Chhatra) Canopy */}
          <Polygon points="80,26 48,46 112,46" fill="#E86E2F" />
          <Line x1="80" y1="26" x2="80" y2="20" stroke="#E86E2F" strokeWidth="2.5" strokeLinecap="round" />
          <Circle cx="80" cy="20" r="2" fill="#FBBF24" />
          {/* Wooden Peetham / Boat-like Chowki */}
          <Path d="M 46 84 Q 80 88 114 84 L 118 80 L 42 80 Z" fill="#9C4A26" />
          {/* Modaks pyramid (white rounded sweets) */}
          <Circle cx="64" cy="74" r="5" fill="#FAF5E8" />
          <Circle cx="74" cy="74" r="5" fill="#FAF5E8" />
          <Circle cx="86" cy="74" r="5" fill="#FAF5E8" />
          <Circle cx="96" cy="74" r="5" fill="#FAF5E8" />
          <Circle cx="69" cy="66" r="5" fill="#FFFDF8" />
          <Circle cx="80" cy="65" r="5.5" fill="#FFFDF8" />
          <Circle cx="91" cy="66" r="5" fill="#FFFDF8" />
          <Circle cx="75" cy="58" r="5" fill="#FFFFFF" />
          <Circle cx="85" cy="58" r="5" fill="#FFFFFF" />
          <Circle cx="80" cy="51" r="5" fill="#FFFFFF" />
          <Path d="M 80 47 Q 80 44 80 43" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
        </Svg>
      </View>
    );
  }

  // Office opening Pooja (Shop entrance, green awning, yellow ribbon & bow, kalash)
  if (norm.includes('office')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#D8EDE9', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgOffice" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#CCEBE6" />
              <Stop offset="100%" stopColor="#DDF3F0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgOffice)" />
          {/* Ground line */}
          <Line x1="10" y1="88" x2="150" y2="88" stroke="#A7C7C0" strokeWidth="2" />
          {/* Office Building Front */}
          <Rect x="42" y="38" width="76" height="50" fill="#FFFFFF" stroke="#D1E5E1" strokeWidth="1" rx="2" />
          {/* Glass Doors / Windows */}
          <Rect x="48" y="48" width="30" height="40" fill="#F0F7F6" stroke="#C4DDD8" strokeWidth="1" />
          <Rect x="82" y="48" width="30" height="40" fill="#F0F7F6" stroke="#C4DDD8" strokeWidth="1" />
          {/* Green Awning / Roof */}
          <Polygon points="36,38 124,38 120,30 40,30" fill="#1E6756" />
          <Rect x="38" y="38" width="84" height="6" fill="#247865" rx="1" />
          {/* Green Thoranam (Mango leaves hanging along awning) */}
          {[42, 48, 54, 60, 66, 72, 78, 84, 90, 96, 102, 108, 114, 118].map((x, i) => (
            <Polygon key={i} points={`${x},44 ${x + 2},49 ${x + 4},44`} fill="#4E994E" />
          ))}
          {/* Yellow Ribbon with bow tied across entrance */}
          <Line x1="42" y1="64" x2="118" y2="64" stroke="#F5A623" strokeWidth="3" />
          <Circle cx="80" cy="64" r="3.5" fill="#D97706" />
          <Path d="M 77 64 Q 72 58 75 64 Q 72 70 77 64 Z" fill="#F5A623" />
          <Path d="M 83 64 Q 88 58 85 64 Q 88 70 83 64 Z" fill="#F5A623" />
          <Line x1="78" y1="65" x2="73" y2="72" stroke="#F5A623" strokeWidth="2" />
          <Line x1="82" y1="65" x2="87" y2="72" stroke="#F5A623" strokeWidth="2" />
          {/* Kalash on floor on right */}
          <G transform="translate(120, 68)">
            <Path d="M 4 14 Q 0 20 8 22 Q 16 22 24 20 Q 28 14 24 14 Z" fill="#C97A3E" stroke="#A65F2B" strokeWidth="1" />
            <Rect x="9" y="12" width="10" height="3" fill="#DDA052" rx="1" />
            <Polygon points="6,12 14,3 12,12" fill="#469B4B" />
            <Polygon points="22,12 14,3 16,12" fill="#469B4B" />
            <Polygon points="10,12 14,0 18,12" fill="#58B25D" />
            <Circle cx="14" cy="7" r="4.5" fill="#78350F" />
          </G>
        </Svg>
      </View>
    );
  }

  // Vahana Pooja (Red car with yellow marigold garland and lemons)
  if (norm.includes('vahana') || norm.includes('vehicle')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#D8EDE9', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Defs>
            <LinearGradient id="bgVahana" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#CCEBE6" />
              <Stop offset="100%" stopColor="#DDF3F0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="160" height="110" fill="url(#bgVahana)" />
          {/* Road line */}
          <Line x1="10" y1="88" x2="150" y2="88" stroke="#A7C7C0" strokeWidth="2" />
          {/* Red Car Body */}
          <Path d="M 48 54 L 62 40 L 102 40 L 118 54 Z" fill="#C93B3B" />
          {/* Windows */}
          <Polygon points="63,42 78,42 78,52 52,52" fill="#BCE3F2" />
          <Polygon points="82,42 100,42 113,52 82,52" fill="#BCE3F2" />
          {/* Main Car Lower Body */}
          <Path d="M 34 54 L 126 54 Q 134 54 134 64 L 134 72 L 26 72 L 26 64 Q 26 54 34 54 Z" fill="#C93B3B" />
          {/* Headlight & Taillight */}
          <Rect x="131" y="58" width="3" height="6" fill="#FDE047" rx="1" />
          <Rect x="26" y="58" width="3" height="6" fill="#EF4444" rx="1" />
          {/* Tires (with wheels) */}
          <Circle cx="50" cy="74" r="10" fill="#2D3136" />
          <Circle cx="50" cy="74" r="5" fill="#88929A" />
          <Circle cx="110" cy="74" r="10" fill="#2D3136" />
          <Circle cx="110" cy="74" r="5" fill="#88929A" />
          {/* Lemons under tires */}
          <Circle cx="44" cy="85" r="3.5" fill="#FACC15" />
          <Circle cx="116" cy="85" r="3.5" fill="#FACC15" />
          {/* Marigold Garland draped across roof & hood */}
          {[46, 54, 62, 70, 78, 86, 94, 102, 110, 118].map((x, i) => (
            <Circle key={i} cx={x} cy={i > 0 && i < 8 ? 39 : 45} r="3" fill="#F59E0B" stroke="#D97706" strokeWidth="0.5" />
          ))}
        </Svg>
      </View>
    );
  }

  // 10. Namakaranam (Cradle with Baby)
  if (norm.includes('namakaranam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FBE8E6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Rect x="0" y="0" width="160" height="110" fill="#FBE8E6" />
          <Line x1="42" y1="20" x2="48" y2="48" stroke="#B88A58" strokeWidth="1.5" />
          <Line x1="118" y1="20" x2="112" y2="48" stroke="#B88A58" strokeWidth="1.5" />
          <Circle cx="48" cy="46" r="3" fill="#F39C12" />
          <Circle cx="60" cy="46" r="3" fill="#F39C12" />
          <Circle cx="72" cy="46" r="3" fill="#F39C12" />
          <Circle cx="84" cy="46" r="3" fill="#F39C12" />
          <Circle cx="96" cy="46" r="3" fill="#F39C12" />
          <Circle cx="108" cy="46" r="3" fill="#F39C12" />
          <Circle cx="112" cy="46" r="3" fill="#F39C12" />
          <Path d="M 44 48 Q 42 78 80 82 Q 118 78 116 48 Z" fill="#FFFFFF" stroke="#8C351F" strokeWidth="2" />
          <Circle cx="62" cy="62" r="7" fill="#F7D4B6" />
          <Path d="M 32 88 Q 36 92 40 88 Z" fill="#D49A3D" />
          <Path d="M 120 88 Q 124 92 128 88 Z" fill="#D49A3D" />
        </Svg>
      </View>
    );
  }

  // 11. Annaprasana
  if (norm.includes('annaprasana')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FBE8E6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Rect x="0" y="0" width="160" height="110" fill="#FBE8E6" />
          <Path d="M 28 84 Q 38 68 44 84 Z" fill="#58B25D" />
          <Path d="M 116 84 Q 122 68 132 84 Z" fill="#58B25D" />
          <Path d="M 44 60 Q 48 88 80 88 Q 112 88 116 60 Z" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          <Path d="M 46 62 Q 80 66 114 62 Z" fill="#FFFDF5" />
          <Circle cx="72" cy="64" r="1.5" fill="#B91C1C" />
          <Circle cx="84" cy="64" r="1.5" fill="#B45309" />
          <Circle cx="78" cy="65" r="1.5" fill="#15803D" />
          <Line x1="120" y1="46" x2="98" y2="68" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
        </Svg>
      </View>
    );
  }

  // 12. Aksharabhyasam
  if (norm.includes('aksharabhyasam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FBE8E6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Rect x="0" y="0" width="160" height="110" fill="#FBE8E6" />
          <Rect x="90" y="42" width="46" height="36" fill="#334155" stroke="#78350F" strokeWidth="3" rx="2" />
          <Line x1="96" y1="52" x2="128" y2="52" stroke="#FFFFFF" strokeWidth="1.5" />
          <Line x1="96" y1="60" x2="124" y2="60" stroke="#FFFFFF" strokeWidth="1.5" />
          <Line x1="96" y1="68" x2="118" y2="68" stroke="#FFFFFF" strokeWidth="1.5" />
          <Path d="M 32 76 Q 74 62 116 76 Q 74 90 32 76 Z" fill="#FDE68A" stroke="#B45309" strokeWidth="2" />
          <Path d="M 64 74 Q 72 68 80 74 Q 84 76 80 80" stroke="#78350F" strokeWidth="2" fill="none" />
          <Path d="M 24 82 Q 28 86 32 82 Z" fill="#D49A3D" />
        </Svg>
      </View>
    );
  }

  // 13. Upanayanam
  if (norm.includes('upanayanam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FBE8E6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Rect x="0" y="0" width="160" height="110" fill="#FBE8E6" />
          <Line x1="120" y1="34" x2="120" y2="88" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />
          <Circle cx="120" cy="38" r="3" fill="#15803D" />
          <Path d="M 52 74 Q 48 86 60 88 Q 72 86 68 74 Z" fill="#B45309" />
          <Circle cx="60" cy="72" r="3" fill="#D97706" />
          <Circle cx="86" cy="46" r="11" fill="#E2C1A4" />
          <Path d="M 70 88 Q 86 66 102 88 Z" fill="#FFFDF7" />
          <Line x1="78" y1="68" x2="98" y2="84" stroke="#F59E0B" strokeWidth="2" />
        </Svg>
      </View>
    );
  }

  // 14. Shashtipoorthi
  if (norm.includes('shashti') || norm.includes('poorthi')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FBE8E6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width={160} height={height} viewBox="0 0 160 110">
          <Rect x="0" y="0" width="160" height="110" fill="#FBE8E6" />
          {/* Floral figure-8 Garland */}
          <Path d="M 44 48 C 24 32, 24 64, 44 48 C 64 32, 64 64, 44 48" stroke="#F59E0B" strokeWidth="4" fill="none" />
          <Path d="M 116 48 C 96 32, 96 64, 116 48 C 136 32, 136 64, 116 48" stroke="#F472B6" strokeWidth="4" fill="none" />
          {/* Kalash in center */}
          <Path d="M 72 44 Q 68 56 80 58 Q 92 56 88 44 Z" fill="#E5A93C" />
          <Circle cx="80" cy="38" r="5" fill="#8C582B" />
          {/* "60" Pill below */}
          <Rect x="44" y="74" width="72" height="22" rx="6" fill="#FCA5A5" opacity={0.6} />
          <SvgText x="80" y="90" fontSize="16" fontWeight="bold" fill="#991B1B" textAnchor="middle" fontFamily="sans-serif">
            60
          </SvgText>
        </Svg>
      </View>
    );
  }

  // Default: Gruhapravesam
  return (
    <View style={{ width: '100%', height, backgroundColor: '#FCECD6', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <Svg width={160} height={height} viewBox="0 0 160 110">
        <Defs>
          <LinearGradient id="bgGradGruha" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FCECD6" />
            <Stop offset="100%" stopColor="#F5DDBE" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="160" height="110" fill="url(#bgGradGruha)" />
        <Line x1="10" y1="92" x2="150" y2="92" stroke="#DFBF95" strokeWidth="2.5" strokeLinecap="round" />
        <Rect x="42" y="44" width="68" height="48" fill="#FFFDF8" stroke="#E6DAC8" strokeWidth="1" rx="2" />
        <Polygon points="36,44 76,20 116,44" fill="#9E2A2B" />
        <Rect x="50" y="54" width="12" height="12" fill="#FAD07A" stroke="#CBA14C" strokeWidth="1" rx="1.5" />
        <Rect x="70" y="50" width="22" height="42" fill="#FAD07A" stroke="#DDA83B" strokeWidth="1" />
        <Rect x="71" y="52" width="20" height="40" fill="#F7C85B" />
        <Path d="M 68 50 Q 81 54 94 50" stroke="#3D7B48" strokeWidth="2.5" fill="none" />
        <Polygon points="71,50 73,55 75,50" fill="#3D7B48" />
        <Polygon points="75,51 77,56 79,51" fill="#3D7B48" />
        <Polygon points="79,52 81,57 83,52" fill="#3D7B48" />
        <Polygon points="83,52 85,57 87,52" fill="#3D7B48" />
        <Polygon points="87,51 89,56 91,51" fill="#3D7B48" />
        <Polygon points="91,50 93,55 95,50" fill="#3D7B48" />
        <Path d="M 66 92 Q 81 87 96 92" stroke="#9E2A2B" strokeWidth="2" fill="none" />
        <G transform="translate(120, 70)">
          <Path d="M 4 14 Q 0 20 8 22 Q 16 22 24 20 Q 28 14 24 14 Z" fill="#D49A3D" stroke="#A6701B" strokeWidth="1" />
          <Rect x="9" y="12" width="10" height="3" fill="#E5AA45" rx="1" />
          <Polygon points="6,12 14,3 12,12" fill="#469B4B" />
          <Polygon points="22,12 14,3 16,12" fill="#469B4B" />
          <Polygon points="10,12 14,0 18,12" fill="#58B25D" />
          <Circle cx="14" cy="7" r="4.5" fill="#8C582B" />
        </G>
      </Svg>
    </View>
  );
}

/**
 * Mahalaya Amavasya Banner Card Illustration (Image 2 & 3)
 */
export function MahalayaIllustration({ width = 180, height = 110 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 180 110">
      <Rect x="0" y="0" width="180" height="74" fill="#1C2541" />
      <Circle cx="20" cy="18" r="1" fill="#FFFFFF" />
      <Circle cx="45" cy="30" r="1" fill="#FFFFFF" />
      <Circle cx="110" cy="22" r="1" fill="#FFFFFF" />
      <Circle cx="140" cy="26" r="16" stroke="#4F5D7E" strokeWidth="2.5" fill="none" />
      <Circle cx="140" cy="26" r="12" fill="#2E3856" />
      <Rect x="0" y="52" width="60" height="8" fill="#8D6B4F" />
      <Line x1="12" y1="52" x2="12" y2="48" stroke="#4A3B32" strokeWidth="2" />
      <G transform="translate(62, 28) rotate(-35 20 20)">
        <Path d="M 12 12 Q 6 28 24 30 Q 42 28 36 12 Z" fill="#B36237" />
        <Circle cx="24" cy="10" r="6" fill="#8F4822" />
      </G>
      <Path d="M 88 52 Q 84 62 86 74" stroke="#70C1B3" strokeWidth="3" fill="none" />
      <Rect x="0" y="68" width="180" height="42" fill="#2B597B" />
      <Path d="M 12 76 Q 22 73 32 76" stroke="#4A7C9D" strokeWidth="2" fill="none" />
      <Path d="M 64 80 Q 74 77 84 80" stroke="#4A7C9D" strokeWidth="2" fill="none" />
      <Path d="M 130 76 Q 140 73 150 76" stroke="#4A7C9D" strokeWidth="2" fill="none" />
      <Line x1="140" y1="74" x2="138" y2="60" stroke="#5E8C61" strokeWidth="2" />
      <Line x1="145" y1="74" x2="145" y2="56" stroke="#5E8C61" strokeWidth="2" />
      <Line x1="150" y1="74" x2="152" y2="58" stroke="#5E8C61" strokeWidth="2" />
      <Line x1="156" y1="74" x2="159" y2="62" stroke="#5E8C61" strokeWidth="2" />
    </Svg>
  );
}

/**
 * Devi Navaratri Festive Card Illustration (Image 2 & 3)
 */
export function DeviNavaratriFestivalIllustration({ width = 180, height = 110 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 180 110">
      <Rect x="0" y="0" width="180" height="110" fill="#5A1522" />
      <Path d="M 0 12 Q 90 28 180 12" stroke="#D97706" strokeWidth="2" fill="none" />
      {[10, 24, 38, 52, 66, 80, 94, 108, 122, 136, 150, 164].map((cx, i) => (
        <Circle key={i} cx={cx} cy={16 + (i > 2 && i < 10 ? 4 : 0)} r="4" fill="#F59E0B" />
      ))}
      <G transform="translate(138, 50)">
        <Path d="M 6 16 Q 0 28 14 30 Q 28 28 22 16 Z" fill="#FBBF24" />
        <Polygon points="4,16 14,6 12,16" fill="#22C55E" />
        <Polygon points="24,16 14,6 16,16" fill="#22C55E" />
        <Circle cx="14" cy="10" r="5" fill="#78350F" />
      </G>
      <Line x1="0" y1="88" x2="180" y2="88" stroke="#7E2231" strokeWidth="1.5" />
      {[36, 68, 100, 132].map((cx, i) => (
        <G key={i} transform={`translate(${cx - 8}, 74)`}>
          <Path d="M 2 10 Q 8 16 14 10 Z" fill="#F59E0B" />
          <Path d="M 8 9 Q 9 4 8 2 Q 7 4 8 9 Z" fill="#EF4444" />
        </G>
      ))}
    </Svg>
  );
}

/**
 * Deepavali Festive Card Illustration (Matching Image 1)
 */
export function DeepavaliFestivalIllustration({ width = 180, height = 110 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 180 110">
      <Rect x="0" y="0" width="180" height="110" fill="#2C1A42" />
      {/* Hanging Kandil Lantern at top left */}
      <Line x1="44" y1="0" x2="44" y2="16" stroke="#D97706" strokeWidth="1" />
      <Polygon points="44,16 54,26 44,36 34,26" fill="#E87428" />
      <Polygon points="44,18 50,26 44,34 38,26" fill="#FBBF24" />
      <Line x1="38" y1="36" x2="36" y2="44" stroke="#FBBF24" strokeWidth="1.2" />
      <Line x1="44" y1="36" x2="44" y2="46" stroke="#FBBF24" strokeWidth="1.2" />
      <Line x1="50" y1="36" x2="52" y2="44" stroke="#FBBF24" strokeWidth="1.2" />
      {/* Stars in Sky */}
      <Circle cx="120" cy="18" r="1" fill="#FFFFFF" />
      <Circle cx="154" cy="20" r="1.5" fill="#F472B6" />
      <Circle cx="128" cy="38" r="1" fill="#FDE047" />
      <Circle cx="140" cy="62" r="1.5" fill="#67E8F9" />
      {/* Starburst on right */}
      <Polygon points="150,38 152,34 154,38 158,40 154,42 152,46 150,42 146,40" fill="#FDE047" />
      {/* Center Semicircle Rangoli */}
      {[
        { cx: 72, cy: 92, fill: '#6EE7B7' },
        { cx: 80, cy: 84, fill: '#F472B6' },
        { cx: 90, cy: 78, fill: '#FDE047' },
        { cx: 100, cy: 84, fill: '#F472B6' },
        { cx: 108, cy: 92, fill: '#6EE7B7' },
      ].map((p, i) => (
        <Circle key={i} cx={p.cx} cy={p.cy} r="4.5" fill={p.fill} />
      ))}
      <Path d="M 62 100 Q 90 84 118 100 Z" fill="#3B1C52" />
      {/* 4 Clay Diyas at bottom */}
      {[24, 60, 120, 156].map((x, i) => (
        <G key={i}>
          <Path d={`M ${x - 5} 96 Q ${x} 101 ${x + 5} 96 Z`} fill="#B86B3E" />
          <Path d={`M ${x} 95 Q ${x + 2} 90 ${x} 86 Q ${x - 2} 90 ${x} 95 Z`} fill="#FDE047" />
        </G>
      ))}
    </Svg>
  );
}

/**
 * Karthika Pournami Festive Card Illustration
 */
export function KarthikaPournamiFestivalIllustration({ width = 180, height = 110 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 180 110">
      <Rect x="0" y="0" width="180" height="110" fill="#0D2137" />
      {/* Full Moon */}
      <Circle cx="135" cy="30" r="18" fill="#FFF8E7" />
      <Circle cx="135" cy="30" r="22" stroke="#FFF8E7" strokeWidth="1" strokeOpacity="0.3" fill="none" />
      {/* Stars */}
      <Circle cx="25" cy="18" r="1" fill="#FFFFFF" />
      <Circle cx="60" cy="24" r="1.5" fill="#FFE082" />
      <Circle cx="95" cy="15" r="1" fill="#FFFFFF" />
      {/* Sacred River Water Waves */}
      <Path d="M 0 85 Q 45 80 90 85 Q 135 90 180 85 L 180 110 L 0 110 Z" fill="#143452" />
      <Path d="M 0 95 Q 45 92 90 95 Q 135 98 180 95" stroke="#2E5C8A" strokeWidth="1.5" fill="none" />
      {/* Floating Diyas on water */}
      {[35, 75, 115, 150].map((x, i) => (
        <G key={i} transform={`translate(${x}, ${88 + (i % 2) * 4})`}>
          <Path d="M -8 4 Q 0 8 8 4 Z" fill="#D97706" />
          <Path d="M 0 3 Q 2 -3 0 -6 Q -2 -3 0 3 Z" fill="#FDE047" />
          <Circle cx="0" cy="5" r="1" fill="#FEF08A" />
        </G>
      ))}
      {/* Temple Gopuram Silhouette */}
      <Path d="M 30 85 L 36 50 L 44 50 L 50 85 Z" fill="#091829" />
      <Line x1="40" y1="46" x2="40" y2="50" stroke="#FFD54F" strokeWidth="1.5" />
      <Circle cx="40" cy="45" r="2" fill="#FFD54F" />
    </Svg>
  );
}

/**
 * Makara Sankranti Festive Card Illustration
 */
export function SankrantiFestivalIllustration({ width = 180, height = 110 }: { width?: number; height?: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 180 110">
      <Rect x="0" y="0" width="180" height="110" fill="#FFFBEB" />
      {/* Warm Sun with radiating rays */}
      <Circle cx="140" cy="30" r="16" fill="#F59E0B" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <Line
          key={i}
          x1={140 + Math.cos((angle * Math.PI) / 180) * 20}
          y1={30 + Math.sin((angle * Math.PI) / 180) * 20}
          x2={140 + Math.cos((angle * Math.PI) / 180) * 26}
          y2={30 + Math.sin((angle * Math.PI) / 180) * 26}
          stroke="#FBBF24"
          strokeWidth="1.5"
        />
      ))}
      {/* Flying Kites in Sky */}
      <G transform="translate(30, 22) rotate(15)">
        <Polygon points="0,-10 8,0 0,10 -8,0" fill="#EF4444" />
        <Polygon points="0,0 8,0 0,10" fill="#FBBF24" />
        <Path d="M 0 10 Q 5 18 2 24" stroke="#DC2626" strokeWidth="1" fill="none" />
      </G>
      <G transform="translate(75, 15) rotate(-20)">
        <Polygon points="0,-7 6,0 0,7 -6,0" fill="#10B981" />
        <Polygon points="0,0 6,0 0,7" fill="#3B82F6" />
        <Path d="M 0 7 Q -3 14 -1 18" stroke="#059669" strokeWidth="0.8" fill="none" />
      </G>
      {/* Sugarcane Stalks */}
      <Path d="M 68 110 Q 72 70 70 45" stroke="#15803D" strokeWidth="3.5" fill="none" />
      <Path d="M 112 110 Q 108 70 110 45" stroke="#15803D" strokeWidth="3.5" fill="none" />
      {/* Pongal Clay Pot with overflowing milk */}
      <G transform="translate(90, 85)">
        <Path d="M -18 10 Q -24 25 0 25 Q 24 25 18 10 Z" fill="#9A3412" />
        <Rect x="-12" y="8" width="24" height="4" fill="#C2410C" rx="1" />
        {/* Overflowing Froth */}
        <Path d="M -16 8 Q -10 0 0 2 Q 10 0 16 8 Q 8 6 0 6 Q -8 6 -16 8 Z" fill="#FFFFFF" />
        <Path d="M -6 8 Q -8 16 -6 20" stroke="#FFFFFF" strokeWidth="2.5" fill="none" />
      </G>
    </Svg>
  );
}

/**
 * Slide 1: Devi Navaratri Kalash & Diyas Medallion
 */
export function KalashDiyasMedallion({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="46" fill="#5E1420" opacity={0.6} />
      <Circle cx="50" cy="50" r="40" fill="#6A1826" />
      <Path d="M 36 50 Q 30 68 50 70 Q 70 68 64 50 Z" fill="#E5A93C" />
      <Rect x="42" y="47" width="16" height="4" fill="#F4BA4E" rx="1" />
      <Polygon points="38,47 50,30 46,47" fill="#4B954D" />
      <Polygon points="62,47 50,30 54,47" fill="#4B954D" />
      <Polygon points="44,47 50,26 56,47" fill="#5DB15F" />
      <Circle cx="50" cy="38" r="7" fill="#8B5328" />
      <Path d="M 46 76 Q 50 80 54 76 Z" fill="#F4BA4E" />
      <Path d="M 50 75 Q 51 71 50 70 Q 49 71 50 75 Z" fill="#FF7A00" />
      <Path d="M 28 72 Q 32 76 36 72 Z" fill="#F4BA4E" />
      <Path d="M 32 71 Q 33 67 32 66 Q 31 67 32 71 Z" fill="#FF7A00" />
      <Path d="M 64 72 Q 68 76 72 72 Z" fill="#F4BA4E" />
      <Path d="M 68 71 Q 69 67 68 66 Q 67 67 68 71 Z" fill="#FF7A00" />
    </Svg>
  );
}

/**
 * Slide 2: Bhojanalu Plate Medallion
 */
export function BhojanaluMedallion({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="46" fill="#143B22" opacity={0.7} />
      <Circle cx="50" cy="50" r="40" fill="#194829" />
      <Line x1="50" y1="20" x2="50" y2="25" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity={0.7} />
      <Line x1="72" y1="28" x2="68" y2="32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity={0.7} />
      <Line x1="28" y1="28" x2="32" y2="32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity={0.7} />
      <Path d="M 18 64 Q 50 48 82 64 Q 74 80 50 82 Q 26 80 18 64 Z" fill="#3A8A42" />
      <Line x1="24" y1="64" x2="76" y2="64" stroke="#4DA555" strokeWidth="1.5" strokeLinecap="round" />
      <Circle cx="38" cy="56" r="8" fill="#8E5528" />
      <Polygon points="52,48 66,54 58,62" fill="#F2D04E" />
      <Polygon points="58,50 72,56 64,62" fill="#E8C337" />
      <Circle cx="64" cy="65" r="4" fill="#E74C3C" />
      <Circle cx="52" cy="66" r="3.5" fill="#E67E22" />
    </Svg>
  );
}

/**
 * Slide 3: Gruha Muhurtham Temple Hut Medallion
 */
export function GruhaMuhurthamMedallion({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="46" fill="#4E3708" opacity={0.7} />
      <Circle cx="50" cy="50" r="40" fill="#5C410A" />
      <Rect x="30" y="48" width="40" height="34" fill="#FBF3DB" rx="1.5" />
      <Polygon points="26,48 50,30 74,48" fill="#F6D27A" />
      <Path d="M 28 48 Q 50 51 72 48" stroke="#3A8A42" strokeWidth="2" fill="none" />
      <Polygon points="32,48 34,52 36,48" fill="#3A8A42" />
      <Polygon points="38,49 40,53 42,49" fill="#3A8A42" />
      <Polygon points="44,49 46,53 48,49" fill="#3A8A42" />
      <Polygon points="52,49 54,53 56,49" fill="#3A8A42" />
      <Polygon points="58,49 60,53 62,49" fill="#3A8A42" />
      <Polygon points="64,48 66,52 68,48" fill="#3A8A42" />
      <Rect x="35" y="55" width="6" height="6" fill="#DFA83E" rx="1" />
      <Rect x="59" y="55" width="6" height="6" fill="#DFA83E" rx="1" />
      <Rect x="44" y="58" width="12" height="24" fill="#781D2C" />
      <Circle cx="53" cy="70" r="1.2" fill="#F4D03F" />
    </Svg>
  );
}

/**
 * Slide 4: Launch Offer Zero Booking Fee Voucher Medallion
 */
export function LaunchOfferMedallion({ size = 96 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx="50" cy="50" r="46" fill="#132F4C" opacity={0.7} />
      <Circle cx="50" cy="50" r="40" fill="#183A5D" />
      <G transform="translate(14, 26) rotate(-10 36 24)">
        <Rect x="0" y="0" width="66" height="34" rx="4" fill="#FBF3DC" stroke="#DFCF9F" strokeWidth="1" />
        <Circle cx="0" cy="17" r="4" fill="#183A5D" />
        <Circle cx="66" cy="17" r="4" fill="#183A5D" />
        <Line x1="48" y1="3" x2="48" y2="31" stroke="#CBB988" strokeWidth="1.2" strokeDasharray="2,2" />
        <SvgText x="14" y="24" fontSize="18" fontWeight="bold" fill="#1B4468" fontFamily="sans-serif">
          ₹0
        </SvgText>
        <SvgText x="51" y="21" fontSize="7" fontWeight="bold" fill="#7A683F" fontFamily="sans-serif">
          FEE
        </SvgText>
      </G>
    </Svg>
  );
}

/**
 * Large Hero Illustration for Pooja Details Screen (matching Image 3)
 */
export function PoojaHeroIllustration({ type = 'gruhapravesam', height = 190 }: { type?: string; height?: number }) {
  const norm = String(type).toLowerCase();

  // 1. Office opening Pooja (matching Image 4 & 5)
  if (norm.includes('office')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#D4ECE7', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroOfficeBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#CCEBE5" />
              <Stop offset="100%" stopColor="#DDF3F0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroOfficeBg)" />
          {/* Ground */}
          <Path d="M 0 162 Q 170 155 340 162 L 340 190 L 0 190 Z" fill="#B3D9D2" />
          {/* Office Building Front */}
          <Rect x="85" y="68" width="170" height="96" fill="#FFFFFF" rx="2" />
          <Rect x="95" y="86" width="68" height="78" fill="#F0F7F6" stroke="#C4DDD8" strokeWidth="1.5" />
          <Rect x="177" y="86" width="68" height="78" fill="#F0F7F6" stroke="#C4DDD8" strokeWidth="1.5" />
          {/* Green pitched awning/roof */}
          <Polygon points="72,68 268,68 260,54 80,54" fill="#1E6857" />
          <Rect x="76" y="68" width="188" height="10" fill="#247A67" rx="1" />
          {/* Green mango leaf thoranam hanging along awning */}
          {[80, 92, 104, 116, 128, 140, 152, 164, 176, 188, 200, 212, 224, 236, 248, 256].map((x, i) => (
            <Polygon key={i} points={`${x},78 ${x + 5},88 ${x + 10},78`} fill="#4E994E" />
          ))}
          {/* Bright Yellow Ceremonial Ribbon stretched across entrance */}
          <Line x1="72" y1="120" x2="268" y2="120" stroke="#F5A623" strokeWidth="4.5" />
          {/* Center Bow */}
          <Circle cx="170" cy="120" r="5" fill="#D97706" />
          <Path d="M 166 120 Q 155 110 162 120 Q 155 130 166 120 Z" fill="#F5A623" />
          <Path d="M 174 120 Q 185 110 178 120 Q 185 130 174 120 Z" fill="#F5A623" />
          <Line x1="168" y1="122" x2="158" y2="136" stroke="#F5A623" strokeWidth="3" />
          <Line x1="172" y1="122" x2="182" y2="136" stroke="#F5A623" strokeWidth="3" />
          {/* Kalash on floor on right */}
          <G transform="translate(254, 132)">
            <Path d="M 8 20 Q 0 28 14 32 Q 28 28 20 20 Z" fill="#C97A3E" stroke="#A65F2B" strokeWidth="1" />
            <Rect x="7" y="17" width="14" height="4" fill="#DDA052" rx="1" />
            <Polygon points="3,17 14,4 11,17" fill="#469B4B" />
            <Polygon points="25,17 14,4 17,17" fill="#469B4B" />
            <Polygon points="8,17 14,0 20,17" fill="#58B25D" />
            <Circle cx="14" cy="10" r="5" fill="#78350F" />
          </G>
        </Svg>
      </View>
    );
  }

  // 2. Vahana Pooja (Red car, garland, lemons)
  if (norm.includes('vahana') || norm.includes('vehicle')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#D4ECE7', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroVahanaBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#CCEBE5" />
              <Stop offset="100%" stopColor="#DDF3F0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroVahanaBg)" />
          {/* Road */}
          <Line x1="10" y1="156" x2="330" y2="156" stroke="#A7C7C0" strokeWidth="3" />
          {/* Car Cabin */}
          <Path d="M 102 96 L 132 70 L 210 70 L 244 96 Z" fill="#C93B3B" />
          {/* Windows */}
          <Polygon points="134,74 165,74 165,92 110,92" fill="#BCE3F2" />
          <Polygon points="173,74 207,74 233,92 173,92" fill="#BCE3F2" />
          {/* Car Lower Body */}
          <Path d="M 76 96 L 260 96 Q 276 96 276 114 L 276 130 L 60 130 L 60 114 Q 60 96 76 96 Z" fill="#C93B3B" />
          {/* Lights */}
          <Rect x="270" y="104" width="5" height="10" fill="#FDE047" rx="1.5" />
          <Rect x="60" y="104" width="5" height="10" fill="#EF4444" rx="1.5" />
          {/* Tires */}
          <Circle cx="106" cy="132" r="18" fill="#2D3136" />
          <Circle cx="106" cy="132" r="9" fill="#88929A" />
          <Circle cx="228" cy="132" r="18" fill="#2D3136" />
          <Circle cx="228" cy="132" r="9" fill="#88929A" />
          {/* Lemons under tires */}
          <Circle cx="96" cy="152" r="6" fill="#FACC15" />
          <Circle cx="238" cy="152" r="6" fill="#FACC15" />
          {/* Marigold Garland */}
          {[100, 114, 128, 142, 156, 170, 184, 198, 212, 226, 240].map((x, i) => (
            <Circle key={i} cx={x} cy={i > 0 && i < 8 ? 68 : 82} r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="0.8" />
          ))}
        </Svg>
      </View>
    );
  }

  // 3. Abdikam (River, Sun, Banana leaf, 3 Pindas, Kalash)
  if (norm.includes('abdikam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#E0EBF3', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroAbdikamBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#E2EBF2" />
              <Stop offset="100%" stopColor="#D4E3ED" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroAbdikamBg)" />
          {/* Faint Sun in top-left */}
          <Circle cx="76" cy="56" r="24" fill="#FCEBD6" />
          {/* River Water Band */}
          <Path d="M 0 94 Q 170 84 340 94 L 340 190 L 0 190 Z" fill="#588EA9" />
          {/* Green Grass blades on left */}
          <Line x1="42" y1="130" x2="34" y2="94" stroke="#68A54E" strokeWidth="4" strokeLinecap="round" />
          <Line x1="52" y1="134" x2="52" y2="86" stroke="#5E9447" strokeWidth="4" strokeLinecap="round" />
          <Line x1="62" y1="130" x2="70" y2="94" stroke="#68A54E" strokeWidth="4" strokeLinecap="round" />
          {/* Green leaf mound in center */}
          <Path d="M 96 122 Q 170 102 244 122 Q 170 134 96 122 Z" fill="#4C853F" />
          {/* 3 white pinda balls with dark sesame dots */}
          <Circle cx="138" cy="112" r="10" fill="#FFFFFF" />
          <Circle cx="135" cy="110" r="1.5" fill="#1F1A18" />
          <Circle cx="140" cy="112" r="1.5" fill="#1F1A18" />
          <Circle cx="170" cy="110" r="10" fill="#FFFFFF" />
          <Circle cx="167" cy="108" r="1.5" fill="#1F1A18" />
          <Circle cx="172" cy="110" r="1.5" fill="#1F1A18" />
          <Circle cx="202" cy="112" r="10" fill="#FFFFFF" />
          <Circle cx="199" cy="110" r="1.5" fill="#1F1A18" />
          <Circle cx="204" cy="112" r="1.5" fill="#1F1A18" />
          {/* Terracotta Pot on right */}
          <Path d="M 264 100 Q 250 130 280 136 Q 310 130 296 100 Z" fill="#B36437" />
          <Rect x="270" y="96" width="20" height="5" rx="1.5" fill="#9F532A" />
        </Svg>
      </View>
    );
  }

  // 4. Devi Navaratri Chandi Pooja (Trident from Lotus, Diyas)
  if (norm.includes('chandi') || norm.includes('devi navaratri')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#2C1B33', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroChandiBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#2E1C37" />
              <Stop offset="100%" stopColor="#43224B" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroChandiBg)" />
          {/* Glowing Aura behind Trident */}
          <Circle cx="170" cy="80" r="50" fill="#FCE5A4" opacity={0.15} />
          {/* Shelf Line */}
          <Line x1="20" y1="160" x2="320" y2="160" stroke="#54295D" strokeWidth="3" strokeLinecap="round" />
          {/* 7 Diyas */}
          {[60, 96, 132, 170, 208, 244, 280].map((x, i) => (
            <G key={i}>
              <Path d={`M ${x - 7} 160 Q ${x} 168 ${x + 7} 160 Z`} fill="#B87333" />
              <Path d={`M ${x} 158 Q ${x + 2.5} 150 ${x} 146 Q ${x - 2.5} 150 ${x} 158 Z`} fill="#F5B041" />
            </G>
          ))}
          {/* Pink Lotus at base */}
          <Path d="M 170 154 C 146 146 130 124 170 154 Z" fill="#E8597E" />
          <Path d="M 170 154 C 194 146 210 124 170 154 Z" fill="#E8597E" />
          <Path d="M 150 150 C 134 134 150 116 170 150 Z" fill="#F06292" />
          <Path d="M 190 150 C 206 134 190 116 170 150 Z" fill="#F06292" />
          <Path d="M 170 154 C 156 132 164 114 170 110 C 176 114 184 132 170 154 Z" fill="#F48FB1" />
          {/* Golden Trishulam / Trident */}
          <Line x1="170" y1="36" x2="170" y2="132" stroke="#F5C451" strokeWidth="5" strokeLinecap="round" />
          <Polygon points="170,28 163,42 177,42" fill="#F5C451" />
          {/* Left Prongs */}
          <Path d="M 170 94 C 136 94 136 50 142 44 C 141 60 156 80 170 84" fill="none" stroke="#F5C451" strokeWidth="4.5" strokeLinecap="round" />
          {/* Right Prongs */}
          <Path d="M 170 94 C 204 94 204 50 198 44 C 199 60 184 80 170 84" fill="none" stroke="#F5C451" strokeWidth="4.5" strokeLinecap="round" />
        </Svg>
      </View>
    );
  }

  // 5. Deepavali Lakshmi Pooja (Kandil Lantern, Rangoli, Diyas)
  if (norm.includes('deepavali') || norm.includes('lakshmi')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#26183B', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroDeepavaliBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#25163A" />
              <Stop offset="100%" stopColor="#3B1C52" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroDeepavaliBg)" />
          {/* Warm center light glow */}
          <Circle cx="170" cy="96" r="54" fill="#E89F43" opacity={0.25} />
          {/* Hanging Kandil Lantern at top-right */}
          <Line x1="268" y1="0" x2="268" y2="30" stroke="#D97706" strokeWidth="2" />
          <Polygon points="268,30 282,44 268,58 254,44" fill="#E87428" />
          <Polygon points="268,34 277,44 268,54 259,44" fill="#FBBF24" />
          <Line x1="262" y1="58" x2="258" y2="68" stroke="#FBBF24" strokeWidth="1.5" />
          <Line x1="268" y1="58" x2="268" y2="72" stroke="#FBBF24" strokeWidth="1.5" />
          <Line x1="274" y1="58" x2="278" y2="68" stroke="#FBBF24" strokeWidth="1.5" />
          {/* Rangoli Floral Petals at bottom */}
          {[
            { cx: 122, cy: 142, fill: '#6EE7B7' },
            { cx: 140, cy: 132, fill: '#F472B6' },
            { cx: 160, cy: 126, fill: '#FDE047' },
            { cx: 180, cy: 126, fill: '#FDE047' },
            { cx: 200, cy: 132, fill: '#F472B6' },
            { cx: 218, cy: 142, fill: '#6EE7B7' },
          ].map((pt, i) => (
            <Circle key={i} cx={pt.cx} cy={pt.cy} r="7.5" fill={pt.fill} />
          ))}
          <Path d="M 108 152 Q 170 128 232 152 Z" fill="#2E1C44" />
          {/* Diyas */}
          <Path d="M 76 146 Q 86 154 96 146 Z" fill="#C26A38" />
          <Path d="M 86 145 Q 89 138 86 134 Q 83 138 86 145 Z" fill="#FBBF24" />
          <Path d="M 160 150 Q 170 158 180 150 Z" fill="#C26A38" />
          <Path d="M 170 149 Q 173 142 170 138 Q 167 142 170 149 Z" fill="#FBBF24" />
          <Path d="M 244 146 Q 254 154 264 146 Z" fill="#C26A38" />
          <Path d="M 254 145 Q 257 138 254 134 Q 251 138 254 145 Z" fill="#FBBF24" />
        </Svg>
      </View>
    );
  }

  // 6. Vinayaka Chavithi Pooja (Umbrella, Modaks, Peetham)
  if (norm.includes('vinayaka') || norm.includes('chavithi') || norm.includes('ganesha')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#26183B', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroVinayakaBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#25163A" />
              <Stop offset="100%" stopColor="#3C1A52" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroVinayakaBg)" />
          {/* Garika grass blades on left */}
          <Line x1="78" y1="146" x2="68" y2="120" stroke="#489945" strokeWidth="4" strokeLinecap="round" />
          <Line x1="86" y1="146" x2="86" y2="114" stroke="#5CB85A" strokeWidth="4" strokeLinecap="round" />
          <Line x1="94" y1="146" x2="102" y2="120" stroke="#489945" strokeWidth="4" strokeLinecap="round" />
          {/* Garika grass blades on right */}
          <Line x1="246" y1="146" x2="238" y2="120" stroke="#489945" strokeWidth="4" strokeLinecap="round" />
          <Line x1="254" y1="146" x2="254" y2="114" stroke="#5CB85A" strokeWidth="4" strokeLinecap="round" />
          <Line x1="262" y1="146" x2="272" y2="120" stroke="#489945" strokeWidth="4" strokeLinecap="round" />
          {/* Orange Umbrella (Chhatra) Canopy */}
          <Polygon points="170,44 116,78 224,78" fill="#E86E2F" />
          <Line x1="170,44" y1="170,34" x2="170" y2="34" stroke="#E86E2F" strokeWidth="4" strokeLinecap="round" />
          <Circle cx="170" cy="34" r="3.5" fill="#FBBF24" />
          {/* Wooden Peetham / Boat-like Chowki */}
          <Path d="M 112 146 Q 170 152 228 146 L 234 140 L 106 140 Z" fill="#9C4A26" />
          {/* Modaks pyramid */}
          <Circle cx="144" cy="130" r="8" fill="#FAF5E8" />
          <Circle cx="160" cy="130" r="8" fill="#FAF5E8" />
          <Circle cx="180" cy="130" r="8" fill="#FAF5E8" />
          <Circle cx="196" cy="130" r="8" fill="#FAF5E8" />
          <Circle cx="152" cy="116" r="8" fill="#FFFDF8" />
          <Circle cx="170" cy="115" r="8.5" fill="#FFFDF8" />
          <Circle cx="188" cy="116" r="8" fill="#FFFDF8" />
          <Circle cx="161" cy="103" r="8" fill="#FFFFFF" />
          <Circle cx="179" cy="103" r="8" fill="#FFFFFF" />
          <Circle cx="170" cy="91" r="8" fill="#FFFFFF" />
          <Path d="M 170 85 Q 170 80 170 78" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" />
        </Svg>
      </View>
    );
  }

  // 7. Satyanarayana Vratham
  if (norm.includes('satyanarayana') || norm.includes('vratham')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FAF1D9', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroSatyaBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FBF2D8" />
              <Stop offset="100%" stopColor="#F5E4BE" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroSatyaBg)" />
          {/* Ground */}
          <Path d="M 0 160 Q 170 152 340 160 L 340 190 L 0 190 Z" fill="#E8CE9D" />
          {/* Banana plants on left & right */}
          <Path d="M 70 150 Q 56 100 80 72" stroke="#2E7D32" strokeWidth="7" fill="none" strokeLinecap="round" />
          <Path d="M 270 150 Q 284 100 260 72" stroke="#2E7D32" strokeWidth="7" fill="none" strokeLinecap="round" />
          {/* Wooden Mandapam */}
          <Rect x="110" y="86" width="120" height="70" fill="#FFFDF8" stroke="#D7A94E" strokeWidth="2" rx="2" />
          <Polygon points="98,86 170,48 242,86" fill="#8C2032" />
          {/* Golden Kalash on Mandapam */}
          <G transform="translate(154, 98)">
            <Path d="M 8 22 Q 0 32 16 36 Q 32 32 24 22 Z" fill="#E6A833" />
            <Polygon points="5,20 16,6 13,20" fill="#3D8B37" />
            <Polygon points="27,20 16,6 19,20" fill="#3D8B37" />
            <Polygon points="10,20 16,2 22,20" fill="#4CAF50" />
            <Circle cx="16" cy="12" r="6" fill="#8D5A2B" />
          </G>
          {/* Diyas on sides of altar */}
          <Path d="M 120 148 Q 126 154 132 148 Z" fill="#B87333" />
          <Path d="M 126 147 Q 128 141 126 138 Z" fill="#F5B041" />
          <Path d="M 208 148 Q 214 154 220 148 Z" fill="#B87333" />
          <Path d="M 214 147 Q 216 141 214 138 Z" fill="#F5B041" />
        </Svg>
      </View>
    );
  }

  // 8. Homams (Ganapathi, Navagraha, Sudarshana)
  if (norm.includes('homam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#4A1C22', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroHomamBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#4A1C22" />
              <Stop offset="100%" stopColor="#6C2832" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroHomamBg)" />
          {/* Stepped Homam Kundam */}
          <Rect x="100" y="146" width="140" height="14" fill="#8C351F" rx="2" />
          <Rect x="114" y="132" width="112" height="14" fill="#9C3C24" rx="2" />
          <Rect x="128" y="118" width="84" height="14" fill="#B3462A" rx="2" />
          {/* Sacred Agni Flames */}
          <Path d="M 170 52 Q 194 88 180 118 Q 160 118 146 88 Q 160 70 170 52 Z" fill="#F39C12" />
          <Path d="M 170 68 Q 184 94 176 118 Q 164 118 156 94 Z" fill="#F1C40F" />
          {/* Wooden Ghee Ladle */}
          <Line x1="244" y1="86" x2="212" y2="134" stroke="#D3A270" strokeWidth="5" strokeLinecap="round" />
          {/* Coconut/Offerings on side */}
          <Circle cx="86" cy="142" r="7" fill="#FAF0D7" />
          <Circle cx="76" cy="144" r="6" fill="#FAF0D7" />
          <Circle cx="81" cy="136" r="6" fill="#FAF0D7" />
        </Svg>
      </View>
    );
  }

  // 9. Upanayanam (Sacred Thread, Palasha Danda, Brahmachari Peetham)
  if (norm.includes('upanayanam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FAF0E4', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroUpaBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FAF1E6" />
              <Stop offset="100%" stopColor="#F5DFCA" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroUpaBg)" />
          {/* Floor / Ground */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#EAD4BD" />

          {/* Mango leaf festoon garland at top */}
          <Line x1="20" y1="20" x2="320" y2="20" stroke="#2E7D32" strokeWidth="2" />
          {[40, 68, 96, 124, 152, 180, 208, 236, 264, 292].map((x, i) => (
            <Polygon key={i} points={`${x},20 ${x + 6},34 ${x + 12},20`} fill="#388E3C" />
          ))}

          {/* Palasha Danda (Staff) on Left */}
          <Line x1="88" y1="44" x2="88" y2="162" stroke="#78350F" strokeWidth="5" strokeLinecap="round" />
          <Path d="M 88 56 Q 102 52 96 66 Q 88 62 88 56 Z" fill="#2E7D32" />
          {/* Sacred Yellow Cloth tied to Danda */}
          <Path d="M 88 78 Q 74 86 88 94 Z" fill="#F59E0B" />

          {/* Kamandalu (Water Pot) beside Danda */}
          <G transform="translate(100, 126)">
            <Path d="M 10 18 Q 4 30 18 32 Q 32 30 26 18 Z" fill="#B45309" stroke="#92400E" strokeWidth="1" />
            <Rect x="13" y="14" width="10" height="4" fill="#D97706" rx="1" />
            <Path d="M 24 22 Q 32 20 30 26 Q 24 28 24 22 Z" fill="#B45309" />
            <Path d="M 12 14 C 12 6, 24 6, 24 14" stroke="#92400E" strokeWidth="2.5" fill="none" />
          </G>

          {/* Center: Brahmachari with Sacred Thread */}
          {/* Peetham / Seat */}
          <Rect x="144" y="152" width="76" height="12" fill="#B45309" rx="2" />
          <Rect x="148" y="142" width="68" height="10" fill="#D97706" rx="2" />
          {/* Sitting figure in white dhoti */}
          <Circle cx="182" cy="74" r="16" fill="#ECC2A0" />
          {/* Shikhai / Tuft hair knot */}
          <Circle cx="182" cy="56" r="5" fill="#1F2937" />
          {/* Torso & White Angavastram */}
          <Path d="M 158 142 L 164 100 Q 182 96 200 100 L 206 142 Z" fill="#FFFDF8" stroke="#E5E7EB" strokeWidth="1" />
          {/* Sandalwood Chandan Tilak on forehead */}
          <Line x1="178" y1="72" x2="186" y2="72" stroke="#FDE68A" strokeWidth="2" />
          <Circle cx="182" cy="75" r="1.5" fill="#DC2626" />
          {/* 3-Strand Gold Yajnopavita (Sacred Thread) passing diagonally */}
          <Line x1="168" y1="98" x2="202" y2="136" stroke="#D97706" strokeWidth="3" />
          <Line x1="169" y1="100" x2="203" y2="138" stroke="#FBBF24" strokeWidth="1.5" />

          {/* Right: Small Agni Kunda / Homa Fire */}
          <G transform="translate(236, 120)">
            <Rect x="0" y="32" width="48" height="10" fill="#9C3C24" rx="1" />
            <Rect x="6" y="24" width="36" height="8" fill="#B3462A" rx="1" />
            <Path d="M 24 4 Q 34 16 28 26 Q 20 26 14 16 Q 20 10 24 4 Z" fill="#F59E0B" />
            <Path d="M 24 10 Q 30 18 26 26 Q 22 26 18 18 Z" fill="#FDE047" />
          </G>
        </Svg>
      </View>
    );
  }

  // 10. Namakaranam (Golden Baby Cradle, Baby, Rice plate)
  if (norm.includes('namakaranam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FDF0F3', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroNamaBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FDF2F4" />
              <Stop offset="100%" stopColor="#FCE0E6" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroNamaBg)" />
          {/* Floor */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#F7CED6" />

          {/* Hanging Cradle (Uyyala / Jhula) */}
          {/* Ropes from top with floral garlands */}
          <Line x1="110" y1="0" x2="130" y2="76" stroke="#D97706" strokeWidth="2.5" />
          <Line x1="230" y1="0" x2="210" y2="76" stroke="#D97706" strokeWidth="2.5" />
          {[20, 42, 64].map((y, i) => (
            <G key={i}>
              <Circle cx={110 + (20 * y) / 76} cy={y} r="4" fill="#F472B6" />
              <Circle cx={230 - (20 * y) / 76} cy={y} r="4" fill="#F472B6" />
            </G>
          ))}

          {/* Wooden/Golden Cradle Body */}
          <Path d="M 116 86 Q 170 120 224 86 L 220 76 Q 170 96 120 76 Z" fill="#F59E0B" stroke="#D97706" strokeWidth="1.5" />
          <Rect x="122" y="74" width="96" height="12" fill="#FBBF24" rx="2" />
          {/* Soft silk pink mattress & pillows */}
          <Path d="M 126 80 Q 170 94 214 80 Z" fill="#FBCFE8" />
          {/* Swaddled Baby */}
          <Circle cx="170" cy="74" r="9" fill="#FDE2D0" />
          <Path d="M 163 80 Q 170 90 177 80 Z" fill="#FFFFFF" />
          <Circle cx="170" cy="72" r="1.5" fill="#DC2626" />

          {/* Foreground: Brass Thali with Rice Grains for Name Writing */}
          <G transform="translate(136, 138)">
            <Ellipse cx="34" cy="14" rx="42" ry="12" fill="#D97706" />
            <Ellipse cx="34" cy="13" rx="39" ry="10" fill="#FEF08A" />
            {/* Golden Ring / Inscription in rice */}
            <Circle cx="34" cy="13" r="4" stroke="#B45309" strokeWidth="2" fill="none" />
          </G>

          {/* Twin brass diyas on floor */}
          <Path d="M 64 154 Q 72 162 80 154 Z" fill="#D97706" />
          <Path d="M 72 153 Q 74 145 72 142 Z" fill="#F59E0B" />
          <Path d="M 260 154 Q 268 162 276 154 Z" fill="#D97706" />
          <Path d="M 268 153 Q 270 145 268 142 Z" fill="#F59E0B" />
        </Svg>
      </View>
    );
  }

  // 11. Annaprasana (Silver Bowl, Payasam, Peacock feather, Gold Coin)
  if (norm.includes('annaprasana')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FDF8E8', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroAnnaBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FDF9EA" />
              <Stop offset="100%" stopColor="#FBE9C4" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroAnnaBg)" />
          {/* Floor */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#EBD2A7" />

          {/* Banana Leaf Base Plate in center */}
          <Path d="M 80 148 Q 170 120 260 148 Q 170 166 80 148 Z" fill="#2E7D32" stroke="#1B5E20" strokeWidth="1" />
          <Line x1="90" y1="148" x2="250" y2="148" stroke="#4CAF50" strokeWidth="1.5" />

          {/* Ornate Silver Katori / Bowl with Payasam */}
          <G transform="translate(138, 86)">
            {/* Bowl Stand */}
            <Rect x="20" y="44" width="24" height="6" fill="#94A3B8" rx="1" />
            <Path d="M 8 20 Q 2 44 32 46 Q 62 44 56 20 Z" fill="#CBD5E1" stroke="#94A3B8" strokeWidth="2" />
            {/* Delicious creamy kheer with saffron strings */}
            <Ellipse cx="32" cy="20" rx="24" ry="8" fill="#FFFBEB" />
            <Path d="M 24 18 Q 32 20 40 18" stroke="#D97706" strokeWidth="1.5" fill="none" />
            <Circle cx="30" cy="21" r="1.5" fill="#EF4444" />
            <Circle cx="36" cy="19" r="1.5" fill="#15803D" />

            {/* Silver Spoon resting on bowl */}
            <Path d="M 44 14 Q 58 6 68 0 L 72 4 Q 60 14 46 22 Z" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
            <Circle cx="44" cy="18" r="4" fill="#FFFBEB" />
          </G>

          {/* Vibrant Peacock Feather on Left */}
          <G transform="translate(68, 64) rotate(-24 20 50)">
            <Line x1="20" y1="80" x2="20" y2="0" stroke="#047857" strokeWidth="2" />
            {/* Eye of the feather */}
            <Ellipse cx="20" cy="16" rx="14" ry="18" fill="#059669" />
            <Ellipse cx="20" cy="18" rx="10" ry="12" fill="#2563EB" />
            <Ellipse cx="20" cy="20" rx="6" ry="7" fill="#7C3AED" />
            <Circle cx="20" cy="21" r="3" fill="#F59E0B" />
          </G>

          {/* Symbolic Choice Items on Right (Gold Coin, Sacred Grantha) */}
          <G transform="translate(232, 126)">
            {/* Gold Coin */}
            <Circle cx="16" cy="16" r="10" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
            <Circle cx="16" cy="16" r="7" stroke="#D97706" strokeWidth="1" fill="none" />
            {/* Grantha / Book */}
            <Rect x="30" y="8" width="22" height="18" fill="#DC2626" rx="2" />
            <Line x1="33" y1="12" x2="49" y2="12" stroke="#FDE68A" strokeWidth="1" />
            <Line x1="33" y1="16" x2="49" y2="16" stroke="#FDE68A" strokeWidth="1" />
            <Line x1="33" y1="20" x2="45" y2="20" stroke="#FDE68A" strokeWidth="1" />
          </G>
        </Svg>
      </View>
    );
  }

  // 12. Aksharabhyasam (Slate with Om / Sri, Yellow Akshatalu Plate, Chalk)
  if (norm.includes('aksharabhyasam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FFF2E5', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroAkshBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FFF4E8" />
              <Stop offset="100%" stopColor="#FCE0C6" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroAkshBg)" />
          {/* Ground */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#E8C7A4" />

          {/* Wooden Slate (Palaka) in Center */}
          <G transform="translate(110, 52)">
            {/* Wooden Slate Frame */}
            <Rect x="0" y="0" width="120" height="86" fill="#78350F" rx="6" stroke="#572607" strokeWidth="2" />
            {/* Dark Slate Surface */}
            <Rect x="8" y="8" width="104" height="70" fill="#1E293B" rx="3" />
            {/* Luminous White Inscription: Om and Sri */}
            <SvgText x="60" y="44" fontSize="26" fontWeight="bold" fill="#FFFFFF" textAnchor="middle" fontFamily="serif">
              ॐ
            </SvgText>
            <SvgText x="60" y="66" fontSize="16" fontWeight="bold" fill="#FDE68A" textAnchor="middle" fontFamily="serif">
              శ్రీ
            </SvgText>
            {/* White chalk piece */}
            <Rect x="96" y="64" width="12" height="4" fill="#FFFFFF" rx="1" transform="rotate(-15 96 64)" />
          </G>

          {/* Brass Plate with Yellow Akshatalu Rice on Left */}
          <G transform="translate(42, 114)">
            <Ellipse cx="32" cy="18" rx="36" ry="14" fill="#D97706" />
            <Ellipse cx="32" cy="17" rx="32" ry="11" fill="#FACC15" />
            {/* Finger tracing in rice */}
            <Path d="M 22 17 Q 32 12 42 17" stroke="#B45309" strokeWidth="2" fill="none" />
          </G>

          {/* Auspicious Peacock Feather on Right */}
          <G transform="translate(244, 76) rotate(18 20 50)">
            <Line x1="20" y1="80" x2="20" y2="0" stroke="#047857" strokeWidth="2" />
            <Ellipse cx="20" cy="16" rx="12" ry="16" fill="#059669" />
            <Ellipse cx="20" cy="18" rx="8" ry="10" fill="#2563EB" />
            <Circle cx="20" cy="20" r="4" fill="#F59E0B" />
          </G>
        </Svg>
      </View>
    );
  }

  // 13. Shashtipoorthi (Celebratory Twin Garlands, "60" Medallion, Brass Lamps)
  if (norm.includes('shashti') || norm.includes('poorthi')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FAF0DC', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroShashtiBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FAF1DD" />
              <Stop offset="100%" stopColor="#F5DDB3" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroShashtiBg)" />
          {/* Ground */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#E4C894" />

          {/* Celebratory Floral Garland Across Top */}
          <Path d="M 20 40 Q 170 94 320 40" stroke="#F59E0B" strokeWidth="7" fill="none" />
          <Path d="M 20 40 Q 170 94 320 40" stroke="#DC2626" strokeWidth="5" strokeDasharray="8,8" fill="none" />

          {/* Center: Celebratory Golden Medallion "60" */}
          <G transform="translate(170, 92)">
            {/* Scalloped Gold Rays */}
            <Circle cx="0" cy="0" r="38" fill="#FDE68A" stroke="#D97706" strokeWidth="2" />
            <Circle cx="0" cy="0" r="32" fill="#FEF3C7" stroke="#B45309" strokeWidth="1.5" />
            {/* Bold Crimson "60" */}
            <SvgText x="0" y="7" fontSize="24" fontWeight="bold" fill="#8C2032" textAnchor="middle" fontFamily="sans-serif">
              60
            </SvgText>
            <SvgText x="0" y="21" fontSize="9" fontWeight="bold" fill="#78350F" textAnchor="middle" fontFamily="sans-serif">
              షష్టిపూర్తి
            </SvgText>
          </G>

          {/* Left Kuthuvilakku Lamp */}
          <G transform="translate(56, 76)">
            <Line x1="16" y1="84" x2="16" y2="20" stroke="#D97706" strokeWidth="4" />
            <Ellipse cx="16" cy="84" rx="14" ry="4" fill="#B45309" />
            <Path d="M 6 36 Q 16 46 26 36 Z" fill="#F59E0B" />
            <Path d="M 16 20 Q 20 8 16 4 Q 12 8 16 20 Z" fill="#FDE047" />
          </G>

          {/* Right Kuthuvilakku Lamp */}
          <G transform="translate(252, 76)">
            <Line x1="16" y1="84" x2="16" y2="20" stroke="#D97706" strokeWidth="4" />
            <Ellipse cx="16" cy="84" rx="14" ry="4" fill="#B45309" />
            <Path d="M 6 36 Q 16 46 26 36 Z" fill="#F59E0B" />
            <Path d="M 16 20 Q 20 8 16 4 Q 12 8 16 20 Z" fill="#FDE047" />
          </G>
        </Svg>
      </View>
    );
  }

  // 14. Vastu Shanti (Vastu Purusha Mandala 9x9 Grid, Diyas, Altar)
  if (norm.includes('vastu')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FDF3E2', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroVastuBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FDF4E5" />
              <Stop offset="100%" stopColor="#F9E2BE" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroVastuBg)" />
          {/* Ground */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#E8CE9D" />

          {/* Raised Altar Platform */}
          <Rect x="85" y="146" width="170" height="18" fill="#C9924E" rx="2" />

          {/* Sacred Vastu Purusha Mandala Geometric Grid */}
          <G transform="translate(126, 46)">
            {/* Outer Protective Square */}
            <Rect x="0" y="0" width="88" height="88" fill="#FFFDF8" stroke="#8C2032" strokeWidth="3" rx="2" />
            {/* 3x3 Main Divisions */}
            <Line x1="29.3" y1="0" x2="29.3" y2="88" stroke="#8C2032" strokeWidth="1.5" />
            <Line x1="58.6" y1="0" x2="58.6" y2="88" stroke="#8C2032" strokeWidth="1.5" />
            <Line x1="0" y1="29.3" x2="88" y2="29.3" stroke="#8C2032" strokeWidth="1.5" />
            <Line x1="0" y1="58.6" x2="88" y2="58.6" stroke="#8C2032" strokeWidth="1.5" />

            {/* Finer Internal Grid lines */}
            <Line x1="14.6" y1="0" x2="14.6" y2="88" stroke="#D97706" strokeWidth="0.8" strokeDasharray="2,2" />
            <Line x1="44" y1="0" x2="44" y2="88" stroke="#D97706" strokeWidth="0.8" strokeDasharray="2,2" />
            <Line x1="73.3" y1="0" x2="73.3" y2="88" stroke="#D97706" strokeWidth="0.8" strokeDasharray="2,2" />
            <Line x1="0" y1="14.6" x2="88" y2="14.6" stroke="#D97706" strokeWidth="0.8" strokeDasharray="2,2" />
            <Line x1="0" y1="44" x2="88" y2="44" stroke="#D97706" strokeWidth="0.8" strokeDasharray="2,2" />
            <Line x1="0" y1="73.3" x2="88" y2="73.3" stroke="#D97706" strokeWidth="0.8" strokeDasharray="2,2" />

            {/* Central Brahmasthana Gold Bindu */}
            <Circle cx="44" cy="44" r="8" fill="#F59E0B" stroke="#8C2032" strokeWidth="1.5" />
            <Circle cx="44" cy="44" r="3" fill="#8C2032" />

            {/* 4 Corner Auspicious Triangles */}
            <Polygon points="0,0 15,0 0,15" fill="#8C2032" />
            <Polygon points="88,0 73,0 88,15" fill="#8C2032" />
            <Polygon points="0,88 15,88 0,73" fill="#8C2032" />
            <Polygon points="88,88 73,88 88,73" fill="#8C2032" />
          </G>

          {/* Golden Kalash on Right */}
          <G transform="translate(246, 114)">
            <Path d="M 8 20 Q 0 30 16 34 Q 32 30 24 20 Z" fill="#E6A833" />
            <Polygon points="5,18 16,4 13,18" fill="#3D8B37" />
            <Polygon points="27,18 16,4 19,18" fill="#3D8B37" />
            <Polygon points="10,18 16,0 22,18" fill="#4CAF50" />
            <Circle cx="16" cy="10" r="5.5" fill="#8D5A2B" />
          </G>

          {/* Twin brass diyas flanking the mandala */}
          <Path d="M 58 148 Q 66 156 74 148 Z" fill="#D97706" />
          <Path d="M 66 147 Q 68 139 66 136 Z" fill="#F59E0B" />
          <Path d="M 276 148 Q 284 156 292 148 Z" fill="#D97706" />
          <Path d="M 284 147 Q 286 139 284 136 Z" fill="#F59E0B" />
        </Svg>
      </View>
    );
  }

  // 15. Bhoomi Pooja (Sacred Earth Mound, Sprout, Ceremonial Pickaxe, Foundation Bricks)
  if (norm.includes('bhoomi')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FCEBD4', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroBhoomiBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FCECD6" />
              <Stop offset="100%" stopColor="#F5D8B4" />
            </LinearGradient>
            <LinearGradient id="heroEarthGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#A06733" />
              <Stop offset="100%" stopColor="#75431A" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroBhoomiBg)" />
          {/* Ground */}
          <Rect x="0" y="152" width="340" height="38" fill="#DFBE92" />

          {/* Consecrated Earth Mound in Center */}
          <Path d="M 60 152 Q 170 76 280 152 Z" fill="url(#heroEarthGrad)" />

          {/* Sacred Green Sprout (Navadhanya Ankuram) */}
          <Path d="M 170 106 Q 172 74 170 54" stroke="#469B4B" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Left Leaf */}
          <Path d="M 170 74 Q 146 64 150 78 Q 160 82 170 74 Z" fill="#469B4B" />
          {/* Right Leaf */}
          <Path d="M 170 66 Q 194 56 190 70 Q 180 74 170 66 Z" fill="#58B25D" />

          {/* Stack of Sacred Foundation Bricks on Left */}
          <G transform="translate(68, 126)">
            <Rect x="0" y="16" width="46" height="12" rx="2" fill="#B85338" stroke="#8C351F" strokeWidth="1.5" />
            <Rect x="8" y="2" width="46" height="12" rx="2" fill="#C25A3F" stroke="#8C351F" strokeWidth="1.5" />
            {/* Turmeric & Kumkum dots on bricks */}
            <Circle cx="20" cy="8" r="2" fill="#FACC15" />
            <Circle cx="30" cy="8" r="2" fill="#DC2626" />
            <Circle cx="40" cy="8" r="2" fill="#FACC15" />
          </G>

          {/* Ceremonial Decorated Pickaxe / Shovel on Right */}
          <G transform="translate(210, 80) rotate(26 30 40)">
            <Line x1="30" y1="0" x2="30" y2="80" stroke="#8C6239" strokeWidth="6" strokeLinecap="round" />
            {/* Steel Spade Blade with marigold flower */}
            <Polygon points="16,68 44,68 36,86 24,86" fill="#71717A" stroke="#52525B" strokeWidth="1" />
            <Circle cx="30" cy="66" r="5" fill="#F59E0B" />
          </G>
        </Svg>
      </View>
    );
  }

  // 16. Rudrabhishekam (Shiva Lingam, Tripundra, Suspended Abhishekam Kalash, Bilva)
  if (norm.includes('rudra') || norm.includes('abhishekam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#E8F5ED', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroRudraBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#EEF7F1" />
              <Stop offset="100%" stopColor="#D4EADB" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroRudraBg)" />
          {/* Ground */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#B3D9BE" />

          {/* Bilva Patra foliage on sides */}
          <Polygon points="54,162 66,138 78,162" fill="#3D7B48" />
          <Polygon points="262,162 274,138 286,162" fill="#3D7B48" />

          {/* Shiva Peetham (Yoni base) */}
          <Polygon points="108,162 232,162 212,142 128,142" fill="#374151" stroke="#1F2937" strokeWidth="2" />
          {/* Lingam */}
          <Path d="M 152 142 Q 152 94 170 94 Q 188 94 188 142 Z" fill="#111827" />
          {/* Sacred Tripundra White Markings */}
          <Line x1="160" y1="110" x2="180" y2="110" stroke="#FFFFFF" strokeWidth="2" />
          <Line x1="160" y1="114" x2="180" y2="114" stroke="#FFFFFF" strokeWidth="2" />
          <Line x1="160" y1="118" x2="180" y2="118" stroke="#FFFFFF" strokeWidth="2" />
          <Circle cx="170" cy="114" r="2" fill="#DC2626" />

          {/* Suspended Copper Abhishekam Kalash above */}
          <G transform="translate(154, 24)">
            <Line x1="16" y1="-24" x2="16" y2="12" stroke="#D97706" strokeWidth="2" />
            <Path d="M 6 12 Q 0 32 16 34 Q 32 32 26 12 Z" fill="#B45309" stroke="#92400E" strokeWidth="1.5" />
            <Rect x="8" y="8" width="16" height="5" fill="#D97706" rx="1" />
          </G>

          {/* Stream of Sacred Milk falling from pot on Lingam */}
          <Path d="M 170 58 L 170 94" stroke="#BAE6FD" strokeWidth="3.5" strokeDasharray="5,3" fill="none" />

          {/* Bilva Patra (3 leaves) at base */}
          <G transform="translate(136, 148)">
            <Circle cx="0" cy="0" r="5" fill="#2E7D32" />
            <Circle cx="8" cy="-5" r="5" fill="#388E3C" />
            <Circle cx="16" cy="0" r="5" fill="#2E7D32" />
          </G>
        </Svg>
      </View>
    );
  }

  // 17. Varalakshmi Vratham (Kalash on Pink Lotus with Golden Jewelry & Diyas)
  if (norm.includes('varalakshmi')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FCEDF2', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroVaraBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FDF2F6" />
              <Stop offset="100%" stopColor="#F9D4E2" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroVaraBg)" />
          {/* Ground */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#F0BACF" />

          {/* Festoon Garland at top */}
          <Path d="M 30 36 Q 170 66 310 36" stroke="#F59E0B" strokeWidth="3" strokeDasharray="6,4" fill="none" />

          {/* Blooming Pink Lotus Pedestal */}
          <Path d="M 170 152 Q 120 152 108 126 Q 138 132 170 152 Z" fill="#F48FB1" />
          <Path d="M 170 152 Q 220 152 232 126 Q 202 132 170 152 Z" fill="#F48FB1" />
          <Path d="M 170 152 Q 148 106 170 96 Q 192 106 170 152 Z" fill="#F06292" />

          {/* Golden Varalakshmi Kalash draped in red silk vastram */}
          <Path d="M 150 96 Q 138 132 170 136 Q 202 132 190 96 Z" fill="#E5A93C" stroke="#D97706" strokeWidth="1.5" />
          {/* Red vastram band with gold border */}
          <Rect x="148" y="106" width="44" height="14" fill="#DC2626" rx="2" />
          <Line x1="148" y1="108" x2="192" y2="108" stroke="#FBBF24" strokeWidth="1.5" />
          <Line x1="148" y1="118" x2="192" y2="118" stroke="#FBBF24" strokeWidth="1.5" />

          {/* Mango Leaves & Coconut on top */}
          <Polygon points="152,94 170,72 160,94" fill="#3D7B48" />
          <Polygon points="188,94 170,72 180,94" fill="#3D7B48" />
          <Polygon points="160,94 170,64 180,94" fill="#4CAF50" />
          <Circle cx="170" cy="80" r="9" fill="#8C582B" />
          {/* Haldi & Kumkum on coconut */}
          <Circle cx="170" cy="78" r="2.5" fill="#DC2626" />

          {/* Twin glowing brass lamps */}
          <G transform="translate(64, 110)">
            <Path d="M 0 36 Q 12 44 24 36 Z" fill="#D97706" />
            <Path d="M 12 35 Q 15 25 12 20 Q 9 25 12 35 Z" fill="#F59E0B" />
          </G>
          <G transform="translate(252, 110)">
            <Path d="M 0 36 Q 12 44 24 36 Z" fill="#D97706" />
            <Path d="M 12 35 Q 15 25 12 20 Q 9 25 12 35 Z" fill="#F59E0B" />
          </G>
        </Svg>
      </View>
    );
  }

  // 18. Vivaha / Marriage / Kalyanam
  if (norm.includes('vivaha') || norm.includes('marriage') || norm.includes('kalyanam')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#FDF0EB', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroVivahaBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#FDF2EC" />
              <Stop offset="100%" stopColor="#F9D7C7" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroVivahaBg)" />
          {/* Ground */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#ECC0AC" />

          {/* Wedding Mandapam Pillars */}
          <Rect x="54" y="24" width="16" height="138" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          <Rect x="270" y="24" width="16" height="138" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          {/* Top Mandapam Arch */}
          <Path d="M 50 36 Q 170 10 290 36" stroke="#DC2626" strokeWidth="8" fill="none" />
          <Path d="M 50 36 Q 170 10 290 36" stroke="#F59E0B" strokeWidth="4" strokeDasharray="8,6" fill="none" />

          {/* Center: Mangalsutra / Auspicious Coconut & Jeelakarra-Bellam */}
          <G transform="translate(170, 96)">
            {/* Sacred Yellow Thread Arc */}
            <Path d="M -48 -20 Q 0 40 48 -20" stroke="#FBBF24" strokeWidth="3" fill="none" />
            {/* Black Beads along thread */}
            {[-36, -24, -12, 12, 24, 36].map((x, i) => (
              <Circle key={i} cx={x} cy={12 - Math.abs(x) * 0.4} r="2" fill="#1F2937" />
            ))}
            {/* Twin Golden Sutras (Bottu) */}
            <Circle cx="-6" cy="24" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <Circle cx="6" cy="24" r="8" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
          </G>

          {/* Saptapadi Homa Kunda at base */}
          <G transform="translate(136, 138)">
            <Rect x="0" y="14" width="68" height="10" fill="#9C3C24" rx="1" />
            <Path d="M 34 -4 Q 44 8 38 14 Q 30 14 24 8 Z" fill="#F59E0B" />
          </G>
        </Svg>
      </View>
    );
  }

  // 19. Seemantham / Baby Shower (Sacred Green Glass Bangles & Jasmine)
  if (norm.includes('seemantham') || norm.includes('godh bharai')) {
    return (
      <View style={{ width: '100%', height, backgroundColor: '#EEF7F2', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Svg width="100%" height={height} viewBox="0 0 340 190">
          <Defs>
            <LinearGradient id="heroSeemBg" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#F1F8F4" />
              <Stop offset="100%" stopColor="#D8EDE0" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width="340" height="190" fill="url(#heroSeemBg)" />
          {/* Ground */}
          <Path d="M 0 162 Q 170 154 340 162 L 340 190 L 0 190 Z" fill="#BCDDC6" />

          {/* Fragrant Jasmine Strings across top */}
          <Path d="M 30 30 Q 170 70 310 30" stroke="#FFFFFF" strokeWidth="6" fill="none" />
          <Path d="M 30 30 Q 170 70 310 30" stroke="#FDE68A" strokeWidth="3" strokeDasharray="5,5" fill="none" />

          {/* Auspicious Green Glass Bangles (Gaajulu) Stack */}
          <G transform="translate(170, 96)">
            {[-24, -16, -8, 0, 8, 16, 24].map((x, i) => (
              <Ellipse key={i} cx={x} cy={0} rx="16" ry="34" fill="none" stroke={i % 2 === 0 ? "#15803D" : "#16A34A"} strokeWidth="3.5" opacity={0.9} />
            ))}
          </G>

          {/* Silver Thali with 5 variety sweets / fruits on floor */}
          <G transform="translate(130, 142)">
            <Ellipse cx="40" cy="14" rx="50" ry="12" fill="#94A3B8" />
            <Ellipse cx="40" cy="13" rx="46" ry="10" fill="#E2E8F0" />
            <Circle cx="20" cy="12" r="5" fill="#EF4444" />
            <Circle cx="32" cy="11" r="5" fill="#F59E0B" />
            <Circle cx="44" cy="11" r="5" fill="#FACC15" />
            <Circle cx="56" cy="12" r="5" fill="#10B981" />
          </G>
        </Svg>
      </View>
    );
  }

  // DEFAULT: Gruhapravesam (Image 3 exact match)
  return <GruhapravesamHeroIllustration height={height} />;
}

export function GruhapravesamHeroIllustration({ height = 190 }: { height?: number }) {
  return (
    <View style={{ width: '100%', height, backgroundColor: '#FCEFCF', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
      <Svg width="100%" height={height} viewBox="0 0 340 190">
        <Defs>
          <LinearGradient id="heroGruhaBg" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#FDF2D6" />
            <Stop offset="100%" stopColor="#F9E2BE" />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="340" height="190" fill="url(#heroGruhaBg)" />
        {/* Soft ground hill curve */}
        <Path d="M 0 162 Q 170 152 340 162 L 340 190 L 0 190 Z" fill="#E8CD9E" />

        {/* House Facade */}
        <Rect x="90" y="92" width="160" height="68" fill="#FFFDF8" rx="2" />

        {/* Roof - Deep Crimson/Maroon Pitch Triangle */}
        <Polygon points="74,92 170,44 266,92" fill="#8C2032" />

        {/* Left Window */}
        <Rect x="108" y="108" width="22" height="22" fill="#E8B04A" rx="1.5" />

        {/* Right Window */}
        <Rect x="210" y="108" width="22" height="22" fill="#E8B04A" rx="1.5" />

        {/* Center Entrance Door */}
        <Rect x="150" y="102" width="40" height="58" fill="#F6CA63" rx="1" />

        {/* Mango Leaf Festoon (Thoranam) along Door Header */}
        <Path d="M 148 102 L 192 102" stroke="#2E7D32" strokeWidth="2.5" />
        {[150, 155, 160, 165, 170, 175, 180, 185].map((x, i) => (
          <Polygon key={i} points={`${x},102 ${x + 2.5},110 ${x + 5},102`} fill="#2E7D32" />
        ))}

        {/* Threshold Kolam / Rangoli Arc at Doorstep */}
        <Path d="M 136 160 C 136 153, 204 153, 204 160 C 204 167, 136 167, 136 160 Z" stroke="#8C2032" strokeWidth="3" fill="none" />

        {/* Brass / Terracotta Kalash on the Right */}
        <G transform="translate(244, 126)">
          <Path d="M 10 24 Q 0 34 16 38 Q 32 38 22 24 Z" fill="#D99B26" stroke="#B87D18" strokeWidth="1" />
          <Rect x="8" y="21" width="16" height="4" rx="1" fill="#E6A833" />
          {/* Mango Leaves */}
          <Polygon points="5,21 16,8 13,21" fill="#3D8B37" />
          <Polygon points="27,21 16,8 19,21" fill="#3D8B37" />
          <Polygon points="10,21 16,3 22,21" fill="#4CAF50" />
          {/* Coconut */}
          <Circle cx="16" cy="14" r="6.5" fill="#8D5B28" />
        </G>
      </Svg>
    </View>
  );
}

import React from 'react';
import Svg, { Path, Circle, G, Line, Rect, SvgXml } from 'react-native-svg';

export interface CategoryIconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * 1. Lotus (Padma) Icon for "All"
 * Sacred lotus with center petal, flanking petals, calyx base, and auspicious bindus.
 */
export function LotusIcon({ size = 26, color = '#7C1B2C', strokeWidth = 1.6 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Top bindu */}
      <Circle cx="16" cy="3.5" r="0.9" fill={color} />

      {/* Center upright petal */}
      <Path
        d="M 16 5.5 C 13.8 11 13.8 16 16 20.5 C 18.2 16 18.2 11 16 5.5 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner left petal */}
      <Path
        d="M 15 20.5 C 11.5 18 10 12.5 11.5 8 C 13.8 11.5 14.5 15.5 15 20.5 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Inner right petal */}
      <Path
        d="M 17 20.5 C 20.5 18 22 12.5 20.5 8 C 18.2 11.5 17.5 15.5 17 20.5 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer left spreading petal */}
      <Path
        d="M 14 21 C 8.5 19 5.5 14.5 6 12 C 8.5 14 11.5 17.5 14 21 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Outer right spreading petal */}
      <Path
        d="M 18 21 C 23.5 19 26.5 14.5 26 12 C 23.5 14 20.5 17.5 18 21 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Lower calyx / base cradle */}
      <Path
        d="M 11 22.5 Q 16 24.5 21 22.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Path
        d="M 13 24.5 Q 16 26 19 24.5"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />

      {/* Base decorative dots */}
      <Circle cx="16" cy="27.5" r="0.9" fill={color} />
      <Circle cx="12.5" cy="26" r="0.7" fill={color} />
      <Circle cx="19.5" cy="26" r="0.7" fill={color} />
    </Svg>
  );
}

/**
 * 2. Gruha (Sacred Mandir / Home) Icon for "Gruha"
 * House with peaked roof, pinnacle kalash, swastika doorway, and flanking auspicious sprigs.
 */
export function GruhaIcon({ size = 26, color = '#7C1B2C', strokeWidth = 1.5 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Top finial / kalash & flag */}
      <Path
        d="M 16 3 L 16 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <Circle cx="16" cy="3" r="1" fill={color} />
      <Path
        d="M 16 4.5 Q 18.5 4 18 6 L 16 6"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />

      {/* Peaked gopuram roof */}
      <Path
        d="M 6.5 14 L 16 6.5 L 25.5 14"
        stroke={color}
        strokeWidth={strokeWidth * 1.1}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M 9.5 13.5 L 16 8.5 L 22.5 13.5"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* House walls */}
      <Path
        d="M 9 14.5 L 9 26.5 L 23 26.5 L 23 14.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base platform */}
      <Path
        d="M 7 26.5 L 25 26.5"
        stroke={color}
        strokeWidth={strokeWidth * 1.1}
        strokeLinecap="round"
      />

      {/* Doorway frame */}
      <Path
        d="M 12 26.5 L 12 18 L 20 18 L 20 26.5"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Auspicious Swastika inside doorway */}
      <G stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" strokeLinejoin="round">
        {/* Swastika vertical bar + arms */}
        <Path d="M 16 19.5 L 16 24.5" />
        <Path d="M 16 19.5 L 18 19.5" />
        <Path d="M 14 24.5 L 16 24.5" />

        {/* Swastika horizontal bar + arms */}
        <Path d="M 13.5 22 L 18.5 22" />
        <Path d="M 13.5 20 L 13.5 22" />
        <Path d="M 18.5 22 L 18.5 24" />
      </G>

      {/* Left auspicious foliage / tulsi sprig */}
      <Path
        d="M 5.5 23 L 5.5 18"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />
      <Path
        d="M 5.5 20 Q 3.5 19 4 17.5 Q 5.5 18.5 5.5 20"
        stroke={color}
        strokeWidth={strokeWidth * 0.7}
      />
      <Circle cx="5.5" cy="17" r="0.8" fill={color} />

      {/* Right auspicious foliage / tulsi sprig */}
      <Path
        d="M 26.5 23 L 26.5 18"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />
      <Path
        d="M 26.5 20 Q 28.5 19 28 17.5 Q 26.5 18.5 26.5 20"
        stroke={color}
        strokeWidth={strokeWidth * 0.7}
      />
      <Circle cx="26.5" cy="17" r="0.8" fill={color} />
    </Svg>
  );
}

/**
 * 3. Samskaras (Purna Kumbha / Kalash) Icon for "Samskaras"
 * Sacred kalash with swastika, sacred coconut, and radiating mango leaves.
 */
export function SamskarasIcon({ size = 26, color = '#7C1B2C', strokeWidth = 1.5 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Radiating Mango Leaves (Amra Pallava) behind coconut */}
      {/* Central top leaf */}
      <Path
        d="M 16 3 C 14.8 6 15 9 16 11 C 17 9 17.2 6 16 3 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinejoin="round"
      />
      {/* Left upper leaf */}
      <Path
        d="M 11.5 6 C 12 8.5 13.5 10.5 15 11.5 C 13.5 11 11.5 9 11.5 6 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinejoin="round"
      />
      {/* Right upper leaf */}
      <Path
        d="M 20.5 6 C 20 8.5 18.5 10.5 17 11.5 C 18.5 11 20.5 9 20.5 6 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinejoin="round"
      />
      {/* Left side leaf */}
      <Path
        d="M 8.5 10.5 C 10 12 12.5 12.8 14.5 13 C 12 13 9.5 12 8.5 10.5 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinejoin="round"
      />
      {/* Right side leaf */}
      <Path
        d="M 23.5 10.5 C 22 12 19.5 12.8 17.5 13 C 20 13 22.5 12 23.5 10.5 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinejoin="round"
      />

      {/* Sacred Coconut (Shreefal) */}
      <Path
        d="M 16 7.5 C 14 10 13.5 12 14 13.5 C 15 14 17 14 18 13.5 C 18.5 12 18 10 16 7.5 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Coconut texture marks */}
      <Path d="M 15 10.5 L 17 10.5" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />
      <Path d="M 14.8 12 L 17.2 12" stroke={color} strokeWidth={strokeWidth * 0.7} strokeLinecap="round" />

      {/* Kalash Neck rim */}
      <Path
        d="M 12 14.5 Q 16 15.5 20 14.5"
        stroke={color}
        strokeWidth={strokeWidth * 1.1}
        strokeLinecap="round"
      />
      <Path
        d="M 12.5 16.5 Q 16 17.2 19.5 16.5"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />

      {/* Kalash Body */}
      <Path
        d="M 12.5 16.5 C 9.5 18 8.5 22 11 25.5 C 12.2 27 19.8 27 21 25.5 C 23.5 22 22.5 18 19.5 16.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Kalash Base foot */}
      <Path
        d="M 12.5 26.5 Q 16 27.5 19.5 26.5"
        stroke={color}
        strokeWidth={strokeWidth * 1.1}
        strokeLinecap="round"
      />

      {/* Swastika on Kalash belly */}
      <G stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M 16 19.5 L 16 23.5" />
        <Path d="M 16 19.5 L 17.6 19.5" />
        <Path d="M 14.4 23.5 L 16 23.5" />

        <Path d="M 14 21.5 L 18 21.5" />
        <Path d="M 14 19.9 L 14 21.5" />
        <Path d="M 18 21.5 L 18 23.1" />
      </G>
    </Svg>
  );
}

/**
 * 4. Vratams (Anjali Mudra / Pranam / Namaste) Icon for "Vratams"
 * Folded hands in worship surrounded by radiating divine rays of light.
 */
export function VratamsIcon({ size = 26, color = '#7C1B2C', strokeWidth = 1.5 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Radiant Divine Halo / Blessing Rays above hands */}
      {/* Top center ray */}
      <Path d="M 16 2.5 L 16 4.5" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
      {/* Angle rays */}
      <Path d="M 12 3.8 L 12.8 5.4" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
      <Path d="M 20 3.8 L 19.2 5.4" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
      <Path d="M 8.5 6.5 L 10 7.8" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
      <Path d="M 23.5 6.5 L 22 7.8" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
      <Path d="M 6 10.5 L 8 11.2" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
      <Path d="M 26 10.5 L 24 11.2" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
      <Path d="M 5 15 L 7 15" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />
      <Path d="M 27 15 L 25 15" stroke={color} strokeWidth={strokeWidth * 0.85} strokeLinecap="round" />

      {/* Aura dots around arch */}
      <Circle cx="14" cy="3.2" r="0.6" fill={color} />
      <Circle cx="18" cy="3.2" r="0.6" fill={color} />
      <Circle cx="10" cy="5" r="0.6" fill={color} />
      <Circle cx="22" cy="5" r="0.6" fill={color} />
      <Circle cx="7" cy="8.5" r="0.6" fill={color} />
      <Circle cx="25" cy="8.5" r="0.6" fill={color} />
      <Circle cx="5.5" cy="12.5" r="0.6" fill={color} />
      <Circle cx="26.5" cy="12.5" r="0.6" fill={color} />

      {/* Left Hand: Wrist, Palm, Thumb & Fingers */}
      <Path
        d="M 12.5 27 L 12.5 24 C 11.8 22.5 10.5 19 12 17.5 C 13.2 16.5 14.5 18 14.5 18.5 C 13.8 17 14.5 11 16 9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right Hand: Wrist, Palm, Thumb & Fingers */}
      <Path
        d="M 19.5 27 L 19.5 24 C 20.2 22.5 21.5 19 20 17.5 C 18.8 16.5 17.5 18 17.5 18.5 C 18.2 17 17.5 11 16 9.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Center line dividing palms */}
      <Path
        d="M 16 9.5 L 16 22"
        stroke={color}
        strokeWidth={strokeWidth * 0.8}
        strokeLinecap="round"
      />

      {/* Finger joint accents */}
      <Path d="M 14.5 13 L 15.8 14" stroke={color} strokeWidth={strokeWidth * 0.65} strokeLinecap="round" />
      <Path d="M 17.5 13 L 16.2 14" stroke={color} strokeWidth={strokeWidth * 0.65} strokeLinecap="round" />

      {/* Wrist bangles / sacred thread lines */}
      <Path d="M 11.5 25 L 14 25" stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
      <Path d="M 18 25 L 20.5 25" stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
      <Path d="M 11.5 26.5 L 14 26.5" stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
      <Path d="M 18 26.5 L 20.5 26.5" stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * 5. Homams (Sacred Homa Kundam / Yajna Fire Altar) Icon for "Homams"
 * Stepped sacrificial altar (kunda) with roaring sacred flames (Agni).
 */
export function HomamsIcon({ size = 26, color = '#7C1B2C', strokeWidth = 1.5 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Sacred Agni (Flames) */}
      {/* Central tall sacred flame */}
      <Path
        d="M 16 4.5 C 14 9 13.5 12 14.5 14 C 15.5 12.5 17 12 16.5 9 C 18 11.5 18 13.5 16 16.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Inner flame core */}
      <Path
        d="M 16 7.5 C 15.2 10.5 15.2 13 16 14.5 C 16.8 13 16.8 10.5 16 7.5 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.75}
        strokeLinejoin="round"
      />
      {/* Left licking flame */}
      <Path
        d="M 13.5 15 C 12 13 11.5 10 12.5 8 C 11 10.5 10.5 13.5 12 16"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />
      {/* Right licking flame */}
      <Path
        d="M 18.5 15 C 20 13 20.5 10 19.5 8 C 21 10.5 21.5 13.5 20 16"
        stroke={color}
        strokeWidth={strokeWidth * 0.9}
        strokeLinecap="round"
      />

      {/* Stepped Homa Kundam */}
      {/* Top layer (pit opening) */}
      <Path
        d="M 10 16.5 L 22 16.5 L 21 19 L 11 19 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Middle stepped tier */}
      <Path
        d="M 8 19 L 24 19 L 23 22.5 L 9 22.5 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Tier geometric decor line & dots */}
      <Path d="M 9.5 20.8 L 22.5 20.8" stroke={color} strokeWidth={strokeWidth * 0.6} />
      <Circle cx="12" cy="20.8" r="0.6" fill={color} />
      <Circle cx="16" cy="20.8" r="0.6" fill={color} />
      <Circle cx="20" cy="20.8" r="0.6" fill={color} />

      {/* Bottom tier / foundation */}
      <Path
        d="M 5.5 22.5 L 26.5 22.5 L 25.5 25.5 L 6.5 25.5 Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      {/* Foundation decorative pattern */}
      <Path d="M 7.5 24 L 24.5 24" stroke={color} strokeWidth={strokeWidth * 0.6} />
      <Circle cx="9.5" cy="24" r="0.5" fill={color} />
      <Circle cx="13" cy="24" r="0.5" fill={color} />
      <Circle cx="16" cy="24" r="0.5" fill={color} />
      <Circle cx="19" cy="24" r="0.5" fill={color} />
      <Circle cx="22.5" cy="24" r="0.5" fill={color} />

      {/* Base ground line & supports */}
      <Path d="M 4 27 L 28 27" stroke={color} strokeWidth={strokeWidth * 1.1} strokeLinecap="round" />
      <Path d="M 8 25.5 L 7.5 27" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M 16 25.5 L 16 27" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M 24 25.5 L 24.5 27" stroke={color} strokeWidth={strokeWidth} />

      {/* Tiny sacred sparks */}
      <Circle cx="16" cy="2.8" r="0.8" fill={color} />
      <Circle cx="11.5" cy="6" r="0.6" fill={color} />
      <Circle cx="20.5" cy="6" r="0.6" fill={color} />
    </Svg>
  );
}

/**
 * 6. Festivals (Deepam / Diya) Icon for "Festivals"
 * Auspicious clay lamp with sacred flame, lotus pedestal, and divine aura.
 */
export function FestivalsIcon({ size = 26, color = '#7C1B2C', strokeWidth = 1.5 }: CategoryIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      {/* Top aura bindu */}
      <Circle cx="16" cy="3" r="0.9" fill={color} />

      {/* Radiance aura dots around flame */}
      <Circle cx="11.5" cy="8" r="0.7" fill={color} />
      <Circle cx="20.5" cy="8" r="0.7" fill={color} />
      <Circle cx="8.5" cy="13" r="0.7" fill={color} />
      <Circle cx="23.5" cy="13" r="0.7" fill={color} />

      {/* Aura rays */}
      <Path d="M 16 4.5 L 16 6" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M 12.8 6 L 13.8 7.2" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M 19.2 6 L 18.2 7.2" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M 10 10 L 11.5 10.8" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />
      <Path d="M 22 10 L 20.5 10.8" stroke={color} strokeWidth={strokeWidth * 0.8} strokeLinecap="round" />

      {/* Sacred Jyoti / Teardrop Flame */}
      <Path
        d="M 16 6.5 C 13.5 10.5 13 14 14.5 16.5 C 15.5 17.5 16.5 17.5 17.5 16.5 C 19 14 18.5 10.5 16 6.5 Z"
        stroke={color}
        strokeWidth={strokeWidth * 1.1}
        strokeLinejoin="round"
      />
      {/* Inner flame core / wick */}
      <Path
        d="M 16 10 C 15 12.5 15 14.5 16 15.8 C 17 14.5 17 12.5 16 10 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.75}
        strokeLinejoin="round"
      />

      {/* Diya Bowl rim */}
      <Path
        d="M 8 18.5 C 12 21 20 21 24 18.5"
        stroke={color}
        strokeWidth={strokeWidth * 1.2}
        strokeLinecap="round"
      />

      {/* Diya Bowl body */}
      <Path
        d="M 8 18.5 C 8.5 22.5 11.5 24.5 16 24.5 C 20.5 24.5 23.5 22.5 24 18.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />

      {/* Lotus Petal Base / Pedestal below Diya */}
      {/* Central petal */}
      <Path
        d="M 16 24.5 C 15 26.5 15 28 16 29 C 17 28 17 26.5 16 24.5 Z"
        stroke={color}
        strokeWidth={strokeWidth * 0.85}
        strokeLinejoin="round"
      />
      {/* Left petal */}
      <Path
        d="M 13 24.5 C 11.5 26 11 27.5 12 28.5 C 13.5 28 14.5 26.5 15 24.5"
        stroke={color}
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Right petal */}
      <Path
        d="M 19 24.5 C 20.5 26 21 27.5 20 28.5 C 18.5 28 17.5 26.5 17 24.5"
        stroke={color}
        strokeWidth={strokeWidth * 0.85}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base line */}
      <Path d="M 11 29 L 21 29" stroke={color} strokeWidth={strokeWidth * 0.9} strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Helper component that renders the appropriate crisp 4K vector icon
 * for each pooja category.
 */
export function CategoryIcon({
  category,
  svgContent,
  size = 24,
  color = '#7C1B2C',
}: {
  category: string;
  svgContent?: string | null;
  size?: number;
  color?: string;
}) {
  if (svgContent) {
    try {
      const coloredXml = svgContent.includes('currentColor')
        ? svgContent.replace(/currentColor/g, color)
        : svgContent;
      return <SvgXml xml={coloredXml} width={size} height={size} />;
    } catch (e) {
      // Fallback to vector icon below
    }
  }

  const catLower = (category || '').toLowerCase();
  if (catLower.includes('all')) return <LotusIcon size={size} color={color} />;
  if (catLower.includes('gruha')) return <GruhaIcon size={size} color={color} />;
  if (catLower.includes('samskara')) return <SamskarasIcon size={size} color={color} />;
  if (catLower.includes('vrata')) return <VratamsIcon size={size} color={color} />;
  if (catLower.includes('homa')) return <HomamsIcon size={size} color={color} />;
  if (catLower.includes('festiv')) return <FestivalsIcon size={size} color={color} />;

  return <LotusIcon size={size} color={color} />;
}

'use client';

import {
  Dumbbell, Car, ShieldCheck, Trees, Flame, Waves, Trophy, Baby,
  Clapperboard, ShoppingCart, Zap, ArrowUpDown, Lightbulb, Heart,
  Home, Flower2, Wind, Mountain, PartyPopper, IceCreamCone,
  Binoculars, Coffee, CloudSun, Droplets, ThermometerSun, Sparkles,
  Sofa, TreePine, Sprout, Footprints, Volleyball,
  type LucideIcon,
} from 'lucide-react';

// No Phosphor icons available in this install — all sport icons use Lucide fallbacks:
// PersonSimpleRun → Footprints, Cricket/Basketball/Squash → Trophy,
// Tennis/Badminton → Dumbbell, SoccerBall → Volleyball, Bicycle → Wind,
// PersonSimpleSwim → Waves

export interface AmenityMeta {
  icon: React.ElementType;
  label: string;
  color: string;
}

/**
 * Converts human-readable amenity names to snake_case lookup keys.
 * "Tennis Court" → "tennis_court", "Jogging Track" → "jogging_track"
 */
export function normalizeAmenityKey(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');
}

const AMENITY_MAP: Record<string, AmenityMeta> = {
  // ─── Pool / Water ───
  swimming_pool:               { icon: Waves,          label: 'Swimming Pool',       color: 'bg-blue-50' },
  lap_pool:                    { icon: Waves,          label: 'Lap Pool',             color: 'bg-blue-50' },
  kids_pool:                   { icon: Waves,          label: 'Kids Pool',            color: 'bg-blue-50' },
  hydrotherapy:                { icon: Droplets,       label: 'Hydrotherapy',         color: 'bg-blue-50' },
  private_pool:                { icon: Waves,          label: 'Private Pool',         color: 'bg-blue-50' },
  infinity_pool:               { icon: Waves,          label: 'Infinity Pool',        color: 'bg-blue-50' },
  temperature_controlled_pool: { icon: ThermometerSun, label: 'Temperature Pool',     color: 'bg-blue-50' },
  steam_sauna:                 { icon: Flame,          label: 'Steam & Sauna',        color: 'bg-orange-50' },
  jacuzzi:                     { icon: Droplets,       label: 'Jacuzzi',              color: 'bg-blue-50' },
  spa:                         { icon: Sparkles,       label: 'Spa',                  color: 'bg-purple-50' },
  health_club:                 { icon: Heart,          label: 'Health Club',          color: 'bg-red-50' },

  // ─── Fitness ───
  gym:                         { icon: Dumbbell,       label: 'Gym & Fitness',        color: 'bg-violet-50' },
  gymnasium:                   { icon: Dumbbell,       label: 'Gymnasium',            color: 'bg-violet-50' },
  yoga_area:                   { icon: Sparkles,       label: 'Yoga Area',            color: 'bg-purple-50' },
  yoga_room:                   { icon: Sparkles,       label: 'Yoga Room',            color: 'bg-purple-50' },
  yoga_deck:                   { icon: Sparkles,       label: 'Yoga Deck',            color: 'bg-purple-50' },
  yoga_center:                 { icon: Sparkles,       label: 'Yoga Center',          color: 'bg-purple-50' },
  meditation_pavilion:         { icon: Sparkles,       label: 'Meditation',           color: 'bg-purple-50' },
  meditation_garden:           { icon: Sparkles,       label: 'Meditation Garden',    color: 'bg-purple-50' },

  // ─── Sports — distinct icons per activity ───
  jogging_track:               { icon: Footprints,     label: 'Jogging Track',        color: 'bg-green-50' },
  running_track:               { icon: Footprints,     label: 'Running Track',        color: 'bg-green-50' },
  cycling_track:               { icon: Wind,           label: 'Cycling Track',        color: 'bg-green-50' },
  bicycle_track:               { icon: Wind,           label: 'Bicycle Track',        color: 'bg-green-50' },
  cricket_pitch:               { icon: Trophy,         label: 'Cricket Pitch',        color: 'bg-green-50' },
  cricket_stadium:             { icon: Trophy,         label: 'Cricket Stadium',      color: 'bg-green-50' },
  cricket_net:                 { icon: Trophy,         label: 'Cricket Nets',         color: 'bg-green-50' },
  cricket_academy:             { icon: Trophy,         label: 'Cricket Academy',      color: 'bg-green-50' },
  tennis_court:                { icon: Dumbbell,       label: 'Tennis Court',         color: 'bg-yellow-50' },
  lawn_tennis:                 { icon: Dumbbell,       label: 'Lawn Tennis',          color: 'bg-yellow-50' },
  basketball_court:            { icon: Trophy,         label: 'Basketball Court',     color: 'bg-orange-50' },
  football_ground:             { icon: Volleyball,     label: 'Football Ground',      color: 'bg-green-50' },
  badminton_court:             { icon: Dumbbell,       label: 'Badminton Court',      color: 'bg-green-50' },
  squash_court:                { icon: Trophy,         label: 'Squash Court',         color: 'bg-green-50' },
  skating_rink:                { icon: IceCreamCone,   label: 'Skating Rink',         color: 'bg-purple-50' },
  sports_courts:               { icon: Trophy,         label: 'Sports Courts',        color: 'bg-green-50' },
  multipurpose_sports:         { icon: Trophy,         label: 'Sports Area',          color: 'bg-green-50' },

  // ─── Clubhouse / Lounge ───
  resort_style_clubhouse:      { icon: Sofa,           label: 'Resort Clubhouse',     color: 'bg-amber-50' },
  clubhouse:                   { icon: Sofa,           label: 'Clubhouse',            color: 'bg-amber-50' },
  club_house:                  { icon: Sofa,           label: 'Club House',           color: 'bg-amber-50' },
  luxury_club:                 { icon: Sparkles,       label: 'Luxury Club',          color: 'bg-amber-50' },
  luxury_lobby:                { icon: Sparkles,       label: 'Luxury Lobby',         color: 'bg-amber-50' },
  sky_lounge:                  { icon: CloudSun,       label: 'Sky Lounge',           color: 'bg-sky-50' },

  // ─── Entertainment ───
  floating_restaurant:         { icon: Coffee,         label: 'Restaurant',           color: 'bg-rose-50' },
  amphitheatre:                { icon: Clapperboard,   label: 'Amphitheatre',         color: 'bg-purple-50' },
  mini_theater:                { icon: Clapperboard,   label: 'Mini Theater',         color: 'bg-purple-50' },
  cafe:                        { icon: Coffee,         label: 'Café & Lounge',        color: 'bg-rose-50' },
  multipurpose_hall:           { icon: PartyPopper,    label: 'Multipurpose Hall',    color: 'bg-pink-50' },
  party_hall:                  { icon: PartyPopper,    label: 'Party Hall',           color: 'bg-pink-50' },

  // ─── Kids / Family ───
  kids_play_area:              { icon: Baby,           label: 'Kids Play Area',       color: 'bg-pink-50' },
  children_play_area:          { icon: Baby,           label: 'Kids Play Area',       color: 'bg-pink-50' },
  child_development_center:    { icon: Baby,           label: 'Kids Center',          color: 'bg-pink-50' },
  landscaped_play_zones:       { icon: Baby,           label: 'Play Zones',           color: 'bg-pink-50' },
  private_party_deck:          { icon: PartyPopper,    label: 'Party Deck',           color: 'bg-pink-50' },

  // ─── Shopping ───
  shopping_center:             { icon: ShoppingCart,   label: 'Shopping Center',      color: 'bg-teal-50' },
  shopping_arcade:             { icon: ShoppingCart,   label: 'Shopping Arcade',      color: 'bg-teal-50' },
  convenience_store:           { icon: ShoppingCart,   label: 'Convenience Store',    color: 'bg-teal-50' },
  convenient_shopping:         { icon: ShoppingCart,   label: 'Shopping',             color: 'bg-teal-50' },
  feature_mall:                { icon: ShoppingCart,   label: 'Feature Mall',         color: 'bg-teal-50' },

  // ─── Security / Service ───
  security:                    { icon: ShieldCheck,    label: '24/7 Security',        color: 'bg-slate-50' },
  concierge:                   { icon: ShieldCheck,    label: 'Concierge',            color: 'bg-slate-50' },
  concierge_service:           { icon: ShieldCheck,    label: 'Concierge Service',    color: 'bg-slate-50' },
  smart_home_automation:       { icon: Lightbulb,      label: 'Smart Home',           color: 'bg-indigo-50' },

  // ─── Tech / Infra ───
  power_backup:                { icon: Zap,            label: 'Power Backup',         color: 'bg-yellow-50' },
  private_elevator:            { icon: ArrowUpDown,    label: 'Private Elevator',     color: 'bg-slate-50' },
  automated_lighting:          { icon: Lightbulb,      label: 'Smart Lighting',       color: 'bg-yellow-50' },
  high_speed_lifts:            { icon: ArrowUpDown,    label: 'High-Speed Lifts',     color: 'bg-slate-50' },
  health_wellness_clinic:      { icon: Heart,          label: 'Wellness Clinic',      color: 'bg-red-50' },
  electric_charging_station:   { icon: Zap,            label: 'EV Charging',          color: 'bg-yellow-50' },

  // ─── Parking ───
  parking:                     { icon: Car,            label: 'Parking',              color: 'bg-gray-50' },
  dedicated_parking:           { icon: Car,            label: 'Dedicated Parking',    color: 'bg-gray-50' },

  // ─── Golf / Garden ───
  golf_course:                 { icon: TreePine,       label: 'Golf Course',          color: 'bg-emerald-50' },
  golf_facing:                 { icon: TreePine,       label: 'Golf View',            color: 'bg-emerald-50' },
  golf_course_access:          { icon: TreePine,       label: 'Golf Access',          color: 'bg-emerald-50' },
  golf_view:                   { icon: TreePine,       label: 'Golf View',            color: 'bg-emerald-50' },
  pitch_and_putt_golf:         { icon: TreePine,       label: 'Golf',                 color: 'bg-emerald-50' },
  organic_garden:              { icon: Sprout,         label: 'Organic Garden',       color: 'bg-emerald-50' },
  private_garden:              { icon: Sprout,         label: 'Private Garden',       color: 'bg-emerald-50' },
  orchard_gardens:             { icon: Trees,          label: 'Orchard Gardens',      color: 'bg-emerald-50' },

  // ─── Outdoor / View ───
  forest_groves:               { icon: Trees,          label: 'Forest Grove',         color: 'bg-emerald-50' },
  sculpture_garden:            { icon: Flower2,        label: 'Sculpture Garden',     color: 'bg-emerald-50' },
  panoramic_view:              { icon: Binoculars,     label: 'Panoramic View',       color: 'bg-sky-50' },
  three_side_open:             { icon: Wind,           label: 'Three-Side Open',      color: 'bg-sky-50' },
  private_terrace:             { icon: CloudSun,       label: 'Private Terrace',      color: 'bg-sky-50' },
  low_density:                 { icon: Mountain,       label: 'Low Density',          color: 'bg-emerald-50' },
  sitting_plaza:               { icon: Sofa,           label: 'Sitting Plaza',        color: 'bg-amber-50' },

  // ─── Interior / Luxury ───
  marazzo_flooring:            { icon: Home,           label: 'Premium Flooring',     color: 'bg-amber-50' },
  luxury_interiors:            { icon: Home,           label: 'Luxury Interiors',     color: 'bg-amber-50' },
  ac_units:                    { icon: Wind,           label: 'AC Units',             color: 'bg-sky-50' },
  modular_kitchen:             { icon: Home,           label: 'Modular Kitchen',      color: 'bg-amber-50' },
  vitrified_tiles:             { icon: Home,           label: 'Premium Flooring',     color: 'bg-amber-50' },
};

export function getAmenityMeta(amenityKey: string): AmenityMeta {
  const normalized = normalizeAmenityKey(amenityKey);
  if (AMENITY_MAP[normalized]) return AMENITY_MAP[normalized];
  if (AMENITY_MAP[amenityKey]) return AMENITY_MAP[amenityKey];

  const label = amenityKey
    .replace(/_/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
  return { icon: Home, label, color: 'bg-gray-50' };
}

export function getMappedAmenities(amenities: string[], max = 6): AmenityMeta[] {
  const seen = new Set<string>();
  return amenities
    .map((a) => getAmenityMeta(a))
    .filter((meta) => {
      if (seen.has(meta.label)) return false;
      seen.add(meta.label);
      return true;
    })
    .slice(0, max);
}

type AmenitySize = 'sm' | 'md' | 'lg' | 'xl';

const sizeMap = {
  sm: { tile: 'w-9 h-9',   lucide: 14, label: 'text-[9px]' },
  md: { tile: 'w-12 h-12', lucide: 18, label: 'text-[10px]' },
  lg: { tile: 'w-16 h-16', lucide: 24, label: 'text-xs' },
  xl: { tile: 'w-20 h-20', lucide: 32, label: 'text-sm' },
};

interface AmenityIconProps {
  amenity: string;
  size?: AmenitySize;
  showLabel?: boolean;
}

export default function AmenityIcon({ amenity, size = 'md', showLabel = true }: AmenityIconProps) {
  const meta = getAmenityMeta(amenity);
  const s = sizeMap[size];
  const IconComp = meta.icon;

  return (
    <div className="flex flex-col items-center gap-1" title={meta.label}>
      <div className={`${s.tile} ${meta.color} rounded-xl flex items-center justify-center transition-colors hover:brightness-95`}>
        <IconComp size={s.lucide} className="text-gray-600" strokeWidth={1.8} />
      </div>
      {showLabel && (
        <span className={`${s.label} text-gray-500 text-center leading-tight max-w-[4.5rem] truncate`}>
          {meta.label}
        </span>
      )}
    </div>
  );
}

export function AmenityGrid({
  amenities,
  max = 6,
  size = 'md',
  showLabel = true,
  cols = 'grid-cols-3 sm:grid-cols-6',
}: {
  amenities: string[];
  max?: number;
  size?: AmenitySize;
  showLabel?: boolean;
  cols?: string;
}) {
  const mapped = getMappedAmenities(amenities, max);
  if (mapped.length === 0) return null;

  return (
    <div className={`grid ${cols} gap-3`}>
      {mapped.map((meta, idx) => {
        const IconComp = meta.icon;
        const s = sizeMap[size];
        return (
          <div key={idx} className="flex flex-col items-center gap-1" title={meta.label}>
            <div className={`${s.tile} ${meta.color} rounded-xl flex items-center justify-center hover:brightness-95 transition-colors`}>
              <IconComp size={s.lucide} className="text-gray-600" strokeWidth={1.8} />
            </div>
            {showLabel && (
              <span className={`${s.label} text-gray-500 text-center leading-tight max-w-[4.5rem] truncate`}>
                {meta.label}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

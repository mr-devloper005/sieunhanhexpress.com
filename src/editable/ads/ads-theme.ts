// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.
// You control the LOOK here (radius, border, shadow, background, label color).
// You CANNOT change the ad's shape/fit from here — that stays locked in
// src/lib/ad-slots.ts, so the ad always displays correctly no matter what.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Site-wide default skin — tune to your brand.
export const adSkin: AdSkin = {
  radius: '26px',
  border: '1px solid #EADCD4',
  shadow: 'none',
  background: '#FFFFFF',
  labelClassName: 'bg-[#F4553D] text-white',
}

// Optional per-slot overrides — adjust only where you need to.
export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '22px', background: '#F6E9E3' },
  popup: { radius: '30px' },
  header: { radius: '26px', background: '#F6E9E3' },
  rail: { radius: '20px' },
  feature: { radius: '26px' },
  interstitial: { radius: '30px', shadow: '0 30px 80px rgba(24,18,17,0.35)' },
  anchor: { radius: '999px', shadow: '0 10px 34px rgba(24,18,17,0.18)' },
}

/** Merge site default + per-slot override for a slot. */
export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
// junior tweak



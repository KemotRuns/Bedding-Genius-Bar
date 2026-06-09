import type { QuestionConfig } from './types'

// ── Icons ─────────────────────────────────────────────────────────────────────

// Temperature icons
const FlameIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4C16 4 21 10 21 16C21 18.2 20.1 20.2 18.5 21.5C18.8 20.2 18.5 18.7 17.5 17.5C17.5 17.5 16 19 14.5 17.5C13 16 13 14 13 14C13 14 11 17 13 21C11.5 19.8 11 17.9 11 16C11 10 16 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 28C18.8 28 21 25.8 21 23C21 20.2 16 16 16 16C16 16 11 20.2 11 23C11 25.8 13.2 28 16 28Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const ThermometerHighIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="13" y="5" width="6" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="25" r="4" stroke="currentColor" strokeWidth="2"/>
    <rect x="15" y="7" width="2" height="14" rx="1" fill="currentColor"/>
  </svg>
)

const ThermometerMidIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="13" y="5" width="6" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="25" r="4" stroke="currentColor" strokeWidth="2"/>
    <rect x="15" y="11" width="2" height="10" rx="1" fill="currentColor"/>
  </svg>
)

const SnowflakeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <line x1="16" y1="3" x2="16" y2="29" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="3" y1="16" x2="29" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="7" y1="7" x2="25" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="25" y1="7" x2="7" y2="25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="3" fill="currentColor"/>
    <circle cx="16" cy="4" r="1.5" fill="currentColor"/>
    <circle cx="16" cy="28" r="1.5" fill="currentColor"/>
    <circle cx="4" cy="16" r="1.5" fill="currentColor"/>
    <circle cx="28" cy="16" r="1.5" fill="currentColor"/>
  </svg>
)

// Skin icons
const ShieldNoneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L6 8V17C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 17V8L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

const ShieldSensitiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L6 8V17C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 17V8L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="2" fill="currentColor"/>
    <line x1="16" y1="11" x2="16" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ShieldAllergyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L6 8V17C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 17V8L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <line x1="13" y1="12" x2="19" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="19" y1="12" x2="13" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Care level icons
const CareMinimalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="6" y="6" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="19" r="5" stroke="currentColor" strokeWidth="2"/>
    <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="11" r="1" fill="currentColor"/>
    <circle cx="21" cy="11" r="1" fill="currentColor"/>
    <path d="M13 23L15.5 25L19 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const CareStandardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="6" y="6" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="19" r="5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="19" r="2" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="11" r="1" fill="currentColor"/>
    <circle cx="21" cy="11" r="1" fill="currentColor"/>
  </svg>
)

const CareCarefulIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M8 18C8 18 7 14 9 11C11 8 14 8 16 8C18 8 21 8 23 11C25 14 24 18 24 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M5 20C5 20 6 24 9 26C12 28 16 28 16 28C16 28 20 28 23 26C26 24 27 20 27 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M11 22C11 22 12 25 16 25C20 25 21 22 21 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="16" cy="13" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// Sensory preference icons
const CoolingIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M6 16C6 16 9 10 16 10C23 10 26 16 26 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 22C6 22 9 16 16 16C23 16 26 22 26 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="13" r="1.5" fill="currentColor"/>
    <circle cx="10" cy="19" r="1.5" fill="currentColor"/>
    <circle cx="22" cy="19" r="1.5" fill="currentColor"/>
  </svg>
)

const SilkyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M6 8C8 8 10 12 12 12C14 12 14 8 16 8C18 8 18 12 20 12C22 12 24 8 26 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 16C8 16 10 20 12 20C14 20 14 16 16 16C18 16 18 20 20 20C22 20 24 16 26 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 24C8 24 10 28 12 28C14 28 14 24 16 24C18 24 18 28 20 28C22 28 24 24 26 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ClassicIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="5" y="5" width="22" height="22" rx="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="5" y1="12" x2="27" y2="12" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="5" y1="19" x2="27" y2="19" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="12" y1="5" x2="12" y2="27" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="19" y1="5" x2="19" y2="27" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// Comforter temperature
const PersonColdIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 28V18C10 15.8 11.8 14 14 14H18C20.2 14 22 15.8 22 18V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
    <path d="M7 10L5 8L7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 8H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const PersonNeutralIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 28V18C10 15.8 11.8 14 14 14H18C20.2 14 22 15.8 22 18V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const PersonHotIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 28V18C10 15.8 11.8 14 14 14H18C20.2 14 22 15.8 22 18V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 6C24.5 7 25 8 24.5 9.5C24 11 24 12 25 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M27 5C27.5 6.5 28 8 27 10C26 12 27 13.5 27.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// Comforter feel icons
const HeavyBlanketIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="8" width="24" height="5" rx="2" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="15" width="24" height="5" rx="2" stroke="currentColor" strokeWidth="2"/>
    <rect x="4" y="22" width="24" height="5" rx="2" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const CloudIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M8 22C5.2 22 3 19.8 3 17C3 14.5 4.8 12.4 7.2 12.1C7.1 11.7 7 11.4 7 11C7 8.2 9.2 6 12 6C13.7 6 15.2 6.8 16.2 8C17 6.8 18.4 6 20 6C22.8 6 25 8.2 25 11C25 11.4 24.9 11.7 24.8 12.1C27.2 12.4 29 14.5 29 17C29 19.8 26.8 22 24 22H8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

const SmoothWaveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M3 12C5.5 12 5.5 8 8 8C10.5 8 10.5 12 13 12C15.5 12 15.5 8 18 8C20.5 8 20.5 12 23 12C25.5 12 25.5 8 28 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 20C5.5 20 5.5 16 8 16C10.5 16 10.5 20 13 20C15.5 20 15.5 16 18 16C20.5 16 20.5 20 23 20C25.5 20 25.5 16 28 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M3 26C5.5 26 5.5 24 8 24C10.5 24 10.5 26 13 26C15.5 26 15.5 24 18 24C20.5 24 20.5 26 23 26C25.5 26 25.5 24 28 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const PracticalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="6" y="6" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="19" r="5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="19" r="2" fill="currentColor" opacity="0.3"/>
    <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="11" r="1" fill="currentColor"/>
    <circle cx="21" cy="11" r="1" fill="currentColor"/>
    <path d="M18 30L16 28L20 28L18 30Z" fill="currentColor"/>
  </svg>
)

// Breathing icons
const BreathingYesIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 6C12 6 8 10 8 16C8 19 10 22 12 24H20C22 22 24 19 24 16C24 10 20 6 16 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 24V26C12 27 13 28 14 28H18C19 28 20 27 20 26V24" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="10" x2="16" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="25" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/>
    <line x1="23" y1="8" x2="27" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="25" y1="6" x2="25" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const BreathingNoIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 6C12 6 8 10 8 16C8 19 10 22 12 24H20C22 22 24 19 24 16C24 10 20 6 16 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 24V26C12 27 13 28 14 28H18C19 28 20 27 20 26V24" stroke="currentColor" strokeWidth="2"/>
    <line x1="12" y1="14" x2="20" y2="14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="16" y1="10" x2="16" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 6L27 11M27 6L22 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

// Sleep position icons
const SideSleepIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="22" cy="9" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 12C22 12 22 16 18 18L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 18L18 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="4" y="25" width="24" height="2" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
)

const BackSleepIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="7" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 10V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 14L10 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 14L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 20L13 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 20L19 25" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="4" y="28" width="24" height="2" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
)

const StomachSleepIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="10" cy="9" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 12C10 12 14 14 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 16C8 16 6 20 8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 18C16 18 20 20 22 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="4" y="25" width="24" height="2" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
)

const ComboSleepIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11L16 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 15L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
    <path d="M16 15L22 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
    <path d="M16 21L13 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 21L19 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Shoulder width icons
const PetiteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 16L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 16L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 24L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 24L18 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const AverageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="7" r="3.5" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 15L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 15L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 23L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 23L18 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const BroadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <circle cx="16" cy="6" r="3.5" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 10V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 14L9 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 14L23 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 22L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 22L18 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Pillow feel icons
const SinkIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="18" width="24" height="8" rx="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 4V16M16 16L12 12M16 16L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 18C7 18 10 22 16 22C22 22 25 18 25 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.5"/>
  </svg>
)

const SpringyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M10 6C10 6 22 6 22 12C22 18 10 18 10 24C10 30 22 30 22 30" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M14 4L10 6L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 28L22 30L18 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ContourIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M4 20C4 20 8 12 12 12C16 12 14 20 18 20C22 20 24 14 28 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M4 26H28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
    <circle cx="10" cy="14" r="2" fill="currentColor" opacity="0.4"/>
  </svg>
)

const BalancedIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <rect x="4" y="16" width="24" height="10" rx="5" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 6V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
    <path d="M10 16C10 16 10 11 16 11C22 11 22 16 22 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// Pillow priority icons
const AllergyProtectIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L6 8V17C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 17V8L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 16L15 19L20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ValueIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M6 16L14 6H26L26 18L18 28H6L6 16Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="21" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

const PremiumIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
    <path d="M16 4L19 12H28L21 17L24 25L16 20L8 25L11 17L4 12H13L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

// ── Questions ─────────────────────────────────────────────────────────────────

export const QUESTIONS: QuestionConfig[] = [

  // ── SHEETS & MATERIALS ──────────────────────────────────────────
  {
    id: 'nightHeat',
    section: 'Sheets & Materials',
    question: 'Do you overheat or sweat at night, or do you tend to feel cold in bed?',
    columns: 4,
    options: [
      { value: 'Very Hot', label: 'Often hot / sweats', icon: <FlameIcon />, sublabel: 'Night sweats or very warm' },
      { value: 'Warm', label: 'Slightly warm', icon: <ThermometerHighIcon />, sublabel: 'Kick covers off sometimes' },
      { value: 'Neutral', label: 'Just right', icon: <ThermometerMidIcon />, sublabel: 'Comfortable most nights' },
      { value: 'Cold', label: 'Usually cold', icon: <SnowflakeIcon />, sublabel: 'Always reaching for blankets' },
    ],
  },

  {
    id: 'skinType',
    section: 'Sheets & Materials',
    question: 'Does your skin react to certain fabrics, or do you have allergies or eczema?',
    columns: 3,
    options: [
      { value: 'Allergic/Eczema', label: 'Eczema or allergies', icon: <ShieldAllergyIcon />, sublabel: 'Strong reactions to fabric' },
      { value: 'Sensitive', label: 'Sensitive skin', icon: <ShieldSensitiveIcon />, sublabel: 'Mild irritation sometimes' },
      { value: 'None', label: 'No concerns', icon: <ShieldNoneIcon />, sublabel: 'No skin issues' },
    ],
  },

  {
    id: 'careLevel',
    section: 'Sheets & Materials',
    question: 'How much time can you give to washing and caring for your sheets?',
    columns: 3,
    options: [
      { value: 'Minimal', label: 'Wash and go', icon: <CareMinimalIcon />, sublabel: 'Machine wash, no ironing' },
      { value: 'Standard', label: 'Regular machine wash', icon: <CareStandardIcon />, sublabel: 'Happy to follow care labels' },
      { value: 'Careful', label: 'Happy to hand wash', icon: <CareCarefulIcon />, sublabel: 'Dry-clean or gentle wash OK' },
    ],
  },

  {
    id: 'sensoryPref',
    section: 'Sheets & Materials',
    question: 'What feeling do you look for the moment you get into bed?',
    columns: 3,
    options: [
      { value: 'Cooling', label: 'Cool & crisp', icon: <CoolingIcon />, sublabel: 'Instant cool-to-touch refresh' },
      { value: 'Silky', label: 'Silky & lustrous', icon: <SilkyIcon />, sublabel: 'Smooth, elegant, natural sheen' },
      { value: 'Classic', label: 'Classic soft comfort', icon: <ClassicIcon />, sublabel: 'Familiar, reliable, cosy' },
    ],
  },

  // ── COMFORTER ───────────────────────────────────────────────────
  {
    id: 'comforterTemp',
    section: 'Comforter',
    question: 'Under the covers at night — do you sleep cold, or do you kick the duvet off?',
    columns: 3,
    options: [
      { value: 'Always Cold', label: 'Always cold', icon: <PersonColdIcon />, sublabel: 'Need heavy warmth to sleep' },
      { value: 'Neutral', label: 'Comfortable', icon: <PersonNeutralIcon />, sublabel: 'Most nights are just right' },
      { value: 'Hot', label: 'Often too warm', icon: <PersonHotIcon />, sublabel: 'Kick covers off at night' },
    ],
  },

  {
    id: 'comforterFeel',
    section: 'Comforter',
    question: 'Do you prefer a heavy cocooned feel, or something light and airy?',
    columns: 4,
    options: [
      { value: 'Heavy', label: 'Heavy & wrapped', icon: <HeavyBlanketIcon />, sublabel: 'Secure, weighted warmth' },
      { value: 'Fluffy', label: 'Light & fluffy', icon: <CloudIcon />, sublabel: 'Cloud-like, weightless loft' },
      { value: 'Smooth', label: 'Smooth & light', icon: <SmoothWaveIcon />, sublabel: 'Body-hugging, breathable' },
      { value: 'Practical', label: 'Practical & easy', icon: <PracticalIcon />, sublabel: 'Machine washable, durable' },
    ],
  },

  {
    id: 'breathingIssues',
    section: 'Comforter',
    question: 'Do asthma, dust allergies, or breathing sensitivities disrupt your sleep?',
    columns: 2,
    options: [
      { value: 'Yes', label: 'Yes, it affects me', icon: <BreathingYesIcon />, sublabel: 'Allergies or asthma at night' },
      { value: 'No', label: 'No issues', icon: <BreathingNoIcon />, sublabel: 'Breathing is not a concern' },
    ],
  },

  // ── PILLOWS ─────────────────────────────────────────────────────
  {
    id: 'sleepPosition',
    section: 'Pillows',
    question: 'What is your main sleeping position?',
    columns: 4,
    options: [
      { value: 'Side', label: 'Side', icon: <SideSleepIcon />, sublabel: 'Ear to shoulder' },
      { value: 'Back', label: 'Back', icon: <BackSleepIcon />, sublabel: 'Facing the ceiling' },
      { value: 'Stomach', label: 'Stomach', icon: <StomachSleepIcon />, sublabel: 'Face down' },
      { value: 'Combination', label: 'All over', icon: <ComboSleepIcon />, sublabel: 'I move around a lot' },
    ],
  },

  {
    id: 'shoulderWidth',
    section: 'Pillows',
    question: 'How wide are your shoulders? This determines your ideal pillow height.',
    columns: 3,
    options: [
      { value: 'Petite', label: 'Narrower (S/XS)', icon: <PetiteIcon />, sublabel: '~36 cm or less' },
      { value: 'Average', label: 'Average (M/L)', icon: <AverageIcon />, sublabel: '~38–44 cm' },
      { value: 'Broad', label: 'Broader (XL+)', icon: <BroadIcon />, sublabel: '~46 cm or more' },
    ],
  },

  {
    id: 'pillowFeel',
    section: 'Pillows',
    question: 'Do you prefer your head to sink deeply in, or be actively supported?',
    columns: 4,
    options: [
      { value: 'Sink', label: 'Sink in & fluffy', icon: <SinkIcon />, sublabel: 'Soft, cushioned, enveloping' },
      { value: 'Springy', label: 'Resilient & springy', icon: <SpringyIcon />, sublabel: 'Pushes back, responsive' },
      { value: 'Contour', label: 'Pressure-relieving', icon: <ContourIcon />, sublabel: 'Moulds to neck shape' },
      { value: 'Balanced', label: 'Balanced support', icon: <BalancedIcon />, sublabel: 'Soft resilience, easy care' },
    ],
  },

  {
    id: 'pillowPriority',
    section: 'Pillows',
    question: 'What matters most in your pillow decision?',
    columns: 3,
    options: [
      { value: 'Allergies', label: 'Allergy protection', icon: <AllergyProtectIcon />, sublabel: 'Hypoallergenic is a must' },
      { value: 'Value', label: 'Best value', icon: <ValueIcon />, sublabel: 'Great comfort per dollar' },
      { value: 'Premium', label: 'Premium quality', icon: <PremiumIcon />, sublabel: 'Only the best materials' },
    ],
  },
]

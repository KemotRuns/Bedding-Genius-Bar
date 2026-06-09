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
    question_zh: '您晚上睡覺時，通常感覺如何？',
    columns: 4,
    options: [
      { value: 'Very Hot', label: 'Often hot / sweats', label_zh: '非常熱', icon: <FlameIcon />, sublabel: 'Night sweats or very warm', sublabel_zh: '常常踢被、容易盜汗' },
      { value: 'Warm', label: 'Slightly warm', label_zh: '偏熱', icon: <ThermometerHighIcon />, sublabel: 'Kick covers off sometimes', sublabel_zh: '偏熱但大致舒適' },
      { value: 'Neutral', label: 'Just right', label_zh: '體溫適中', icon: <ThermometerMidIcon />, sublabel: 'Comfortable most nights', sublabel_zh: '整夜體溫均衡舒適' },
      { value: 'Cold', label: 'Usually cold', label_zh: '偏冷', icon: <SnowflakeIcon />, sublabel: 'Always reaching for blankets', sublabel_zh: '容易感到寒冷' },
    ],
  },

  {
    id: 'skinType',
    section: 'Sheets & Materials',
    question: 'Does your skin react to certain fabrics, or do you have allergies or eczema?',
    question_zh: '您的皮膚容易對材質產生反應嗎？',
    columns: 3,
    options: [
      { value: 'Allergic/Eczema', label: 'Eczema or allergies', label_zh: '過敏／濕疹', icon: <ShieldAllergyIcon />, sublabel: 'Strong reactions to fabric', sublabel_zh: '有已知過敏或皮膚炎' },
      { value: 'Sensitive', label: 'Sensitive skin', label_zh: '敏感肌', icon: <ShieldSensitiveIcon />, sublabel: 'Mild irritation sometimes', sublabel_zh: '接觸粗糙材質偶爾泛紅' },
      { value: 'None', label: 'No concerns', label_zh: '無特殊狀況', icon: <ShieldNoneIcon />, sublabel: 'No skin issues', sublabel_zh: '皮膚耐受性強' },
    ],
  },

  {
    id: 'careLevel',
    section: 'Sheets & Materials',
    question: 'How much time can you give to washing and caring for your sheets?',
    question_zh: '您願意花多少心思保養寢具？',
    columns: 3,
    options: [
      { value: 'Minimal', label: 'Wash and go', label_zh: '越簡單越好', icon: <CareMinimalIcon />, sublabel: 'Machine wash, no ironing', sublabel_zh: '機洗即可，快速搞定' },
      { value: 'Standard', label: 'Regular machine wash', label_zh: '標準保養', icon: <CareStandardIcon />, sublabel: 'Happy to follow care labels', sublabel_zh: '會遵照洗標指示' },
      { value: 'Careful', label: 'Happy to hand wash', label_zh: '細心呵護', icon: <CareCarefulIcon />, sublabel: 'Dry-clean or gentle wash OK', sublabel_zh: '重視品質，願意用心保養' },
    ],
  },

  {
    id: 'sensoryPref',
    section: 'Sheets & Materials',
    question: 'What feeling do you look for the moment you get into bed?',
    question_zh: '您最重視床單的哪種觸感？',
    columns: 3,
    options: [
      { value: 'Cooling', label: 'Cool & crisp', label_zh: '清涼感', icon: <CoolingIcon />, sublabel: 'Instant cool-to-touch refresh', sublabel_zh: '瞬間接觸涼感，清爽降溫' },
      { value: 'Silky', label: 'Silky & lustrous', label_zh: '絲滑感', icon: <SilkyIcon />, sublabel: 'Smooth, elegant, natural sheen', sublabel_zh: '柔順奢華，如絲綢般滑順' },
      { value: 'Classic', label: 'Classic soft comfort', label_zh: '棉質感', icon: <ClassicIcon />, sublabel: 'Familiar, reliable, cosy', sublabel_zh: '天然透氣，日常舒適' },
    ],
  },

  // ── COMFORTER ───────────────────────────────────────────────────
  {
    id: 'comforterTemp',
    section: 'Comforter',
    question: 'Under the covers at night — do you sleep cold, or do you kick the duvet off?',
    question_zh: '您在被窩裡容易感到寒冷，還是容易過熱？',
    columns: 3,
    options: [
      { value: 'Always Cold', label: 'Always cold', label_zh: '非常怕冷', icon: <PersonColdIcon />, sublabel: 'Need heavy warmth to sleep', sublabel_zh: '蓋很厚還是覺得不夠暖' },
      { value: 'Neutral', label: 'Comfortable', label_zh: '適中舒適', icon: <PersonNeutralIcon />, sublabel: 'Most nights are just right', sublabel_zh: '一般棉被就足夠保暖' },
      { value: 'Hot', label: 'Often too warm', label_zh: '容易發熱', icon: <PersonHotIcon />, sublabel: 'Kick covers off at night', sublabel_zh: '睡覺容易發熱，常常踢被' },
    ],
  },

  {
    id: 'comforterFeel',
    section: 'Comforter',
    question: 'Do you prefer a heavy cocooned feel, or something light and airy?',
    question_zh: '您偏好哪種棉被觸感？',
    columns: 4,
    options: [
      { value: 'Heavy', label: 'Heavy & wrapped', label_zh: '厚實沉穩', icon: <HeavyBlanketIcon />, sublabel: 'Secure, weighted warmth', sublabel_zh: '喜歡有重量、包覆感' },
      { value: 'Fluffy', label: 'Light & fluffy', label_zh: '蓬鬆輕盈', icon: <CloudIcon />, sublabel: 'Cloud-like, weightless loft', sublabel_zh: '如雲朵般柔軟蓬鬆' },
      { value: 'Smooth', label: 'Smooth & light', label_zh: '輕薄順滑', icon: <SmoothWaveIcon />, sublabel: 'Body-hugging, breathable', sublabel_zh: '輕盈滑順，翻身自如' },
      { value: 'Practical', label: 'Practical & easy', label_zh: '實用易洗', icon: <PracticalIcon />, sublabel: 'Machine washable, durable', sublabel_zh: '易洗易乾，注重方便' },
    ],
  },

  {
    id: 'breathingIssues',
    section: 'Comforter',
    question: 'Do asthma, dust allergies, or breathing sensitivities disrupt your sleep?',
    question_zh: '您有塵蟎過敏、氣喘或睡眠呼吸問題嗎？',
    columns: 2,
    options: [
      { value: 'Yes', label: 'Yes, it affects me', label_zh: '有，會影響睡眠', icon: <BreathingYesIcon />, sublabel: 'Allergies or asthma at night', sublabel_zh: '尤其在冬天或乾燥季節' },
      { value: 'No', label: 'No issues', label_zh: '沒有困擾', icon: <BreathingNoIcon />, sublabel: 'Breathing is not a concern', sublabel_zh: '幾乎不受影響' },
    ],
  },

  // ── PILLOWS ─────────────────────────────────────────────────────
  {
    id: 'sleepPosition',
    section: 'Pillows',
    question: 'What is your main sleeping position?',
    question_zh: '您最常用的睡姿是？',
    columns: 4,
    options: [
      { value: 'Side', label: 'Side', label_zh: '側睡', icon: <SideSleepIcon />, sublabel: 'Ear to shoulder', sublabel_zh: '靠左或靠右睡' },
      { value: 'Back', label: 'Back', label_zh: '仰睡', icon: <BackSleepIcon />, sublabel: 'Facing the ceiling', sublabel_zh: '臉朝上、平躺' },
      { value: 'Stomach', label: 'Stomach', label_zh: '趴睡', icon: <StomachSleepIcon />, sublabel: 'Face down', sublabel_zh: '臉朝下俯臥' },
      { value: 'Combination', label: 'All over', label_zh: '多種睡姿', icon: <ComboSleepIcon />, sublabel: 'I move around a lot', sublabel_zh: '睡眠中經常翻身' },
    ],
  },

  {
    id: 'shoulderWidth',
    section: 'Pillows',
    question: 'How wide are your shoulders? This determines your ideal pillow height.',
    question_zh: '您的肩寬大約是多少？這決定了最適合您的枕頭高度。',
    columns: 3,
    options: [
      { value: 'Petite', label: 'Narrower (S/XS)', label_zh: '窄肩 (S/XS)', icon: <PetiteIcon />, sublabel: '~36 cm or less', sublabel_zh: '約 36 cm 以下' },
      { value: 'Average', label: 'Average (M/L)', label_zh: '標準肩 (M/L)', icon: <AverageIcon />, sublabel: '~38–44 cm', sublabel_zh: '約 38–44 cm' },
      { value: 'Broad', label: 'Broader (XL+)', label_zh: '寬肩 (XL+)', icon: <BroadIcon />, sublabel: '~46 cm or more', sublabel_zh: '約 46 cm 以上' },
    ],
  },

  {
    id: 'pillowFeel',
    section: 'Pillows',
    question: 'Do you prefer your head to sink deeply in, or be actively supported?',
    question_zh: '您偏好頭部陷入枕頭，還是有明顯的支撐感？',
    columns: 4,
    options: [
      { value: 'Sink', label: 'Sink in & fluffy', label_zh: '陷入感', icon: <SinkIcon />, sublabel: 'Soft, cushioned, enveloping', sublabel_zh: '柔軟包覆，整個陷入' },
      { value: 'Springy', label: 'Resilient & springy', label_zh: '彈力回彈', icon: <SpringyIcon />, sublabel: 'Pushes back, responsive', sublabel_zh: 'Q彈有支撐，富有彈性' },
      { value: 'Contour', label: 'Pressure-relieving', label_zh: '貼合頸部', icon: <ContourIcon />, sublabel: 'Moulds to neck shape', sublabel_zh: '慢回彈，完美貼合曲線' },
      { value: 'Balanced', label: 'Balanced support', label_zh: '均衡輕盈', icon: <BalancedIcon />, sublabel: 'Soft resilience, easy care', sublabel_zh: '軟硬適中，靈活適應' },
    ],
  },

  {
    id: 'pillowPriority',
    section: 'Pillows',
    question: 'What matters most in your pillow decision?',
    question_zh: '選枕頭時，您最在意什麼？',
    columns: 3,
    options: [
      { value: 'Allergies', label: 'Allergy protection', label_zh: '防蟎抗菌', icon: <AllergyProtectIcon />, sublabel: 'Hypoallergenic is a must', sublabel_zh: '適合過敏族群，低敏材質' },
      { value: 'Value', label: 'Best value', label_zh: '價格實惠', icon: <ValueIcon />, sublabel: 'Great comfort per dollar', sublabel_zh: '好洗好乾，高CP值' },
      { value: 'Premium', label: 'Premium quality', label_zh: '優質觸感', icon: <PremiumIcon />, sublabel: 'Only the best materials', sublabel_zh: '願意投資，追求高品質' },
    ],
  },
]

import type { QuestionConfig } from './types'

// ---- SVG Icons ----

const SnowflakeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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

const ThermometerMidIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="13" y="5" width="6" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="25" r="4" stroke="currentColor" strokeWidth="2"/>
    <rect x="15" y="11" width="2" height="10" rx="1" fill="currentColor"/>
  </svg>
)

const ThermometerHighIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="13" y="5" width="6" height="18" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="25" r="4" stroke="currentColor" strokeWidth="2"/>
    <rect x="15" y="7" width="2" height="14" rx="1" fill="currentColor"/>
  </svg>
)

const FlameIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4C16 4 21 10 21 16C21 18.2 20.1 20.2 18.5 21.5C18.8 20.2 18.5 18.7 17.5 17.5C17.5 17.5 16 19 14.5 17.5C13 16 13 14 13 14C13 14 11 17 13 21C11.5 19.8 11 17.9 11 16C11 10 16 4 16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M16 28C18.8 28 21 25.8 21 23C21 20.2 16 16 16 16C16 16 11 20.2 11 23C11 25.8 13.2 28 16 28Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const PersonColdIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 28V18C10 15.8 11.8 14 14 14H18C20.2 14 22 15.8 22 18V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
    <path d="M8 10L6 8L8 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6 8H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const PersonNeutralIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 28V18C10 15.8 11.8 14 14 14H18C20.2 14 22 15.8 22 18V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const PersonWarmIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 28V18C10 15.8 11.8 14 14 14H18C20.2 14 22 15.8 22 18V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 8C24 8 26 9.5 26 11.5C26 13.5 24 15 24 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const PersonHotIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 28V18C10 15.8 11.8 14 14 14H18C20.2 14 22 15.8 22 18V28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="10" y1="22" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
    <path d="M24 6C24.5 7 25 8 24.5 9.5C24 11 24 12 25 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M27 5C27.5 6.5 28 8 27 10C26 12 27 13.5 27.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)

const SideSleepIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="22" cy="9" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M22 12C22 12 22 16 18 18L10 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M18 18L18 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="4" y="25" width="24" height="2" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
)

const BackSleepIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
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
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="9" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 12C10 12 14 14 16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M8 16C8 16 6 20 8 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 18C16 18 20 20 22 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <rect x="4" y="25" width="24" height="2" rx="1" fill="currentColor" opacity="0.3"/>
  </svg>
)

const ComboSleepIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11L16 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 15L10 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
    <path d="M16 15L22 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="2 2"/>
    <path d="M16 21L13 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 21L19 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ShieldNoneIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L6 8V17C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 17V8L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
)

const ShieldMildIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L6 8V17C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 17V8L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M12 16L15 19L20 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const ShieldSensitiveIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L6 8V17C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 17V8L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <circle cx="16" cy="15" r="2" fill="currentColor"/>
    <line x1="16" y1="10" x2="16" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const ShieldAllergyIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4L6 8V17C6 22 10.5 26.5 16 28C21.5 26.5 26 22 26 17V8L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
    <line x1="13" y1="12" x2="19" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <line x1="19" y1="12" x2="13" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const NoPetsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="12" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="2"/>
    <path d="M10 12V10C10 7.8 11.8 6 14 6H18C20.2 6 22 7.8 22 10V12" stroke="currentColor" strokeWidth="2"/>
    <line x1="16" y1="18" x2="16" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const PetsIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="11" cy="12" r="2.5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="21" cy="12" r="2.5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="7" cy="20" r="2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="25" cy="20" r="2" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 14C12 14 9 17 9 21C9 23.2 11 25 13 25H19C21 25 23 23.2 23 21C23 17 20 14 16 14Z" stroke="currentColor" strokeWidth="2"/>
  </svg>
)

const LaundryLowIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="19" r="5" stroke="currentColor" strokeWidth="2"/>
    <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="11" r="1" fill="currentColor"/>
    <circle cx="21" cy="11" r="1" fill="currentColor"/>
  </svg>
)

const LaundryHighIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="6" y="6" width="20" height="22" rx="3" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="19" r="5" stroke="currentColor" strokeWidth="2"/>
    <circle cx="16" cy="19" r="2" stroke="currentColor" strokeWidth="2"/>
    <line x1="10" y1="11" x2="14" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="18" cy="11" r="1" fill="currentColor"/>
    <circle cx="21" cy="11" r="1" fill="currentColor"/>
  </svg>
)

const PetiteIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11V24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 16L13 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 16L19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 24L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 24L18 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const AverageIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="7" r="3.5" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 11V23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 15L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 15L20 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 23L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 23L18 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

const BroadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="6" r="3.5" stroke="currentColor" strokeWidth="2"/>
    <path d="M16 10V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 14L9 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 14L23 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M16 22L14 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M16 22L18 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
)

// ---- Question Definitions ----

export const QUESTIONS: QuestionConfig[] = [
  {
    id: 'roomTemp',
    question: 'What temperature is your bedroom?',
    columns: 4,
    options: [
      { value: 'Cold', label: 'Cold', icon: <SnowflakeIcon />, sublabel: 'Below 65°F / 18°C' },
      { value: 'Moderate', label: 'Moderate', icon: <ThermometerMidIcon />, sublabel: '65–72°F / 18–22°C' },
      { value: 'Warm', label: 'Warm', icon: <ThermometerHighIcon />, sublabel: '72–78°F / 22–26°C' },
      { value: 'Hot', label: 'Hot', icon: <FlameIcon />, sublabel: 'Above 78°F / 26°C' },
    ],
  },
  {
    id: 'sleeperTemp',
    question: 'How do you feel during the night?',
    columns: 4,
    options: [
      { value: 'Always Cold', label: 'Always cold', icon: <PersonColdIcon />, sublabel: 'Extra blankets always' },
      { value: 'Neutral', label: 'Neutral', icon: <PersonNeutralIcon />, sublabel: 'Comfortable as-is' },
      { value: 'Warm', label: 'Warm', icon: <PersonWarmIcon />, sublabel: 'Kick covers off' },
      { value: 'Hot Flash Prone', label: 'Night sweats', icon: <PersonHotIcon />, sublabel: 'Wake up damp' },
    ],
  },
  {
    id: 'sleepPosition',
    question: 'What\'s your primary sleep position?',
    columns: 4,
    options: [
      { value: 'Side', label: 'Side', icon: <SideSleepIcon />, sublabel: 'Ear to shoulder' },
      { value: 'Back', label: 'Back', icon: <BackSleepIcon />, sublabel: 'Facing the ceiling' },
      { value: 'Stomach', label: 'Stomach', icon: <StomachSleepIcon />, sublabel: 'Face down' },
      { value: 'Combination', label: 'All over', icon: <ComboSleepIcon />, sublabel: 'I move around' },
    ],
  },
  {
    id: 'skinSensitivity',
    question: 'How would you describe your skin?',
    columns: 4,
    options: [
      { value: 'None', label: 'No issues', icon: <ShieldNoneIcon />, sublabel: 'Rarely reacts' },
      { value: 'Mild', label: 'Mild', icon: <ShieldMildIcon />, sublabel: 'Occasionally dry' },
      { value: 'Sensitive', label: 'Sensitive', icon: <ShieldSensitiveIcon />, sublabel: 'Reacts to fabrics' },
      { value: 'Allergic/Eczema', label: 'Allergic', icon: <ShieldAllergyIcon />, sublabel: 'Eczema or allergies' },
    ],
  },
  {
    id: 'petStatus',
    question: 'Do pets share your bed?',
    columns: 2,
    options: [
      { value: 'No Pets', label: 'No pets', icon: <NoPetsIcon />, sublabel: 'Just me' },
      { value: 'Yes — Cats or Dogs', label: 'Yes — cats or dogs', icon: <PetsIcon />, sublabel: 'Fur friends included' },
    ],
  },
  {
    id: 'maintenancePref',
    question: 'How often do you launder your sheets?',
    columns: 2,
    options: [
      { value: 'Low Maintenance', label: 'Low maintenance', icon: <LaundryLowIcon />, sublabel: 'Every 2–4 weeks' },
      { value: 'I Launder Frequently', label: 'Frequently', icon: <LaundryHighIcon />, sublabel: 'Weekly or more' },
    ],
  },
  {
    id: 'bodyType',
    question: 'How would you describe your shoulder width? (for pillow fit)',
    columns: 3,
    options: [
      { value: 'Petite', label: 'Petite', icon: <PetiteIcon />, sublabel: 'Narrower frame' },
      { value: 'Average', label: 'Average', icon: <AverageIcon />, sublabel: 'Standard width' },
      { value: 'Broad', label: 'Broad', icon: <BroadIcon />, sublabel: 'Wider shoulders' },
    ],
  },
]

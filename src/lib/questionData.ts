import type { QuizAnswers } from './types'

// Plain, serializable question data — no JSX, so it's safe to import from
// build scripts (the seed generator) as well as the app. questions.tsx resolves
// these into renderable QuestionConfig[] by attaching icons from the registry.

// Section codes (DB) ↔ section names (app/QuestionConfig.section, used by Quiz filtering).
export const SECTION_LONG_TO_SHORT: Record<string, string> = {
  'Sheets & Materials': 'sheets',
  'Comforter': 'comforter',
  'Pillows': 'pillow',
}
export const SECTION_SHORT_TO_LONG: Record<string, string> = {
  sheets: 'Sheets & Materials',
  comforter: 'Comforter',
  pillow: 'Pillows',
}

export interface SeedOption {
  value: string
  label: string
  label_zh: string
  icon_key: string
  sublabel: string
  sublabel_zh: string
}
export interface SeedQuestion {
  id: keyof QuizAnswers
  section: string
  question: string
  question_zh: string
  columns: 2 | 3 | 4
  options: SeedOption[]
}

export const QUESTION_SEED: SeedQuestion[] = [
  // ── SHEETS & MATERIALS ──
  {
    id: 'nightHeat', section: 'Sheets & Materials',
    question: 'Do you overheat or sweat at night, or do you tend to feel cold in bed?',
    question_zh: '您晚上睡覺時，通常感覺如何？',
    columns: 4,
    options: [
      { value: 'Very Hot', label: 'Often hot / sweats', label_zh: '非常熱', icon_key: 'flame', sublabel: 'Night sweats or very warm', sublabel_zh: '常常踢被、容易盜汗' },
      { value: 'Warm', label: 'Slightly warm', label_zh: '偏熱', icon_key: 'thermometer-high', sublabel: 'Kick covers off sometimes', sublabel_zh: '偏熱但大致舒適' },
      { value: 'Neutral', label: 'Just right', label_zh: '體溫適中', icon_key: 'thermometer-mid', sublabel: 'Comfortable most nights', sublabel_zh: '整夜體溫均衡舒適' },
      { value: 'Cold', label: 'Usually cold', label_zh: '偏冷', icon_key: 'snowflake', sublabel: 'Always reaching for blankets', sublabel_zh: '容易感到寒冷' },
    ],
  },
  {
    id: 'skinType', section: 'Sheets & Materials',
    question: 'Does your skin react to certain fabrics, or do you have allergies or eczema?',
    question_zh: '您的皮膚容易對材質產生反應嗎？',
    columns: 3,
    options: [
      { value: 'Allergic/Eczema', label: 'Eczema or allergies', label_zh: '過敏／濕疹', icon_key: 'shield-allergy', sublabel: 'Strong reactions to fabric', sublabel_zh: '有已知過敏或皮膚炎' },
      { value: 'Sensitive', label: 'Sensitive skin', label_zh: '敏感肌', icon_key: 'shield-sensitive', sublabel: 'Mild irritation sometimes', sublabel_zh: '接觸粗糙材質偶爾泛紅' },
      { value: 'None', label: 'No concerns', label_zh: '無特殊狀況', icon_key: 'shield-none', sublabel: 'No skin issues', sublabel_zh: '皮膚耐受性強' },
    ],
  },
  {
    id: 'careLevel', section: 'Sheets & Materials',
    question: 'How much time can you give to washing and caring for your sheets?',
    question_zh: '您願意花多少心思保養寢具？',
    columns: 3,
    options: [
      { value: 'Minimal', label: 'Wash and go', label_zh: '越簡單越好', icon_key: 'care-minimal', sublabel: 'Machine wash, no ironing', sublabel_zh: '機洗即可，快速搞定' },
      { value: 'Standard', label: 'Regular machine wash', label_zh: '標準保養', icon_key: 'care-standard', sublabel: 'Happy to follow care labels', sublabel_zh: '會遵照洗標指示' },
      { value: 'Careful', label: 'Happy to hand wash', label_zh: '細心呵護', icon_key: 'care-careful', sublabel: 'Dry-clean or gentle wash OK', sublabel_zh: '重視品質，願意用心保養' },
    ],
  },
  {
    id: 'sensoryPref', section: 'Sheets & Materials',
    question: 'What feeling do you look for the moment you get into bed?',
    question_zh: '您最重視床單的哪種觸感？',
    columns: 3,
    options: [
      { value: 'Cooling', label: 'Cool & crisp', label_zh: '清涼感', icon_key: 'cooling', sublabel: 'Instant cool-to-touch refresh', sublabel_zh: '瞬間接觸涼感，清爽降溫' },
      { value: 'Silky', label: 'Silky & lustrous', label_zh: '絲滑感', icon_key: 'silky', sublabel: 'Smooth, elegant, natural sheen', sublabel_zh: '柔順奢華，如絲綢般滑順' },
      { value: 'Classic', label: 'Classic soft comfort', label_zh: '棉質感', icon_key: 'classic', sublabel: 'Familiar, reliable, cosy', sublabel_zh: '天然透氣，日常舒適' },
    ],
  },
  // ── COMFORTER ──
  {
    id: 'comforterTemp', section: 'Comforter',
    question: 'Under the covers at night — do you sleep cold, or do you kick the duvet off?',
    question_zh: '您在被窩裡容易感到寒冷，還是容易過熱？',
    columns: 3,
    options: [
      { value: 'Always Cold', label: 'Always cold', label_zh: '非常怕冷', icon_key: 'person-cold', sublabel: 'Need heavy warmth to sleep', sublabel_zh: '蓋很厚還是覺得不夠暖' },
      { value: 'Neutral', label: 'Comfortable', label_zh: '適中舒適', icon_key: 'person-neutral', sublabel: 'Most nights are just right', sublabel_zh: '一般棉被就足夠保暖' },
      { value: 'Hot', label: 'Often too warm', label_zh: '容易發熱', icon_key: 'person-hot', sublabel: 'Kick covers off at night', sublabel_zh: '睡覺容易發熱，常常踢被' },
    ],
  },
  {
    id: 'comforterFeel', section: 'Comforter',
    question: 'Do you prefer a heavy cocooned feel, or something light and airy?',
    question_zh: '您偏好哪種棉被觸感？',
    columns: 4,
    options: [
      { value: 'Heavy', label: 'Heavy & wrapped', label_zh: '厚實沉穩', icon_key: 'heavy-blanket', sublabel: 'Secure, weighted warmth', sublabel_zh: '喜歡有重量、包覆感' },
      { value: 'Fluffy', label: 'Light & fluffy', label_zh: '蓬鬆輕盈', icon_key: 'cloud', sublabel: 'Cloud-like, weightless loft', sublabel_zh: '如雲朵般柔軟蓬鬆' },
      { value: 'Smooth', label: 'Smooth & light', label_zh: '輕薄順滑', icon_key: 'smooth-wave', sublabel: 'Body-hugging, breathable', sublabel_zh: '輕盈滑順，翻身自如' },
      { value: 'Practical', label: 'Practical & easy', label_zh: '實用易洗', icon_key: 'practical', sublabel: 'Machine washable, durable', sublabel_zh: '易洗易乾，注重方便' },
    ],
  },
  {
    id: 'breathingIssues', section: 'Comforter',
    question: 'Do asthma, dust allergies, or breathing sensitivities disrupt your sleep?',
    question_zh: '您有塵蟎過敏、氣喘或睡眠呼吸問題嗎？',
    columns: 2,
    options: [
      { value: 'Yes', label: 'Yes, it affects me', label_zh: '有，會影響睡眠', icon_key: 'breathing-yes', sublabel: 'Allergies or asthma at night', sublabel_zh: '尤其在冬天或乾燥季節' },
      { value: 'No', label: 'No issues', label_zh: '沒有困擾', icon_key: 'breathing-no', sublabel: 'Breathing is not a concern', sublabel_zh: '幾乎不受影響' },
    ],
  },
  // ── PILLOWS ──
  {
    id: 'sleepPosition', section: 'Pillows',
    question: 'What is your main sleeping position?',
    question_zh: '您最常用的睡姿是？',
    columns: 4,
    options: [
      { value: 'Side', label: 'Side', label_zh: '側睡', icon_key: 'side-sleep', sublabel: 'Ear to shoulder', sublabel_zh: '靠左或靠右睡' },
      { value: 'Back', label: 'Back', label_zh: '仰睡', icon_key: 'back-sleep', sublabel: 'Facing the ceiling', sublabel_zh: '臉朝上、平躺' },
      { value: 'Stomach', label: 'Stomach', label_zh: '趴睡', icon_key: 'stomach-sleep', sublabel: 'Face down', sublabel_zh: '臉朝下俯臥' },
      { value: 'Combination', label: 'All over', label_zh: '多種睡姿', icon_key: 'combo-sleep', sublabel: 'I move around a lot', sublabel_zh: '睡眠中經常翻身' },
    ],
  },
  {
    id: 'shoulderWidth', section: 'Pillows',
    question: 'How wide are your shoulders? This determines your ideal pillow height.',
    question_zh: '您的肩寬大約是多少？這決定了最適合您的枕頭高度。',
    columns: 3,
    options: [
      { value: 'Petite', label: 'Narrower (S/XS)', label_zh: '窄肩 (S/XS)', icon_key: 'petite', sublabel: '~36 cm or less', sublabel_zh: '約 36 cm 以下' },
      { value: 'Average', label: 'Average (M/L)', label_zh: '標準肩 (M/L)', icon_key: 'average', sublabel: '~38–44 cm', sublabel_zh: '約 38–44 cm' },
      { value: 'Broad', label: 'Broader (XL+)', label_zh: '寬肩 (XL+)', icon_key: 'broad', sublabel: '~46 cm or more', sublabel_zh: '約 46 cm 以上' },
    ],
  },
  {
    id: 'pillowFeel', section: 'Pillows',
    question: 'Do you prefer your head to sink deeply in, or be actively supported?',
    question_zh: '您偏好頭部陷入枕頭，還是有明顯的支撐感？',
    columns: 4,
    options: [
      { value: 'Sink', label: 'Sink in & fluffy', label_zh: '陷入感', icon_key: 'sink', sublabel: 'Soft, cushioned, enveloping', sublabel_zh: '柔軟包覆，整個陷入' },
      { value: 'Springy', label: 'Resilient & springy', label_zh: '彈力回彈', icon_key: 'springy', sublabel: 'Pushes back, responsive', sublabel_zh: 'Q彈有支撐，富有彈性' },
      { value: 'Contour', label: 'Pressure-relieving', label_zh: '貼合頸部', icon_key: 'contour', sublabel: 'Moulds to neck shape', sublabel_zh: '慢回彈，完美貼合曲線' },
      { value: 'Balanced', label: 'Balanced support', label_zh: '均衡輕盈', icon_key: 'balanced', sublabel: 'Soft resilience, easy care', sublabel_zh: '軟硬適中，靈活適應' },
    ],
  },
  {
    id: 'pillowPriority', section: 'Pillows',
    question: 'What matters most in your pillow decision?',
    question_zh: '選枕頭時，您最在意什麼？',
    columns: 3,
    options: [
      { value: 'Allergies', label: 'Allergy protection', label_zh: '防蟎抗菌', icon_key: 'allergy-protect', sublabel: 'Hypoallergenic is a must', sublabel_zh: '適合過敏族群，低敏材質' },
      { value: 'Value', label: 'Best value', label_zh: '價格實惠', icon_key: 'value', sublabel: 'Great comfort per dollar', sublabel_zh: '好洗好乾，高CP值' },
      { value: 'Premium', label: 'Premium quality', label_zh: '優質觸感', icon_key: 'premium', sublabel: 'Only the best materials', sublabel_zh: '願意投資，追求高品質' },
    ],
  },
]

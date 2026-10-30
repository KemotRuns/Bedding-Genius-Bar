import type { QuizAnswers } from './types'

// Plain, serializable question data (no JSX) — the single source of truth for
// the quiz. v2 (FEAC spreadsheet "Pro-Bar-Questions-TN-Bedding_1020"):
// 5 questions per product section. Questions live in code by design: the
// client edits products in /admin; question or flow changes come to Brainiak.

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
  /** How much this question counts when ranking products (hard constraints weigh more). */
  weight: number
  /** Short product-side label used in the admin "recommend when…" checklist. */
  admin_label: string
  options: SeedOption[]
}

export const QUESTION_SEED: SeedQuestion[] = [
  // ── BEDDING SETS ──
  {
    id: 'nightHeat', section: 'Sheets & Materials', weight: 2, admin_label: 'Body temperature',
    question: 'Do you frequently wake up from night sweats, or overheat during warmer months?',
    question_zh: '您是否常在夜間悶熱流汗，或在溫暖季節容易過熱？',
    columns: 4,
    options: [
      { value: 'Very Hot', label: 'Hot sleeper / night sweats', label_zh: '易熱體質', icon_key: 'flame', sublabel: 'Overheat, kick covers off', sublabel_zh: '夜間悶熱流汗' },
      { value: 'Warm', label: 'Slightly warm', label_zh: '偏熱', icon_key: 'thermometer-high', sublabel: 'Warm but mostly fine', sublabel_zh: '偏熱但大致舒適' },
      { value: 'Neutral', label: 'Just right', label_zh: '適中', icon_key: 'thermometer-mid', sublabel: 'Comfortable most nights', sublabel_zh: '整夜體溫均衡' },
      { value: 'Cold', label: 'Usually cold', label_zh: '偏冷', icon_key: 'snowflake', sublabel: 'Always reaching for blankets', sublabel_zh: '容易感到寒冷' },
    ],
  },
  {
    id: 'skinType', section: 'Sheets & Materials', weight: 2, admin_label: 'Skin & touch',
    question: 'Do skin sensitivities, allergies, or morning irritation disrupt your rest?',
    question_zh: '肌膚過敏或敏感是否影響您的睡眠？',
    columns: 3,
    options: [
      { value: 'SensitiveLux', label: 'Sensitive skin, luxurious touch', label_zh: '敏感肌膚 極致絲滑', icon_key: 'skin-lux', sublabel: 'The silkiest feel possible', sublabel_zh: '追求最滑順的膚觸' },
      { value: 'SensitiveRefined', label: 'Sensitive skin, refined feel', label_zh: '敏感肌膚 細膩手感', icon_key: 'shield-sensitive', sublabel: 'Gentle and fine', sublabel_zh: '溫和細緻' },
      { value: 'Everyday', label: 'Everyday soft & natural', label_zh: '天然親膚 全齡適用', icon_key: 'shield-none', sublabel: 'For all ages', sublabel_zh: '適合全家人' },
    ],
  },
  {
    id: 'careLevel', section: 'Sheets & Materials', weight: 1, admin_label: 'Care routine',
    question: 'How much time can you give to washing and caring for your sheets?',
    question_zh: '您願意花多少時間清洗保養寢具？',
    columns: 3,
    options: [
      { value: 'Minimal', label: 'As simple as possible', label_zh: '越簡單越好', icon_key: 'care-minimal', sublabel: 'Machine wash, no fuss', sublabel_zh: '機洗即可，快速搞定' },
      { value: 'Standard', label: 'Standard wash routine', label_zh: '標準清洗程序', icon_key: 'care-standard', sublabel: 'Follow the care label', sublabel_zh: '依照洗標標示' },
      { value: 'Careful', label: 'Careful, attentive care', label_zh: '細心呵護 用心保養', icon_key: 'care-careful', sublabel: 'Happy to go the extra mile', sublabel_zh: '重視品質，願意用心保養' },
    ],
  },
  {
    id: 'sensoryPref', section: 'Sheets & Materials', weight: 2, admin_label: 'Preferred touch',
    question: 'What sensory experience helps your body unwind the moment you get into bed?',
    question_zh: '入睡那一刻，最能讓您放鬆的觸感體驗為何？',
    columns: 3,
    options: [
      { value: 'Cooling', label: 'Cool to the touch', label_zh: '清涼感', icon_key: 'cooling', sublabel: 'Instant cooling refresh', sublabel_zh: '瞬間接觸涼感' },
      { value: 'Silky', label: 'Silky smooth', label_zh: '絲滑膚觸', icon_key: 'silky', sublabel: 'Smooth, elegant sheen', sublabel_zh: '柔順滑膩' },
      { value: 'Classic', label: 'Soft cotton feel', label_zh: '柔質棉感', icon_key: 'classic', sublabel: 'Familiar, natural, cosy', sublabel_zh: '天然透氣，日常舒適' },
    ],
  },
  {
    id: 'designStyle', section: 'Sheets & Materials', weight: 10, admin_label: 'Design style',
    question: 'When visualising your ideal bedroom, what design style best reflects your taste?',
    question_zh: '什麼樣的設計風格最符合您的寢室裝潢？',
    columns: 4,
    options: [
      { value: 'Nature', label: 'Nature-inspired', label_zh: '自然風格', icon_key: 'style-nature', sublabel: 'Floral, leaves, botanical prints', sublabel_zh: '花草植物圖樣' },
      { value: 'Minimal', label: 'Minimalist & solid', label_zh: '簡約風格', icon_key: 'style-minimal', sublabel: 'Clean lines, solid colours', sublabel_zh: '幾何、素色' },
      { value: 'Playful', label: 'Playful & thematic', label_zh: '主題童趣', icon_key: 'style-playful', sublabel: 'Special themes, animals', sublabel_zh: '特殊主題、動物' },
      { value: 'Classic', label: 'Classic luxury', label_zh: '經典奢華', icon_key: 'style-classic', sublabel: 'Embroidery, lace, jacquard', sublabel_zh: '刺繡、蕾絲、緹花' },
    ],
  },

  // ── COMFORTER ──
  {
    id: 'comforterTemp', section: 'Comforter', weight: 3, admin_label: 'Sleeps cold / warm',
    question: 'Under the covers at night, do you feel too cold, or do you kick the duvet off?',
    question_zh: '您在被窩裡容易感到寒冷，還是容易過熱？',
    columns: 3,
    options: [
      { value: 'Always Cold', label: 'I often feel too cold', label_zh: '非常怕冷', icon_key: 'person-cold', sublabel: 'Need serious warmth', sublabel_zh: '蓋很厚還是覺得不夠暖' },
      { value: 'Neutral', label: 'Comfortable', label_zh: '適中舒適', icon_key: 'person-neutral', sublabel: 'Most nights are just right', sublabel_zh: '一般棉被就足夠' },
      { value: 'Hot', label: 'I often feel too warm', label_zh: '容易發熱', icon_key: 'person-hot', sublabel: 'Kick the covers off', sublabel_zh: '常常踢被' },
    ],
  },
  {
    id: 'comforterFeel', section: 'Comforter', weight: 2, admin_label: 'Weight & feel',
    question: 'Do you sleep better under a heavier, enveloping blanket or a lighter, airy one?',
    question_zh: '睡眠偏好包覆厚重感，還是輕盈雲朵感？',
    columns: 3,
    options: [
      { value: 'Heavy', label: 'Heavier, securely wrapped', label_zh: '厚重包裹感', icon_key: 'heavy-blanket', sublabel: 'Weighted, cocooned warmth', sublabel_zh: '喜歡有重量、包覆感' },
      { value: 'Fluffy', label: 'Light & fluffy', label_zh: '輕盈蓬鬆', icon_key: 'cloud', sublabel: 'Cloud-like loft', sublabel_zh: '如雲朵般柔軟蓬鬆' },
      { value: 'Smooth', label: 'Body-hugging, breathable', label_zh: '貼身透氣', icon_key: 'smooth-wave', sublabel: 'Light and smooth', sublabel_zh: '輕盈滑順，翻身自如' },
    ],
  },
  {
    id: 'comforterAllergy', section: 'Comforter', weight: 3, admin_label: 'Allergy needs',
    question: 'Do respiratory issues, asthma, or dust allergies bother you while sleeping?',
    question_zh: '是否有呼吸道過敏或氣喘困擾？',
    columns: 3,
    options: [
      { value: 'Washable', label: 'Yes, I need washable bedding', label_zh: '過敏體質 要求可水洗', icon_key: 'allergy-washable', sublabel: 'Allergy-sensitive, easy to clean', sublabel_zh: '可水洗為必要條件' },
      { value: 'Natural', label: 'Yes, I prefer natural & breathable', label_zh: '過敏體質 追求天然透氣', icon_key: 'allergy-natural', sublabel: 'Allergy-sensitive, natural fibres', sublabel_zh: '偏好天然且高透氣材質' },
      { value: 'None', label: 'No allergy concerns', label_zh: '無過敏問題', icon_key: 'breathing-no', sublabel: 'Breathing is not a concern', sublabel_zh: '幾乎不受影響' },
    ],
  },
  {
    id: 'comforterScent', section: 'Comforter', weight: 1, admin_label: 'Scent tolerance',
    question: 'Are you sensitive to material odours?',
    question_zh: '您是否對材質氣味敏感？',
    columns: 2,
    options: [
      { value: 'NoScent', label: 'I prefer no noticeable scent', label_zh: '拒絕異味', icon_key: 'scent-no', sublabel: 'Odour-free only', sublabel_zh: '不接受任何氣味' },
      { value: 'MildOk', label: 'A mild natural scent at first is fine', label_zh: '接受初期些微天然氣味', icon_key: 'scent-mild', sublabel: 'Wool or down are OK', sublabel_zh: '羊毛、羽絨皆可' },
    ],
  },
  {
    id: 'comforterUse', section: 'Comforter', weight: 1, admin_label: 'Household & budget',
    question: 'What best describes the home you are shopping for and your needs?',
    question_zh: '使用情境比較接近租屋高頻更換，還是頂級奢華享受？',
    columns: 3,
    options: [
      { value: 'Budget', label: 'Rental, busy household, or budget-conscious', label_zh: '租屋族／忙碌家庭／預算導向', icon_key: 'home-budget', sublabel: 'Practical and easy', sublabel_zh: '實用易洗' },
      { value: 'Daily', label: 'Upgraded daily comfort', label_zh: '日常舒適升級', icon_key: 'home-daily', sublabel: 'A step up for every night', sublabel_zh: '每天都更舒適' },
      { value: 'Luxury', label: 'Premium luxury oasis', label_zh: '頂級奢華 願細心維護', icon_key: 'premium', sublabel: 'Happy to give it extra care', sublabel_zh: '願意投資與用心保養' },
    ],
  },

  // ── PILLOW ──
  {
    id: 'sleepPosition', section: 'Pillows', weight: 3, admin_label: 'Sleep position',
    question: 'What is your primary sleeping position?',
    question_zh: '您主要的睡眠姿勢為何？',
    columns: 3,
    options: [
      { value: 'Side', label: 'Side sleeper', label_zh: '側睡', icon_key: 'side-sleep', sublabel: 'Ear to shoulder', sublabel_zh: '靠左或靠右睡' },
      { value: 'Back', label: 'Back sleeper', label_zh: '仰睡', icon_key: 'back-sleep', sublabel: 'Facing the ceiling', sublabel_zh: '臉朝上、平躺' },
      { value: 'Stomach', label: 'Stomach sleeper', label_zh: '趴睡', icon_key: 'stomach-sleep', sublabel: 'Face down', sublabel_zh: '臉朝下俯臥' },
    ],
  },
  {
    id: 'pillowFeel', section: 'Pillows', weight: 2, admin_label: 'Feel',
    question: 'Do you prefer your head to sink into the pillow, or one that offers firm support?',
    question_zh: '偏好頭部深陷的包覆感，還是有回彈支撐力的枕頭？',
    columns: 4,
    options: [
      { value: 'Sink', label: 'Deep, cushioned sink-in', label_zh: '深陷、緩衝包覆', icon_key: 'sink', sublabel: 'Soft and enveloping', sublabel_zh: '柔軟包覆' },
      { value: 'Springy', label: 'Responsive, springy push-back', label_zh: '有彈性、回彈支撐', icon_key: 'springy', sublabel: 'Pushes back', sublabel_zh: 'Q彈有支撐' },
      { value: 'Contour', label: 'Targeted pressure relief', label_zh: '針對性釋壓', icon_key: 'contour', sublabel: 'Moulds to your neck', sublabel_zh: '慢回彈貼合曲線' },
      { value: 'Balanced', label: 'Balanced soft resilience', label_zh: '均衡柔軟彈性', icon_key: 'balanced', sublabel: 'Soft yet supportive', sublabel_zh: '軟硬適中' },
    ],
  },
  {
    id: 'shoulderWidth', section: 'Pillows', weight: 3, admin_label: 'Pillow height',
    question: 'How wide are your shoulders? This determines your ideal pillow height.',
    question_zh: '您大約的肩寬是多少？這決定了適合您的枕頭高度。',
    columns: 3,
    options: [
      { value: 'Petite', label: 'Narrower', label_zh: '窄肩', icon_key: 'petite', sublabel: '36 cm or less · low pillow 8–10 cm', sublabel_zh: '36 cm 以下 · 低枕 8–10 cm' },
      { value: 'Average', label: 'Average', label_zh: '標準肩', icon_key: 'average', sublabel: '38–44 cm · medium pillow 11–14 cm', sublabel_zh: '38–44 cm · 中枕 11–14 cm' },
      { value: 'Broad', label: 'Broader', label_zh: '寬肩', icon_key: 'broad', sublabel: '46 cm or more · high pillow 15 cm+', sublabel_zh: '46 cm 以上 · 高枕 15 cm 以上' },
    ],
  },
  {
    id: 'pillowAllergy', section: 'Pillows', weight: 2, admin_label: 'Allergy / odour sensitive',
    question: 'Are you allergic or sensitive to any specific materials or odours?',
    question_zh: '您是否對特定材質或氣味過敏或敏感？',
    columns: 2,
    options: [
      { value: 'Yes', label: 'Yes', label_zh: '是', icon_key: 'allergy-protect', sublabel: 'Anti-mite, antibacterial, washable', sublabel_zh: '防螨抗菌、可水洗' },
      { value: 'No', label: 'No', label_zh: '否', icon_key: 'breathing-no', sublabel: 'No sensitivities', sublabel_zh: '無特殊狀況' },
    ],
  },
  {
    id: 'pillowTier', section: 'Pillows', weight: 1, admin_label: 'Series / budget',
    question: 'What kind of sleep upgrade are you hoping for with your next pillow?',
    question_zh: '您希望下一顆枕頭為您帶來什麼樣的「睡眠升級體驗」？',
    columns: 3,
    options: [
      { value: 'Effortless', label: 'Effortless Comfort', label_zh: '簡單舒適系列', icon_key: 'value', sublabel: 'Everyday value', sublabel_zh: '日常實惠之選' },
      { value: 'Enhanced', label: 'Enhanced Support', label_zh: '功能進階系列', icon_key: 'tier-enhanced', sublabel: 'Functional upgrade', sublabel_zh: '機能升級' },
      { value: 'Luxury', label: 'Luxury Hotel Feel', label_zh: '奢華飯店體驗系列', icon_key: 'premium', sublabel: 'Five-star indulgence', sublabel_zh: '頂級飯店等級' },
    ],
  },
]

export const QUESTION_WEIGHTS: Record<string, number> = Object.fromEntries(QUESTION_SEED.map(q => [q.id, q.weight]))

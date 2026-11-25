import type { QuizAnswers } from './types'

// Plain, serializable question data (no JSX) — the single source of truth for
// the quiz. v2.2 (FEAC workbook "Pro-Bar-Questions-TN-Bedding_1123"):
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
  // ── BEDDING SETS ── (material first; style ranks inside the material)
  {
    id: 'nightHeat', section: 'Sheets & Materials', weight: 2, admin_label: 'Body temperature',
    question: 'Do you often wake up perspiring or feel too warm while sleeping?',
    question_zh: '您是否常在夜間悶熱流汗，或睡覺時容易覺得太熱？',
    columns: 2,
    options: [
      { value: 'Hot', label: 'Yes, I tend to feel hot or perspire at night', label_zh: '是，易熱體質', icon_key: 'flame', sublabel: 'Warm sleeper, night sweats', sublabel_zh: '夜間悶熱流汗' },
      { value: 'Neutral', label: 'No, I usually feel just right or slightly cold', label_zh: '否，溫度適中或容易怕冷', icon_key: 'thermometer-mid', sublabel: 'Comfortable or cool sleeper', sublabel_zh: '整夜舒適或偏冷' },
    ],
  },
  {
    id: 'skinType', section: 'Sheets & Materials', weight: 2, admin_label: 'Skin sensitivity',
    question: 'Do you experience skin sensitivities or allergies that affect your sleep?',
    question_zh: '您是否有肌膚敏感或過敏的困擾？',
    columns: 2,
    options: [
      { value: 'Sensitive', label: 'Yes, I have sensitive skin or allergies', label_zh: '有敏感問題', icon_key: 'shield-sensitive', sublabel: 'Hypoallergenic, skin-friendly fabrics only', sublabel_zh: '低敏親膚：專為敏感肌膚打造的安心首選' },
      { value: 'None', label: 'No skin sensitivities or allergies', label_zh: '無敏感問題', icon_key: 'shield-none', sublabel: 'An everyday essential for everyone', sublabel_zh: '日常必備：適合所有族群與年齡層' },
    ],
  },
  {
    id: 'careLevel', section: 'Sheets & Materials', weight: 1, admin_label: 'Care routine',
    question: 'How do you prefer to wash and care for your bedding?',
    question_zh: '您偏好的寢具清潔與保養方式是？',
    columns: 2,
    options: [
      { value: 'Standard', label: 'Standard washing', label_zh: '標準清洗程序', icon_key: 'care-standard', sublabel: 'Following the care label', sublabel_zh: '依照洗標標示' },
      { value: 'Careful', label: 'Happy to take extra care of delicate fabrics', label_zh: '細心呵護 用心保養', icon_key: 'care-careful', sublabel: 'Extra time for finer fabrics', sublabel_zh: '願意為細緻布料多花時間' },
    ],
  },
  {
    id: 'sensoryPref', section: 'Sheets & Materials', weight: 2, admin_label: 'Preferred touch',
    question: 'What kind of fabric feel helps you relax when you get into bed?',
    question_zh: '入睡那一刻，最能讓您放鬆的觸感體驗為何？',
    columns: 3,
    options: [
      { value: 'Cooling', label: 'A refreshing, cooling sensation', label_zh: '清涼感', icon_key: 'cooling', sublabel: 'Cool to the touch', sublabel_zh: '接觸瞬間涼感' },
      { value: 'Silky', label: 'A silky-smooth touch', label_zh: '絲滑膚觸', icon_key: 'silky', sublabel: 'Smooth and fine', sublabel_zh: '柔順滑膩' },
      { value: 'Classic', label: 'A soft, cosy cotton feel', label_zh: '柔質棉感', icon_key: 'classic', sublabel: 'Familiar and natural', sublabel_zh: '天然透氣，日常舒適' },
    ],
  },
  {
    id: 'designStyle', section: 'Sheets & Materials', weight: 0.5, admin_label: 'Design style',
    question: 'When visualising your ideal bedroom, what design style best reflects your personal taste?',
    question_zh: '什麼樣的設計風格比較符合您的寢室裝潢？',
    columns: 4,
    options: [
      { value: 'Nature', label: 'Nature-inspired', label_zh: '自然風格', icon_key: 'style-nature', sublabel: 'Floral, leaf and botanical prints', sublabel_zh: '花、葉植物印花' },
      { value: 'Minimal', label: 'Minimalist & solid', label_zh: '簡約風格', icon_key: 'style-minimal', sublabel: 'Clean lines, solid colours, geometric patterns', sublabel_zh: '簡約線條、幾何印花、素色' },
      { value: 'Playful', label: 'Playful & thematic', label_zh: '主題和童趣風格', icon_key: 'style-playful', sublabel: 'Novelty and animal prints', sublabel_zh: '特殊主題、動物印花' },
      { value: 'Classic', label: 'Classic luxury', label_zh: '經典奢華', icon_key: 'style-classic', sublabel: 'Embroidery, lace, jacquard', sublabel_zh: '刺繡、蕾絲、緹花' },
    ],
  },

  // ── COMFORTER ──
  {
    id: 'comforterTemp', section: 'Comforter', weight: 3, admin_label: 'Sleeps cold / warm',
    question: 'Under the covers at night, do you feel cold, or do you kick the covers off?',
    question_zh: '每晚入睡時，您是容易手腳冰冷，還是總是悶熱到想踢被？',
    columns: 3,
    options: [
      { value: 'Always Cold', label: 'I often feel too cold', label_zh: '非常怕冷', icon_key: 'person-cold', sublabel: 'Need serious warmth', sublabel_zh: '容易手腳冰冷' },
      { value: 'Neutral', label: 'I usually feel just right', label_zh: '適中舒適', icon_key: 'person-neutral', sublabel: 'Most nights are comfortable', sublabel_zh: '大多數夜晚都舒適' },
      { value: 'Hot', label: 'I often feel too warm', label_zh: '容易發熱', icon_key: 'person-hot', sublabel: 'Kick the covers off', sublabel_zh: '悶熱到想踢被' },
    ],
  },
  {
    id: 'comforterFeel', section: 'Comforter', weight: 2, admin_label: 'Weight & feel',
    question: 'What kind of comforter do you prefer sleeping under?',
    question_zh: '睡眠偏好包覆厚重感，還是輕盈雲朵感？',
    columns: 3,
    options: [
      { value: 'Heavy', label: 'Heavier, with a cosy, enveloping feel', label_zh: '厚重包裹感', icon_key: 'heavy-blanket', sublabel: 'Wrapped-up warmth', sublabel_zh: '喜歡有重量、包覆感' },
      { value: 'Fluffy', label: 'Light & fluffy', label_zh: '輕盈蓬鬆', icon_key: 'cloud', sublabel: 'Cloud-like loft', sublabel_zh: '如雲朵般柔軟蓬鬆' },
      { value: 'Smooth', label: 'Soft, breathable and gently draping', label_zh: '貼身透氣', icon_key: 'smooth-wave', sublabel: 'Follows the body', sublabel_zh: '輕盈滑順，翻身自如' },
    ],
  },
  {
    id: 'comforterAllergy', section: 'Comforter', weight: 3, admin_label: 'Allergy needs',
    question: 'Do you have any allergies or respiratory sensitivities that affect your sleep?',
    question_zh: '是否有呼吸道過敏或氣喘困擾？',
    columns: 3,
    options: [
      { value: 'Washable', label: 'Yes, and I want bedding that is easy to wash', label_zh: '過敏體質，要求可水洗', icon_key: 'allergy-washable', sublabel: 'Washable comforters only', sublabel_zh: '僅推薦可水洗的棉被' },
      { value: 'Natural', label: 'Yes, and I want natural, breathable materials', label_zh: '過敏體質，追求天然且高透氣', icon_key: 'allergy-natural', sublabel: 'Natural fills only', sublabel_zh: '僅推薦天然高透氣材質' },
      { value: 'None', label: 'No allergy concerns', label_zh: '無過敏問題', icon_key: 'breathing-no', sublabel: 'The full range is open', sublabel_zh: '所有材質皆可' },
    ],
  },
  {
    id: 'comforterScent', section: 'Comforter', weight: 1, admin_label: 'Scent tolerance',
    question: 'How do you feel about the natural smell of new bedding materials?',
    question_zh: '您是否對材質氣味敏感？',
    columns: 2,
    options: [
      { value: 'NoScent', label: 'I would prefer no noticeable scent', label_zh: '拒絕異味', icon_key: 'scent-no', sublabel: 'Wool and down are left out', sublabel_zh: '不推薦羊毛與羽絨' },
      { value: 'MildOk', label: 'A mild, natural scent at first is fine', label_zh: '接受初期些微天然氣味', icon_key: 'scent-mild', sublabel: 'Wool or down are OK', sublabel_zh: '羊毛、羽絨皆可' },
    ],
  },
  {
    id: 'comforterUse', section: 'Comforter', weight: 1, admin_label: 'Household & budget',
    question: 'What best describes the environment you are shopping for and your needs?',
    question_zh: '使用情境比較接近租屋高頻更換，還是頂級奢華享受？',
    columns: 3,
    options: [
      { value: 'Budget', label: 'Rental, busy household, or budget-conscious', label_zh: '租屋族／忙碌家庭／預算考量', icon_key: 'home-budget', sublabel: 'Practical and easy to care for', sublabel_zh: '實用好保養' },
      { value: 'Daily', label: 'Upgraded daily comfort', label_zh: '日常舒適升級', icon_key: 'home-daily', sublabel: 'A step up for every night', sublabel_zh: '每天都更舒適' },
      { value: 'Luxury', label: 'Premium luxury oasis', label_zh: '頂級奢華 願細心維護', icon_key: 'premium', sublabel: 'Happy to give it extra care', sublabel_zh: '願意用心保養' },
    ],
  },

  // ── PILLOW ──
  {
    id: 'sleepPosition', section: 'Pillows', weight: 3, admin_label: 'Sleep position',
    question: 'What is your usual sleeping position?',
    question_zh: '您主要的睡眠姿勢為何？',
    columns: 3,
    options: [
      { value: 'Side', label: 'I sleep on my side', label_zh: '側睡', icon_key: 'side-sleep', sublabel: 'Ear to shoulder', sublabel_zh: '靠左或靠右睡' },
      { value: 'Back', label: 'I sleep on my back', label_zh: '仰睡', icon_key: 'back-sleep', sublabel: 'Facing the ceiling', sublabel_zh: '臉朝上、平躺' },
      { value: 'Stomach', label: 'I sleep on my stomach', label_zh: '趴睡', icon_key: 'stomach-sleep', sublabel: 'Face down', sublabel_zh: '臉朝下俯臥' },
    ],
  },
  {
    id: 'pillowFeel', section: 'Pillows', weight: 2, admin_label: 'Feel',
    question: 'What kind of support and comfort do you prefer from your pillow?',
    question_zh: '偏好頭部深陷的包覆感，還是有回彈支撐力的枕頭？',
    columns: 4,
    options: [
      { value: 'Sink', label: 'Soft and cushioning', label_zh: '深陷、緩衝包覆', icon_key: 'sink', sublabel: 'Soft and enveloping', sublabel_zh: '柔軟包覆' },
      { value: 'Springy', label: 'Springy and responsive', label_zh: '有彈性、回彈支撐', icon_key: 'springy', sublabel: 'Pushes back', sublabel_zh: 'Q彈有支撐' },
      { value: 'Contour', label: 'Contouring pressure relief', label_zh: '針對性釋壓', icon_key: 'contour', sublabel: 'Moulds to your neck', sublabel_zh: '慢回彈貼合曲線' },
      { value: 'Balanced', label: 'A balance of softness and support', label_zh: '均衡柔軟彈性', icon_key: 'balanced', sublabel: 'Soft yet supportive', sublabel_zh: '軟硬適中' },
    ],
  },
  {
    id: 'shoulderWidth', section: 'Pillows', weight: 3, admin_label: 'Pillow height',
    question: 'How would you describe your shoulder width? It guides your pillow height.',
    question_zh: '您大約的肩寬是多少？我們會依據肩寬選擇枕頭高度。',
    columns: 3,
    options: [
      { value: 'Petite', label: 'Narrow', label_zh: '窄肩', icon_key: 'petite', sublabel: '37 cm or less', sublabel_zh: '37 cm 或以下' },
      { value: 'Average', label: 'Average', label_zh: '一般肩寬', icon_key: 'average', sublabel: '38 to 45 cm', sublabel_zh: '38–45 cm' },
      { value: 'Broad', label: 'Broad', label_zh: '寬肩', icon_key: 'broad', sublabel: '46 cm or more', sublabel_zh: '46 cm 或以上' },
    ],
  },
  {
    id: 'pillowAllergy', section: 'Pillows', weight: 2, admin_label: 'Allergy / odour sensitive',
    question: 'Are you allergic or sensitive to any specific materials or odours?',
    question_zh: '您是否對特定材質或氣味過敏或敏感？',
    columns: 2,
    options: [
      { value: 'Yes', label: 'Yes', label_zh: '是', icon_key: 'allergy-protect', sublabel: 'Some materials or odours bother me', sublabel_zh: '對某些材質或氣味敏感' },
      { value: 'No', label: 'No', label_zh: '否', icon_key: 'breathing-no', sublabel: 'No sensitivities', sublabel_zh: '無特殊狀況' },
    ],
  },
  {
    id: 'pillowTier', section: 'Pillows', weight: 1, admin_label: 'Series',
    question: 'What kind of sleep experience are you looking for in your next pillow?',
    question_zh: '您希望下一顆新枕頭，能為您帶來什麼樣的「睡眠升級體驗」？',
    columns: 3,
    options: [
      { value: 'Effortless', label: 'Effortless Comfort', label_zh: '簡單舒適系列', icon_key: 'value', sublabel: 'Easy everyday comfort', sublabel_zh: '日常舒適之選' },
      { value: 'Enhanced', label: 'Enhanced Support', label_zh: '功能進階系列', icon_key: 'tier-enhanced', sublabel: 'Functional upgrade', sublabel_zh: '機能升級' },
      { value: 'Luxury', label: 'Luxury Hotel Feel', label_zh: '奢華飯店體驗系列', icon_key: 'premium', sublabel: 'Five-star indulgence', sublabel_zh: '頂級飯店等級' },
    ],
  },
]

export const QUESTION_WEIGHTS: Record<string, number> = Object.fromEntries(QUESTION_SEED.map(q => [q.id, q.weight]))

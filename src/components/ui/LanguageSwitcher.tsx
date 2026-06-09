import { motion } from 'framer-motion'
import { useLang } from '../../lib/LanguageContext'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLang()

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center bg-white/85 backdrop-blur-md border border-white/70 rounded-full p-1 shadow-glass gap-0.5">
      <motion.button
        onClick={() => setLang('en')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none ${
          lang === 'en'
            ? 'bg-charcoal text-cream shadow-sm'
            : 'text-charcoal/45 hover:text-charcoal/70'
        }`}
        whileTap={{ scale: 0.93 }}
        transition={{ duration: 0.1 }}
      >
        EN
      </motion.button>
      <motion.button
        onClick={() => setLang('zh')}
        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer select-none ${
          lang === 'zh'
            ? 'bg-charcoal text-cream shadow-sm'
            : 'text-charcoal/45 hover:text-charcoal/70'
        }`}
        whileTap={{ scale: 0.93 }}
        transition={{ duration: 0.1 }}
      >
        中
      </motion.button>
    </div>
  )
}

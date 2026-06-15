import { useEffect } from 'react'
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import { LanguageProvider } from './lib/LanguageContext'
import { CatalogProvider } from './lib/CatalogContext'
import LanguageSwitcher from './components/ui/LanguageSwitcher'
import { flushQueue } from './lib/session'
import './index.css'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.key}>
        <Route path="/" element={<Landing />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  // Retry any sessions that couldn't reach the remote endpoint last time.
  useEffect(() => { void flushQueue() }, [])

  return (
    <HashRouter>
      <LanguageProvider>
        <CatalogProvider>
          <LanguageSwitcher />
          <AnimatedRoutes />
        </CatalogProvider>
      </LanguageProvider>
    </HashRouter>
  )
}

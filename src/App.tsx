import { HashRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import { LanguageProvider } from './lib/LanguageContext'
import LanguageSwitcher from './components/ui/LanguageSwitcher'
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
  return (
    <HashRouter>
      <LanguageProvider>
        <LanguageSwitcher />
        <AnimatedRoutes />
      </LanguageProvider>
    </HashRouter>
  )
}

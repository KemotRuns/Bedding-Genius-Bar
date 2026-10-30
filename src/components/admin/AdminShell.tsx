import { useState } from 'react'
import ResponsesPanel from './ResponsesPanel'
import ProductsPanel from './ProductsPanel'

// v2: the client manages products only. Questions, flow and matching weights
// live in code and come back to Brainiak for changes.
type Tab = 'products' | 'responses'

const TABS: { id: Tab; label: string }[] = [
  { id: 'products', label: 'Products 商品' },
  { id: 'responses', label: 'Responses 回覆' },
]

export default function AdminShell({ email, onSignOut }: { email?: string; onSignOut: () => void }) {
  const [tab, setTab] = useState<Tab>('products')

  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-charcoal text-cream">
        <div className="max-w-6xl mx-auto px-6 pt-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-gold-light mb-0.5">TN Select · Admin</p>
              <h1 className="font-serif text-2xl">{TABS.find(t => t.id === tab)?.label}</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-cream/50 hidden sm:inline">{email}</span>
              <button onClick={onSignOut} className="text-xs text-cream/70 hover:text-cream underline-offset-2 hover:underline cursor-pointer">Sign out</button>
            </div>
          </div>
          <nav className="flex gap-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`text-sm px-4 py-2.5 rounded-t-lg transition-colors cursor-pointer ${tab === t.id ? 'bg-cream text-charcoal font-medium' : 'text-cream/60 hover:text-cream'}`}>
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        {tab === 'products' && <ProductsPanel />}
        {tab === 'responses' && <ResponsesPanel />}
      </main>
    </div>
  )
}

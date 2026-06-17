import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!supabase) return
    setBusy(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) setError(error.message)
    setBusy(false)
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-sm p-8">
        <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-charcoal/40 mb-1">TN Select</p>
        <h1 className="font-serif text-2xl text-charcoal mb-6">Admin sign in</h1>

        <label className="block text-xs font-medium text-charcoal/50 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="username"
          className="w-full px-4 py-3 mb-4 rounded-xl bg-white/60 border border-charcoal/12 text-sm text-charcoal outline-none focus:border-gold transition-colors"
        />

        <label className="block text-xs font-medium text-charcoal/50 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full px-4 py-3 mb-5 rounded-xl bg-white/60 border border-charcoal/12 text-sm text-charcoal outline-none focus:border-gold transition-colors"
        />

        {error && <p className="text-xs text-red-500 mb-4">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-charcoal text-cream py-3 rounded-xl text-sm font-medium hover:bg-charcoal/85 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

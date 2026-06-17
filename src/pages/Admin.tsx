import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import AdminLogin from '../components/admin/AdminLogin'
import ResponsesPanel from '../components/admin/ResponsesPanel'

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="glass-card max-w-sm w-full p-8 text-center text-sm text-charcoal/70 space-y-4">{children}</div>
    </div>
  )
}

export default function Admin() {
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(!isSupabaseConfigured)
  const [adminState, setAdminState] = useState<{ checkedFor: string | null; isAdmin: boolean }>({ checkedFor: null, isAdmin: false })

  // Track the auth session (state set only in async callbacks).
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setAuthReady(true)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  // Verify admin allowlist membership whenever the session changes.
  useEffect(() => {
    if (!supabase || !session) return
    let cancelled = false
    supabase.from('admins').select('user_id').eq('user_id', session.user.id).maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setAdminState({ checkedFor: session.user.id, isAdmin: Boolean(data) })
      })
    return () => { cancelled = true }
  }, [session])

  const adminChecked = session ? adminState.checkedFor === session.user.id : true
  const isAdmin = Boolean(session) && adminChecked && adminState.isAdmin

  if (!isSupabaseConfigured) {
    return <Centered>Supabase isn’t configured. Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code>.</Centered>
  }
  if (!authReady) return <Centered>Loading…</Centered>
  if (!session) return <AdminLogin />
  if (!adminChecked) return <Centered>Checking access…</Centered>
  if (!isAdmin) {
    return (
      <Centered>
        <p>Signed in as <strong>{session.user.email}</strong>, but this account isn’t an admin.</p>
        <button onClick={() => supabase!.auth.signOut()} className="text-charcoal underline cursor-pointer">Sign out</button>
      </Centered>
    )
  }
  return <ResponsesPanel email={session.user.email} onSignOut={() => supabase!.auth.signOut()} />
}

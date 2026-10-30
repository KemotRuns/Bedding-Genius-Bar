import { useEffect, useState } from 'react'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth, isFirebaseConfigured, isAdminEmail } from '../lib/firebase'
import AdminLogin from '../components/admin/AdminLogin'
import AdminShell from '../components/admin/AdminShell'

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="glass-card max-w-sm w-full p-8 text-center text-sm text-charcoal/70 space-y-4">{children}</div>
    </div>
  )
}

export default function Admin() {
  const [user, setUser] = useState<User | null>(null)
  const [authReady, setAuthReady] = useState(!isFirebaseConfigured)

  useEffect(() => {
    if (!auth) return
    return onAuthStateChanged(auth, u => { setUser(u); setAuthReady(true) })
  }, [])

  if (!isFirebaseConfigured) {
    return <Centered>Firebase isn’t configured. Set the <code>VITE_FIREBASE_*</code> variables.</Centered>
  }
  if (!authReady) return <Centered>Loading…</Centered>
  if (!user) return <AdminLogin />
  if (!isAdminEmail(user.email)) {
    return (
      <Centered>
        <p>Signed in as <strong>{user.email}</strong>, but this account isn’t an admin.</p>
        <button onClick={() => auth && signOut(auth)} className="text-charcoal underline cursor-pointer">Sign out</button>
      </Centered>
    )
  }
  return <AdminShell email={user.email ?? undefined} onSignOut={() => auth && signOut(auth)} />
}

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'
import type { Auth } from 'firebase/auth'

// Firebase (Firestore + Auth) replaces Supabase from v2.1. The web config is
// public by design; access is enforced by firestore.rules. Leave the env vars
// empty and the app runs on the bundled catalog with local-only capture.
const env = (k: string) => (import.meta.env[k] as string | undefined)?.trim() || ''

const config = {
  apiKey: env('VITE_FIREBASE_API_KEY'),
  authDomain: env('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: env('VITE_FIREBASE_PROJECT_ID'),
  appId: env('VITE_FIREBASE_APP_ID'),
}

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId)

const app = isFirebaseConfigured ? initializeApp(config) : null
export const db: Firestore | null = app ? getFirestore(app) : null
export const auth: Auth | null = app ? getAuth(app) : null

/** Emails allowed into /admin (mirrors the allowlist in firestore.rules, which is what actually enforces it). */
export const ADMIN_EMAILS = env('VITE_ADMIN_EMAILS').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
export const isAdminEmail = (email: string | null | undefined) =>
  ADMIN_EMAILS.length === 0 ? Boolean(email) : Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()))

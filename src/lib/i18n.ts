export type Lang = 'en' | 'zh'

/** Pick the string for the current language. */
export function tr(obj: { en: string; zh: string }, lang: Lang): string {
  return lang === 'zh' ? obj.zh : obj.en
}

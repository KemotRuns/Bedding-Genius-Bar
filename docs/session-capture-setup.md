# Session capture → Google Sheet

Each time a user presses **Save my profile** on the Results page, the app:

1. Saves the full session to the device (`localStorage`, key `tn_sessions`) — always, even offline.
2. POSTs the session to a remote endpoint for central analysis — **if** `VITE_CAPTURE_ENDPOINT` is set.
   If the POST fails (offline), the session is queued and retried on the next app load.

The simplest zero-server endpoint is a **Google Apps Script Web App** that appends a row
to a Google Sheet. Setup takes ~5 minutes.

---

## 1. Create the Sheet + script

1. Create a new Google Sheet (this is where responses land — and where you run your analysis).
2. **Extensions → Apps Script**.
3. Delete the boilerplate and paste the script below.
4. **Deploy → New deployment → type: Web app**
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
5. Copy the **Web app URL** (ends in `/exec`).

```javascript
// Apps Script — appends each finalized session as a row in the bound Sheet.
const HEADERS = [
  'timestamp', 'id', 'name', 'email', 'lang', 'completedSections',
  'sheet', 'sheetSku', 'comforter', 'comforterSku', 'pillow', 'pillowSku',
  // raw answers
  'nightHeat', 'skinType', 'careLevel', 'sensoryPref',
  'comforterTemp', 'comforterFeel', 'breathingIssues',
  'sleepPosition', 'shoulderWidth', 'pillowFeel', 'pillowPriority',
]

function doPost(e) {
  const lock = LockService.getScriptLock()
  lock.waitLock(30000)
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0]
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS)

    const s = JSON.parse(e.postData.contents)
    const a = s.answers || {}
    const rec = s.recommendation || {}
    sheet.appendRow([
      s.createdAt, s.id, s.name, s.email || '', s.lang,
      (s.completedSections || []).join(', '),
      rec.sheet || '', rec.sheetSku || '',
      rec.comforter || '', rec.comforterSku || '',
      rec.pillow || '', rec.pillowSku || '',
      a.nightHeat || '', a.skinType || '', a.careLevel || '', a.sensoryPref || '',
      a.comforterTemp || '', a.comforterFeel || '', a.breathingIssues || '',
      a.sleepPosition || '', a.shoulderWidth || '', a.pillowFeel || '', a.pillowPriority || '',
    ])
    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON)
  } finally {
    lock.releaseLock()
  }
}
```

> Note: the app sends the POST with `mode: 'no-cors'`, so the browser never reads the
> response — that's fine, the row still gets written. Apps Script Web Apps don't need
> CORS headers for this to work.

---

## 2. Point the app at it

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```
VITE_CAPTURE_ENDPOINT=https://script.google.com/macros/s/XXXXXXXX/exec
```

Restart the dev server (`npm run dev`) so Vite picks up the new env var.
For the Netlify build, add the same variable under **Site settings → Environment variables**.

---

## 3. Verify

1. Run the quiz, press **Save my profile**.
2. A new row appears in the Sheet.
3. Offline test: disable network, save → re-enable → reload the app; the queued session flushes automatically.

---

## Swapping in a database instead

The endpoint is just an HTTP POST of a JSON `CapturedSession` (see `src/lib/session.ts`).
To use Supabase / a custom API instead of Sheets, point `VITE_CAPTURE_ENDPOINT` at any
URL that accepts that POST body — no app code changes needed.

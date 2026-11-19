export function attemptPayload(phone, source) {
  return { masked_number: `628***${phone.slice(-2)}`, source }
}

export function logAttempt(phone, source) {
  const url = import.meta.env.VITE_SUPABASE_URL
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return

  void fetch(`${url.replace(/\/+$/, '')}/rest/v1/whatsapp_attempts`, {
    method: 'POST',
    headers: { apikey: key, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(attemptPayload(phone, source)),
    keepalive: true,
  }).catch(() => {})
}

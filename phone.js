export function normalizePhone(raw) {
  const text = raw.normalize('NFKC').replace(/[\p{Bidi_Control}\u200B\u2060]/gu, '').trim()
  if (!/^\+?[0-9\p{Zs}\t().\p{Dash}]+$/u.test(text)) return null
  let digits = text.replace(/\D/g, '')
  if (text.startsWith('+') && !digits.startsWith('62')) return null
  if (digits.startsWith('0062')) digits = digits.slice(2)
  if (digits.startsWith('6208')) digits = `62${digits.slice(3)}`
  if (digits.startsWith('08')) digits = `62${digits.slice(1)}`
  if (digits.startsWith('8')) digits = `62${digits}`
  return /^628\d{8,11}$/.test(digits) ? digits : null
}

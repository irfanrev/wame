import assert from 'node:assert/strict'
import { test } from 'node:test'
import { normalizePhone } from './phone.js'
import { attemptPayload } from './analytics.js'

test('normalizes common Indonesian mobile formats', () => {
  for (const input of ['0863-9472-3947', '+62 (863) 9472.3947', '6286394723947', '0062 863 9472 3947', '863 9472 3947', '+62 (0)863 9472 3947']) {
    assert.equal(normalizePhone(input), '6286394723947')
  }
})

test('normalizes numbers copied with Unicode spacing and punctuation', () => {
  for (const input of ['+62\u00a0822‑1788‑5415', '0822‑1788‑5415', '+62\u202f822−1788−5415', '＋６２（８２２）１７８８－５４１５', '\u200e0822\u200b1788\u20095415']) {
    assert.equal(normalizePhone(input), '6282217885415')
  }
})

test('accepts local and international forms with or without separators', () => {
  for (const input of ['822‑1788‑5415', '+6282217885415', '082217885415', '82217885415']) {
    assert.equal(normalizePhone(input), '6282217885415')
  }
})

test('rejects invalid or ambiguous inputs', () => {
  for (const input of ['', '+1 86394723947', '0215555555', '0863', '086394723947 ext 2', '086394723947 / 08123456789', '08123456789012345']) {
    assert.equal(normalizePhone(input), null)
  }
})

test('analytics sends a masked number, not the full number', () => {
  assert.deepEqual(attemptPayload('6286394723947', 'paste'), { masked_number: '628***47', source: 'paste' })
})

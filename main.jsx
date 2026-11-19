import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowUpRight, Clipboard, Link2, ShieldCheck } from 'lucide-react'
import wameLogo from './wame.svg'
import '@fontsource-variable/manrope'
import './style.css'
import { normalizePhone } from './phone.js'
import { logAttempt } from './analytics.js'

function App() {
  const [input, setInput] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState(false)
  const field = useRef(null)
  const number = normalizePhone(input)
  const link = number && `https://wa.me/${number}`

  function open(raw, source) {
    const phone = normalizePhone(raw)
    setError(!phone)
    if (!phone) {
      setMessage('Masukkan satu nomor HP Indonesia, misalnya 0863-9472-3947.')
      field.current.focus()
      return
    }
    setMessage('Mencoba membuka aplikasi WhatsApp…')
    logAttempt(phone, source)
    window.location.href = `whatsapp://send?phone=${phone}`
  }

  function pasteText(text) {
    setInput(text)
    open(text, 'paste')
  }

  async function pasteFromClipboard() {
    try { pasteText(await navigator.clipboard.readText()) }
    catch {
      setError(false)
      setMessage('Akses clipboard tidak tersedia. Tempel langsung di kolom nomor.')
      field.current.focus()
    }
  }

  async function copyLink() {
    try { await navigator.clipboard.writeText(link); setMessage('Tautan berhasil disalin.') }
    catch { setMessage('Tidak bisa menyalin otomatis. Salin tautan yang ditampilkan.') }
  }

  return <div className="shell mx-auto flex min-h-svh max-w-5xl flex-col px-5 sm:px-10">
    <header className="flex items-center justify-between gap-3 py-3 md:py-6">
      <div className="brand flex items-center gap-2.5"><img className="brand-icon" src={wameLogo} alt="" width="36" height="36" />Wame</div>
      <span className="country">Indonesia · +62</span>
    </header>
    <main className="mx-auto grid w-full max-w-lg flex-1 content-start items-start gap-5 py-6 md:max-w-none md:grid-cols-[1fr_1.1fr] md:content-center md:items-center md:gap-x-14 md:py-12">
      <section>
        <h1>Buka chat,<br /><span>tanpa simpan nomor.</span></h1>
        <p className="intro mt-3 md:mt-5">Tempel nomor HP Indonesia untuk langsung membuka WhatsApp.</p>
      </section>
      <section className="panel min-w-0 p-4 sm:p-8 md:col-start-2 md:row-span-2 md:row-start-1" aria-label="Pembuka chat WhatsApp">
        <form onSubmit={event => { event.preventDefault(); open(input, 'manual') }}>
          <label htmlFor="phone">Nomor WhatsApp</label>
          <div className="input-row mt-2 flex items-stretch">
            <input ref={field} id="phone" type="tel" inputMode="tel" autoComplete="off" placeholder="08xx xxxx xxxx" value={input} aria-invalid={error} aria-describedby="format feedback" onChange={event => { setInput(event.target.value); setError(false); setMessage('') }} onPaste={event => { event.preventDefault(); pasteText(event.clipboardData.getData('text')) }} />
            <button type="button" className="paste flex items-center gap-1.5" onClick={pasteFromClipboard}><Clipboard size={16} aria-hidden="true" /> Tempel</button>
          </div>
          <p id="format" className="hint mt-2">Format 08…, +62…, atau 8…, dengan atau tanpa pemisah.</p>
          <button type="submit" className="primary mt-5 flex w-full items-center justify-between gap-2">Buka WhatsApp <ArrowUpRight size={20} aria-hidden="true" /></button>
        </form>
        <p id="feedback" role="status" className={error ? 'feedback error' : 'feedback'}>{message}</p>
        {link && <div className="result mt-4">
          <p className="hint">Nomor siap: <strong>+{number}</strong></p>
          <a className="fallback min-h-11" href={link} target="_blank" rel="noopener noreferrer">Aplikasi tidak terbuka? Buka wa.me <span className="sr-only">(tab baru)</span><ArrowUpRight size={15} aria-hidden="true" /></a>
          <div className="mt-2 flex flex-wrap items-center gap-2"><span className="hint break-all">{link}</span><button type="button" className="copy inline-flex items-center gap-1" onClick={copyLink}><Link2 size={14} aria-hidden="true" /> Salin</button></div>
        </div>}
      </section>
      <div className="example flex flex-wrap items-center gap-x-3 gap-y-1 md:self-start"><span>0822‑1788‑5415</span><ArrowUpRight size={15} aria-hidden="true" /><span>wa.me/6282217885415</span></div>
    </main>
    <footer className="flex flex-wrap items-center justify-between gap-3 py-5"><span className="flex items-start gap-2"><ShieldCheck size={17} className="shrink-0" aria-hidden="true" /> Analitik hanya mencatat nomor tersamar jika diaktifkan.</span><span>Tidak berafiliasi dengan WhatsApp.</span><span>© {new Date().getFullYear()} <a className="underline underline-offset-2" href="https://sukacode.com">Sukacode</a></span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />)

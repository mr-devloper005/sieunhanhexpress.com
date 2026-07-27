'use client'

import { useState } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'

type FormStatus = 'idle' | 'submitting' | 'success' | 'error'

const fieldClass =
  'h-12 w-full rounded-full border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 text-[0.95rem] text-[var(--slot4-page-text)] outline-none transition duration-500 placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:bg-[var(--slot4-surface-bg)]'

export function EditableContactLeadForm() {
  const [status, setStatus] = useState<FormStatus>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')
    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(formData.entries())),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data?.message || 'Unable to send your message.')
      setStatus('success')
      setMessage(data?.message || 'Thanks. Your message has been received.')
      form.reset()
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'Unable to send your message.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7 grid gap-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="name" label="Full name" placeholder="Your name" required />
        <Field name="email" type="email" label="Email address" placeholder="you@example.com" required />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Field name="phone" label="Phone number" placeholder="Optional" />
        <Field name="subject" label="Subject" placeholder="What is this about?" />
      </div>

      <label className="grid gap-2">
        <span className="editable-label text-[var(--slot4-muted-text)]">Message</span>
        <textarea
          name="message"
          required
          rows={6}
          placeholder="Tell us what you are trying to publish, fix or launch..."
          className="w-full resize-y rounded-[22px] border border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-5 py-4 text-[0.95rem] leading-7 text-[var(--slot4-page-text)] outline-none transition duration-500 placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:bg-[var(--slot4-surface-bg)]"
        />
      </label>

      <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      {message ? (
        <div
          className={`flex items-start gap-3 rounded-[18px] px-5 py-4 text-sm font-medium ${
            status === 'success'
              ? 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-page-text)]'
              : 'border border-[var(--slot4-accent)] text-[var(--slot4-accent)]'
          }`}
        >
          {status === 'success' ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> : null}
          <span>{message}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="mt-1 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-8 py-4 text-sm font-semibold text-[var(--slot4-cream)] transition duration-500 hover:bg-[var(--slot4-accent)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status === 'submitting' ? 'Sending' : 'Send message'}
      </button>
    </form>
  )
}

function Field({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
}) {
  return (
    <label className="grid gap-2">
      <span className="editable-label text-[var(--slot4-muted-text)]">{label}</span>
      <input name={name} type={type} required={required} placeholder={placeholder} className={fieldClass} />
    </label>
  )
}

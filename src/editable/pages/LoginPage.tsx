import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  const copy = pagesContent.auth.login
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto grid w-full max-w-[var(--editable-container)] items-center gap-10 px-5 pb-20 pt-[112px] sm:px-8 sm:pt-[132px] lg:grid-cols-[1fr_0.85fr] lg:gap-16 lg:px-10">
          <div className="min-w-0">
            <p className="editable-label text-[var(--slot4-accent)]">{copy.badge}</p>
            <h1 className="editable-display mt-5 max-w-xl text-[2.6rem] leading-[1.03] tracking-[-0.02em] sm:text-[3.6rem]">{copy.title}</h1>
            <p className="mt-6 max-w-lg text-[1.02rem] leading-[1.8] text-[var(--slot4-muted-text)]">{copy.description}</p>
            <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-semibold transition hover:text-[var(--slot4-accent)]">
              Keep browsing instead <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="min-w-0 rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 sm:p-9">
            <h2 className="editable-display text-[1.8rem] leading-tight">{copy.formTitle}</h2>
            <EditableLocalLoginForm />
            <p className="mt-7 text-sm text-[var(--slot4-muted-text)]">
              New here?{' '}
              <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {copy.createCta}
              </Link>
            </p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

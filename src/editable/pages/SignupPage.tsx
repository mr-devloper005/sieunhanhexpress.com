import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  const copy = pagesContent.auth.signup
  return (
    <EditableSiteShell>
      <main className="bg-[var(--slot4-page-bg)]">
        <section className="mx-auto grid w-full max-w-[var(--editable-container)] items-center gap-10 px-5 pb-20 pt-[112px] sm:px-8 sm:pt-[132px] lg:grid-cols-[0.85fr_1fr] lg:gap-16 lg:px-10">
          <div className="order-2 min-w-0 rounded-[28px] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-7 sm:p-9 lg:order-1">
            <h1 className="editable-display text-[1.8rem] leading-tight">{copy.formTitle}</h1>
            <EditableLocalSignupForm />
            <p className="mt-7 text-sm text-[var(--slot4-muted-text)]">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                {copy.loginCta}
              </Link>
            </p>
          </div>

          <div className="order-1 min-w-0 lg:order-2">
            <p className="editable-label text-[var(--slot4-accent)]">{copy.badge}</p>
            <h2 className="editable-display mt-5 max-w-xl text-[2.6rem] leading-[1.03] tracking-[-0.02em] sm:text-[3.6rem]">{copy.title}</h2>
            <p className="mt-6 max-w-lg text-[1.02rem] leading-[1.8] text-[var(--slot4-muted-text)]">{copy.description}</p>
            <ul className="mt-8 grid gap-3">
              {['Prepare posts with images, links and a summary', 'Keep everything in one workspace', 'Submit when it is ready — not before'].map((point) => (
                <li key={point} className="flex gap-3 text-[0.95rem] leading-[1.7] text-[var(--slot4-muted-text)]">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--slot4-accent)]" />
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

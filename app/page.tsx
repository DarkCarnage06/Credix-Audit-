import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Page() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <section className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-10 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.35em] text-primary">AI spend audit</p>
              <div className="space-y-4">
                <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
                  Find out if you
re overpaying for AI tools.
                </h1>
                <p className="max-w-2xl text-lg text-slate-400 sm:text-xl">
                  Free audit in 2 minutes. No signup required. Measure your subscriptions, seats, and spend with clarity so you can cut unnecessary costs fast.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link href="/audit">
                  <Button className="rounded-full px-7 py-4 text-base">Start Your Free Audit →</Button>
                </Link>
                <p className="text-sm text-slate-500">
                  Built for teams who want better visibility into AI spend across Copilot, ChatGPT, OpenAI, Claude, and more.
                </p>
              </div>
            </div>
            <div className="rounded-[2rem] border border-slate-800/70 bg-slate-900/80 p-8 text-slate-300 shadow-[0_30px_80px_rgba(15,23,42,0.25)]">
              <p className="text-sm uppercase tracking-[0.35em] text-primary">What you can do</p>
              <ul className="mt-6 space-y-4 text-slate-400">
                <li>• Compare seat-based subscriptions to benchmark pricing.</li>
                <li>• Capture API usage spend across OpenAI, Anthropic, and Gemini.</li>
                <li>• Identify overlapping tools and hidden overpayment.</li>
                <li>• Keep audit state in your browser for instant return.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

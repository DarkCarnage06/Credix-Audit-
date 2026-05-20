"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { AI_TOOLS, USE_CASES } from "@/lib/tools"
import { useAuditStore } from "@/lib/store"

export default function Page() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const teamSize = useAuditStore((state) => state.teamSize)
  const useCase = useAuditStore((state) => state.useCase)
  const toolEntries = useAuditStore((state) => state.toolEntries)
  const addTool = useAuditStore((state) => state.addTool)
  const removeTool = useAuditStore((state) => state.removeTool)
  const updateTool = useAuditStore((state) => state.updateTool)
  const setTeamSize = useAuditStore((state) => state.setTeamSize)
  const setUseCase = useAuditStore((state) => state.setUseCase)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)
    router.push("/results")
  }

  const handleToolChange = (entryId: string, toolId: string) => {
    const selectedTool = AI_TOOLS.find((tool) => tool.id === toolId)
    const newPlan = selectedTool?.plans[0]

    updateTool(entryId, {
      toolId,
      planId: newPlan?.id ?? "",
      monthlySpend: newPlan?.price ? newPlan.price * 1 : 0,
      seats: 1,
    })
  }

  const handlePlanChange = (entryId: string, planId: string) => {
    const entry = toolEntries.find((item) => item.id === entryId)
    if (!entry) return
    const tool = AI_TOOLS.find((item) => item.id === entry.toolId)
    const plan = tool?.plans.find((option) => option.id === planId)

    updateTool(entryId, {
      planId,
      monthlySpend: plan ? plan.price * entry.seats : entry.monthlySpend,
    })
  }

  const handleSeatsChange = (entryId: string, value: string) => {
    const seats = Math.max(1, Number(value) || 1)
    const entry = toolEntries.find((item) => item.id === entryId)
    if (!entry) return

    const tool = AI_TOOLS.find((item) => item.id === entry.toolId)
    const plan = tool?.plans.find((option) => option.id === entry.planId)
    const previousSpend = plan ? plan.price * entry.seats : entry.monthlySpend
    const updatedSpend = plan ? plan.price * seats : entry.monthlySpend

    updateTool(entryId, {
      seats,
      monthlySpend: entry.monthlySpend === previousSpend ? updatedSpend : entry.monthlySpend,
    })
  }

  const handleSpendChange = (entryId: string, value: string) => {
    const amount = Math.max(0, Number(value) || 0)
    updateTool(entryId, { monthlySpend: amount })
  }

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-slate-950 px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <section className="space-y-4 rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.35)]">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-primary">AI spend audit</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Tell us what your team actually pays for AI tools.</h1>
            <p className="max-w-2xl text-slate-400">
              Enter your team size, use case, and subscribed tools so we can map your spend against market benchmarks.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="teamSize">Team size</Label>
                <Input
                  id="teamSize"
                  type="number"
                  min={1}
                  value={teamSize}
                  onChange={(event) => setTeamSize(Number(event.target.value))}
                  className="max-w-[12rem]"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="useCase">Primary AI use case</Label>
                <Select
                  id="useCase"
                  value={useCase}
                  onChange={(event) => setUseCase(event.target.value as typeof useCase)}
                >
                  {USE_CASES.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Your AI tools</h2>
                  <p className="text-sm text-slate-400">
                    Add every AI subscription your team pays for, including APIs and seat-based plans.
                  </p>
                </div>
                <Button type="button" variant="outline" onClick={addTool} className="whitespace-nowrap">
                  Add another tool
                </Button>
              </div>

              <div className="grid gap-6">
                {toolEntries.map((entry, index) => {
                  const selectedTool = AI_TOOLS.find((tool) => tool.id === entry.toolId) ?? AI_TOOLS[0]
                  const selectedPlan = selectedTool.plans.find((plan) => plan.id === entry.planId) ?? selectedTool.plans[0]

                  return (
                    <Card key={entry.id} className="p-6">
                      <div className="flex flex-col gap-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-100">Tool {index + 1}</h3>
                            <p className="text-sm text-slate-400">Select the AI tool and plan your team uses today.</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            className="text-slate-400 hover:text-slate-100"
                            onClick={() => removeTool(entry.id)}
                          >
                            Remove
                          </Button>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="grid gap-2">
                            <Label htmlFor={`tool-${entry.id}`}>Tool</Label>
                            <Select
                              id={`tool-${entry.id}`}
                              value={entry.toolId}
                              onChange={(event) => handleToolChange(entry.id, event.target.value)}
                            >
                              {AI_TOOLS.map((tool) => (
                                <option key={tool.id} value={tool.id}>
                                  {tool.name}
                                </option>
                              ))}
                            </Select>
                          </div>

                          <div className="grid gap-2">
                            <Label htmlFor={`plan-${entry.id}`}>Plan</Label>
                            <Select
                              id={`plan-${entry.id}`}
                              value={selectedPlan.id}
                              onChange={(event) => handlePlanChange(entry.id, event.target.value)}
                            >
                              {selectedTool.plans.map((plan) => (
                                <option key={plan.id} value={plan.id}>
                                  {plan.name} {plan.price ? `($${plan.price}/seat)` : "(usage-based)"}
                                </option>
                              ))}
                            </Select>
                          </div>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3">
                          <div className="grid gap-2">
                            <Label htmlFor={`seats-${entry.id}`}>Seats</Label>
                            <Input
                              id={`seats-${entry.id}`}
                              type="number"
                              min={1}
                              value={entry.seats}
                              onChange={(event) => handleSeatsChange(entry.id, event.target.value)}
                            />
                          </div>
                          <div className="grid gap-2 sm:col-span-2">
                            <Label htmlFor={`spend-${entry.id}`}>Monthly spend ($)</Label>
                            <Input
                              id={`spend-${entry.id}`}
                              type="number"
                              min={0}
                              value={entry.monthlySpend}
                              onChange={(event) => handleSpendChange(entry.id, event.target.value)}
                            />
                          </div>
                        </div>

                        <div className="rounded-3xl bg-slate-900/80 p-4 text-sm text-slate-400">
                          <p>{selectedTool.description}</p>
                          <p className="mt-2 font-medium text-slate-200">
                            Estimated rate: {selectedPlan.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  )
                })}
              </div>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1 text-slate-400">
                <p>All changes are saved locally so you can return to the audit anytime.</p>
                <p className="text-sm text-slate-500">No account, no signup, no surprises.</p>
              </div>
              <Button type="submit" className="inline-flex items-center justify-center" disabled={isSaving}>
                {isSaving ? "Saving your audit..." : "Get My Audit →"}
              </Button>
            </div>
          </form>
        </section>

        <section className="rounded-[2rem] border border-slate-800/80 bg-slate-950/90 p-8 shadow-[0_35px_90px_rgba(15,23,42,0.25)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Why this matters</h2>
              <p className="max-w-2xl text-slate-400">
                Teams often pay for overlapping AI subscriptions or seat licenses they don’t fully use. This audit will surface where your spend is concentrated and where fast savings are possible.
              </p>
            </div>
            <Link href="/" className="text-sm font-semibold text-primary hover:text-primary/90">
              Back to homepage
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}

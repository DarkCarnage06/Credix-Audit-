import { create } from "zustand"
import { persist, type PersistStorage } from "zustand/middleware"
import { UseCase } from "@/lib/tools"

export type ToolEntry = {
  id: string
  toolId: string
  planId: string
  seats: number
  monthlySpend: number
}

export type AuditState = {
  teamSize: number
  useCase: UseCase
  toolEntries: ToolEntry[]
  addTool: () => void
  removeTool: (id: string) => void
  updateTool: (id: string, update: Partial<Omit<ToolEntry, "id">>) => void
  setTeamSize: (value: number) => void
  setUseCase: (value: UseCase) => void
}

const defaultToolEntry: ToolEntry = {
  id: "entry-1",
  toolId: "cursor",
  planId: "hobby",
  seats: 1,
  monthlySpend: 0,
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      teamSize: 1,
      useCase: "mixed",
      toolEntries: [defaultToolEntry],
      addTool: () =>
        set((state) => {
          const id = `entry-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

          return {
            toolEntries: [
              ...state.toolEntries,
              {
                id,
                toolId: "cursor",
                planId: "hobby",
                seats: 1,
                monthlySpend: 0,
              },
            ],
          }
        }),
      removeTool: (id) =>
        set((state) => ({
          toolEntries: state.toolEntries.filter((entry) => entry.id !== id),
        })),
      updateTool: (id, update) =>
        set((state) => ({
          toolEntries: state.toolEntries.map((entry) =>
            entry.id === id ? { ...entry, ...update } : entry
          ),
        })),
      setTeamSize: (value) => set({ teamSize: Math.max(1, value) }),
      setUseCase: (value) => set({ useCase: value }),
    }),
    {
      name: "credex-audit-store",
      storage:
        typeof window !== "undefined"
          ? ({
              getItem: (name: string) => window.localStorage.getItem(name),
              setItem: (name: string, value: string) => window.localStorage.setItem(name, value),
              removeItem: (name: string) => window.localStorage.removeItem(name),
            } as unknown as PersistStorage<AuditState, unknown>)
          : undefined,
    }
  )
)

import * as React from "react"
import { cn } from "@/lib/utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-950/90 shadow-[0_25px_100px_rgba(15,23,42,0.35)]",
        className
      )}
      {...props}
    />
  )
)
Card.displayName = "Card"

export { Card }

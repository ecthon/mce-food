import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon } from '@hugeicons/core-free-icons'

interface EventHeaderProps {
  title: string
  date: string
}

export default function EventHeader({ title, date }: EventHeaderProps) {
  return (
    <div className="bg-zinc-100 rounded-xl px-4 py-3">
      <p className="text-base font-bold text-zinc-900 leading-tight">{title}</p>
      <div className="flex items-center gap-2 mt-1">
        <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.5} className="text-violet-500 shrink-0" />
        <p className="text-xs text-zinc-400">{date}</p>
      </div>
    </div>
  )
}

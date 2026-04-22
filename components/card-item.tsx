import { HugeiconsIcon } from '@hugeicons/react'
import { Add01Icon, Remove01Icon } from '@hugeicons/core-free-icons'
import { Button } from './ui/button'

export type MenuItem = {
    id: number
    name: string
    description: string
    price: number
}

interface CardItemProps {
    item: MenuItem
    quantity: number
    onQuantityChange: (id: number, quantity: number) => void
}

export default function CardItem({ item, quantity, onQuantityChange }: CardItemProps) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3 border rounded-xl">
            <div className="flex flex-col min-w-0 w-full space-y-2">
                <div className="flex flex-col items-start">
                    <p className="text-sm font-bold text-zinc-800 truncate">{item.name}</p>
                    <span className="mt-1 text-xs font-medium text-zinc-600 bg-zinc-100 self-start px-2 py-0.5 rounded-full">
                        R$ {item.price.toFixed(2).replace('.', ',')}/unid.
                    </span>
                </div>
                <p className="text-xs text-zinc-500 leading-snug">{item.description}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => onQuantityChange(item.id, Math.max(0, quantity - 1))}
                    disabled={quantity === 0}
                >
                    <HugeiconsIcon icon={Remove01Icon} size={18} strokeWidth={1.5} className="text-indigo-600" />
                </Button>
                <span className="w-5 text-center text-sm font-medium text-zinc-900">{quantity}</span>
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 cursor-pointer"
                    onClick={() => onQuantityChange(item.id, Math.min(5, quantity + 1))}
                    disabled={quantity === 5}
                >
                    <HugeiconsIcon icon={Add01Icon} size={18} strokeWidth={1.5} className="text-indigo-600" />
                </Button>
            </div>
        </div>
    )
}
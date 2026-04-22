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
            <div className="flex flex-col min-w-0 w-full space-y-3">
                <div className="flex flex-col items-start gap-0.5">
                    <p className="text-sm font-bold text-zinc-800 truncate">{item.name}</p>
                    <p className="text-xs text-zinc-500 leading-snug">{item.description}</p>
                </div>
                <span className="text-xs font-semibold text-zinc-600 self-start">
                    R$ {item.price.toFixed(2).replace('.', ',')}
                </span>
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
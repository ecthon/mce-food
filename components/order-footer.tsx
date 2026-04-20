"use client"

import { HugeiconsIcon } from '@hugeicons/react'
import { ShoppingBag01Icon } from '@hugeicons/core-free-icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { MenuItem } from '@/components/card-item'

interface OrderFooterProps {
  items: MenuItem[]
  quantities: Record<number, number>
  observations: string
  onConfirm: () => void
}

export default function OrderFooter({ items, quantities, observations, onConfirm }: OrderFooterProps) {
  const selectedItems = items.filter((item) => (quantities[item.id] ?? 0) > 0)
  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0)

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white border-t px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={ShoppingBag01Icon} size={22} strokeWidth={1.5} className="text-red-600 shrink-0" />
        <div className="flex items-baseline gap-0.5">
          <p className="text-lg font-semibold text-zinc-800">
            R$ {totalPrice.toFixed(2).replace('.', ',')}
          </p>
          <p className="text-xs text-zinc-500">/ {totalItems} {totalItems === 1 ? 'item' : 'itens'}</p>
        </div>
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            disabled={totalItems === 0}
            className="bg-red-600 hover:bg-red-700 rounded-full px-6 h-11 text-white font-semibold shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            Finalizar Pedido
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-800">
              Resumo do pedido
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2.5 mt-1">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {quantities[item.id]}
                  </span>
                  <p className="text-sm text-zinc-700 truncate">{item.name}</p>
                </div>
                <p className="text-sm font-medium text-zinc-800 shrink-0">
                  R$ {(item.price * quantities[item.id]).toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t pt-3 mt-1 flex items-center justify-between">
            <p className="text-sm font-semibold text-zinc-700">Total</p>
            <p className="text-base font-bold text-zinc-900">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {observations.trim() && (
            <div className="bg-zinc-50 rounded-lg px-3 py-2">
              <p className="text-xs font-medium text-zinc-500 mb-0.5">Observações</p>
              <p className="text-sm text-zinc-700">{observations.trim()}</p>
            </div>
          )}

          <DialogFooter className="flex gap-2 mt-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1">Voltar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-violet-600/90 hover:bg-violet-700/90 text-white font-semibold"
              >
                Confirmar pedido
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

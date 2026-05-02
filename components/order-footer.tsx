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
  orderConfirmed?: boolean
  onEdit?: () => void
  isLoading?: boolean
}

export default function OrderFooter({ items, quantities, observations, onConfirm, orderConfirmed, onEdit, isLoading = false }: OrderFooterProps) {
  const selectedItems = items.filter((item) => (quantities[item.id] ?? 0) > 0)
  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0)

  if (orderConfirmed) {
    return (
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg border-t border-zinc-200 px-4 py-4">
        <Button
          onClick={onEdit}
          disabled={isLoading}
          variant="outline"
          className={`w-full h-11 text-sm font-semibold rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} text-indigo-600 border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300`}
        >
          Editar pedido
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-lg bg-white px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <HugeiconsIcon icon={ShoppingBag01Icon} size={22} strokeWidth={1.5} className="text-indigo-600 shrink-0" />
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
            className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-6 h-11 text-white font-semibold shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            Finalizar pedido
          </Button>
        </DialogTrigger>

        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-xl p-0 overflow-hidden gap-0">
          <DialogHeader className="px-5 pt-5 pb-4 border-b border-zinc-100">
            <DialogTitle className="text-base font-bold text-zinc-900">
              Confirmar pedido
            </DialogTitle>
            <p className="text-xs text-zinc-400">Revise os itens antes de confirmar</p>
          </DialogHeader>

          <div className="flex flex-col px-5 py-4 gap-2.5">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-bold text-zinc-600 bg-zinc-100 rounded-md w-6 h-6 flex items-center justify-center shrink-0">
                    {quantities[item.id]}
                  </span>
                  <p className="text-sm text-zinc-700 truncate">{item.name}</p>
                </div>
                <p className="text-sm font-semibold text-zinc-900 shrink-0">
                  R$ {(item.price * quantities[item.id]).toFixed(2).replace('.', ',')}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between px-5 py-3 border-t border-zinc-100 bg-zinc-50">
            <p className="text-sm font-semibold text-zinc-500">Total</p>
            <p className="text-base font-bold text-zinc-900">
              R$ {totalPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>

          {observations.trim() && (
            <div className="mx-5 mb-4 mt-1 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2.5">
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest mb-1">Observações</p>
              <p className="text-sm text-zinc-700 leading-relaxed">{observations.trim()}</p>
            </div>
          )}

          <DialogFooter className="flex flex-row gap-2 px-5 pb-5 mt-2">
            <DialogClose asChild>
              <Button variant="outline" className="flex-1 h-10 text-sm rounded-lg cursor-pointer">Voltar</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 h-10 text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {isLoading ? 'Enviando...' : 'Confirmar'}
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

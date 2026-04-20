"use client"
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon, ShoppingBag01Icon } from '@hugeicons/core-free-icons'
import { Button } from "@/components/ui/button"
import CardItem from '@/components/card-item'
import HeaderUser from '@/components/header-user'

export default function Page() {
  return (
    <div className='flex flex-col'>
      <HeaderUser />
      <div className="flex flex-col gap-4 min-h-svh p-4 max-w-lg mx-auto pb-28">
        {/* Header do evento */}
        <div className="bg-zinc-100 rounded-xl px-4 py-3">
          <p className="text-base font-bold text-zinc-800 leading-tight">Almoço de domingo - Churrasquinho</p>
          <div className="flex items-center gap-2 mt-1">
            <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.5} className="text-violet-500 shrink-0" />
            <p className="text-sm text-zinc-500">Domingo • 15/10/2026</p>
          </div>
        </div>

        {/* Lista de itens */}
        <div className="flex flex-col gap-3 w-full">
          <CardItem />
          <CardItem />
          <CardItem />
          <CardItem />
        </div>

        {/* Footer fixo */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2">
            <HugeiconsIcon icon={ShoppingBag01Icon} size={22} strokeWidth={1.5} className="text-red-600 shrink-0" />
            <div className="flex items-baseline gap-0.5">
              <p className="text-lg font-semibold text-zinc-800">R$ 0,00</p>
              <p className="text-xs text-zinc-500">/ 0 itens</p>
            </div>
          </div>
          <Button className="bg-red-600 hover:bg-red-700 rounded-full px-6 h-11 text-white font-semibold shrink-0">
            Finalizar Pedido
          </Button>
        </div>
      </div>
    </div>
  )
}

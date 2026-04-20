"use client"
import { useState } from 'react'
import { HugeiconsIcon } from '@hugeicons/react'
import { Calendar03Icon, ShoppingBag01Icon } from '@hugeicons/core-free-icons'
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import CardItem, { MenuItem } from '@/components/card-item'
import HeaderUser from '@/components/header-user'

const churrasquinho: { title: string; date: string; items: MenuItem[] } = {
  title: "Almoço de domingo - Churrasquinho",
  date: "20/10/2026",
  items: [
    {
      id: 1,
      name: "Frango combo",
      description: "Espetinho de frango, arroz, farofa e batatonese.",
      price: 20.00,
    },
    {
      id: 2,
      name: "Frango simples",
      description: "Espetinho de frango, arroz e farofa.",
      price: 15.00,
    },
    {
      id: 3,
      name: "Carne combo",
      description: "Espetinho de carne, arroz, farofa e batatonese. Suco e pudim inclusos",
      price: 30.00,
    },
    {
      id: 4,
      name: "Carne simples",
      description: "Espetinho de carne, arroz e farofa.",
      price: 20.00,
    },
  ]
}

export default function Page() {
  const [quantities, setQuantities] = useState<Record<number, number>>(
    Object.fromEntries(churrasquinho.items.map((item) => [item.id, 0]))
  )
  const [observations, setObservations] = useState('')

  const handleQuantityChange = (id: number, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: quantity }))
  }

  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
  const totalPrice = churrasquinho.items.reduce(
    (sum, item) => sum + item.price * (quantities[item.id] ?? 0),
    0
  )

  const selectedItems = churrasquinho.items.filter((item) => (quantities[item.id] ?? 0) > 0)

  const handleConfirmOrder = () => {
    const order = {
      event: churrasquinho.title,
      items: selectedItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: quantities[item.id],
        price: item.price,
        subtotal: item.price * quantities[item.id],
      })),
      totalItems,
      totalPrice,
      observations: observations.trim() || null,
    }
    console.log('Pedido confirmado:', order)
    // TODO: substituir por chamada ao endpoint do backend
  }

  return (
    <div className='flex flex-col'>
      <HeaderUser />
      <div className="flex flex-col gap-4 min-h-svh p-4 max-w-lg mx-auto pb-28">

        {/* Header do evento */}
        <div className="bg-zinc-100 rounded-xl px-4 py-3">
          <p className="text-base font-bold text-zinc-800 leading-tight">{churrasquinho.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <HugeiconsIcon icon={Calendar03Icon} size={16} strokeWidth={1.5} className="text-violet-500 shrink-0" />
            <p className="text-sm text-zinc-500">{churrasquinho.date}</p>
          </div>
        </div>

        {/* Lista de itens */}
        <div className="flex flex-col gap-3 w-full">
          {churrasquinho.items.map((item) => (
            <CardItem
              key={item.id}
              item={item}
              quantity={quantities[item.id] ?? 0}
              onQuantityChange={handleQuantityChange}
            />
          ))}
        </div>

        {/* Observações */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="observations" className="text-sm font-medium text-zinc-700">
            Observações
          </label>
          <Textarea
            id="observations"
            placeholder="Ex: sem cebola, ponto da carne bem passado..."
            className="resize-none text-sm"
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div>

        {/* Footer fixo */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex items-center justify-between gap-3 max-w-lg mx-auto">
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

              {/* Itens selecionados */}
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

              {/* Total */}
              <div className="border-t pt-3 mt-1 flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-700">Total</p>
                <p className="text-base font-bold text-zinc-900">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </p>
              </div>

              {/* Observações no modal (se houver) */}
              {observations.trim() && (
                <div className="bg-zinc-50 rounded-lg px-3 py-2">
                  <p className="text-xs font-medium text-zinc-500 mb-0.5">Observações</p>
                  <p className="text-sm text-zinc-700">{observations.trim()}</p>
                </div>
              )}

              <DialogFooter className="flex gap-2 mt-2">
                <DialogClose asChild>
                  <Button variant="outline" className="flex-1">
                    Voltar
                  </Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button
                    onClick={handleConfirmOrder}
                    className="flex-1 bg-violet-600/90 hover:bg-violet-700/90 text-white font-semibold"
                  >
                    Confirmar pedido
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

      </div>
    </div>
  )
}

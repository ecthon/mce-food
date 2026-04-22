"use client"

import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import CardItem, { MenuItem } from '@/components/card-item'
import HeaderUser from '@/components/header-user'
import EventHeader from '@/components/event-header'
import OrderFooter from '@/components/order-footer'

const churrasquinho: { title: string; date: string; items: MenuItem[] } = {
  title: "Almoço de domingo - Churrasquinho",
  date: "20/10/2026",
  items: [
    { id: 1, name: "Frango combo", description: "Espetinho de frango, arroz, farofa e batatonese.", price: 20.00 },
    { id: 2, name: "Frango simples", description: "Espetinho de frango, arroz e farofa.", price: 15.00 },
    { id: 3, name: "Carne combo", description: "Espetinho de carne, arroz, farofa e batatonese. Suco e pudim inclusos", price: 30.00 },
    { id: 4, name: "Carne simples", description: "Espetinho de carne, arroz e farofa.", price: 20.00 },
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

  const handleConfirmOrder = () => {
    const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
    const totalPrice = churrasquinho.items.reduce(
      (sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0
    )
    const order = {
      event: churrasquinho.title,
      items: churrasquinho.items
        .filter((item) => (quantities[item.id] ?? 0) > 0)
        .map((item) => ({
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
    <div className="flex flex-col">
      <HeaderUser />
      <div className="flex flex-col gap-4 min-h-svh -mt-10 p-4 max-w-lg mx-auto pb-28">

        <EventHeader title={churrasquinho.title} date={churrasquinho.date} />

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

      </div>

      <OrderFooter
        items={churrasquinho.items}
        quantities={quantities}
        observations={observations}
        onConfirm={handleConfirmOrder}
      />
    </div>
  )
}

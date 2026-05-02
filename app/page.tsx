"use client"

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import CardItem, { MenuItem } from '@/components/card-item'
import HeaderUser from '@/components/header-user'
import EventHeader from '@/components/event-header'
import OrderFooter from '@/components/order-footer'

import { HugeiconsIcon } from '@hugeicons/react'
import { CheckmarkCircle03Icon } from '@hugeicons/core-free-icons'
import { api } from '@/lib/api'

interface EventData {
  id: string
  title: string
  date: string
  active: boolean
  items: MenuItem[]
}

export default function Page() {
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [observations, setObservations] = useState('')
  const [orderConfirmed, setOrderConfirmed] = useState(false)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true)
        const response = await api.get<{ event: EventData }>('/events/event-1')
        setEvent(response.data.event)
        setQuantities(
          Object.fromEntries(response.data.event.items.map((item) => [item.id, 0]))
        )
      } catch (err) {
        console.error('Failed to fetch event:', err)
        setError('Falha ao carregar o evento')
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [])

  const handleQuantityChange = (id: number, quantity: number) => {
    setQuantities((prev) => ({ ...prev, [id]: quantity }))
  }

  const handleConfirmOrder = () => {
    if (!event) return
    
    const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
    const totalPrice = event.items.reduce(
      (sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0
    )
    const order = {
      event: event.title,
      items: event.items
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
    setOrderConfirmed(true)
  }

  const handleEditOrder = () => {
    setOrderConfirmed(false)
  }

  if (loading) {
    return (
      <div className="flex flex-col">
        <HeaderUser />
        <div className="flex items-center justify-center min-h-svh">
          <p className="text-zinc-600">Carregando evento...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="flex flex-col">
        <HeaderUser />
        <div className="flex items-center justify-center min-h-svh">
          <p className="text-red-600">{error || 'Evento não encontrado'}</p>
        </div>
      </div>
    )
  }

  const selectedItems = event.items.filter((item) => (quantities[item.id] ?? 0) > 0)
  const totalItems = Object.values(quantities).reduce((sum, q) => sum + q, 0)
  const totalPrice = event.items.reduce((sum, item) => sum + item.price * (quantities[item.id] ?? 0), 0)

  return (
    <div className="flex flex-col">
      <HeaderUser />
      <div className={`flex flex-col gap-4 min-h-svh -mt-10 p-4 max-w-lg mx-auto w-full ${orderConfirmed ? 'pb-20' : 'pb-28'}`}>

        <EventHeader title={event.title} date={event.date} />

        {orderConfirmed ? (
          <div className="flex flex-col gap-3">
            {/* Banner de sucesso */}
            <div className="flex items-center gap-3 bg-emerald-100/70 rounded-xl px-4 py-3">
              <div className="w-7 h-7 rounded-full bg-emerald-200 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={CheckmarkCircle03Icon} size={20} strokeWidth={2} className="text-emerald-900 shrink-0" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-900 leading-tight">Pedido realizado com sucesso!</p>
              </div>
            </div>

            {/* Resumo dos itens */}
            <div className="flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden">
              {selectedItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between gap-3 px-4 py-3 ${index < selectedItems.length - 1 ? 'border-b border-zinc-100' : ''}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-semibold text-zinc-600 bg-zinc-200 rounded-md w-6 h-6 flex items-center justify-center shrink-0">
                      {quantities[item.id]}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-800 truncate">{item.name}</p>
                      <p className="text-xs text-zinc-400">R$ {item.price.toFixed(2).replace('.', ',')} / unid.</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-zinc-700 shrink-0">
                    R$ {(item.price * quantities[item.id]).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              ))}
              <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-200">
                <p className="text-sm font-semibold text-zinc-500">Total</p>
                <p className="text-base font-bold text-zinc-900">
                  R$ {totalPrice.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>

            {/* Observações */}
            {observations.trim() && (
              <div className="border border-zinc-200 rounded-xl px-4 py-3">
                <p className="text-xs font-semibold text-zinc-400 mb-1">Observações</p>
                <p className="text-sm text-zinc-700 leading-relaxed">{observations.trim()}</p>
              </div>
            )}
          </div>

        ) : (
          <>
            <div className="flex flex-col gap-3 w-full">
              {event.items.map((item) => (
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
          </>
        )}

      </div>

      <OrderFooter
        items={event.items}
        quantities={quantities}
        observations={observations}
        onConfirm={handleConfirmOrder}
        orderConfirmed={orderConfirmed}
        onEdit={handleEditOrder}
      />
    </div>
  )
}

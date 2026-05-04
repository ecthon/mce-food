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
import { useOrder } from '@/hooks/useOrder'
import { validateOrderData } from '@/lib/orders'
import { usePersistentCart } from '@/hooks/usePersistentCart'

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
  
  const { quantities, observations, updateQuantities, updateObservations, clearCart } = usePersistentCart()
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [isEditingExistingOrder, setIsEditingExistingOrder] = useState(false)

  const { createOrder, fetchOrder, updateOrder, cancelOrder, error: orderError, loading: orderLoading } = useOrder()

  useEffect(() => {
    const fetchEventAndOrder = async () => {
      try {
        setLoading(true)
        const eventId = 'event-1'
        
        // Carregar o evento
        const eventResponse = await api.get<{ event: EventData }>(`/events/${eventId}`)
        setEvent(eventResponse.data.event)
        
        // Tentar carregar o pedido existente do cliente
        try {
          const orderResponse = await fetchOrder(eventId)
          if (orderResponse && orderResponse.order) {
            const existingOrder = orderResponse.order
            setOrderId(existingOrder.id)
            
            // Pre-preencher as quantidades com base no pedido existente
            const newQuantities: Record<number, number> = {}
            eventResponse.data.event.items.forEach((item) => {
              newQuantities[item.id] = 0
            })
            
            // Adicionar as quantidades do pedido existente
            existingOrder.items.forEach((orderItem) => {
              newQuantities[orderItem.menuItemId] = orderItem.quantity
            })
            
            updateQuantities(newQuantities)
            updateObservations(existingOrder.observations || '')
          }
        } catch (orderErr) {
          // Pedido não existe ainda, começar com carrinho vazio
          const newQuantities: Record<number, number> = {}
          eventResponse.data.event.items.forEach((item) => {
            newQuantities[item.id] = 0
          })
          updateQuantities(newQuantities)
        }
      } catch (err) {
        console.error('Failed to fetch event:', err)
        setError('Falha ao carregar o evento')
      } finally {
        setLoading(false)
      }
    }

    fetchEventAndOrder()
  }, [])

  const handleQuantityChange = (id: number, quantity: number) => {
    updateQuantities({ ...quantities, [id]: quantity })
  }

  const handleConfirmOrder = async () => {
    if (!event) return

    const items = event.items
      .filter((item) => (quantities[item.id] ?? 0) > 0)
      .map((item) => ({
        menuItemId: item.id,
        quantity: quantities[item.id],
      }))

    const validation = validateOrderData(items)
    if (!validation.valid) {
      setError(validation.error || 'Erro ao validar pedido')
      return
    }

    try {
      if (orderId && isEditingExistingOrder) {
        // Atualizar pedido existente
        await updateOrder(orderId, items, observations.trim() || null)
      } else {
        // Criar novo pedido
        await createOrder(event.id, items, observations.trim() || null)
      }
      setOrderConfirmed(true)
      setIsEditingExistingOrder(false)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao processar pedido'
      setError(message)
      console.error('Erro ao processar pedido:', err)
    }
  }

  const handleEditOrder = () => {
    setOrderConfirmed(false)
    setIsEditingExistingOrder(true)
    setError(null)
  }

  const handleCancelEditMode = () => {
    setIsEditingExistingOrder(false)
    setOrderConfirmed(true)
    setError(null)
  }

  const handleCancelExistingOrder = async () => {
    if (!orderId || !window.confirm('Tem certeza que deseja cancelar este pedido? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await cancelOrder(orderId)
      setOrderId(null)
      setOrderConfirmed(false)
      setIsEditingExistingOrder(false)
      clearCart()
      setError(null)
      // Re-carregar a página para limpar tudo
      window.location.href = '/'
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao cancelar pedido'
      setError(message)
    }
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

        {/* Banner indicando que há um pedido existente carregado */}
        {orderId && !orderConfirmed && (
          <div className="flex items-center gap-3 bg-amber-100/70 rounded-xl px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
              ℹ️
            </div>
            <div>
              <p className="text-sm font-semibold text-amber-900 leading-tight">Você já possui um pedido para este evento. Edite os itens ou confirme.</p>
            </div>
          </div>
        )}

        {/* Exibir erro se houver */}
        {(orderError || error) && (
          <div className="flex items-center gap-3 bg-red-100/70 rounded-xl px-4 py-3">
            <div className="w-7 h-7 rounded-full bg-red-200 flex items-center justify-center shrink-0">
              ⚠️
            </div>
            <div>
              <p className="text-sm font-semibold text-red-900 leading-tight">{orderError || error}</p>
            </div>
          </div>
        )}

        {orderConfirmed ? (
          <div className="flex flex-col gap-3">
            {/* Banner indicando edição */}
            {isEditingExistingOrder && (
              <div className="flex items-center gap-3 bg-blue-100/70 rounded-xl px-4 py-3">
                <div className="w-7 h-7 rounded-full bg-blue-200 flex items-center justify-center shrink-0">
                  ✏️
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-900 leading-tight">Modo de edição: suas alterações serão atualizadas</p>
                </div>
              </div>
            )}

            {/* Banner de sucesso */}
            <div className="flex items-center gap-3 bg-emerald-100/70 rounded-xl px-4 py-3">
              <div className="w-7 h-7 rounded-full bg-emerald-200 flex items-center justify-center shrink-0">
                <HugeiconsIcon icon={CheckmarkCircle03Icon} size={20} strokeWidth={2} className="text-emerald-900 shrink-0" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-900 leading-tight">
                  {isEditingExistingOrder ? 'Pedido atualizado com sucesso!' : 'Pedido realizado com sucesso!'}
                </p>
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

            {/* Opção de cancelar pedido se houver pedido existente */}
            {orderId && (
              <div className="border border-red-200 rounded-xl px-4 py-3 bg-red-50">
                <p className="text-xs font-semibold text-red-600 mb-2">Zona de Perigo</p>
                <button
                  onClick={handleCancelExistingOrder}
                  disabled={orderLoading}
                  className="text-sm font-semibold text-red-600 hover:text-red-700 underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancelar este pedido
                </button>
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
                onChange={(e) => updateObservations(e.target.value)}
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
        isLoading={orderLoading}
      />
    </div>
  )
}

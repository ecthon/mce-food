'use client'

import { useState } from 'react'
import {
  createOrder,
  getOrderByEvent,
  updateOrder,
  cancelOrder,
  type OrderResponse,
  type GetOrderResponse,
} from '@/lib/orders'

interface UseOrderState {
  order: OrderResponse | null
  fullOrder: GetOrderResponse | null
  loading: boolean
  error: string | null
}

export function useOrder() {
  const [state, setState] = useState<UseOrderState>({
    order: null,
    fullOrder: null,
    loading: false,
    error: null,
  })

  // Criar pedido
  const handleCreateOrder = async (
    eventId: string,
    items: Array<{ menuItemId: number; quantity: number }>,
    observations?: string | null
  ) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const order = await createOrder(eventId, {
        items,
        observations,
      })
      setState((prev) => ({ ...prev, order, loading: false }))
      return order
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erro desconhecido'
      setState((prev) => ({ ...prev, loading: false, error }))
      throw err
    }
  }

  // Buscar pedido
  const handleFetchOrder = async (eventId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const fullOrder = await getOrderByEvent(eventId)
      setState((prev) => ({
        ...prev,
        order: fullOrder.order,
        fullOrder,
        loading: false,
      }))
      return fullOrder
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erro desconhecido'
      setState((prev) => ({ ...prev, loading: false, error }))
      // Não lançar erro - pode ser que não exista pedido ainda
      return null
    }
  }

  // Atualizar pedido
  const handleUpdateOrder = async (
    orderId: string,
    items: Array<{ menuItemId: number; quantity: number }>,
    observations?: string | null
  ) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const order = await updateOrder(orderId, {
        items,
        observations,
      })
      setState((prev) => ({ ...prev, order, loading: false }))
      return order
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erro desconhecido'
      setState((prev) => ({ ...prev, loading: false, error }))
      throw err
    }
  }

  // Cancelar pedido
  const handleCancelOrder = async (orderId: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    try {
      const order = await cancelOrder(orderId)
      setState((prev) => ({ ...prev, order, loading: false }))
      return order
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Erro desconhecido'
      setState((prev) => ({ ...prev, loading: false, error }))
      throw err
    }
  }

  // Limpar estado
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }))
  }

  const clearOrder = () => {
    setState((prev) => ({
      ...prev,
      order: null,
      fullOrder: null,
      error: null,
    }))
  }

  return {
    // Estado
    order: state.order,
    fullOrder: state.fullOrder,
    loading: state.loading,
    error: state.error,
    // Ações
    createOrder: handleCreateOrder,
    fetchOrder: handleFetchOrder,
    updateOrder: handleUpdateOrder,
    cancelOrder: handleCancelOrder,
    clearError,
    clearOrder,
  }
}

'use client'

import { useState, useEffect } from 'react'

interface CartState {
  quantities: Record<number, number>
  observations: string
}

const CART_STORAGE_KEY = 'mce-cart-state'

/**
 * Hook para persistir estado do carrinho em localStorage
 */
export function usePersistentCart() {
  const [isClient, setIsClient] = useState(false)
  const [quantities, setQuantities] = useState<Record<number, number>>({})
  const [observations, setObservations] = useState('')

  // Inicializar do localStorage
  useEffect(() => {
    setIsClient(true)
    
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const { quantities: savedQuantities, observations: savedObservations } = JSON.parse(
          saved
        ) as CartState
        setQuantities(savedQuantities)
        setObservations(savedObservations)
      }
    } catch (err) {
      console.error('Erro ao carregar carrinho do localStorage:', err)
    }
  }, [])

  // Persistir quando mudar
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return

    try {
      const cartState: CartState = { quantities, observations }
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState))
    } catch (err) {
      console.error('Erro ao salvar carrinho no localStorage:', err)
    }
  }, [quantities, observations, isClient])

  const updateQuantities = (newQuantities: Record<number, number>) => {
    setQuantities(newQuantities)
  }

  const updateObservations = (newObservations: string) => {
    setObservations(newObservations)
  }

  const clearCart = () => {
    setQuantities({})
    setObservations('')
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }

  return {
    quantities,
    observations,
    updateQuantities,
    updateObservations,
    clearCart,
  }
}

import { api } from '@/lib/api'

// ========================================
// TIPOS/INTERFACES
// ========================================

export interface OrderItem {
  menuItemId: number
  quantity: number
}

export interface CreateOrderPayload {
  items: OrderItem[]
  observations?: string | null
}

export interface OrderResponse {
  id: string
  userId: string
  eventId: string
  items: Array<{
    menuItemId: number
    name: string
    quantity: number
    priceAtOrder: number
  }>
  observations?: string | null
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED'
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export interface GetOrderResponse {
  order: OrderResponse
  user: {
    id: string
    firstName: string
    lastName: string
    cpf: string
    phone: string
    role: string
  }
  event: {
    id: string
    title: string
    date: string
    active: boolean
  }
}

// ========================================
// FUNÇÕES DA API
// ========================================

/**
 * Criar um novo pedido para um evento
 */
export async function createOrder(
  eventId: string,
  payload: CreateOrderPayload
): Promise<OrderResponse> {
  try {
    const response = await api.post<{ order: OrderResponse }>(
      `/orders/${eventId}`,
      payload
    )
    return response.data.order
  } catch (error) {
    throw handleOrderError(error)
  }
}

/**
 * Buscar o pedido do cliente logado para um evento específico
 */
export async function getOrderByEvent(
  eventId: string
): Promise<GetOrderResponse> {
  try {
    const response = await api.get<GetOrderResponse>(`/orders/${eventId}`)
    return response.data
  } catch (error) {
    throw handleOrderError(error)
  }
}

/**
 * Atualizar um pedido existente
 */
export async function updateOrder(
  orderId: string,
  payload: CreateOrderPayload
): Promise<OrderResponse> {
  try {
    const response = await api.put<{ order: OrderResponse }>(
      `/orders/${orderId}`,
      payload
    )
    return response.data.order
  } catch (error) {
    throw handleOrderError(error)
  }
}

/**
 * Cancelar um pedido
 */
export async function cancelOrder(
  orderId: string,
): Promise<OrderResponse> {
  try {
    const response = await api.delete<{ order: OrderResponse }>(
      `/orders/${orderId}`
    )
    return response.data.order
  } catch (error) {
    throw handleOrderError(error)
  }
}

// ========================================
// TRATAMENTO DE ERROS
// ========================================

interface ApiError {
  response?: {
    status: number
    data?: {
      error?: string
    }
  }
  message?: string
}

function handleOrderError(error: any): Error {
  const apiError = error as ApiError

  if (apiError.response) {
    const status = apiError.response.status
    const message = apiError.response.data?.error || 'Erro na requisição'

    switch (status) {
      case 400:
        return new Error(`Dados inválidos: ${message}`)
      case 401:
        return new Error('Sessão expirada. Faça login novamente.')
      case 403:
        return new Error('Você não tem permissão para esta ação.')
      case 404:
        return new Error('Pedido ou evento não encontrado.')
      case 409:
        return new Error('Conflito nos dados. Tente novamente.')
      case 500:
        return new Error('Erro no servidor. Tente mais tarde.')
      default:
        return new Error(message)
    }
  }

  return new Error('Erro ao conectar com o servidor.')
}

// ========================================
// FUNÇÃO AUXILIAR PARA VALIDAR PEDIDO
// ========================================

export function validateOrderData(
  items: Array<{ menuItemId: number; quantity: number }>
): { valid: boolean; error?: string } {
  if (items.length === 0) {
    return { valid: false, error: 'Adicione pelo menos um item ao pedido' }
  }

  for (const item of items) {
    if (item.quantity <= 0) {
      return {
        valid: false,
        error: `Quantidade deve ser maior que 0`,
      }
    }
  }

  return { valid: true }
}

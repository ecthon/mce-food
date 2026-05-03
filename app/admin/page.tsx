"use client"

import { useEffect, useState } from 'react'
import HeaderUser from '@/components/header-user'
import { getAdminOrders, AdminOrderResponse } from '@/lib/orders'

export default function AdminPage() {
  const [orders, setOrders] = useState<AdminOrderResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        setError(null)
        const adminOrders = await getAdminOrders()
        setOrders(adminOrders)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Falha ao carregar pedidos.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="flex flex-col">
      <HeaderUser />
      <div className="flex flex-col gap-4 min-h-svh -mt-10 p-4 max-w-5xl mx-auto w-full pb-10">
        <div className="flex flex-col gap-2">
          <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">Admin</p>
          <h1 className="text-3xl font-bold text-zinc-900">Pedidos dos clientes</h1>
          <p className="text-sm text-zinc-500 max-w-2xl">
            Aqui você pode visualizar todos os pedidos registrados no sistema.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center rounded-3xl border border-zinc-200 bg-white px-6 py-10 text-zinc-600">
            Carregando pedidos...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-8 text-red-700">
            {error}
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-zinc-200 bg-white px-6 py-10 text-zinc-600">
            Nenhum pedido encontrado.
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-zinc-500">Pedido</p>
                    <p className="font-semibold text-zinc-900">{order.id}</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3 sm:items-center">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Status</p>
                      <p className="font-semibold text-zinc-900">{order.status}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Total</p>
                      <p className="font-semibold text-zinc-900">R$ {order.totalPrice.toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Criado em</p>
                      <p className="font-semibold text-zinc-900">{new Date(order.createdAt).toLocaleString('pt-BR')}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Cliente</p>
                    <p className="font-semibold text-zinc-900">
                      {order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Usuário desconhecido'}
                    </p>
                    <p className="text-sm text-zinc-600">CPF: {order.user?.cpf ?? '-'}</p>
                    <p className="text-sm text-zinc-600">Telefone: {order.user?.phone ?? '-'}</p>
                  </div>
                  <div className="rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Evento</p>
                    <p className="font-semibold text-zinc-900">{order.event?.title ?? 'Evento desconhecido'}</p>
                    <p className="text-sm text-zinc-600">{order.event?.date ?? '-'}</p>
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-200">
                  <div className="grid gap-3 bg-zinc-100 px-4 py-3 text-xs uppercase tracking-[0.2em] text-zinc-500 sm:grid-cols-[1fr_1fr_1fr_1fr]">
                    <span>Item</span>
                    <span>Quantidade</span>
                    <span>Preço unit.</span>
                    <span>Subtotal</span>
                  </div>
                  <div className="divide-y divide-zinc-200 bg-white">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.menuItemId}`} className="grid gap-3 px-4 py-3 text-sm sm:grid-cols-[1fr_1fr_1fr_1fr]">
                        <span className="font-medium text-zinc-900">{item.name}</span>
                        <span className="text-zinc-600">{item.quantity}</span>
                        <span className="text-zinc-600">R$ {item.priceAtOrder.toFixed(2).replace('.', ',')}</span>
                        <span className="text-zinc-900">R$ {(item.priceAtOrder * item.quantity).toFixed(2).replace('.', ',')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {order.observations ? (
                  <div className="mt-5 rounded-2xl bg-zinc-50 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Observações</p>
                    <p className="mt-2 text-sm text-zinc-700">{order.observations}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

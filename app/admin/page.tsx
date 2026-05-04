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

  // Calcula totais de itens
  const itemTotals = orders.reduce(
    (acc, order) => {
      order.items.forEach((item) => {
        const existing = acc.find((i) => i.name === item.name)
        if (existing) {
          existing.quantity += item.quantity
        } else {
          acc.push({ name: item.name, quantity: item.quantity, menuItemId: item.menuItemId })
        }
      })
      return acc
    },
    [] as Array<{ name: string; quantity: number; menuItemId: number }>
  ).sort((a, b) => a.name.localeCompare(b.name))

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
          <div className="flex flex-col gap-6">
            {/* Lista de Pedidos Compacta */}
            <div className="grid gap-3">
              {orders.map((order) => {
                const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0)
                const userName = order.user
                  ? `${order.user.firstName} ${order.user.lastName}`
                  : 'Usuário desconhecido'

                return (
                  <div key={order.id} className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">Cliente</p>
                        <p className="font-semibold text-zinc-900">{userName}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {order.items.map((item) => (
                          <span
                            key={`${order.id}-${item.menuItemId}`}
                            className="inline-flex items-center gap-1 rounded-full bg-zinc-100 px-3 py-1 text-zinc-700"
                          >
                            <span>{item.name}</span>
                            <span className="font-semibold text-zinc-900">×{item.quantity}</span>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">Total itens</p>
                          <p className="font-semibold text-zinc-900">{totalItems}</p>
                        </div>
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-[0.2em]">Status</p>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-semibold uppercase tracking-[0.1em] ${
                              order.status === 'PENDING'
                                ? 'bg-yellow-100 text-yellow-800'
                                : order.status === 'CONFIRMED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Resumo Total de Itens */}
            <div className="mt-8 rounded-3xl border-2 border-zinc-300 bg-gradient-to-br from-zinc-50 to-white p-6">
              <p className="mb-4 text-lg font-bold text-zinc-900">📦 Resumo Total de Itens</p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {itemTotals.map((item) => (
                  <div key={item.menuItemId} className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
                    <span className="font-medium text-zinc-700">{item.name}</span>
                    <span className="inline-flex items-center justify-center rounded-full bg-blue-100 px-3 py-1 font-bold text-blue-900">
                      {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

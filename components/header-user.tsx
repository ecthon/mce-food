"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { Logout03Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("")
}

export default function HeaderUser() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  if (!user) return null

  return (
    <div className="flex bg-purple-100 w-full items-center">
      <div className="flex w-full max-w-lg mx-auto px-4 py-3 items-center gap-4">
        <div className="flex items-center justify-center bg-violet-200 rounded-full w-12 h-12 shrink-0 text-sm font-semibold text-violet-800">
          {getInitials(user.name)}
        </div>
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <p className="text-base font-semibold text-zinc-800 leading-tight truncate">
            Olá, {user.name.split(" ")[0]}!
          </p>
          <p className="text-xs text-zinc-500 font-medium">CPF: {user.cpf}</p>
        </div>
        <Button
          id="btn-logout"
          variant="ghost"
          size="icon"
          className="shrink-0 text-zinc-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
          title="Sair"
        >
          <HugeiconsIcon icon={Logout03Icon} size={20} strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}
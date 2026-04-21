"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserIcon, ArrowRight01Icon, ArrowLeft01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/lib/auth-context"
import {
  formatCpf,
  findUserByCpf,
  cpfExists,
  registerUser,
} from "@/lib/mock-users"

type Step = "cpf" | "not-found" | "register"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [step, setStep] = useState<Step>("cpf")
  const [cpf, setCpf] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCpf(e.target.value))
    setError("")
  }

  const handleCpfSubmit = () => {
    if (cpf.length < 14) {
      setError("Digite um CPF válido com 11 dígitos.")
      return
    }

    setLoading(true)
    // simula latência de rede
    setTimeout(() => {
      const user = findUserByCpf(cpf)
      if (user) {
        login(user)
        router.push("/")
      } else {
        setStep("not-found")
      }
      setLoading(false)
    }, 600)
  }

  const handleRegister = () => {
    if (!name.trim() || name.trim().length < 3) {
      setError("Digite seu nome completo.")
      return
    }
    if (cpfExists(cpf)) {
      setError("Este CPF já está cadastrado.")
      return
    }

    setLoading(true)
    setTimeout(() => {
      const newUser = registerUser(name.trim(), cpf)
      login(newUser)
      router.push("/")
      setLoading(false)
    }, 700)
  }

  const handleBack = () => {
    setStep("cpf")
    setName("")
    setError("")
  }

  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-background px-4">
      {/* Logo / Branding */}
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-100">
          <HugeiconsIcon
            icon={UserIcon}
            size={32}
            strokeWidth={1.5}
            className="text-violet-600"
          />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-900 leading-tight">
            MCE Orders
          </h1>
          <p className="text-sm text-zinc-500 mt-0.5">
            Sistema de pedidos de eventos
          </p>
        </div>
      </div>

      {/* Card principal */}
      <div className="w-full max-w-sm bg-card border rounded-2xl shadow-sm p-6 flex flex-col gap-5">

        {/* Etapa: digitar CPF */}
        {step === "cpf" && (
          <>
            <div>
              <h2 className="text-base font-semibold text-zinc-800">
                Identificação
              </h2>
              <p className="text-sm text-zinc-500 mt-0.5">
                Digite seu CPF para continuar
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="cpf-input" className="text-sm font-medium text-zinc-700">
                CPF
              </label>
              <Input
                id="cpf-input"
                inputMode="numeric"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCpfChange}
                maxLength={14}
                className="text-sm"
                onKeyDown={(e) => e.key === "Enter" && handleCpfSubmit()}
              />
              {error && (
                <p className="text-xs text-destructive font-medium">{error}</p>
              )}
            </div>

            <Button
              id="btn-continue"
              onClick={handleCpfSubmit}
              disabled={loading}
              className="w-full gap-2"
            >
              {loading ? "Verificando..." : "Continuar"}
              {!loading && (
                <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
              )}
            </Button>
          </>
        )}

        {/* Etapa: CPF não encontrado — opção de cadastro */}
        {step === "not-found" && (
          <>
            <div>
              <h2 className="text-base font-semibold text-zinc-800">
                CPF não encontrado
              </h2>
              <p className="text-sm text-zinc-500 mt-0.5">
                O CPF{" "}
                <span className="font-medium text-zinc-700">{cpf}</span> não
                está cadastrado. Deseja se cadastrar?
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Button
                id="btn-register"
                onClick={() => { setStep("register"); setError("") }}
                className="w-full"
              >
                Cadastrar agora
              </Button>
              <Button
                id="btn-back-cpf"
                variant="ghost"
                onClick={handleBack}
                className="w-full gap-1.5 text-zinc-500"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />
                Usar outro CPF
              </Button>
            </div>
          </>
        )}

        {/* Etapa: formulário de cadastro */}
        {step === "register" && (
          <>
            <div>
              <h2 className="text-base font-semibold text-zinc-800">
                Novo cadastro
              </h2>
              <p className="text-sm text-zinc-500 mt-0.5">
                Preencha seus dados para criar sua conta
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="name-input" className="text-sm font-medium text-zinc-700">
                  Nome completo
                </label>
                <Input
                  id="name-input"
                  placeholder="Ex: Maria Silva"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError("") }}
                  className="text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-zinc-700">CPF</label>
                <Input
                  value={cpf}
                  disabled
                  className="text-sm bg-muted text-muted-foreground"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive font-medium">{error}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Button
                id="btn-confirm-register"
                onClick={handleRegister}
                disabled={loading}
                className="w-full gap-2"
              >
                {loading ? "Cadastrando..." : "Confirmar cadastro"}
                {!loading && (
                  <HugeiconsIcon icon={ArrowRight01Icon} size={16} strokeWidth={2} />
                )}
              </Button>
              <Button
                id="btn-back-not-found"
                variant="ghost"
                onClick={handleBack}
                className="w-full gap-1.5 text-zinc-500"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={15} strokeWidth={2} />
                Voltar
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Rodapé informativo */}
      <p className="mt-6 text-xs text-zinc-400 text-center max-w-xs">
        Seu CPF é usado apenas para identificação nos pedidos. Nenhum dado é
        compartilhado externamente.
      </p>
    </div>
  )
}

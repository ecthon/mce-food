'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useState } from "react";

export default function AuthPage() {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const trimmedCpf = cpf.trim();

        if (!trimmedCpf) {
            setError("CPF é obrigatório.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await api.post("/auth/login", { cpf: trimmedCpf });
            const token = response.data?.token;

            if (!token) {
                throw new Error("Token não retornado pelo servidor.");
            }

            localStorage.setItem("token", token);
            window.location.href = "/";
        } catch (err) {
            console.error("Login failed:", err);
            setError("Falha ao fazer login. Verifique o CPF e tente novamente.");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="flex w-full h-screen items-center justify-center bg-indigo-50">
      <Card className="w-full md:w-[400px] p-4">
        <CardHeader>
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Informe seu CPF para fazer login.
            </p>
            <Input
              type="number"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              aria-invalid={!!error}
              aria-describedby="cpf-error"
            />
            {error ? (
              <p id="cpf-error" className="text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </CardContent>
          <CardFooter>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2 rounded-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
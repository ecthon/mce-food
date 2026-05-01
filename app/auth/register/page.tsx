'use client'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useState } from "react";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedCpf = cpf.trim();
    const trimmedPhone = phone.trim();

    if (!trimmedFirstName || !trimmedLastName || !trimmedCpf || !trimmedPhone) {
      setError("Todos os campos são obrigatórios.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/register", {
        firstName: trimmedFirstName,
        lastName: trimmedLastName,
        cpf: trimmedCpf,
        phone: trimmedPhone,
      });

      const token = response.data?.token;

      if (!token) {
        throw new Error("Token não retornado pelo servidor.");
      }

      localStorage.setItem("token", token);
      window.location.href = "/";
    } catch (err: any) {
      console.error("Registration failed:", err);
      if (err.response?.status === 409) {
        setError("CPF já cadastrado.");
      } else {
        setError("Falha ao registrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full h-screen items-center justify-center bg-indigo-50">
      <Card className="w-full md:w-[400px] p-4">
        <CardHeader>
          <h1 className="text-2xl font-bold">Registrar</h1>
        </CardHeader>

        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <Input
              type="text"
              placeholder="Nome"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              aria-invalid={!!error}
            />
            <Input
              type="text"
              placeholder="Sobrenome"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              aria-invalid={!!error}
            />
            <Input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              aria-invalid={!!error}
            />
            <Input
              type="text"
              placeholder="Telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={!!error}
            />

            {error ? (
              <p className="text-sm text-red-600">
                {error}
              </p>
            ) : null}
          </CardContent>

          <CardFooter>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

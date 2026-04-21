export type User = {
  id: number
  name: string
  cpf: string // formato: "000.000.000-00"
}

// CPFs no formato "000.000.000-00"
export const mockUsers: User[] = [
  { id: 1, name: "Ecthon Barros", cpf: "123.456.789-09" },
  { id: 2, name: "Maria Silva", cpf: "987.654.321-00" },
  { id: 3, name: "João Oliveira", cpf: "111.222.333-44" },
]

export function formatCpf(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11)
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
}

export function findUserByCpf(cpf: string): User | undefined {
  return mockUsers.find((u) => u.cpf === cpf)
}

export function cpfExists(cpf: string): boolean {
  return mockUsers.some((u) => u.cpf === cpf)
}

export function registerUser(name: string, cpf: string): User {
  const newUser: User = {
    id: mockUsers.length + 1,
    name,
    cpf,
  }
  mockUsers.push(newUser)
  return newUser
}

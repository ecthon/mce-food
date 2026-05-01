import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function AuthPage() {
  return (
    <div className="flex w-full h-screen items-center justify-center bg-indigo-50">
      <Card className="w-full md:w-[400px] p-4">
        <CardHeader>
          <h1 className="text-2xl font-bold">Login</h1>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Informe seu CPF para fazer login.
          </p>
          <Input type="text" placeholder="CPF" />
        </CardContent>
        <CardFooter>
              <button className="w-full bg-primary text-white py-2 rounded-md cursor-pointer">Entrar</button>
        </CardFooter>
      </Card>
    </div>
  );
}
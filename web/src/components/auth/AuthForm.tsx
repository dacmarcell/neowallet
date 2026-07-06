import { useState } from "react";
import { Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";

export function AuthForm() {
  const [tab, setTab] = useState<"signin" | "signup">("signin");

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow btn-glow">
          <Wallet className="h-6 w-6 text-primary-foreground" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">NeoWallet</h1>
        <p className="text-sm text-muted-foreground">
          Sua carteira digital segura
        </p>
      </div>

      <div className="card-elevated rounded-2xl p-6">
        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as "signin" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Entrar</TabsTrigger>
            <TabsTrigger value="signup">Cadastrar</TabsTrigger>
          </TabsList>
          <TabsContent value="signin" className="mt-6">
            <SignInForm />
          </TabsContent>
          <TabsContent value="signup" className="mt-6">
            <SignUpForm onSuccess={() => setTab("signin")} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

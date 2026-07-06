import { Wallet, Shield, RefreshCw, Send } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function Landing() {
  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-glow">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            NeoWallet
          </span>
        </div>
        <Link to="/auth">
          <Button>Entrar</Button>
        </Link>
      </header>

      <main className="mx-auto max-w-5xl px-6 pt-16 pb-24 md:pt-28">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Nova era da
            carteira digital
          </span>
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
            Dinheiro que se move na{" "}
            <span className="text-gradient">velocidade do @</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Envie, receba e deposite em segundos. Transferências por @username,
            reversão de qualquer operação e autenticação segura.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/auth">
              <Button className="btn-glow">Criar minha carteira</Button>
            </Link>
            <Link to="/auth">
              <Button>Já tenho conta</Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Send,
              title: "Transferência instantânea",
              desc: "Envie para qualquer @username sem taxa.",
            },
            {
              icon: RefreshCw,
              title: "Reverta quando precisar",
              desc: "Cancele qualquer depósito ou transferência.",
            },
            {
              icon: Shield,
              title: "Seguro por design",
              desc: "Operações atômicas com bloqueio de saldo no banco.",
            },
          ].map((f) => (
            <div key={f.title} className="card-elevated rounded-2xl p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

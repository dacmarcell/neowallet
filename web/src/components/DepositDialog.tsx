import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "./ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/Dialog";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";

const schema = z
  .number()
  .positive("Informe um valor maior que zero")
  .max(1_000_000, "Valor muito alto");

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (amount: number) => Promise<void>;
  pending: boolean;
}

export function DepositDialog({
  open,
  onOpenChange,
  onSubmit,
  pending,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [cents, setCents] = useState(0);

  const displayed = cents === 0 ? "" : formatBRL(cents);

  const handle = async () => {
    setError(null);

    const amount = cents / 100;
    const parsed = schema.safeParse(amount);

    if (!parsed.success) return setError(parsed.error.issues[0].message);
    try {
      await onSubmit(parsed.data);
      setCents(0);
      toast.success("Depósito realizado com sucesso");
    } catch (e) {
      toast.error("Erro ao realizar depósito");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits === "") return setCents(0);

    const next = parseInt(digits, 10);
    if (next > 1_000_000 * 100) return;

    setCents(next);
    setError(null);
  };

  function formatBRL(cents: number): string {
    return (cents / 100).toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Depositar</DialogTitle>
          <DialogDescription>
            Adicione saldo à sua carteira. Se seu saldo estiver negativo, o
            depósito será somado ao valor atual.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              inputMode="decimal"
              placeholder="0,00"
              value={displayed}
              onChange={handleChange}
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>
          <Button
            className="w-full btn-glow"
            onClick={handle}
            disabled={pending}
          >
            {pending ? "Processando..." : "Confirmar depósito"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

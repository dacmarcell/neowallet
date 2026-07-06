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
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handle = async () => {
    setError(null);
    const parsed = schema.safeParse(Number(value.replace(",", ".")));
    if (!parsed.success) return setError(parsed.error.issues[0].message);
    try {
      await onSubmit(parsed.data);
      setValue("");
      toast.success("Depósito realizado com sucesso");
    } catch (e) {
      toast.error("Erro ao realizar depósito");
    }
  };

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
              value={value}
              onChange={(e) => setValue(e.target.value)}
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

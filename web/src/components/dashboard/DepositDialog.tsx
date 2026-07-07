import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";
import { Label } from "../ui/Label";
import { Input } from "../ui/Input";
import { walletService, type Wallet } from "../../services/wallet.service";

const schema = z
  .number("Valor deve ser um número")
  .positive("Informe um valor maior que zero")
  .nonnegative("Valor não pode ser negativo")
  .max(1_000_000, "Valor muito alto");

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  fetchData: () => Promise<void>;
  wallet: Wallet;
}

export function DepositDialog({
  open,
  onOpenChange,
  fetchData,
  wallet,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [depositPending, setDepositPending] = useState(false);

  const onSubmit = async (amount: number) => {
    setDepositPending(true);
    try {
      await walletService.deposit(wallet.id, amount);
      await fetchData();
    } finally {
      setDepositPending(false);
    }
  };

  const handle = async () => {
    setError(null);

    const amount = parseFloat(value.replace(",", "."));
    const parsed = schema.safeParse(amount);

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
          <DialogDescription>Adicione saldo à sua carteira.</DialogDescription>
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
            disabled={depositPending}
          >
            {depositPending ? "Processando..." : "Confirmar depósito"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

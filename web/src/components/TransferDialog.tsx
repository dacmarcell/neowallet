import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { brl } from "../lib/format";
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

const accountIdSchema = z
  .string()
  .min(1, "ID da conta é obrigatório")
  .transform((val) => parseInt(val, 10))
  .refine((val) => !isNaN(val), "ID deve ser um número válido");
const amountSchema = z
  .number()
  .positive("Valor deve ser maior que zero")
  .max(1_000_000);

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  maxAmount: number;
  onSubmit: (input: {
    destinationAccountId: number;
    amount: number;
  }) => Promise<void>;
  pending: boolean;
}

export function TransferDialog({
  open,
  onOpenChange,
  maxAmount,
  onSubmit,
  pending,
}: Props) {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handle = async () => {
    setError(null);

    const accountId = accountIdSchema.safeParse(username);
    if (!accountId.success) {
      return setError(accountId.error.issues[0].message);
    }

    const a = amountSchema.safeParse(Number(amount.replace(",", ".")));
    if (!a.success) {
      return setError(a.error.issues[0].message);
    }
    if (a.data > maxAmount) {
      return setError(`Saldo insuficiente. Disponível: ${brl(maxAmount)}`);
    }

    try {
      await onSubmit({
        destinationAccountId: accountId.data,
        amount: a.data,
      });
      setUsername("");
      setAmount("");
      toast.success("Transferência realizada com sucesso");
    } catch (e) {
      toast.error("Erro ao realizar transferência");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir</DialogTitle>
          <DialogDescription>
            Envie dinheiro para outro @username. Saldo disponível:{" "}
            <strong>{brl(maxAmount)}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Destinatário</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">@</span>
              <Input
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button
            className="w-full btn-glow"
            onClick={handle}
            disabled={pending}
          >
            {pending ? "Enviando..." : "Confirmar transferência"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

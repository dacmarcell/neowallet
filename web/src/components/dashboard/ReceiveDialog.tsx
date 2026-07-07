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

const schema = z
  .number("Valor deve ser um número")
  .positive("Informe um valor maior que zero")
  .nonnegative("Valor não pode ser negativo")
  .max(1_000_000, "Valor muito alto");

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSubmit: (amount: number) => Promise<void>;
  pending: boolean;
}

export function ReceiveDialog({
  open,
  onOpenChange,
  onSubmit,
  pending,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState("");

  const handle = async () => {
    setError(null);

    const amount = parseFloat(value.replace(",", "."));
    const parsed = schema.safeParse(amount);

    if (!parsed.success) return setError(parsed.error.issues[0].message);
    try {
      await onSubmit(parsed.data);
      setValue("");
      toast.success("Solicitação de recebimento enviada com sucesso");
    } catch (e) {
      toast.error("Erro ao enviar solicitação de recebimento");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Receber</DialogTitle>
          <DialogDescription>
            Receba dinheiro de outro usuário.
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
            {pending
              ? "Processando..."
              : "Confirmar solicitação de recebimento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
    if (!accountId.success) return setError(accountId.error.issues[0].message);
    const a = amountSchema.safeParse(Number(amount.replace(",", ".")));
    if (!a.success) return setError(a.error.issues[0].message);
    if (a.data > maxAmount)
      return setError(`Saldo insuficiente. Disponível: ${brl(maxAmount)}`);
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

  if (!open) return null;

  return (
    // <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    //   <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
    //     <h2 className="text-xl font-bold mb-2">Transferir</h2>
    //     <p className="text-gray-600 text-sm mb-4">
    //       Envie dinheiro para outro usuário. Saldo disponível:{" "}
    //       <strong>{brl(maxAmount)}</strong>
    //     </p>
    //     <div className="space-y-4">
    //       <div className="space-y-2">
    //         <label htmlFor="to" className="text-sm font-medium">
    //           ID da conta de destino
    //         </label>
    //         <input
    //           id="to"
    //           type="text"
    //           placeholder="ID da conta"
    //           value={username}
    //           onChange={(e) => setUsername(e.target.value)}
    //           autoFocus
    //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
    //         />
    //       </div>
    //       <div className="space-y-2">
    //         <label htmlFor="amt" className="text-sm font-medium">
    //           Valor (R$)
    //         </label>
    //         <input
    //           id="amt"
    //           type="text"
    //           inputMode="decimal"
    //           placeholder="0,00"
    //           value={amount}
    //           onChange={(e) => setAmount(e.target.value)}
    //           className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
    //         />
    //       </div>
    //       {error && <p className="text-xs text-red-600">{error}</p>}
    //       <Button
    //         className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
    //         onClick={handle}
    //         disabled={pending}
    //       >
    //         {pending ? "Enviando..." : "Confirmar transferência"}
    //       </Button>
    //       <Button
    //         className="w-full text-gray-600 py-2 hover:text-gray-800 transition-colors"
    //         onClick={() => onOpenChange(false)}
    //       >
    //         Cancelar
    //       </Button>
    //     </div>
    //   </div>
    // </div>
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
            <Label htmlFor="to">Destinatário</Label>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">@</span>
              <Input
                id="to"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amt">Valor (R$)</Label>
            <Input
              id="amt"
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

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
import { Check, Copy } from "lucide-react";

const schema = z
  .number("Valor deve ser um número")
  .positive("Informe um valor maior que zero")
  .nonnegative("Valor não pode ser negativo")
  .max(1_000_000, "Valor muito alto");

interface Props {
  open: boolean;
  wallet: Wallet;
  onOpenChange: (v: boolean) => void;
  fetchData: (page?: number) => Promise<void>;
}

export function ReceiveDialog({
  open,
  wallet,
  fetchData,
  onOpenChange,
}: Props) {
  const [error, setError] = useState<string | null>(null);
  const [value, setValue] = useState("");
  const [receiveLink, setReceiveLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [receivePending, setReceivePending] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(receiveLink);
      setLinkCopied(true);
      toast.success("Link copiado!");
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  const handleReceive = async (amount: number) => {
    setReceivePending(true);
    try {
      const res = await walletService.generateReceiveLink(wallet.id, amount);
      setReceiveLink(res.data.link);

      await fetchData();
    } finally {
      setReceivePending(false);
    }
  };

  const handle = async () => {
    setError(null);

    const amount = parseFloat(value.replace(",", "."));
    const parsed = schema.safeParse(amount);

    if (!parsed.success) return setError(parsed.error.issues[0].message);
    try {
      await handleReceive(parsed.data);
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
          {receiveLink ? (
            <div className="space-y-2">
              <Label>Link de recebimento</Label>
              <div className="relative">
                <Input value={receiveLink} readOnly className="pr-10" />
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copiar link"
                >
                  {linkCopied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ) : null}
          <Button
            className="w-full btn-glow"
            onClick={handle}
            disabled={receivePending}
          >
            {receivePending
              ? "Processando..."
              : "Confirmar solicitação de recebimento"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

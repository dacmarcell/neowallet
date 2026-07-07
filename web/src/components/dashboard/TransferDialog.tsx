import { useState, useEffect, useCallback } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { brl } from "../../lib/format";
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
import { userService, type User } from "../../services/user.service";
import { walletService, type Wallet } from "../../services/wallet.service";

const usernameSchema = z
  .string()
  .min(3, "Username deve ter pelo menos 3 caracteres")
  .max(50);
const amountSchema = z
  .number()
  .positive("Valor deve ser maior que zero")
  .max(1_000_000);

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  maxAmount: number;
  presetUsername?: string;
  presetAmount?: number;
  fetchData: (page?: number) => void;
  wallet: Wallet;
}

export function TransferDialog({
  open,
  onOpenChange,
  maxAmount,
  presetUsername,
  presetAmount,
  fetchData,
  wallet,
}: Props) {
  const [username, setUsername] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [transferPending, setTransferPending] = useState(false);

  const isLocked = !!presetUsername;

  const searchUsers = useCallback(
    async (query: string) => {
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setSearchError("");
        const results = await userService.searchUsers(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (e) {
        setSearchError(e.message);
        setSuggestions([]);
      }
    },
    [isLocked],
  );

  useEffect(() => {
    if (open && presetUsername) {
      setUsername(presetUsername);
    }
    if (open && presetAmount) {
      setAmount(String(presetAmount).replace(".", ","));
    }
  }, [open, presetUsername, presetAmount]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username && !selectedUser) {
        searchUsers(username);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [username, selectedUser, searchUsers, isLocked]);

  const onSubmit = async (input: {
    destinationAccountUsername: string;
    amount: number;
  }) => {
    setTransferPending(true);
    try {
      await walletService.transfer(
        wallet.id,
        input.destinationAccountUsername,
        input.amount,
      );
      await fetchData();
    } finally {
      setTransferPending(false);
    }
  };

  const handle = async () => {
    setError(null);

    const usernameResult = usernameSchema.safeParse(username);
    if (!usernameResult.success) {
      return setError(usernameResult.error.issues[0].message);
    }
    if (!selectedUser) {
      return setError("Selecione um destinatário válido");
    }

    const destinationAccountUsername = isLocked
      ? presetUsername
      : selectedUser?.username;

    if (!destinationAccountUsername) {
      return setError("Selecione um destinatário válido");
    }

    const amountResult = amountSchema.safeParse(
      Number(amount.replace(",", ".")),
    );
    if (!amountResult.success) {
      return setError(amountResult.error.issues[0].message);
    }
    if (amountResult.data > maxAmount) {
      return setError(`Saldo insuficiente. Disponível: ${brl(maxAmount)}`);
    }

    try {
      await onSubmit({
        destinationAccountUsername,
        amount: amountResult.data,
      });
      setUsername("");
      setAmount("");
      setSelectedUser(null);
      setSuggestions([]);
      toast.success("Transferência realizada com sucesso");
    } catch {
      toast.error("Erro ao realizar transferência");
    }
  };

  const handleSelectUser = (user: User) => {
    setUsername(user.username);
    setSelectedUser(user);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir</DialogTitle>
          <DialogDescription>
            {isLocked
              ? "Confirme o pagamento solicitado."
              : "Envie dinheiro para outro @username."}{" "}
            Saldo disponível: <strong>{brl(maxAmount)}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Destinatário</Label>
            <div className="relative">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">@</span>
                <Input
                  placeholder="username"
                  value={username}
                  disabled={isLocked}
                  onChange={(e) => {
                    if (isLocked) return;
                    setUsername(e.target.value);
                    setSelectedUser(null);
                  }}
                  onFocus={() => {
                    if (!isLocked && suggestions.length > 0) {
                      setShowSuggestions(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowSuggestions(false), 200);
                  }}
                  autoFocus={!isLocked}
                />
              </div>
              {searchError ? (
                <p className="text-xs text-destructive mt-1">{searchError}</p>
              ) : null}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  data-state={showSuggestions ? "open" : "closed"}
                  className="absolute z-10 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto origin-top data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:pointer-events-none duration-200"
                >
                  {suggestions.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectUser(user)}
                      className="w-full px-4 py-2 text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">@{user.username}</span>
                        <span className="text-muted-foreground text-sm">
                          ({user.name})
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Valor (R$)</Label>
            <Input
              inputMode="decimal"
              placeholder="0,00"
              value={amount}
              disabled={isLocked}
              onChange={(e) => {
                if (isLocked) return;
                const value = e.target.value;
                if (!/^\d*[.,]?\d*$/.test(value)) return;
                setAmount(value);
              }}
            />
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
          <Button
            className="w-full btn-glow"
            onClick={handle}
            disabled={transferPending}
          >
            {transferPending ? "Enviando..." : "Confirmar transferência"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

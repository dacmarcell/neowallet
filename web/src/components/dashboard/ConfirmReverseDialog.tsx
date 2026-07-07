import { brl, dateTime } from "../../lib/format";
import type { Transaction } from "../../services/wallet.service";
import { Button } from "../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/Dialog";

interface Props {
  reversingId: number | null;
  handleConfirmReversal: () => void;
  pendingReversal: Transaction | null;
  setPendingReversal: (value: Transaction | null) => void;
}

export default function ConfirmReverseDialog({
  reversingId,
  pendingReversal,
  setPendingReversal,
  handleConfirmReversal,
}: Props) {
  return (
    <Dialog
      open={!!pendingReversal}
      onOpenChange={(v) => !v && setPendingReversal(null)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reverter transação</DialogTitle>
          <DialogDescription>
            Você tem certeza que quer reverter essa operação?
            <br />
            <strong className="text-destructive">
              Essa ação é irreversível!
            </strong>
          </DialogDescription>
        </DialogHeader>

        {pendingReversal && (
          <div className="rounded-lg bg-muted p-3 text-sm">
            <p className="font-medium">{brl(pendingReversal.amount)}</p>
            {pendingReversal.origin_account?.username && (
              <p className="text-xs text-gray-600">
                @{pendingReversal.origin_account.username}
              </p>
            )}
            <p className="text-xs text-gray-500">
              {dateTime(pendingReversal.created_at)}
            </p>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => setPendingReversal(null)}>
            Cancelar
          </Button>
          <Button
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            onClick={handleConfirmReversal}
            disabled={reversingId === pendingReversal?.id}
          >
            {reversingId === pendingReversal?.id
              ? "Revertendo..."
              : "Sim, reverter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

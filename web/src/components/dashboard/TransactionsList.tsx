import { ArrowDownLeft, ArrowUpRight, RefreshCw, Undo2 } from "lucide-react";
import type { Transaction } from "../../services/wallet.service";
import { brl, dateTime } from "../../lib/format";
import { Button } from "../ui/Button";
import ConfirmReverseDialog from "./ConfirmReverseDialog";
import { useState } from "react";

interface Props {
  transactions: Transaction[];
  currentAccountId: number;
  onReverse: (id: number) => void;
  reversingId: number | null;
  loading: boolean;
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function TransactionsList({
  transactions,
  currentAccountId,
  onReverse,
  reversingId,
  loading,
  currentPage,
  lastPage,
  onPageChange,
}: Props) {
  const [pendingReversal, setPendingReversal] = useState<Transaction | null>(
    null,
  );

  const handleConfirmReversal = () => {
    if (!pendingReversal) return;
    onReverse(pendingReversal.id);
    setPendingReversal(null);
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-200" />
        ))}
      </div>
    );
  }
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl p-12 text-center shadow">
        <p className="text-sm text-gray-500">
          Nenhuma transação ainda. Faça seu primeiro depósito.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            currentAccountId={currentAccountId}
            onRequestReverse={setPendingReversal}
            reversing={reversingId === transaction.id}
          />
        ))}
      </ul>

      {lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Anterior
          </Button>
          <span className="text-xs text-gray-500">
            {currentPage} de {lastPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === lastPage}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Próxima
          </Button>
        </div>
      )}

      <ConfirmReverseDialog
        reversingId={reversingId}
        pendingReversal={pendingReversal}
        setPendingReversal={setPendingReversal}
        handleConfirmReversal={handleConfirmReversal}
      />
    </div>
  );
}

function TransactionRow({
  transaction,
  reversing,
  currentAccountId,
  onRequestReverse,
}: {
  transaction: Transaction;
  reversing: boolean;
  currentAccountId: number;
  onRequestReverse: (transaction: Transaction) => void;
}) {
  const isIncoming = transaction.destination_account_id === currentAccountId;
  const meta = describe(transaction, isIncoming);
  const canReverse = !transaction.reversed && transaction.type !== "reversal";

  return (
    <li className="card-elevated flex items-center justify-between rounded-xl p-4">
      <div className="flex items-center gap-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.iconBg}`}
        >
          <meta.Icon className={`h-5 w-5 ${meta.iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium">{meta.title}</p>
          {transaction.origin_account?.username && (
            <p className="text-xs text-gray-600">
              @{transaction.origin_account.username}
            </p>
          )}
          <p className="text-xs text-gray-500">
            {dateTime(transaction.created_at)}
            {transaction.reversed ? " · revertida" : ""}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span
          className={`font-semibold tabular-nums ${meta.amountColor} ${transaction.reversed ? "line-through opacity-60" : ""}`}
        >
          {meta.sign}
          {brl(transaction.amount)}
        </span>
        {canReverse && (
          <Button
            onClick={() => onRequestReverse(transaction)}
            disabled={reversing}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Reverter"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </li>
  );
}

function describe(tx: Transaction, isIncoming: boolean) {
  if (tx.type === "deposit") {
    return {
      Icon: ArrowDownLeft,
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      title: "Depósito",
      sign: "+",
      amountColor: "text-indigo-600",
    };
  }
  if (tx.type === "reversal") {
    return {
      Icon: RefreshCw,
      iconBg: "bg-gray-100",
      iconColor: "text-gray-500",
      title: `Reversão ${isIncoming ? "recebida" : "aplicada"}`,
      sign: isIncoming ? "+" : "−",
      amountColor: "text-gray-500",
    };
  }
  // transfer
  return {
    Icon: isIncoming ? ArrowDownLeft : ArrowUpRight,
    iconBg: isIncoming ? "bg-indigo-100" : "bg-red-100",
    iconColor: isIncoming ? "text-indigo-600" : "text-red-600",
    title: isIncoming ? "Recebido" : "Enviado",
    sign: isIncoming ? "+" : "−",
    amountColor: isIncoming ? "text-green-600" : "text-red-600",
  };
}

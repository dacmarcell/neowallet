import { useState, useEffect } from "react";
import {
  LogOut,
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
} from "lucide-react";
import { useAuthSession } from "../hooks/useAuthSession";
import {
  walletService,
  type Wallet,
  type Transaction,
} from "../services/wallet.service";
import { brl } from "../lib/format";
import { DepositDialog } from "../components/dashboard/DepositDialog";
import { TransferDialog } from "../components/dashboard/TransferDialog";
import { TransactionsList } from "../components/dashboard/TransactionsList";
import { Button } from "../components/ui/Button";
import { ReceiveDialog } from "../components/dashboard/ReceiveDialog";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositOpen, setDepositOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [reversingId, setReversingId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [receiveContext, setReceiveContext] = useState<{
    username: string;
    amount: number;
  } | null>(null);

  const { logout } = useAuthSession();

  const fetchData = async (page = 1) => {
    try {
      const [walletData, transactionsData] = await Promise.all([
        walletService.getMyWallet(),
        walletService.listTransactions(page),
      ]);

      setWallet(walletData);
      setTransactions(transactionsData.data);
      setCurrentPage(transactionsData.current_page);
      setLastPage(transactionsData.last_page);
      setTotalTransactions(transactionsData.total);
    } catch (err) {
      console.error("Erro ao carregar dados", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setLoading(true);
    fetchData(page);
  };

  const handleReverse = async (txId: number) => {
    setReversingId(txId);
    try {
      await walletService.reverse(txId);
      await fetchData();
    } finally {
      setReversingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  const manageReceiveToken = async () => {
    try {
      const response = await walletService.decryptReceiveLink(token);
      if (!response.data.is_link_valid) {
        toast.error("Link expirado");
        return;
      }

      setReceiveContext({
        username: response.data.destination_account_username,
        amount: response.data.amount,
      });
      setTransferOpen(true);
    } catch (e) {
      toast.error("Link inválido");
    } finally {
      setSearchParams({});
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (token) {
      manageReceiveToken();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Erro ao carregar carteira
        </div>
      </div>
    );
  }

  const balance = parseFloat(wallet.balance);
  const isNegative = balance < 0;

  return (
    <div className="min-h-screen">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-400">
            <WalletIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">NeoWallet</p>
            <p className="text-xs text-gray-500">{wallet?.user?.name}</p>
          </div>
        </div>
        <Button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" /> Sair
        </Button>
      </header>

      <main className="mx-auto max-w-5xl px-6 pb-16">
        <section className="card-elevated relative overflow-hidden rounded-3xl p-8">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="relative">
            <p className="text-sm text-muted-foreground">Saldo disponível</p>
            <div className="mt-2 flex items-baseline gap-3">
              <h2
                className={`text-5xl font-bold tracking-tight ${isNegative ? "text-destructive" : "text-gradient"}`}
              >
                {brl(balance)}
              </h2>
            </div>
            {isNegative && (
              <p className="mt-2 flex items-center gap-2 text-xs text-red-600">
                <RefreshCw className="h-3 w-3" />
                Saldo negativo — o próximo depósito será somado a este valor.
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                onClick={() => setDepositOpen(true)}
                size="lg"
                className="btn-glow"
              >
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Depositar
              </Button>
              <Button
                onClick={() => setTransferOpen(true)}
                size="lg"
                variant="outline"
              >
                <ArrowUpRight className="mr-2 h-4 w-4" /> Transferir
              </Button>
              <Button
                onClick={() => setReceiveOpen(true)}
                size="lg"
                variant="outline"
              >
                <ArrowDownLeft className="mr-2 h-4 w-4" /> Receber
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold">Extrato</h3>
            <p className="text-xs text-gray-500">
              {totalTransactions} transações
            </p>
          </div>
          <TransactionsList
            transactions={transactions}
            currentAccountId={wallet.id}
            onReverse={handleReverse}
            reversingId={reversingId}
            loading={loading}
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        </section>
      </main>

      <DepositDialog
        open={depositOpen}
        onOpenChange={setDepositOpen}
        wallet={wallet}
        fetchData={fetchData}
      />
      <TransferDialog
        open={transferOpen}
        onOpenChange={(val) => {
          setTransferOpen(val);
          if (!val) setReceiveContext(null);
        }}
        presetUsername={receiveContext?.username}
        presetAmount={receiveContext?.amount}
        maxAmount={balance}
        fetchData={fetchData}
        wallet={wallet}
      />
      <ReceiveDialog
        wallet={wallet}
        open={receiveOpen}
        fetchData={fetchData}
        onOpenChange={setReceiveOpen}
      />
    </div>
  );
}

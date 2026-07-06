import { api } from "../lib/api";

export interface Wallet {
  id: number;
  user_id: number;
  balance: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Transaction {
  id: number;
  type: string;
  amount: string;
  origin_account_id: number | null;
  destination_account_id: number | null;
  reversed: boolean;
  created_at: string;
}

export class WalletServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WalletServiceError";
  }
}

export const walletService = {
  async getMyWallet(): Promise<Wallet> {
    const response = await api.get(`/v1/accounts`);
    const data = await response.json();
    return data.data[0];
  },

  async listTransactions(): Promise<Transaction[]> {
    const response = await api.get(`/v1/transactions`);
    const data = await response.json();
    return data.data || [];
  },

  async deposit(accountId: number, amount: number): Promise<Transaction> {
    const response = await api.post(`/v1/accounts/deposit`, {
      account_id: accountId,
      amount,
    });
    const data = await response.json();
    return data;
  },

  async transfer(
    originAccountId: number,
    destinationAccountId: number,
    amount: number,
  ): Promise<Transaction> {
    const response = await api.post(`/v1/accounts/transfer`, {
      origin_account_id: originAccountId,
      destination_account_id: destinationAccountId,
      amount,
    });
    const data = await response.json();
    return data;
  },

  async reverse(txId: number): Promise<Transaction> {
    const response = await api.post(`/v1/transactions/${txId}/reverse`);
    const data = await response.json();
    return data;
  },
};

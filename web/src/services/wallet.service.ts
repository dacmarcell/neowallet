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
    const response = await api.get(`/v1/accounts/me`);
    const data = await response.json();
    return data.data;
  },

  async listTransactions(page = 1): Promise<{
    data: Transaction[];
    current_page: number;
    last_page: number;
    total: number;
  }> {
    const response = await api.get(`/v1/transactions?page=${page}`);
    const data = await response.json();
    return data;
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
    destinationUsername: string,
    amount: number,
  ): Promise<Transaction> {
    const response = await api.post(`/v1/accounts/transfer`, {
      origin_account_id: originAccountId,
      destination_username: destinationUsername,
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

  async generateReceiveLink(
    destinationAccountId: number,
    amount: number,
  ): Promise<{ link: string }> {
    const response = await api.post("/v1/transactions/receive-link", {
      destination_account_id: destinationAccountId,
      amount,
    });
    const data = await response.json();
    return data;
  },

  async decryptReceiveLink(token: string): Promise<{
    data: {
      destination_account_username: string;
      amount: number;
      is_link_valid: boolean;
    };
  }> {
    const response = await api.post("/v1/transactions/decrypt-link", {
      token,
    });
    const data = await response.json();
    return data;
  },
};

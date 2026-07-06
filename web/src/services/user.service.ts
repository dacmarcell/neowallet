import { api } from "../lib/api";

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export class UserServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UserServiceError";
  }
}

export const userService = {
  async searchUsers(query: string): Promise<User[]> {
    if (!query || query.length < 2) {
      return [];
    }

    const response = await api.get(
      `/v1/users/transfer-search?q=${encodeURIComponent(query)}`,
    );
    const data = await response.json();
    return data.data || [];
  },
};

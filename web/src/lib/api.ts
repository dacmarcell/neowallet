async function fetcher(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  return await fetch(`http://localhost:8000/api${endpoint}`, {
    ...options,
    credentials: "include",
  });
}

export const api = {
  get: (endpoint: string) =>
    fetcher(endpoint, { headers: { Accept: "application/json" } }),
  post: (endpoint: string, body?: unknown) =>
    fetcher(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }),
  put: (endpoint: string, body: unknown) =>
    fetcher(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }),
  patch: (endpoint: string, body: unknown) =>
    fetcher(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    }),
  delete: (endpoint: string) => fetcher(endpoint, { method: "DELETE" }),
};

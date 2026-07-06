async function fetcher(
  endpoint: string,
  options?: RequestInit,
): Promise<Response> {
  const response = await fetch(`http://localhost:8000/api${endpoint}`, {
    ...options,
    credentials: "include",
  });

  if (response.status === 401) {
    const shouldRedirect =
      window.location.pathname !== "/" && window.location.pathname !== "/auth";

    if (shouldRedirect) {
      window.location.href = "/";
    }

    return response;
  }

  return response;
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

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
  const config = init || {};
  const headers = new Headers(config.headers);
  if (token) {
    headers.set("admin_token", token);
  }
  config.headers = headers;
  return fetch(input, config);
}

export async function apiFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem("admin_token");
  const config = init || {};
  const headers = new Headers(config.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("authorization", token);
  }
  config.headers = headers;
  return fetch(input, config);
}

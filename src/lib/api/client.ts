import { CONFIG } from "@/lib/config";
import { getAccessToken } from "@/lib/auth";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type RequestOptions = {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  // When sending non-JSON, pass body and set headers accordingly
  body?: any;
};

function withQuery(url: string, params?: Record<string, any>) {
  if (!params || Object.keys(params).length === 0) return url;
  const usp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) v.forEach((vv) => usp.append(k, String(vv)));
    else usp.append(k, String(v));
  });
  const qs = usp.toString();
  return qs ? `${url}?${qs}` : url;
}

async function request<T>(method: HttpMethod, path: string, options: RequestOptions = {}): Promise<T> {
  const base = CONFIG.API_BASE_URL || "";
  const url = withQuery(`${base}${path}`, options.params);

  const token = getAccessToken();
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.body !== undefined && typeof options.body !== "string"
      ? { "Content-Type": "application/json" }
      : {}),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const resp = await fetch(url, {
    method,
    headers,
    body:
      options.body === undefined
        ? undefined
        : typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body),
    // Only include browser credentials (cookies) when we actually have a token.
    // This avoids backends that attempt to validate empty/invalid cookies from failing guest flows.
    credentials: token ? "include" : "omit",
  });

  const contentType = resp.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await resp.json().catch(() => null) : await resp.text();

  if (!resp.ok) {
    const err = {
      status: resp.status,
      message: (isJson && data && (data.message || data.detail)) || resp.statusText,
      details: isJson ? data : undefined,
    } as { status: number; message: string; details?: any };
    throw err;
  }

  return data as T;
}

export const client = {
  get: <T>(path: string, opts?: RequestOptions) => request<T>("GET", path, opts),
  post: <T>(path: string, body?: any, opts?: Omit<RequestOptions, "body"> & { body?: any }) =>
    request<T>("POST", path, { ...(opts || {}), body }),
  put: <T>(path: string, body?: any, opts?: Omit<RequestOptions, "body"> & { body?: any }) =>
    request<T>("PUT", path, { ...(opts || {}), body }),
  del: <T>(path: string, opts?: RequestOptions) => request<T>("DELETE", path, opts),
};

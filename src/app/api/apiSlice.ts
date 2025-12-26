import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut, setCredentials } from "../../feature/authentication/authSlice";
import { Mutex } from "async-mutex";
import { VITE_CHEETAH_BASE_URL } from "../../lib/config";

const baseUrl = VITE_CHEETAH_BASE_URL();

const mutex = new Mutex();

// Custom fetch function that handles both JSON and text responses
const customFetch = async (url: string, options: RequestInit = {}) => {
  console.log("Making request to:", url, "with options:", { method: options.method, headers: options.headers, hasBody: !!options.body });
  const response = await fetch(url, options);
  console.log("Response status:", response.status, "Content-Type:", response.headers.get("content-type"));
  
  // Get content type
  const contentType = response.headers.get("content-type") || "";
  
  let data: any;
  let isTextResponse = false;
  
  // Check if it's JSON or text
  if (contentType.includes("application/json")) {
    try {
      const text = await response.text();
      // Try to parse as JSON
      try {
        data = JSON.parse(text);
      } catch {
        // If JSON parsing fails, it's actually text
        data = text;
        isTextResponse = true;
      }
    } catch {
      // Fallback to text
      data = await response.text();
      isTextResponse = true;
    }
  } else {
    // For text responses
    data = await response.text();
    isTextResponse = true;
  }
  
  // Return in RTK Query format
  // For text responses with 200 status, return as data (not error)
  if (!response.ok) {
    return {
      error: {
        status: response.status,
        data: data,
      },
    };
  }
  
  // Return data - RTK Query won't try to parse it again if it's already a string
  return {
    data: data,
    meta: {
      response: {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      },
    },
  };
};

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const state = api.getState();
  // Get access token - check localStorage first (most reliable), then Redux state
  // This ensures we have the token even if Redux hasn't synced yet
  let accessToken: string | null = null;
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('accessToken');
    console.log("baseQueryWithAuth - localStorage token:", accessToken ? `Found (length: ${accessToken.length})` : "Not found");
  }
  // Fallback to Redux if localStorage doesn't have it
  if (!accessToken) {
    accessToken = state.auth?.accessToken || null;
    console.log("baseQueryWithAuth - Redux token:", accessToken ? `Found (length: ${accessToken.length})` : "Not found");
  }
  
  // Trim whitespace and ensure token is valid
  if (accessToken) {
    const originalLength = accessToken.length;
    accessToken = accessToken.trim();
    if (accessToken === '') {
      console.warn("baseQueryWithAuth - Token was empty after trimming");
      accessToken = null;
    } else if (originalLength !== accessToken.length) {
      console.warn("baseQueryWithAuth - Token had whitespace, trimmed");
    }
  } else {
    console.warn("baseQueryWithAuth - No access token found in localStorage or Redux");
  }
  
  // Construct the full URL
  const urlPath = typeof args === 'string' ? args : args.url;
  const url = urlPath.startsWith('http') ? urlPath : `${baseUrl}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
  
  // Get custom headers if provided (for login, etc.)
  const customHeaders = typeof args !== 'string' && args.headers ? args.headers : {};
  const contentType = customHeaders['Content-Type'] || customHeaders['content-type'] || 'application/json';
  
  // Don't send Authorization header for login endpoint (we're authenticating)
  // Check if this is a login request - only exclude /auth/login, not /auth (which is GET profile)
  const isLoginRequest = urlPath === '/auth/login' || urlPath.includes('/auth/login');
  
  // Build headers object
  const headers: Record<string, string> = {
    'Content-Type': contentType,
    ...customHeaders,
  };
  
  // Add Authorization header if we have a token and it's not a login request
  // Double-check token availability right before adding header
  const finalToken = accessToken && accessToken.trim() !== '' ? accessToken.trim() : null;
  if (finalToken && !isLoginRequest) {
    headers['Authorization'] = `Bearer ${finalToken}`;
    console.log("baseQueryWithAuth - ✓ Adding Authorization header for:", urlPath, "Token length:", finalToken.length);
  } else {
    // Try one more time to get token from localStorage if we still don't have it
    if (!finalToken && typeof window !== 'undefined' && !isLoginRequest) {
      const lastChanceToken = localStorage.getItem('accessToken');
      if (lastChanceToken && lastChanceToken.trim() !== '') {
        headers['Authorization'] = `Bearer ${lastChanceToken.trim()}`;
        console.log("baseQueryWithAuth - ✓ Adding Authorization header (last chance) for:", urlPath, "Token length:", lastChanceToken.trim().length);
      } else {
        console.error("baseQueryWithAuth - ✗ No Authorization header. Token:", !!finalToken, "Last chance token:", !!lastChanceToken, "isLoginRequest:", isLoginRequest, "urlPath:", urlPath);
      }
    } else {
      console.log("baseQueryWithAuth - No Authorization header. Token:", !!finalToken, "isLoginRequest:", isLoginRequest, "urlPath:", urlPath);
    }
  }
  
  const options: RequestInit = {
    method: typeof args === 'string' ? 'GET' : (args.method || 'GET'),
    headers,
    credentials: 'include',
    ...(typeof args !== 'string' && args.body && { 
      body: typeof args.body === 'string' ? args.body : (contentType === 'application/x-www-form-urlencoded' ? args.body : JSON.stringify(args.body))
    }),
  };
  
  console.log("baseQueryWithAuth - Making request to:", url);
  console.log("baseQueryWithAuth - Headers:", JSON.stringify(Object.keys(headers)));
  console.log("baseQueryWithAuth - Has Authorization header:", !!headers['Authorization']);
  if (headers['Authorization']) {
    console.log("baseQueryWithAuth - Authorization header value:", headers['Authorization'].substring(0, 30) + "...");
  }
  
  return customFetch(url, options);
};

const baseQuery = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);

  // Handle 401 responses - token refresh
  if (result?.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const state = api.getState();
        // Get refresh token from Redux state first, then fallback to localStorage
        let refreshToken = state.auth?.refreshToken;
        if (!refreshToken && typeof window !== 'undefined') {
          refreshToken = localStorage.getItem('refreshToken');
        }
        
        if (!refreshToken) {
          api.dispatch(logOut());
          return result;
        }

        const refreshResult = await baseQueryWithAuth(
          {
            url: "/auth/refresh-token",
            method: "POST",
            body: { refreshToken },
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          const data = refreshResult.data as any;
          api.dispatch(setCredentials({
            accessToken: data.accessToken || data.access_token,
            refreshToken: data.refreshToken || data.refresh_token,
            user: data.user,
          }));
          // Retry the original request
          result = await baseQueryWithAuth(args, api, extraOptions);
        } else {
          api.dispatch(logOut());
        }
      } finally {
        release();
      }
    }
  }

  return result;
};

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['Trip', 'Schedule', 'Vehicle', 'Booking', 'Payment', 'Ticket', 'Receipt', 'Wallet'],
  endpoints: (builder) => ({}),
});


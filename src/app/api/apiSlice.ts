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
  const accessToken = state.auth?.accessToken;
  
  // Construct the full URL
  const urlPath = typeof args === 'string' ? args : args.url;
  const url = urlPath.startsWith('http') ? urlPath : `${baseUrl}${urlPath.startsWith('/') ? '' : '/'}${urlPath}`;
  console.log("baseQueryWithAuth - urlPath:", urlPath, "baseUrl:", baseUrl, "final url:", url);
  
  // Get custom headers if provided (for login, etc.)
  const customHeaders = typeof args !== 'string' && args.headers ? args.headers : {};
  const contentType = customHeaders['Content-Type'] || customHeaders['content-type'] || 'application/json';
  
  // Don't send Authorization header for login endpoint (we're authenticating)
  const isLoginRequest = urlPath === '/login' || urlPath.includes('/login');
  
  const options: RequestInit = {
    method: typeof args === 'string' ? 'GET' : (args.method || 'GET'),
    headers: {
      'Content-Type': contentType,
      ...(accessToken && !isLoginRequest && { Authorization: `Bearer ${accessToken}` }),
      ...customHeaders,
    },
    credentials: 'include',
    ...(typeof args !== 'string' && args.body && { 
      body: typeof args.body === 'string' ? args.body : (contentType === 'application/x-www-form-urlencoded' ? args.body : JSON.stringify(args.body))
    }),
  };
  
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
        const refreshToken = state.auth?.refreshToken;
        
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


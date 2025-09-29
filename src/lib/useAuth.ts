"use client";

import { useEffect, useState } from "react";
import { authApi } from "@/lib/api/endpoints/auth";
import { clearAccessToken, getAccessToken } from "@/lib/auth";
import type { UserResponseT } from "@/lib/api/schemas/auth";

export function useAuth() {
  const [user, setUser] = useState<UserResponseT | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const token = getAccessToken();
        if (!token) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        const me = await authApi.me();
        if (mounted) setUser(me);
      } catch (e: any) {
        if (mounted) {
          setUser(null);
          setError(e?.message || "Not authenticated");
        }
        // clear token on 401-like cases to avoid loops
        clearAccessToken();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  return { user, loading, error, signOut };
}

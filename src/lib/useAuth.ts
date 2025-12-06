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
        // Bypass backend - use localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          if (mounted) {
            setUser(null);
            setLoading(false);
          }
          return;
        }
        const parsedUser = JSON.parse(userData);
        // Create a mock user object with expected structure
        const mockUser = {
          user_id: 1,
          email: parsedUser.email,
          first_name: parsedUser.fullName?.split(' ')[0] || 'User',
          last_name: parsedUser.fullName?.split(' ').slice(1).join(' ') || '',
          phone: parsedUser.phone || null,
          is_verified: true,
          created_at: new Date().toISOString(),
        };
        if (mounted) setUser(mockUser as any);
      } catch (e: any) {
        if (mounted) {
          setUser(null);
          setError(e?.message || "Not authenticated");
        }
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
      // Bypass backend - clear localStorage
      localStorage.removeItem('user');
    } catch {
      // ignore
    } finally {
      clearAccessToken();
      setUser(null);
    }
  };

  return { user, loading, error, signOut };
}

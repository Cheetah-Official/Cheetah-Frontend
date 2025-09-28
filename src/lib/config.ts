import { z } from "zod";

const EnvSchema = z.object({
  NEXT_PUBLIC_API_BASE_URL: z.string().url(),
  NEXT_PUBLIC_APP_NAME: z.string().min(1),
});

const parsed = EnvSchema.safeParse({
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "Cheetah",
});

if (!parsed.success) {
  if (process.env.NODE_ENV !== "production") {
    // In dev, throw to help setup
    throw new Error(
      `Invalid environment variables: ${JSON.stringify(parsed.error.flatten(), null, 2)}`
    );
  }
}

export const CONFIG = {
  API_BASE_URL: parsed.success
    ? parsed.data.NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, "")
    : (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, ""),
  APP_NAME: parsed.success ? parsed.data.NEXT_PUBLIC_APP_NAME : process.env.NEXT_PUBLIC_APP_NAME || "Cheetah",
};

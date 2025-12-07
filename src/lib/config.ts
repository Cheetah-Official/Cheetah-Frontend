// Access runtime configuration from environment variables
export const getConfig = () => {
  return {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://official-backend-cheetah-production-0cb4.up.railway.app/cheetah",
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Cheetah",
  };
};

// Export individual config values for convenience
export const VITE_CHEETAH_BASE_URL = () => getConfig().NEXT_PUBLIC_API_BASE_URL;
export const VITE_APP_NAME = () => getConfig().NEXT_PUBLIC_APP_NAME;

export const CONFIG = {
  API_BASE_URL: getConfig().NEXT_PUBLIC_API_BASE_URL.replace(/\/$/, ""),
  APP_NAME: getConfig().NEXT_PUBLIC_APP_NAME,
};

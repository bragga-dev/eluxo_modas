import { QueryClient } from "@tanstack/react-query";
import { ApiError } from "@/types/api";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
          return false; // erro do cliente não se resolve tentando de novo
        }
        return failureCount < 2;
      },
    },
    mutations: {
      retry: false,
    },
  },
});

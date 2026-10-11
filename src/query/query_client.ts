import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => console.error(error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => console.error(error),
  }),
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,  // After 5 minutes React Query may refetch on the next trigger
      gcTime: 1000 * 60 * 15,   // 15 min if the data is not used, the cache will be garbage collected
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },
  },
});
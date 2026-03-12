"use client"; // Providers should be on the client, because the Provider works like a temporary storage on the client to cache data.
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

// Because react-query uses Reacts context, we follow the same structure by creating a wrapper containing the cached data.
export default function Providers({ children }: { children: React.ReactNode }) {
  // Create queryClient once, and as long as the browser-tab is open. Avoids losing the cached data on each re-render.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: { queries: { staleTime: 60 * 1000 } }, // 1 minute cache
      }),
  );
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

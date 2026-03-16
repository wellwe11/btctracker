import {
  QueryClient,
  defaultShouldDehydrateQuery,
} from "@tanstack/react-query";

// A function that works like an independent query-key.
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          // If data is on client, we can dehydrate it
          defaultShouldDehydrateQuery(query) ||
          // If data is not completed, we send it to the client
          query.state.status === "pending",
      },
    },
  });
}

// Checks if there already is a QueryClient active. If not, creates a new one.
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  // For initial server-side render. Creates a temporary client.
  if (typeof window === "undefined") {
    return makeQueryClient();
  } else {
    // Checks if there already is a unique QueryClient tied to this browser. If there is not, it creates one to cache data to. Else, uses Client that has cached data.
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

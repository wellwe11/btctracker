import { getBtcPrice } from "@/lib/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ChartSection from "./ChartSection";
import { getQueryClient } from "@/lib/query-client";

export default async function Home() {
  // Create a fresh, temporary client for each server-request.
  const queryClient = getQueryClient();

  // If no cached key, we wait for data to load, dehydrate it with HTML markup, and send it to client.
  await queryClient.prefetchQuery({
    queryKey: ["btc-price"],
    queryFn: getBtcPrice,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/** We dehydrate the data sent with the unique queryClient */}

      <ChartSection />
    </HydrationBoundary>
  );
}

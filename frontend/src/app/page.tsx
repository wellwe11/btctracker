import { getBtcPrice } from "@/lib/api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import ChartSection from "./ChartSection";
import { getQueryClient } from "@/lib/query-client";
import { useAtom, useAtomValue, useSetAtom } from "jotai";

/**
 * Lets say that I have 20 charts, all displaying their own set of data.
 * Using Jotai, create a automFamily. Instead of manutally writing 20 atoms, use atomFamily.
 * This way, you can generate atoms on the fly based on a key (like graph-1, graph-2).
 * Now you have an atom for each graph-component. The atom that needs update will only update
 * if its data changes, excluding any other atom from updating, and causing only its related
 * component to re-render after the data has finished updating in the atom.
 *
 * Scenario: User changes the date on a dashboard.
 * For this, you use a single dataRangeAtom.
 * You create an atom that does not hold data, but holds logic.
 * When this atom is written to, it looks at the new date and decides what to do next.
 *
 * FOR CODE EXAMPLE, CHECK FILE 'example/atomfamily.tsx'
 * The pattern in the atomfamily is exactly what I need in order to set up logic OUTSIDE of the charts
 * I then handle it there, and render each component based on it's update.
 */

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

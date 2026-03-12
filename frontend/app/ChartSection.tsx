"use client";
import { useQuery } from "@tanstack/react-query";
import { getBtcPrice } from "@/frontend/lib/api";

const ChartSection = () => {
  const { data } = useQuery({
    queryKey: ["btc-price"],
    queryFn: getBtcPrice,
    refetchInterval: 5000,
  });

  console.log(data);

  return (
    <div>
      <h1>hello</h1>
    </div>
  );
};

export default ChartSection;

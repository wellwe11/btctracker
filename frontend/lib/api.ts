import { BtcPrice } from "@/frontend/types/crypto";

export const getBtcPrice = async (): Promise<BtcPrice> => {
  const res = await fetch(
    "https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT",
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch BTC price");
  }

  return res.json();
};

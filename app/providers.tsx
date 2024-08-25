'use client'

import { ThirdwebProvider } from "@thirdweb-dev/react";
import { Rupaya, Binance } from "@thirdweb-dev/chains";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThirdwebProvider
      activeChain={Rupaya}
      clientId={process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID}
      supportedChains={[Rupaya, Binance]}
    >
      {children}
    </ThirdwebProvider>
  )
}
import { Chain } from '@thirdweb-dev/chains';

export const Rupaya: Chain = {
  chainId: 799, // Replace with the actual chain ID
  rpc: ['https://rpc.testnet.rupaya.io'], // Replace with the actual RPC URL
  nativeCurrency: {
    decimals: 18,
    name: 'Rupaya',
    symbol: 'RUPX',
  },
  shortName: 'rupx',
  slug: 'rupaya',
  testnet: false,
  chain: 'Rupaya',
  name: 'Rupaya Network',
};
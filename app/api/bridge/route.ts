import { NextResponse } from 'next/server';
import { ethers } from 'ethers';

export async function POST(req: Request) {
  const { direction, amount, userAddress } = await req.json();

  const rupayaProvider = new ethers.providers.JsonRpcProvider(process.env.RUPAYA_RPC_URL);
  const binanceProvider = new ethers.providers.JsonRpcProvider(process.env.BINANCE_RPC_URL);

  const rupayaBridgeContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_RUPAYA_BRIDGE_CONTRACT!,
    ['function withdraw(address payable to, uint256 amount)'],
    new ethers.Wallet(process.env.PRIVATE_KEY!, rupayaProvider)
  );

  const binanceBridgeContract = new ethers.Contract(
    process.env.NEXT_PUBLIC_BINANCE_BRIDGE_CONTRACT!,
    ['function mint(address to, uint256 amount)'],
    new ethers.Wallet(process.env.PRIVATE_KEY!, binanceProvider)
  );

  try {
    if (direction === 'rupayaToBinance') {
      // Mint tokens on Binance chain
      const tx = await binanceBridgeContract.mint(userAddress, amount);
      await tx.wait();
    } else {
      // Withdraw tokens on Rupaya chain
      const tx = await rupayaBridgeContract.withdraw(userAddress, amount);
      await tx.wait();
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bridge operation failed:', error);
    return NextResponse.json({ success: false, error: 'Bridge operation failed' }, { status: 500 });
  }
}
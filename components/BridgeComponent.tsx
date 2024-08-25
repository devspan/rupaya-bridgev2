'use client'

import { useState, useEffect, useCallback } from "react";
import { useAddress, useContract, useContractWrite, useContractRead, useBalance, useNetwork, useNetworkMismatch } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { ArrowRightLeft, Wallet, Clock, AlertTriangle } from "lucide-react";
import { TransactionHistory } from "./TransactionHistory";

const RUPAYA_CHAIN_ID = process.env.NEXT_PUBLIC_RUPAYA_CHAIN_ID || "0";

const SUPPORTED_CHAINS = [
  { id: RUPAYA_CHAIN_ID, name: "Rupaya", symbol: "RUPX" },
  { id: "56", name: "Binance", symbol: "BRUPX" },
  { id: "1", name: "Ethereum", symbol: "ERUPX" },
  { id: "59144", name: "Linea", symbol: "LRUPX" },
  { id: "42161", name: "Arbitrum", symbol: "ARUPX" },
  { id: "42220", name: "Celo", symbol: "CRUPX" },
];

export default function BridgeComponent() {
  const address = useAddress();
  const [, switchNetwork] = useNetwork();
  const isMismatched = useNetworkMismatch();

  const [amount, setAmount] = useState("");
  const [selectedChain, setSelectedChain] = useState(SUPPORTED_CHAINS[1]);
  const [isToRupaya, setIsToRupaya] = useState(false);

  const { contract: bridgeContract } = useContract(process.env.NEXT_PUBLIC_BRIDGE_CONTRACT);

  const { mutateAsync: bridgeTokens, isLoading: isBridgeLoading } = useContractWrite(bridgeContract, "bridgeTokens");

  const { data: rupayaBalance, refetch: refetchRupayaBalance } = useBalance();
  const { data: selectedChainBalance, refetch: refetchSelectedChainBalance } = useBalance(selectedChain.id);

  const { data: maxTransferAmount } = useContractRead(bridgeContract, "maxTransferAmount");
  const { data: transferCooldown } = useContractRead(bridgeContract, "transferCooldown");
  const { data: lastTransferTimestamp } = useContractRead(bridgeContract, "lastTransferTimestamp", [address]);

  const [timeUntilNextTransfer, setTimeUntilNextTransfer] = useState<number | null>(null);

  useEffect(() => {
    const updateCooldown = () => {
      if (lastTransferTimestamp && transferCooldown) {
        const lastTransfer = lastTransferTimestamp.toNumber();
        const cooldown = transferCooldown.toNumber();
        const now = Math.floor(Date.now() / 1000);
        const timeLeft = Math.max(0, lastTransfer + cooldown - now);
        setTimeUntilNextTransfer(timeLeft);
      }
    };

    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [lastTransferTimestamp, transferCooldown]);

  const handleBridge = useCallback(async () => {
    if (!address) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to continue.",
        variant: "destructive",
      });
      return;
    }

    if (isMismatched) {
      try {
        await switchNetwork?.(parseInt(isToRupaya ? selectedChain.id : RUPAYA_CHAIN_ID));
      } catch (error) {
        console.error("Failed to switch network:", error);
        toast({
          title: "Network switch failed",
          description: "Please switch to the correct network manually.",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      const amountInWei = ethers.utils.parseEther(amount);
      if (amountInWei.gt(maxTransferAmount)) {
        throw new Error("Amount exceeds maximum transfer limit");
      }
      if (timeUntilNextTransfer && timeUntilNextTransfer > 0) {
        throw new Error("Transfer cooldown not met");
      }

      await bridgeTokens({ args: [isToRupaya ? RUPAYA_CHAIN_ID : selectedChain.id, amountInWei] });
      
      toast({
        title: "Bridge transaction successful",
        description: `Successfully bridged ${amount} ${isToRupaya ? selectedChain.symbol : "RUPX"} to ${isToRupaya ? "Rupaya" : selectedChain.name}.`,
      });
      refetchRupayaBalance();
      refetchSelectedChainBalance();
    } catch (error) {
      console.error("Bridge transaction failed:", error);
      toast({
        title: "Bridge transaction failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  }, [address, amount, selectedChain, isToRupaya, isMismatched, switchNetwork, bridgeTokens, refetchRupayaBalance, refetchSelectedChainBalance, maxTransferAmount, timeUntilNextTransfer]);

  return (
    <div className="space-y-8">
      <div className="w-full max-w-md mx-auto">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-center">Bridge Tokens</h2>
            <p className="text-center text-muted-foreground">Transfer RUPX tokens across chains</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Direction</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsToRupaya(false)}
                  variant={!isToRupaya ? "default" : "outline"}
                  className="flex-1"
                >
                  Rupaya to {selectedChain.name}
                </Button>
                <Button
                  onClick={() => setIsToRupaya(true)}
                  variant={isToRupaya ? "default" : "outline"}
                  className="flex-1"
                >
                  {selectedChain.name} to Rupaya
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Chain</label>
              <div className="flex flex-wrap gap-2">
                {SUPPORTED_CHAINS.slice(1).map((chain) => (
                  <Button
                    key={chain.id}
                    onClick={() => setSelectedChain(chain)}
                    variant={selectedChain.id === chain.id ? "default" : "outline"}
                    className="flex-1"
                  >
                    {chain.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="0"
                step="0.000000000000000001"
              />
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span className="text-muted-foreground">Rupaya Balance:</span>
                <span className="font-medium">{rupayaBalance?.displayValue} RUPX</span>
              </div>
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4" />
                <span className="text-muted-foreground">{selectedChain.name} Balance:</span>
                <span className="font-medium">{selectedChainBalance?.displayValue} {selectedChain.symbol}</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowRightLeft className="w-4 h-4" />
                <span className="text-muted-foreground">Max Transfer Amount:</span>
                <span className="font-medium">{maxTransferAmount ? ethers.utils.formatEther(maxTransferAmount) : "Loading..."} {isToRupaya ? selectedChain.symbol : "RUPX"}</span>
              </div>
              {timeUntilNextTransfer !== null && timeUntilNextTransfer > 0 && (
                <div className="flex items-center space-x-2 text-yellow-600">
                  <Clock className="w-4 h-4" />
                  <span>Time until next transfer: {Math.floor(timeUntilNextTransfer / 60)}m {timeUntilNextTransfer % 60}s</span>
                </div>
              )}
            </div>
          </div>
          <Button 
            onClick={handleBridge} 
            className="w-full"
            disabled={isBridgeLoading || !address || (timeUntilNextTransfer !== null && timeUntilNextTransfer > 0)}
          >
            {isBridgeLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <ArrowRightLeft className="mr-2 h-4 w-4" /> Bridge {isToRupaya ? selectedChain.symbol : "RUPX"}
              </>
            )}
          </Button>
          {(timeUntilNextTransfer !== null && timeUntilNextTransfer > 0) && (
            <div className="mt-4">
              <p className="text-yellow-600 text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Transfer cooldown active. Please wait before making another transfer.
              </p>
            </div>
          )}
        </div>
      </div>

      <TransactionHistory />
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import { useAddress, useContract, useContractEvents } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Filter, ExternalLink } from "lucide-react";

interface Transaction {
  from: string;
  to: string;
  amount: string;
  timestamp: Date;
  eventName: string;
  transactionHash: string;
}

const EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL || "https://scan.rupaya.io/tx/";

export function TransactionHistory() {
  const address = useAddress();
  const { contract } = useContract(process.env.NEXT_PUBLIC_BRIDGE_CONTRACT);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const { data: depositEvents } = useContractEvents(contract, "Deposit");
  const { data: withdrawEvents } = useContractEvents(contract, "Withdraw");

  useEffect(() => {
    if (depositEvents && withdrawEvents && address) {
      const allEvents = [...depositEvents, ...withdrawEvents]
        .filter(event => event.data.from === address || event.data.to === address)
        .map(event => ({
          from: event.data.from,
          to: event.data.to || address,
          amount: ethers.utils.formatEther(event.data.amount),
          timestamp: new Date(event.data.timestamp.toNumber() * 1000),
          eventName: event.eventName,
          transactionHash: event.transaction.transactionHash
        }))
        .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setTransactions(allEvents);
      setFilteredTransactions(allEvents);
    }
  }, [depositEvents, withdrawEvents, address]);

  useEffect(() => {
    const filtered = transactions.filter(tx => {
      const matchesType = filterType === "all" || tx.eventName.toLowerCase() === filterType;
      const matchesSearch = tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.to.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            tx.amount.includes(searchTerm) ||
                            tx.transactionHash.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    });
    setFilteredTransactions(filtered);
  }, [filterType, searchTerm, transactions]);

  const handleDownload = () => {
    const dataStr = JSON.stringify(filteredTransactions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'transactions.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Recent bridge transactions for your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Select onValueChange={setFilterType} defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="deposit">Deposit</SelectItem>
                <SelectItem value="withdraw">Withdraw</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Search transactions"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          <Button onClick={handleDownload} className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" /> Download JSON
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>From/To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Tx Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell>{tx.eventName}</TableCell>
                  <TableCell>{tx.amount} RUPX</TableCell>
                  <TableCell>{tx.eventName === 'Deposit' ? tx.from : tx.to}</TableCell>
                  <TableCell>{tx.timestamp.toLocaleString()}</TableCell>
                  <TableCell>
                    <a
                      href={`${EXPLORER_URL}${tx.transactionHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center hover:text-primary"
                    >
                      {tx.transactionHash.slice(0, 6)}...{tx.transactionHash.slice(-4)}
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
'use client'

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Zap, Shield, RefreshCw, Globe, Coins, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAddress } from "@thirdweb-dev/react";
import BridgeComponent from './BridgeComponent';

const LandingPage: React.FC = () => {
  const address = useAddress();

  const features = [
    {
      icon: <Zap size={32} />,
      title: "Lightning Fast",
      description: "Experience rapid token transfers across multiple blockchain networks"
    },
    {
      icon: <Shield size={32} />,
      title: "Secure Bridging",
      description: "Your assets are protected with state-of-the-art security measures"
    },
    {
      icon: <RefreshCw size={32} />,
      title: "Seamless Experience",
      description: "User-friendly interface for effortless cross-chain transactions"
    },
    {
      icon: <Globe size={32} />,
      title: "Multi-Chain Support",
      description: "Bridge Rupaya tokens to various popular blockchain networks"
    }
  ];

  const supportedChains = [
    "Ethereum", "Binance Smart Chain", "Polygon", "Avalanche", "Arbitrum", "Optimism"
  ];

  if (address) {
    return <BridgeComponent />;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center relative"
      >
        <div className="relative w-full h-[400px] mb-8">
          <Image
            src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1600&q=80"
            alt="RupayaBridge Hero"
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-blue-400/80 rounded-lg flex flex-col justify-center items-center">
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              RupayaBridge
            </p>
            <p className="text-lg md:text-xl mb-8 text-white max-w-2xl mx-auto">
              Seamlessly transfer Rupaya tokens to multiple blockchain networks with ease and security
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">How It Works</h2>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-6">
          <div className="flex flex-col items-center">
            <Coins size={48} className="text-blue-500 mb-2" />
            <p className="font-semibold">1. Connect Wallet</p>
            <p className="text-sm text-muted-foreground">Use the top button to connect your wallet</p>
          </div>
          <ChevronDown size={24} className="hidden md:block transform rotate-90 md:rotate-0 text-blue-500" />
          <div className="flex flex-col items-center">
            <Globe size={48} className="text-blue-500 mb-2" />
            <p className="font-semibold">2. Choose Network</p>
            <p className="text-sm text-muted-foreground">Select the destination network</p>
          </div>
          <ChevronDown size={24} className="hidden md:block transform rotate-90 md:rotate-0 text-blue-500" />
          <div className="flex flex-col items-center">
            <Zap size={48} className="text-blue-500 mb-2" />
            <p className="font-semibold">3. Bridge Tokens</p>
            <p className="text-sm text-muted-foreground">Confirm and complete the bridging process</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Supported Networks</h2>
        <div className="flex flex-wrap justify-center gap-4">
          {supportedChains.map((chain, index) => (
            <span key={index} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm">
              {chain}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
          Experience the future of cross-chain token transfers with RupayaBridge. Connect your wallet using the button at the top of the page to start bridging your tokens and unlock the full potential of blockchain interoperability.
        </p>
      </motion.div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <span className="text-blue-500 mr-3">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-muted-foreground">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default LandingPage;
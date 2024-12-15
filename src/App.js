import React, { useState } from 'react';
import styled from 'styled-components';
import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import SwapInterface from './components/SwapInterface';
import WalletConnect from './components/WalletConnect';

// Token data with only Sepolia tokens
export const tokens = [
  { 
    symbol: 'ETH', 
    name: 'Sepolia ETH',
    network: 'sepolia',
    chainId: '0xaa36a7',
    bridgeAddress: process.env.REACT_APP_SEPOLIA_BRIDGE_ADDRESS
  },
  { 
    symbol: 'BASE', 
    name: 'Base Sepolia ETH',
    network: 'base-sepolia',
    chainId: '0x14a34',
    bridgeAddress: process.env.REACT_APP_BASE_SEPOLIA_BRIDGE_ADDRESS
  },
  { 
    symbol: 'GAS',
    name: 'NeoX Mainnet',
    network: 'neox-mainnet',
    chainId: '0xba93',
    bridgeAddress: process.env.REACT_APP_NEOX_MAINNET_BRIDGE_ADDRESS
  }
];

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

function App() {
  const [selectedTokens, setSelectedTokens] = useState({
    from: 'ETH',
    to: 'BASE'
  });

  const handleTokenSelect = (type, token) => {
    setSelectedTokens(prev => ({
      ...prev,
      [type]: token
    }));
  };

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <AppContainer>
        <WalletConnect />
        <SwapInterface
          availableTokens={tokens}
          selectedTokens={selectedTokens}
          onTokenSelect={handleTokenSelect}
          setSelectedTokens={setSelectedTokens}
          style={{ alignSelf: 'flex-start' }}
        />
      </AppContainer>
    </Web3ReactProvider>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #13141b;
  padding: 20px;
  position: relative;
`;

export default App; 
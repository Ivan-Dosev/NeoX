import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import styled from 'styled-components';

const injected = new InjectedConnector({
  supportedChainIds: [11155111, 84532] // Sepolia and Base Sepolia chain IDs
});

const WalletConnect = () => {
  const { active, account, activate, deactivate } = useWeb3React();

  const connect = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  const disconnect = () => {
    try {
      deactivate();
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  return (
    <ConnectButton onClick={active ? disconnect : connect}>
      {active ? `Connected: ${account.substring(0, 6)}...${account.substring(38)}` : 'Connect Wallet'}
    </ConnectButton>
  );
};

const ConnectButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: linear-gradient(135deg, #00f2fe 0%, #4facfe 100%);
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3);
  }

  &:active {
    transform: translateY(0);
  }
`;

export default WalletConnect; 
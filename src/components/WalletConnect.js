import React, { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import styled from 'styled-components';

const injected = new InjectedConnector({
  supportedChainIds: [11155111, 84532, 47763] // Include NeoX chain ID
});

const WalletConnect = () => {
  const { active, account, activate, deactivate } = useWeb3React();
  const [accountState, setAccountState] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Get accounts using eth_accounts
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccountState(accounts[0]); // Set the first account
        activate(injected); // Activate the injected connector
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccountState(accounts[0]);
          activate(injected); // Activate if already connected
        }
      }
    };
    checkConnection();
  }, [activate]);

  return (
    <ConnectButton 
      onClick={active ? deactivate : connectWallet}
      data-wallet-connect
    >
      {active ? `Connected: ${accountState.substring(0, 6)}...${accountState.substring(accountState.length - 4)}` : 'Connect Wallet'}
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
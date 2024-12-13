import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';
import { useState, useEffect } from 'react';

export const injected = new InjectedConnector({
  supportedChainIds: [1, 137, 80001] // Mainnet, Polygon, Mumbai
});

export function useWallet() {
  const { active, account, library, connector, activate, deactivate } = useWeb3React();
  const [error, setError] = useState(null);

  async function connect() {
    try {
      await activate(injected);
      setError(null);
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError('Failed to connect wallet. Please make sure MetaMask is installed and try again.');
    }
  }

  async function disconnect() {
    try {
      deactivate();
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
    }
  }

  // Handle connection on page load
  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        activate(injected);
      }
    });
  }, [activate]);

  return { active, account, library, connector, connect, disconnect, error };
} 
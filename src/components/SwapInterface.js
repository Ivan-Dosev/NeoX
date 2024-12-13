import React, { useState } from 'react';
import styled from 'styled-components';
import TokenInput from './TokenInput';
import { useWallet } from '../hooks/useWallet';
import { useSwap } from '../hooks/useSwap';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { generateZKProof } from '../utils/zkp';
import bridgeABIJson from '../abis/BridgeWithZKP.json';

const SwapContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 20px;
  max-width: 400px;
  margin: 0;
  backdrop-filter: blur(12px);
  box-shadow: 
    0 4px 24px -1px rgba(0, 0, 0, 0.2),
    0 0 1px 0 rgba(255, 255, 255, 0.1),
    0 0 40px -10px rgba(33, 114, 229, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 
      0 4px 28px -1px rgba(0, 0, 0, 0.2),
      0 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 50px -10px rgba(33, 114, 229, 0.4);
  }
`;

const SwapHeader = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  align-items: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    width: 60px;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      rgba(0, 242, 254, 0.5) 50%, 
      transparent 100%
    );
    transform: translateX(-50%);
  }
`;

const Title = styled.h2`
  color: rgba(0, 242, 254, 0.8);
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 4px;
  text-transform: uppercase;
  font-family: 'Inter', monospace;
  text-shadow: 0 0 10px rgba(0, 242, 254, 0.3);
  position: relative;
  padding: 0 20px;
  text-align: center;
  flex: 1;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 15px;
    height: 2px;
    background: linear-gradient(90deg, #00f2fe 0%, transparent 100%);
    transform: translateY(-50%);
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
    transform: translateY(-50%) rotate(180deg);
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: white;
  margin-left: 10px;
  cursor: pointer;
  font-size: 18px;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(79, 172, 254, 0.1) 100%);
    box-shadow: 0 0 12px rgba(0, 242, 254, 0.2);
  }

  &:active {
    transform: scale(0.95);
  }
`;

const SwapArrowButton = styled.button`
  background: linear-gradient(135deg, rgba(0, 242, 254, 0.1) 0%, rgba(79, 172, 254, 0.1) 100%);
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin: -8px auto;
  position: relative;
  z-index: 2;
  transition: all 0.2s ease;
  box-shadow: 0 0 12px rgba(0, 242, 254, 0.1);

  &:hover {
    background: linear-gradient(135deg, rgba(0, 242, 254, 0.2) 0%, rgba(79, 172, 254, 0.2) 100%);
    box-shadow: 0 0 16px rgba(0, 242, 254, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
    fill: #00f2fe;
    transition: transform 0.2s ease;
  }

  &:hover svg {
    transform: rotate(180deg);
  }
`;

const SwapButton = styled.button`
  width: 100%;
  padding: 15px;
  background: ${props => {
    if (props.error) return '#ff4444';
    if (props.status) return '#00ffff';
    if (props.disabled) return '#3a4157';
    if (!props.connected) return 'linear-gradient(135deg, #2172E5 0%, #1C66D2 100%)';
    return 'linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)';
  }};
  border: none;
  border-radius: 8px;
  color: ${props => props.error ? 'white' : (props.status ? 'black' : 'white')};
  font-size: 15px;
  font-weight: 600;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  margin-top: 20px;
  transition: all 0.2s ease;
  min-height: 52px;
  position: relative;
  overflow: hidden;

  &:hover {
    background: ${props => {
      if (props.error) return '#ff6666';
      if (props.status) return '#33ffff';
      if (props.disabled) return '#3a4157';
      if (!props.connected) return 'linear-gradient(135deg, #1C66D2 0%, #1859B7 100%)';
      return 'linear-gradient(135deg, #00e6f2 0%, #3a9fee 100%)';
    }};
  }
`;

const SwapInterface = ({ availableTokens, selectedTokens, onTokenSelect }) => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const { active } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleTokenSelect = (token, type) => {
    if (onTokenSelect) {
      onTokenSelect(type, token);
    }
  };

  const getButtonText = () => {
    if (loading) return 'Processing...';
    if (error) return error;
    if (status) return status;
    if (!active) return 'Connect Wallet';
    if (!fromAmount) return 'Enter an amount';
    return 'Swap';
  };

  const addNetwork = async (chainId, networkParams) => {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams],
      });
    } catch (error) {
      console.error(`Error adding ${networkParams.chainName}:`, error);
      throw error;
    }
  };

  const checkCommitmentExists = async (bridge, commitment) => {
    try {
      const [amount, _, withdrawn] = await bridge.deposits(commitment);
      return amount.gt(0) && !withdrawn;
    } catch (error) {
      console.error("Error checking deposit:", error);
      console.log("Bridge address:", bridge.address);
      console.log("Commitment:", commitment);
      console.log("Contract interface:", bridge.interface.format());
      return false;
    }
  };

  const switchNetwork = async (targetChainId, networkParams) => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: targetChainId }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await addNetwork(targetChainId, networkParams);
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });
      } else {
        throw switchError;
      }
    }
    // Return a new provider after network switch
    return new ethers.providers.Web3Provider(window.ethereum);
  };

  const verifyContracts = async (sourceBridge) => {
    console.log("Verifying contracts...");
    
    // Check if it's a bridge contract by trying to access verifier
    try {
      const verifierAddress = await sourceBridge.verifier();
      console.log("Bridge verifier address:", verifierAddress);
      if (verifierAddress !== '0x784483390D553c712f2330d766460745b274fc42') {
        console.warn("Warning: Unexpected verifier address");
      }
    } catch (error) {
      throw new Error("Not a valid bridge contract");
    }
  };

  const handleSwap = async () => {
    if (!fromAmount || !selectedTokens.from || !selectedTokens.to) {
      console.log("Missing required fields:", { fromAmount, selectedTokens });
      return;
    }

    try {
      setLoading(true);
      setError('');
      setStatus('Initializing swap...');
      console.log("Starting swap process...");

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      console.log("Connected wallet:", address);

      // Generate proof
      setStatus('Generating proof...');
      console.log("Generating ZKP...");
      const { commitment, nullifierHash, proof } = await generateZKProof(
        ethers.utils.parseEther(fromAmount),
        address
      );
      console.log("Proof generated:", { commitment, nullifierHash });

      // Get token info
      const fromToken = availableTokens.find(t => t.symbol === selectedTokens.from);
      const toToken = availableTokens.find(t => t.symbol === selectedTokens.to);
      console.log("Token info:", { fromToken, toToken });

      // Switch to source network and wait for it to be ready
      setStatus('Switching to source network...');
      const sourceProvider = await switchNetwork(fromToken.chainId, {
        chainId: fromToken.chainId,
        chainName: 'Sepolia',
        nativeCurrency: {
          name: 'ETH',
          symbol: 'ETH',
          decimals: 18
        },
        rpcUrls: ['https://sepolia.base.org'],
        blockExplorerUrls: ['https://sepolia.etherscan.io']
      });

      // Wait for network switch to complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Verify we're on the correct network
      const network = await sourceProvider.getNetwork();
      if (network.chainId !== parseInt(fromToken.chainId, 16)) {
        throw new Error('Network switch failed');
      }

      // Create contract instance with new provider
      const sourceSigner = sourceProvider.getSigner();
      const sourceBridge = new ethers.Contract(
        fromToken.bridgeAddress,
        bridgeABIJson.abi,
        sourceSigner
      );
      console.log("Using bridge contract:", {
        address: fromToken.bridgeAddress,
        network: fromToken.network,
        chainId: fromToken.chainId
      });

      // Check if commitment already exists
      const commitmentExists = await checkCommitmentExists(sourceBridge, commitment);
      if (commitmentExists) {
        throw new Error("Please try again - generating new commitment");
      }

      // Execute deposit
      setStatus('Waiting for deposit approval...');
      console.log("Initiating deposit with params:", {
        commitment,
        value: ethers.utils.parseEther(fromAmount).toString(),
        gasLimit: 500000,
        bridgeAddress: fromToken.bridgeAddress
      });

      try {
        // Log contract state before deposit
        console.log("Pre-deposit checks:", {
          contractAddress: fromToken.bridgeAddress,
          commitment: commitment,
          amount: ethers.utils.parseEther(fromAmount).toString(),
          sender: address
        });

        // Check if contract exists
        const code = await sourceProvider.getCode(fromToken.bridgeAddress);
        console.log("Contract code exists:", code !== '0x');
        
        if (code === '0x') {
          throw new Error(`No contract found at address ${fromToken.bridgeAddress}`);
        }

        // Get contract balance
        const contractBalance = await sourceProvider.getBalance(fromToken.bridgeAddress);
        console.log("Contract balance:", ethers.utils.formatEther(contractBalance));

        // Check wallet balance
        const walletBalance = await sourceProvider.getBalance(address);
        console.log("Wallet balance:", ethers.utils.formatEther(walletBalance));

        // Try to estimate gas first
        let gasEstimate;
        try {
          console.log("Estimating gas for deposit...");
          gasEstimate = await sourceBridge.estimateGas.deposit(commitment, {
            value: ethers.utils.parseEther(fromAmount)
          });
          console.log("Gas estimate:", gasEstimate.toString());
        } catch (gasError) {
          console.error("Gas estimation failed:", gasError);
          // Try with manual gas limit if estimation fails
          gasEstimate = ethers.BigNumber.from(300000); // fallback gas limit
        }

        // Execute deposit with more gas
        const depositTx = await sourceBridge.deposit(commitment, {
          value: ethers.utils.parseEther(fromAmount),
          gasLimit: gasEstimate.mul(150).div(100), // Add 50% buffer
        });

        console.log("Deposit transaction sent:", depositTx.hash);
        setStatus('Depositing...');

        const receipt = await depositTx.wait();
        console.log("Deposit receipt:", receipt);

        if (receipt.status === 0) {
          throw new Error("Deposit transaction failed");
        }

        setStatus('Deposit confirmed. Waiting for finalization...');
      } catch (depositError) {
        console.error("Deposit error details:", depositError);
        
        // More detailed error handling
        if (depositError.error && depositError.error.message) {
          throw new Error(`Deposit failed: ${depositError.error.message}`);
        } else if (depositError.message.includes('insufficient funds')) {
          throw new Error('Insufficient funds for transaction');
        } else if (depositError.message.includes('execution reverted')) {
          // Try to decode the revert reason if possible
          const reason = depositError.data ? 
            ethers.utils.toUtf8String(depositError.data) : 
            'Unknown reason';
          throw new Error(`Transaction reverted: ${reason}`);
        } else {
          throw depositError;
        }
      }

      // Remove the two-step withdrawal process and use direct withdrawal
      try {
        // Switch to target network
        setStatus('Switching to target network...');
        const targetProvider = await switchNetwork(toToken.chainId, {
          chainId: toToken.chainId,
          chainName: 'Base Sepolia',
          nativeCurrency: {
            name: 'ETH',
            symbol: 'ETH',
            decimals: 18
          },
          rpcUrls: ['https://sepolia.base.org'],
          blockExplorerUrls: ['https://sepolia-explorer.base.org']
        });

        // Wait for network switch to complete
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Create target bridge contract instance
        const targetSigner = targetProvider.getSigner();
        const targetBridge = new ethers.Contract(
          toToken.bridgeAddress,
          bridgeABIJson.abi,
          targetSigner
        );

        console.log("Target bridge setup:", {
          address: toToken.bridgeAddress,
          network: toToken.network,
          chainId: toToken.chainId
        });

        // Execute withdrawal directly
        setStatus('Executing withdrawal...');
        console.log("Executing withdrawal with params:", {
          amount: ethers.utils.parseEther(fromAmount).toString(),
          recipient: address,
          nullifierHash,
          proofLength: proof.length
        });

        const withdrawTx = await targetBridge.withdraw(
          ethers.utils.parseEther(fromAmount),
          address,
          nullifierHash,
          proof,
          { gasLimit: 500000 }
        );

        console.log("Withdrawal transaction sent:", withdrawTx.hash);
        setStatus('Withdrawing...');
        
        const receipt = await withdrawTx.wait();
        console.log("Withdrawal receipt:", receipt);

        if (receipt.status === 0) {
          throw new Error("Withdrawal transaction failed");
        }

        setStatus('Bridge complete!');

      } catch (error) {
        console.error('Bridge error:', error);
        setError(error.message);
        throw error;
      }
    } catch (error) {
      console.error('Bridge error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSwapButtonClick = () => {
    if (!active) {
      // Find the wallet connect button and simulate a click
      const walletConnectButton = document.querySelector('[data-wallet-connect]');
      if (walletConnectButton) {
        walletConnectButton.click();
      }
      return;
    }
    handleSwap();
  };

  return (
    <SwapContainer>
      <SwapHeader>
        <Title>Swap</Title>
      </SwapHeader>

      <TokenInput
        value={fromAmount}
        onChange={setFromAmount}
        token={selectedTokens.from}
        onTokenChange={(token) => handleTokenSelect(token, 'from')}
        availableTokens={availableTokens}
      />

      <SwapArrowButton onClick={() => {
        handleTokenSelect(selectedTokens.to, 'from');
        handleTokenSelect(selectedTokens.from, 'to');
        setFromAmount(toAmount);
        setToAmount(fromAmount);
      }}>
        <svg viewBox="0 0 24 24">
          <path d="M16 17.01V10h-2v7.01h-3L15 21l4-3.99h-3zM9 3L5 6.99h3V14h2V6.99h3L9 3z" />
        </svg>
      </SwapArrowButton>

      <TokenInput
        value={toAmount}
        onChange={setToAmount}
        token={selectedTokens.to}
        onTokenChange={(token) => handleTokenSelect(token, 'to')}
        availableTokens={availableTokens}
      />

      <SwapButton 
        disabled={loading} 
        connected={active}
        onClick={handleSwapButtonClick}
        error={error}
        status={status && !error}
      >
        {getButtonText()}
      </SwapButton>
    </SwapContainer>
  );
};

export default SwapInterface; 
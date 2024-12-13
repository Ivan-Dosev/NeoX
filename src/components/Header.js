import React from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { injected } from '../connectors';

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
`;

const ConnectButton = styled.button`
  background: #00b8d9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  
  &:hover {
    background: #00a0c2;
  }
`;

const Header = () => {
  const { activate, account } = useWeb3React();

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <HeaderContainer>
      <div>Token Bridge</div>
      <ConnectButton onClick={connectWallet}>
        {account ? `${account.substring(0, 6)}...${account.substring(38)}` : 'Connect Wallet'}
      </ConnectButton>
    </HeaderContainer>
  );
};

export default Header; 
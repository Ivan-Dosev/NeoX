import React from 'react';
import styled from 'styled-components';

const TokenContainer = styled.div`
  background: #2c353d;
  border-radius: 12px;
  padding: 1rem;
`;

const TokenHeader = styled.div`
  color: #8f96a1;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TokenInput = styled.input`
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 100%;
  outline: none;
  
  &::placeholder {
    color: #4a5056;
  }
`;

const TokenSelector = ({ label, amount, setAmount, chainName }) => {
  return (
    <TokenContainer>
      <TokenHeader>{label} on {chainName}</TokenHeader>
      <TokenInput
        type="number"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
    </TokenContainer>
  );
};

export default TokenSelector; 
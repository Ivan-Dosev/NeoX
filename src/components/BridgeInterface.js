import React, { useState } from 'react';
import styled from 'styled-components';
import TokenSelector from './TokenSelector';

const BridgeContainer = styled.div`
  max-width: 480px;
  margin: 2rem auto;
  background: #232b32;
  border-radius: 16px;
  padding: 1.5rem;
`;

const SwapSection = styled.div`
  margin: 1rem 0;
`;

const BridgeButton = styled.button`
  width: 100%;
  background: #00b8d9;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  margin-top: 1rem;
  cursor: pointer;
  
  &:disabled {
    background: #4a5056;
    cursor: not-allowed;
  }
`;

const BridgeInterface = () => {
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  return (
    <BridgeContainer>
      <h3>Bridge</h3>
      <SwapSection>
        <TokenSelector
          label="You send"
          amount={fromAmount}
          setAmount={setFromAmount}
          chainName="Neo X"
        />
      </SwapSection>
      <SwapSection>
        <TokenSelector
          label="You receive"
          amount={toAmount}
          setAmount={setToAmount}
          chainName="Polygon"
        />
      </SwapSection>
      <BridgeButton disabled={!fromAmount}>
        Bridge Tokens
      </BridgeButton>
    </BridgeContainer>
  );
};

export default BridgeInterface; 
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  padding-left: 0;
  justify-content: flex-start;
  width: 100%;
  position: relative;
`;

const Input = styled.input`
  flex: 0 0 80px;
  background: transparent;
  border: none;
  color: #00f2fe;
  font-size: 24px;
  font-family: 'Inter', monospace;
  font-weight: 500;
  outline: none;
  padding: 5px 0;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px rgba(0, 242, 254, 0.3);
  transition: all 0.2s ease;
  text-align: left;

  &::placeholder {
    color: rgba(0, 242, 254, 0.3);
  }

  &:focus {
    text-shadow: 0 0 12px rgba(0, 242, 254, 0.4);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const DropdownContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  min-width: 120px;
  flex-shrink: 0;
  margin-left: 0;
`;

const DropdownButton = styled.button`
  background: rgba(0, 242, 254, 0.1);
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  outline: none;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;

  &:after {
    content: '▼';
    font-size: 10px;
    color: #00f2fe;
    margin-left: 8px;
  }
`;

const DropdownList = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #1a1b23;
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 8px;
  overflow: hidden;
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  width: calc(100% - 2px);
`;

const DropdownItem = styled.div`
  padding: 10px 12px;
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: rgba(0, 242, 254, 0.2);
  }
`;

const TokenInputContainer = styled.div`
  display: flex;
  align-items: center;
  margin: 0;
  padding: 5px;
`;

const TokenInput = ({ 
  value, 
  onChange, 
  token, 
  onTokenChange, 
  availableTokens 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedToken = availableTokens.find(t => t.symbol === token);

  return (
    <Container>
      <TokenInputContainer>
        <InputWrapper>
          <Input
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="0.00"
          />
          <DropdownContainer ref={dropdownRef}>
            <DropdownButton onClick={() => setIsOpen(!isOpen)}>
              {selectedToken ? selectedToken.name : 'Select Token'}
            </DropdownButton>
            {isOpen && (
              <DropdownList>
                {availableTokens.map(t => (
                  <DropdownItem
                    key={t.symbol}
                    onClick={() => {
                      onTokenChange(t.symbol);
                      setIsOpen(false);
                    }}
                  >
                    {t.name}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownContainer>
        </InputWrapper>
      </TokenInputContainer>
    </Container>
  );
};

export default TokenInput; 
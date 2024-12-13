import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  margin-bottom: 15px;
`;

const Label = styled.div`
  color: rgba(0, 242, 254, 0.8);
  font-size: 12px;
  margin-bottom: 8px;
  text-transform: uppercase;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-size: 18px;
  outline: none;
  padding: 5px;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`;

const Select = styled.select`
  background: rgba(0, 242, 254, 0.1);
  border: 1px solid rgba(0, 242, 254, 0.2);
  border-radius: 8px;
  color: white;
  padding: 8px 12px;
  outline: none;
  cursor: pointer;
  min-width: 150px;

  option {
    background: #1a1b23;
    color: white;
  }
`;

const TokenInput = ({ 
  value, 
  onChange, 
  token, 
  onTokenChange, 
  label, 
  availableTokens 
}) => {
  return (
    <Container>
      <Label>{label}</Label>
      <InputWrapper>
        <Input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="0.00"
        />
        <Select 
          value={token} 
          onChange={(e) => onTokenChange(e.target.value)}
        >
          {availableTokens.map(t => (
            <option key={t.symbol} value={t.symbol}>
              {t.name}
            </option>
          ))}
        </Select>
      </InputWrapper>
    </Container>
  );
};

export default TokenInput; 
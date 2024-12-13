import React, { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import styled from 'styled-components';
import { generateZKProof } from '../utils/zkp';

const TOKENS = {
    'ETH': {
        symbol: 'ETH',
        name: 'Ethereum',
        network: 'sepolia',
        chainId: '0xaa36a7',
        bridgeAddress: process.env.REACT_APP_SEPOLIA_BRIDGE_ADDRESS
    },
    'BASE': {
        symbol: 'ETH',
        name: 'Base',
        network: 'base-sepolia',
        chainId: '0x14a33',
        bridgeAddress: process.env.REACT_APP_BASE_SEPOLIA_BRIDGE_ADDRESS
    }
};

const Bridge = () => {
    const [amount, setAmount] = useState('');
    const [fromToken, setFromToken] = useState('ETH');
    const [toToken, setToToken] = useState('BASE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('');

    const switchNetwork = async (networkName) => {
        try {
            const network = TOKENS[networkName];
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: network.chainId }],
            });
        } catch (error) {
            console.error('Error switching network:', error);
            setError('Failed to switch network');
        }
    };

    const executeBridge = useCallback(async () => {
        if (!amount || !fromToken || !toToken) return;
        
        setLoading(true);
        setError('');
        setStatus('');

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const address = await signer.getAddress();

            // Convert amount to wei
            const amountWei = ethers.utils.parseEther(amount);

            // Generate proof
            setStatus('Generating proof...');
            const { commitment, nullifierHash, proof } = await generateZKProof(
                amountWei,
                address
            );

            // Switch to source network
            setStatus('Switching to source network...');
            await switchNetwork(fromToken);

            // Create contract instance
            const bridgeABI = require('../abis/BridgeWithZKP.json');
            const sourceBridge = new ethers.Contract(
                TOKENS[fromToken].bridgeAddress,
                bridgeABI,
                signer
            );

            // Execute deposit
            setStatus('Depositing tokens...');
            const depositTx = await sourceBridge.deposit(commitment, {
                value: amountWei,
                gasLimit: 500000
            });
            await depositTx.wait();
            setStatus('Deposit successful! Waiting for confirmation...');

            // Wait for some blocks
            await new Promise(resolve => setTimeout(resolve, 30000));

            // Switch to target network
            setStatus('Switching to target network...');
            await switchNetwork(toToken);

            // Create target bridge instance
            const targetBridge = new ethers.Contract(
                TOKENS[toToken].bridgeAddress,
                bridgeABI,
                signer
            );

            // Execute withdrawal
            setStatus('Withdrawing tokens...');
            const withdrawTx = await targetBridge.withdraw(
                amountWei,
                address,
                nullifierHash,
                proof,
                { gasLimit: 500000 }
            );
            await withdrawTx.wait();
            setStatus('Bridge complete! Tokens received.');

        } catch (err) {
            console.error('Bridge error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [amount, fromToken, toToken]);

    return (
        <Container>
            <Title>SWAP</Title>
            
            <Section>
                <Label>YOU SELL</Label>
                <InputContainer>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                    />
                    <Select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
                        <Option value="ETH">SepoliaETH</Option>
                        <Option value="BASE">SepoliaBase</Option>
                    </Select>
                </InputContainer>
            </Section>

            <Section>
                <Label>YOU BUY</Label>
                <InputContainer>
                    <Input
                        type="number"
                        value={amount}
                        disabled
                        placeholder="0.00"
                    />
                    <Select value={toToken} onChange={(e) => setToToken(e.target.value)}>
                        <Option value="ETH">SepoliaETH</Option>
                        <Option value="BASE">SepoliaBase</Option>
                    </Select>
                </InputContainer>
            </Section>

            <Button 
                onClick={executeBridge} 
                disabled={loading || !amount}
            >
                {loading ? 'Processing...' : 'Connect Wallet & Swap'}
            </Button>

            {status && <Status>{status}</Status>}
            {error && <Error>{error}</Error>}
        </Container>
    );
};

// Styled Components
const Container = styled.div`
    background: #1a1b23;
    border-radius: 16px;
    padding: 24px;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
`;

const Title = styled.h1`
    color: #00ffff;
    text-align: center;
    margin-bottom: 24px;
`;

const Section = styled.div`
    margin-bottom: 20px;
`;

const Label = styled.div`
    color: #00ffff;
    margin-bottom: 8px;
`;

const InputContainer = styled.div`
    display: flex;
    gap: 12px;
`;

const Input = styled.input`
    background: #2c2d3a;
    border: none;
    border-radius: 8px;
    padding: 12px;
    color: white;
    flex: 1;
    &:focus {
        outline: none;
        border: 1px solid #00ffff;
    }
`;

const Select = styled.select`
    background: #2c2d3a;
    border: none;
    border-radius: 8px;
    padding: 12px;
    color: white;
    min-width: 120px;
    &:focus {
        outline: none;
        border: 1px solid #00ffff;
    }
`;

const Option = styled.option`
    background: #2c2d3a;
    color: white;
`;

const Button = styled.button`
    background: #00ffff;
    color: black;
    border: none;
    border-radius: 8px;
    padding: 16px;
    width: 100%;
    cursor: pointer;
    font-weight: bold;
    margin-top: 24px;
    &:disabled {
        background: #2c2d3a;
        color: #666;
        cursor: not-allowed;
    }
`;

const Status = styled.div`
    color: #00ffff;
    text-align: center;
    margin-top: 16px;
`;

const Error = styled.div`
    color: #ff4444;
    text-align: center;
    margin-top: 16px;
`;

export default Bridge; 
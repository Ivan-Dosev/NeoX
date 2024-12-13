import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import BridgeABI from '../abis/BridgeWithZKP.json';
import ERC20ABI from '../abis/ERC20.json';
import { generateZKProof } from '../utils/zkp';

const BRIDGE_ADDRESSES = {
    'chain-a': 'BRIDGE_CONTRACT_ADDRESS_CHAIN_A',
    'chain-b': 'BRIDGE_CONTRACT_ADDRESS_CHAIN_B'
};

export const useBridge = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeBridge = useCallback(async (
        sourceChain,
        targetChain,
        tokenIn,
        tokenOut,
        amount,
        signer
    ) => {
        try {
            setLoading(true);
            setError(null);

            // Generate ZKP commitment
            const { commitment, nullifierHash, proof } = await generateZKProof(
                tokenIn,
                tokenOut,
                amount,
                signer.getAddress()
            );

            // Create contract instances
            const sourceBridge = new ethers.Contract(
                BRIDGE_ADDRESSES[sourceChain],
                BridgeABI,
                signer
            );
            const tokenContract = new ethers.Contract(
                tokenIn,
                ERC20ABI,
                signer
            );

            // Approve tokens
            const approveTx = await tokenContract.approve(
                BRIDGE_ADDRESSES[sourceChain],
                amount
            );
            await approveTx.wait();

            // Create deposit on source chain
            const depositTx = await sourceBridge.deposit(
                tokenIn,
                amount,
                commitment
            );
            await depositTx.wait();

            // Store commitment and proof for later withdrawal
            localStorage.setItem('bridge_proof', JSON.stringify({
                commitment,
                nullifierHash,
                proof,
                amount,
                tokenOut
            }));

            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
        }
    }, []);

    const executeWithdraw = useCallback(async (
        targetChain,
        signer
    ) => {
        try {
            setLoading(true);
            setError(null);

            // Get stored proof data
            const proofData = JSON.parse(localStorage.getItem('bridge_proof'));
            if (!proofData) throw new Error('No proof found');

            // Create contract instance for target chain
            const targetBridge = new ethers.Contract(
                BRIDGE_ADDRESSES[targetChain],
                BridgeABI,
                signer
            );

            // Execute withdrawal
            const withdrawTx = await targetBridge.withdraw(
                proofData.tokenOut,
                proofData.amount,
                await signer.getAddress(),
                proofData.nullifierHash,
                proofData.proof
            );
            await withdrawTx.wait();

            // Clear stored proof
            localStorage.removeItem('bridge_proof');

            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
        }
    }, []);

    return { executeBridge, executeWithdraw, loading, error };
}; 
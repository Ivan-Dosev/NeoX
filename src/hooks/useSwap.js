import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import TokenSwapABI from '../abis/TokenSwap.json';
import ERC20ABI from '../abis/ERC20.json';

const SWAP_CONTRACT_ADDRESS = 'YOUR_DEPLOYED_CONTRACT_ADDRESS';

export const useSwap = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const executeSwap = useCallback(async (
        tokenIn,
        tokenOut,
        amount,
        signer
    ) => {
        try {
            setLoading(true);
            setError(null);

            // Create contract instances
            const swapContract = new ethers.Contract(
                SWAP_CONTRACT_ADDRESS,
                TokenSwapABI,
                signer
            );
            const tokenContract = new ethers.Contract(
                tokenIn,
                ERC20ABI,
                signer
            );

            // Approve tokens
            const approveTx = await tokenContract.approve(
                SWAP_CONTRACT_ADDRESS,
                amount
            );
            await approveTx.wait();

            // Execute swap
            const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes
            const minAmountOut = amount; // In real app, calculate this based on slippage
            
            const swapTx = await swapContract.swap(
                tokenIn,
                tokenOut,
                amount,
                minAmountOut,
                deadline
            );
            await swapTx.wait();

            setLoading(false);
            return true;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            return false;
        }
    }, []);

    return { executeSwap, loading, error };
}; 
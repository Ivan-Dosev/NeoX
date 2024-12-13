// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenSwap is ReentrancyGuard, Ownable {
    // Events
    event SwapExecuted(
        address indexed user,
        address indexed tokenIn,
        address indexed tokenOut,
        uint256 amountIn,
        uint256 amountOut
    );

    // Mapping to store allowed tokens
    mapping(address => bool) public allowedTokens;

    constructor() {
        // Initialize with some allowed tokens
    }

    // Owner can add or remove allowed tokens
    function setAllowedToken(address token, bool allowed) external onlyOwner {
        allowedTokens[token] = allowed;
    }

    // Main swap function
    function swap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 minAmountOut,
        uint256 deadline
    ) external nonReentrant {
        require(block.timestamp <= deadline, "Swap expired");
        require(allowedTokens[tokenIn], "Token in not allowed");
        require(allowedTokens[tokenOut], "Token out not allowed");
        require(amountIn > 0, "Amount must be greater than 0");

        // Transfer tokens from user to contract
        IERC20(tokenIn).transferFrom(msg.sender, address(this), amountIn);

        // Calculate amount out (in a real DEX this would use price oracles or liquidity pools)
        uint256 amountOut = calculateAmountOut(tokenIn, tokenOut, amountIn);
        require(amountOut >= minAmountOut, "Insufficient output amount");

        // Transfer tokens to user
        IERC20(tokenOut).transfer(msg.sender, amountOut);

        emit SwapExecuted(msg.sender, tokenIn, tokenOut, amountIn, amountOut);
    }

    // Simple price calculation (replace with actual price mechanism)
    function calculateAmountOut(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) public view returns (uint256) {
        // This is a simplified example
        // In a real DEX, you would use:
        // - Price oracles
        // - Liquidity pools
        // - Order books
        // For now, we'll use a 1:1 ratio
        return amountIn;
    }

    // Function to get swap quote
    function getSwapQuote(
        address tokenIn,
        address tokenOut,
        uint256 amountIn
    ) external view returns (uint256) {
        return calculateAmountOut(tokenIn, tokenOut, amountIn);
    }

    // Emergency withdraw function
    function emergencyWithdraw(address token) external onlyOwner {
        uint256 balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner(), balance);
    }
} 
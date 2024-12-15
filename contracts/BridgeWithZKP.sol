// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BridgeWithZKP is ReentrancyGuard, Ownable {
    struct Deposit {
        uint256 amount;
        bytes32 commitment;
        bool withdrawn;
    }

    // Mapping from commitment hash to deposit
    mapping(bytes32 => Deposit) public deposits;
    // Mapping to track used nullifiers
    mapping(bytes32 => bool) public nullifierHashes;
    // Verifier contract address
    address public verifier;
    
    event DepositCreated(
        uint256 amount,
        bytes32 indexed commitment,
        uint256 timestamp
    );

    event WithdrawalExecuted(
        address indexed recipient,
        uint256 amount,
        bytes32 indexed nullifierHash
    );

    constructor(address _verifier) {
        verifier = _verifier;
    }

    // Function to create a deposit with ZKP commitment
    function deposit(bytes32 commitment) external payable nonReentrant {
        require(msg.value > 0, "Amount must be greater than 0");
        require(deposits[commitment].amount == 0, "Commitment already exists");

        // Store deposit info
        deposits[commitment] = Deposit({
            amount: msg.value,
            commitment: commitment,
            withdrawn: false
        });

        emit DepositCreated(msg.value, commitment, block.timestamp);
    }

    // Function to withdraw with ZKP proof
    function withdraw(
        uint256 amount,
        address payable recipient,
        bytes32 nullifierHash,
        bytes calldata proof
    ) external nonReentrant {
        require(!nullifierHashes[nullifierHash], "Nullifier already used");
        require(address(this).balance >= amount, "Insufficient liquidity");

        // Decode the proof to verify the claimer's identity
        (uint256 proofAmount, address proofAddress, bytes32 secret) = 
            abi.decode(proof, (uint256, address, bytes32));

        // Verify amount matches
        require(proofAmount == amount, "Amount mismatch");
        
        // Verify recipient matches the address in the proof
        require(recipient == proofAddress, "Unauthorized withdrawal");

        // Verify the nullifier matches what we expect
        bytes32 expectedNullifier = keccak256(
            abi.encode(secret, proofAddress)
        );
        require(nullifierHash == expectedNullifier, "Invalid nullifier");

        // Mark nullifier as used to prevent double-spending
        nullifierHashes[nullifierHash] = true;

        // Transfer tokens to recipient
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit WithdrawalExecuted(recipient, amount, nullifierHash);
    }

    // Function to get contract balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    // Emergency withdraw function
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    // To receive native tokens
    receive() external payable {}
    fallback() external payable {}
}
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
    // Two-step withdrawal process
    mapping(bytes32 => uint256) public withdrawalCommitments;
    uint256 public constant WITHDRAWAL_DELAY = 10; // blocks
    
    event DepositCreated(
        uint256 amount,
        bytes32 indexed commitment,
        uint256 timestamp
    );

    event WithdrawalCommitted(bytes32 indexed commitmentHash);
    event WithdrawalExecuted(address indexed recipient, uint256 amount);

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

    // Function to commit to withdrawal
    function commitWithdrawal(bytes32 commitmentHash) external {
        require(withdrawalCommitments[commitmentHash] == 0, "Commitment exists");
        withdrawalCommitments[commitmentHash] = block.number;
        emit WithdrawalCommitted(commitmentHash);
    }

    // Function to verify ZKP proof
    function verifyProof(
        bytes calldata proof,
        bytes32 nullifierHash,
        address recipient
    ) internal view returns (bool) {
        // Decode proof components
        (uint256 amount, address proofRecipient, bytes32 secret) = abi.decode(
            proof,
            (uint256, address, bytes32)
        );

        // Verify recipient matches
        require(recipient == proofRecipient, "Invalid recipient");

        // Verify commitment matches
        bytes32 commitment = keccak256(
            abi.encode(secret, amount, recipient)
        );
        require(deposits[commitment].amount > 0, "Invalid commitment");

        // Verify nullifier matches
        bytes32 expectedNullifier = keccak256(
            abi.encode(secret, recipient)
        );
        require(nullifierHash == expectedNullifier, "Invalid nullifier");

        return true;
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

        // Verify the proof includes correct recipient
        require(verifyProof(proof, nullifierHash, recipient), "Invalid proof");

        // Mark nullifier as used
        nullifierHashes[nullifierHash] = true;

        // Transfer native tokens to recipient
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit WithdrawalExecuted(recipient, amount);
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
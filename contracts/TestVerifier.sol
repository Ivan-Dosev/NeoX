// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IZKPVerifier.sol";

contract TestVerifier is IZKPVerifier {
    // For testing purposes, this verifier always returns true
    // In production, this should implement actual ZKP verification
    function verifyProof(
        bytes calldata proof,
        bytes32 nullifierHash
    ) external pure override returns (bool) {
        // Prevent unused parameter warnings
        proof;
        nullifierHash;
        return true;
    }
} 
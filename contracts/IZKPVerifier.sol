// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IZKPVerifier {
    function verifyProof(
        bytes calldata proof,
        bytes32 nullifierHash
    ) external view returns (bool);
} 
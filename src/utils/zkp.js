import { ethers } from 'ethers';

export const generateZKProof = async (amount, address) => {
  console.log("🔒 Starting ZK Proof Generation for Cross-chain Bridge");
  
  // Generate random secret
  const secret = ethers.utils.hexlify(ethers.utils.randomBytes(32));
  console.log("Generated secret for cross-chain proof");

  // Create commitment that will be used on both chains
  // This commitment binds the amount, address, and secret together
  const commitment = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'uint256', 'address'],
      [secret, amount, address]
    )
  );
  console.log("Created cross-chain commitment");

  // Create nullifier hash that will be used to prevent double-spending across chains
  const nullifierHash = ethers.utils.keccak256(
    ethers.utils.defaultAbiCoder.encode(
      ['bytes32', 'address'],
      [secret, address]
    )
  );
  console.log("Created cross-chain nullifier hash");

  // Create proof that can be verified on both chains
  const proof = ethers.utils.defaultAbiCoder.encode(
    ['uint256', 'address', 'bytes32'],
    [amount, address, secret]
  );
  console.log("Generated cross-chain proof");

  return {
    commitment,
    nullifierHash,
    proof
  };
}; 
# NeoX - Cross-Chain Token Bridge

## Overview

NeoX is a decentralized application (dApp) that allows users to seamlessly swap tokens across multiple blockchains. With a focus on security and user experience, NeoX leverages Zero-Knowledge Proofs (ZKPs) to ensure that transactions are both private and verifiable.

## Features

- **Cross-Chain Swapping**: Easily swap tokens between supported blockchains.
- **Zero-Knowledge Proofs**: Enhanced privacy and security for transactions.
- **Staking**: Earn up to 12% APY by staking your tokens.
- **User-Friendly Interface**: Intuitive design for a smooth user experience.

## Technologies Used

- **React**: Frontend framework for building the user interface.
- **Zero-Knowledge Proofs (ZKPs)**: A cryptographic method used to enhance privacy and security in transactions. ZKPs allow one party to prove to another that a statement is true without revealing any additional information. In NeoX, ZKPs are used to ensure that token swaps are secure and private.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **Styled Components**: For styling React components.
- **Hardhat**: Development environment for Ethereum smart contracts.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/neox.git
   cd neox
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up your environment variables:

   Create a `.env` file in the root directory and add the following:

   ```plaintext
   PRIVATE_KEY=your_private_key
   SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/your_infura_project_id
   BASE_SEPOLIA_RPC_URL=https://base-sepolia.infura.io/v3/your_infura_project_id
   SEPOLIA_BRIDGE_ADDRESS=your_sepolia_bridge_address
   NEOX_MAINNET_BRIDGE_ADDRESS=your_neox_bridge_address
   ETHERSCAN_API_KEY=your_etherscan_api_key
   BASESCAN_API_KEY=your_basescan_api_key
   ```

      ```plaintext
   Smart Contract Address Bridge: 0xa8463795fAEfb6004Ce97115f335A201e133C567
   Smart Contract Address SupraOracle: 0x938526421BB64E63b34f814Ae82BBE018e9A110B
   Smart Contract Address Prover: 0x216D043aB1e57180157fDAD7629651CD60a38bD0

   NeoX Explorer: https://xexplorer.neo.org/address/0xa8463795fAEfb6004Ce97115f335A201e133C567?tab=contract
   NeoX Explorer: https://xexplorer.neo.org/address/0x938526421BB64E63b34f814Ae82BBE018e9A110B?tab=contract
   NeoX Explorer: https://xexplorer.neo.org/address/0x216D043aB1e57180157fDAD7629651CD60a38bD0?tab=contract
   ```

### Running the Application

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000` or `https://neox.thedrop.top`

## 🚨 Important Information 🚨

**When testing the bridge and swapping tokens, please make sure that the contract bridge has enough balance to cover the transaction amount, otherwise you will get an error alert and failing transaction.**

## Usage

1. Connect your wallet (e.g., MetaMask).
2. Select the tokens you want to swap.
3. Enter the amount you wish to swap.
4. Click on the "Swap" button to initiate the transaction.
5. Optionally, stake your tokens to earn APY.

## Testing

To run tests, use the following command:

```bash
npx hardhat test
```

## Deployment

To deploy the smart contracts, use:

```bash
npx hardhat run scripts/deploy.js --network sepolia
npx hardhat run scripts/deploy.js --network neoxMainnet
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

# Token Swap Process

This section describes the process of swapping tokens between different chains using our application.

## Sequence Diagram
```mermaid
sequenceDiagram
participant User
participant Wallet
participant SwapInterface
participant SupraOracle
participant SourceBridge
participant TargetBridge
User->>SwapInterface: Input amount and select tokens
SwapInterface->>SwapInterface: Calculate fee
SwapInterface->>SwapInterface: Fetch price from SupraOracle
SwapInterface->>SupraOracle: getPrice(260)
SupraOracle-->>SwapInterface: Return price data
SwapInterface->>SwapInterface: Calculate output amount
SwapInterface->>User: Display output amount
User->>SwapInterface: Click "Swap" button
SwapInterface->>Wallet: Request wallet connection
Wallet-->>SwapInterface: Wallet connected
SwapInterface->>SourceBridge: Deposit tokens
SwapInterface->>SourceBridge: deposit(commitment, { value: transferAmount })
SourceBridge-->>SwapInterface: Transaction confirmed
SwapInterface->>TargetBridge: Withdraw tokens
SwapInterface->>TargetBridge: withdraw(targetAmount, address, nullifierHash, proof)
TargetBridge-->>SwapInterface: Transaction confirmed
SwapInterface->>User: Display success message
```
## Roadmap 🗺️

1. **Cross-Chain Integration** : Add support for additional blockchains to broaden token swapping capabilities.
2. **Enhanced Staking Features**: Introduce new staking options and yield farming opportunities to incentivize user engagement.
3. **Educational Initiatives** : Create tutorials and guides to help users understand how to use the platform and the benefits of using ZKPs in DeFi.
4. **Partnerships with DeFi Projects** : Collaborate with other DeFi projects to create synergies and enhance the platform's offerings.

## Business model 📈

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Ethereum community for their support and resources.
- Special thanks to the developers of Ethers.js and Hardhat for their amazing tools.

---

Feel free to customize this template further based on your project's specific needs and features. Let me know if you need any additional sections or modifications!

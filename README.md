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

### Running the Application

1. Start the development server:

   ```bash
   npm start
   ```

2. Open your browser and navigate to `http://localhost:3000`.

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

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to the Ethereum community for their support and resources.
- Special thanks to the developers of Ethers.js and Hardhat for their amazing tools.

---

Feel free to customize this template further based on your project's specific needs and features. Let me know if you need any additional sections or modifications!

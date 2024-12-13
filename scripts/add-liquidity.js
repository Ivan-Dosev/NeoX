const { ethers } = require("hardhat");
require('dotenv').config();

async function addLiquidity() {
    try {
        // Connect to Base Sepolia
        const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, baseSepoliaProvider);

        console.log("Adding liquidity from wallet:", wallet.address);

        // Amount to add as liquidity (e.g., 0.1 ETH)
        const amount = ethers.utils.parseEther("0.1");

        // Send ETH directly to the bridge contract
        const tx = await wallet.sendTransaction({
            to: process.env.BASE_SEPOLIA_BRIDGE_ADDRESS,
            value: amount,
            gasLimit: 500000
        });

        console.log("Sending liquidity...");
        await tx.wait();
        console.log("Liquidity added successfully!");
        console.log("Transaction hash:", tx.hash);

        // Check the new balance
        const balance = await baseSepoliaProvider.getBalance(process.env.BASE_SEPOLIA_BRIDGE_ADDRESS);
        console.log("New bridge balance:", ethers.utils.formatEther(balance), "ETH");

    } catch (error) {
        console.error("Error adding liquidity:", error);
    }
}

addLiquidity()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }); 
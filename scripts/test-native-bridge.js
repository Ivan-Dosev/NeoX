const { ethers } = require("hardhat");
const { generateZKProof } = require("../src/utils/zkp");
require('dotenv').config();

async function testNativeBridge() {
    try {
        // Connect to networks
        const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
        const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);

        // Load your wallet
        const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
        const sepoliaWallet = wallet.connect(sepoliaProvider);
        const baseSepoliaWallet = wallet.connect(baseSepoliaProvider);

        console.log("Testing with wallet:", wallet.address);

        // Contract instances
        const sepoliaBridge = new ethers.Contract(
            process.env.SEPOLIA_BRIDGE_ADDRESS,
            require("../artifacts/contracts/BridgeWithZKP.sol/BridgeWithZKP.json").abi,
            sepoliaWallet
        );

        const baseSepoliaBridge = new ethers.Contract(
            process.env.BASE_SEPOLIA_BRIDGE_ADDRESS,
            require("../artifacts/contracts/BridgeWithZKP.sol/BridgeWithZKP.json").abi,
            baseSepoliaWallet
        );

        // Amount to bridge (0.01 ETH)
        const amount = ethers.utils.parseEther("0.01");

        console.log("Generating proof...");
        // Generate proof
        const { commitment, nullifierHash, proof } = await generateZKProof(
            amount,
            wallet.address
        );

        console.log("Generated proof");
        console.log("Commitment:", commitment);
        console.log("NullifierHash:", nullifierHash);

        // Deposit on Sepolia
        console.log("Depositing on Sepolia...");
        const depositTx = await sepoliaBridge.deposit(commitment, {
            value: amount,
            gasLimit: 500000
        });
        await depositTx.wait();
        console.log("Deposit successful on Sepolia");
        console.log("Tx hash:", depositTx.hash);

        // Wait for a few blocks
        console.log("Waiting for confirmation...");
        await new Promise(resolve => setTimeout(resolve, 30000)); // 30 seconds

        // Withdraw on Base Sepolia
        console.log("Withdrawing on Base Sepolia...");
        const withdrawTx = await baseSepoliaBridge.withdraw(
            amount,
            wallet.address,
            nullifierHash,
            proof,
            { gasLimit: 500000 }
        );
        await withdrawTx.wait();
        console.log("Withdrawal successful on Base Sepolia");
        console.log("Tx hash:", withdrawTx.hash);

    } catch (error) {
        console.error("Error:", error);
    }
}

testNativeBridge()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    }); 
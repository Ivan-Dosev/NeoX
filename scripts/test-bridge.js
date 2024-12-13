const { ethers } = require("ethers");
const { generateZKProof } = require("../src/utils/zkp");

async function testBridge() {
    // Connect to networks
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(NETWORKS.sepolia.rpcUrl);
    const mumbaiProvider = new ethers.providers.JsonRpcProvider(NETWORKS.mumbai.rpcUrl);

    // Load your wallet
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);
    const sepoliaWallet = wallet.connect(sepoliaProvider);
    const mumbaiWallet = wallet.connect(mumbaiProvider);

    // Contract instances
    const sepoliaBridge = new ethers.Contract(NETWORKS.sepolia.bridgeAddress, BridgeABI, sepoliaWallet);
    const mumbaiBridge = new ethers.Contract(NETWORKS.mumbai.bridgeAddress, BridgeABI, mumbaiWallet);

    // Test parameters
    const amount = ethers.utils.parseEther("1.0");
    const tokenIn = "SEPOLIA_TOKEN_ADDRESS";
    const tokenOut = "MUMBAI_TOKEN_ADDRESS";

    // Generate proof
    const { commitment, nullifierHash, proof } = await generateZKProof(
        tokenIn,
        tokenOut,
        amount,
        wallet.address
    );

    // Deposit on Sepolia
    const depositTx = await sepoliaBridge.deposit(tokenIn, amount, commitment);
    await depositTx.wait();
    console.log("Deposit successful on Sepolia");

    // Withdraw on Mumbai
    const withdrawTx = await mumbaiBridge.withdraw(
        tokenOut,
        amount,
        wallet.address,
        nullifierHash,
        proof
    );
    await withdrawTx.wait();
    console.log("Withdrawal successful on Mumbai");
}

testBridge().catch(console.error); 
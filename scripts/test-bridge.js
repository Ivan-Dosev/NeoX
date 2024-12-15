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
    const tokenIn = "NEOX_TOKEN_ADDRESS";
    const tokenOut = "SEPOLIA_TOKEN_ADDRESS";

    // Generate proof
    const { commitment, nullifierHash, proof } = await generateZKProof(
        tokenIn,
        tokenOut,
        amount,
        wallet.address
    );

    console.log("Commitment:", commitment);
    console.log("Nullifier Hash:", nullifierHash);
    console.log("Proof:", proof);

    // Deposit on NeoX
    const depositTx = await neoxBridge.deposit(tokenIn, amount, commitment);
    await depositTx.wait();
    console.log("Deposit successful on NeoX");

    // Withdraw on Sepolia or Base Sepolia
    const withdrawTx = await sepoliaBridge.withdraw(
        tokenOut,
        amount,
        wallet.address,
        nullifierHash,
        proof
    );
    await withdrawTx.wait();
    console.log("Withdrawal successful on Sepolia");
}

testBridge().catch(console.error); 
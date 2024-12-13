const { ethers } = require("hardhat");

async function checkBalances() {
    // Connect to networks
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);

    // Contract instances
    const sepoliaBridge = new ethers.Contract(
        process.env.SEPOLIA_BRIDGE_ADDRESS,
        require("../artifacts/contracts/BridgeWithZKP.sol/BridgeWithZKP.json").abi,
        sepoliaProvider
    );

    const baseSepoliaBridge = new ethers.Contract(
        process.env.BASE_SEPOLIA_BRIDGE_ADDRESS,
        require("../artifacts/contracts/BridgeWithZKP.sol/BridgeWithZKP.json").abi,
        baseSepoliaProvider
    );

    const sepoliaBalance = await sepoliaBridge.getBalance();
    const baseSepoliaBalance = await baseSepoliaBridge.getBalance();

    console.log("Sepolia Bridge Balance:", ethers.utils.formatEther(sepoliaBalance), "ETH");
    console.log("Base Sepolia Bridge Balance:", ethers.utils.formatEther(baseSepoliaBalance), "ETH");
}

checkBalances()
    .then(() => process.exit(0))
    .catch(console.error); 
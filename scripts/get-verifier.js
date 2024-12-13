const { ethers } = require("hardhat");

async function getVerifier() {
    const sepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
    const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);

    const sepoliaBridge = new ethers.Contract(
        process.env.SEPOLIA_BRIDGE_ADDRESS,
        ["function verifier() view returns (address)"],
        sepoliaProvider
    );

    const baseSepoliaBridge = new ethers.Contract(
        process.env.BASE_SEPOLIA_BRIDGE_ADDRESS,
        ["function verifier() view returns (address)"],
        baseSepoliaProvider
    );

    const sepoliaVerifier = await sepoliaBridge.verifier();
    const baseSepoliaVerifier = await baseSepoliaBridge.verifier();

    console.log("Sepolia Verifier:", sepoliaVerifier);
    console.log("Base Sepolia Verifier:", baseSepoliaVerifier);
}

getVerifier()
    .then(() => process.exit(0))
    .catch(console.error); 
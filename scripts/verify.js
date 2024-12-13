const hre = require("hardhat");

async function main() {
    const network = hre.network.name;
    let verifierAddress;
    let bridgeAddress;

    // Set addresses based on network
    if (network === 'sepolia') {
        verifierAddress = "0x784483390D553c712f2330d766460745b274fc42"; // Sepolia verifier
        bridgeAddress = process.env.SEPOLIA_BRIDGE_ADDRESS;
    } else if (network === 'base-sepolia') {
        verifierAddress = "0xD5c0e02be3e7aE5e068002e125E4e40fA1c46fa9"; // Base Sepolia verifier
        bridgeAddress = process.env.BASE_SEPOLIA_BRIDGE_ADDRESS;
    } else {
        throw new Error("Unsupported network");
    }

    console.log(`Verifying contracts on ${network}...`);
    console.log(`Verifier address: ${verifierAddress}`);
    console.log(`Bridge address: ${bridgeAddress}`);

    try {
        // Verify TestVerifier
        console.log("Verifying TestVerifier...");
        await hre.run("verify:verify", {
            address: verifierAddress,
            contract: "contracts/TestVerifier.sol:TestVerifier",
            constructorArguments: []
        });
        console.log("TestVerifier verified!");

        // Verify BridgeWithZKP
        console.log("Verifying BridgeWithZKP...");
        await hre.run("verify:verify", {
            address: bridgeAddress,
            contract: "contracts/BridgeWithZKP.sol:BridgeWithZKP",
            constructorArguments: [verifierAddress]
        });
        console.log("BridgeWithZKP verified!");

    } catch (error) {
        if (error.message.includes("Already Verified")) {
            console.log("Contract is already verified!");
        } else {
            console.error("Error during verification:", error);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 
const hre = require("hardhat");

async function main() {
    // Deploy TestVerifier
    const TestVerifier = await hre.ethers.getContractFactory("TestVerifier");
    const verifier = await TestVerifier.deploy();
    await verifier.deployed();
    console.log("TestVerifier deployed to:", verifier.address);

    // Deploy Bridge
    const Bridge = await hre.ethers.getContractFactory("BridgeWithZKP");
    const bridge = await Bridge.deploy(verifier.address);
    await bridge.deployed();
    console.log("Bridge deployed to:", bridge.address);

    console.log("Deployment complete!");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 
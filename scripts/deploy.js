const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy TestVerifier
    const TestVerifier = await hre.ethers.getContractFactory("TestVerifier");
    const verifier = await TestVerifier.deploy();
    await verifier.deployed();
    console.log("TestVerifier deployed to:", verifier.address);

    // Deploy the Bridge contract
    const Bridge = await hre.ethers.getContractFactory("BridgeWithZKP");
    const bridge = await Bridge.deploy(verifier.address);
    await bridge.deployed();
    console.log("Bridge deployed to:", bridge.address);

    console.log("Deployment complete!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 
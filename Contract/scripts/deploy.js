// scripts/deploy.js

async function main() {
    // Retrieve accounts from the local node
    const accounts = await ethers.getSigners();
    console.log("Deploying contracts with the account:", accounts[0].address);

    // Get the contract to deploy
    const Oracle = await ethers.getContractFactory("Oracle");
    const oracle = await Oracle.deploy();

    // Wait for the contract to be deployed
    await oracle.deployed();

    console.log("Oracle deployed to:", oracle.address);
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const hre = require("hardhat");

async function main() {
  const initialSupply = hre.ethers.parseUnits("1000", 18); // 1000 HUY tokens

  const MyToken = await hre.ethers.deployContract("MyToken", [initialSupply]);
  await MyToken.waitForDeployment();

  console.log(`✅ MyToken deployed at: ${MyToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


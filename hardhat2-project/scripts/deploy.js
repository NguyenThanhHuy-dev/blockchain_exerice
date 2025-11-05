const fs = require("fs");

async function main() {
  const Greeter = await ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Blockchain!");
  await greeter.waitForDeployment();

  const address = await greeter.getAddress();
  console.log("Greeter deployed to:", address);

  // Ghi địa chỉ vào file
  fs.writeFileSync("deployedAddress.txt", address);
}

main().catch(console.error);

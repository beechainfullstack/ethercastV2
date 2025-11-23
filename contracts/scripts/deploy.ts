import { ethers } from "hardhat";

async function main() {
  const PresenceRegistry = await ethers.getContractFactory("PresenceRegistry");
  const registry = await PresenceRegistry.deploy();
  await registry.waitForDeployment();

  const addr = await registry.getAddress();
  console.log("PresenceRegistry deployed to:", addr);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

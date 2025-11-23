import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const WORLD_CHAIN_ID = 480;

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    worldchain: {
      url: process.env.WORLDCHAIN_RPC_URL || "",
      accounts: process.env.WORLDCHAIN_PRIVATE_KEY
        ? [process.env.WORLDCHAIN_PRIVATE_KEY]
        : [],
      chainId: WORLD_CHAIN_ID
    }
  }
};

export default config;

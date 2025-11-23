import { ethers } from "ethers";

const WORLD_CHAIN_ID = 480;

const rpcUrl = process.env.WORLDCHAIN_RPC_URL;
const privateKey = process.env.WORLDCHAIN_PRIVATE_KEY;
const presenceRegistryAddress = process.env.WORLDCHAIN_PRESENCE_CONTRACT;

const presenceRegistryAbi = [
  "function markPresent(bytes32 nullifier) external",
  "event PresenceMarked(address indexed by, bytes32 indexed nullifier)"
];

export async function recordPresenceOnWorldChain(
  nullifierHash: string | undefined
): Promise<"ok" | "skipped" | "failed"> {
  if (!rpcUrl || !privateKey || !presenceRegistryAddress) {
    console.warn(
      "World Chain env not fully configured; skipping on-chain write.",
      {
        WORLDCHAIN_RPC_URL: !!rpcUrl,
        WORLDCHAIN_PRIVATE_KEY: !!privateKey,
        WORLDCHAIN_PRESENCE_CONTRACT: !!presenceRegistryAddress
      }
    );
    return "skipped";
  }

  if (!nullifierHash) {
    console.warn("No nullifierHash in proof; cannot record presence.");
    return "failed";
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl, WORLD_CHAIN_ID);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(
      presenceRegistryAddress,
      presenceRegistryAbi,
      wallet
    );

    const tx = await contract.markPresent(nullifierHash);
    await tx.wait();

    return "ok";
  } catch (err) {
    console.error("World Chain write failed:", err);
    return "failed";
  }
}

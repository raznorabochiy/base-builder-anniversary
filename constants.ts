export const RPC_URL = "https://base-mainnet.public.blastapi.io";

export const DELAY_FROM_SEC = 1000;
export const DELAY_TO_SEC = 2000;

// Перемешивать ключи, чтобы запускать аккаунты в случайном порядке
export const SHUFFLE_KEYS = false;

export const CONTRACT_ADDRESS = "0x8DC80A209A3362f0586e6C116973Bb6908170c84";

export const CONTRACT_ABI = [
  "function balanceOf(address owner) view returns (uint256 result)",
  "function mint(bytes32[] proof)",
];

export const TX_SCAN = "https://basescan.org/tx/";

export const KEYS_FILENAME = "keys.txt";

export const PROXY_FILENAME = "proxy.txt";

export const PROOF_URL = "https://www.base.org/api/checkNftProof";

import cli from "cli";
import { Contract, JsonRpcProvider, Wallet } from "ethers";
import fetch from "node-fetch";
import { HttpsProxyAgent } from "https-proxy-agent";
import { getTxLink, loadFromFile } from "./utils";
import {
  CONTRACT_ABI,
  CONTRACT_ADDRESS,
  PROOF_URL,
  PROXY_FILENAME,
  RPC_URL,
} from "./constants";
import { ProofResponse } from "./types";

const provider = new JsonRpcProvider(RPC_URL);
const [proxy] = await loadFromFile(PROXY_FILENAME);
const agent = proxy ? new HttpsProxyAgent(`http://${proxy}`) : undefined;

export async function getProof(address: string) {
  cli.spinner("Get proof data");

  const response = await fetch(PROOF_URL, {
    headers: {
      "accept": "*/*",
      "accept-language": "en-US, en;q=0.9",
      "content-type": "application/json",
      "priority": "u=1, i",
      "sec-ch-ua":
        '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"macOS"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "Referer": "https://www.base.org/builder-anniversary-nft",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `{"address":"${address}"}`,
    method: "POST",
    agent,
  });

  const data = await response.json() as ProofResponse;

  if (data.error) {
    throw new Error(data.error);
  }

  if (!data.result) {
    throw new Error("Proof data is empty");
  }

  cli.spinner("Proof data: Done", true);
  return data.result;
}

export async function mint(key: string, proof: string[]) {
  const wallet = new Wallet(key, provider);
  const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

  const txArgs = [
    proof,
  ];

  const gasLimit = await contract.mint.estimateGas(...txArgs);

  const unsignedTx = await contract.mint.populateTransaction(
    ...txArgs,
  );

  const { maxFeePerGas, maxPriorityFeePerGas } = await provider.getFeeData();

  cli.spinner("Send transaction");

  const tx = await wallet.sendTransaction({
    ...unsignedTx,
    gasLimit,
    maxFeePerGas,
    maxPriorityFeePerGas,
  });

  await provider.waitForTransaction(tx.hash);
  cli.spinner(getTxLink(tx.hash), true);
}

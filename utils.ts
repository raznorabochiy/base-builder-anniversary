import fs from "fs/promises";
import { Presets, SingleBar } from "cli-progress";
import { TX_SCAN } from "./constants";

export async function loadFromFile(fileName: string) {
  const file = await fs.readFile(fileName, { encoding: "utf-8" });

  return file.split("\n").map((item) => item.trim()).filter(Boolean);
}

export async function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export const delayProgress = (seconds: number) => {
  if (seconds === 0) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    const bar = new SingleBar({
      format: "Delay [{bar}] {value}/{total}",
    }, Presets.shades_classic);

    bar.start(seconds, 0);
    let counter = 0;

    const timer = setInterval(() => {
      counter = counter + 1;
      bar.update(counter);
      if (counter === seconds) {
        clearInterval(timer);
        bar.stop();
        resolve();
      }
    }, 1000);
  });
};

export function getTxLink(txHash: string) {
  const url = TX_SCAN;
  return `${url}${txHash}`;
}

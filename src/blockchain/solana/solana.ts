import * as solanaWeb3 from "@solana/web3.js";
import { Platforms } from "./platforms";
export class Solana {
  constructor() {}

  private async _getDecimals(data: {
    contractAddress: string;
    api: string;
  }): Promise<number> {
    const connection = new solanaWeb3.Connection(data.api);
    const myMint = new solanaWeb3.PublicKey(data.contractAddress);
    const token = await connection.getTokenSupply(myMint, "confirmed");
    return token.value.decimals;
  }

  async getDecimals(ticker: string, contractAddress: string) {
    const libs = Platforms.filter(
      (e) => e.ticker.toLowerCase() === ticker.toLowerCase()
    );
    if (libs.length > 0) {
      try {
        const lib = libs[Math.floor(Math.random() * libs.length)];
        return await this._getDecimals({
          api: lib.url,
          contractAddress,
        });
      } catch (err) {
        throw err;
      }
    } else {
      throw new Error("Not supported chain");
    }
  }
}

import * as solanaWeb3 from "@solana/web3.js";
export class Solana {
  constructor() {}

  async getDecimals(data: {
    contractAddress: string;
    api: string;
  }): Promise<number> {
    const connection = new solanaWeb3.Connection(data.api);
    const myMint = new solanaWeb3.PublicKey(data.contractAddress);
    const largest = await connection.getParsedAccountInfo(myMint, "confirmed");
    const decimals = (largest.value.data as solanaWeb3.ParsedAccountData).parsed
      .info.decimals;
    return decimals;
  }
}

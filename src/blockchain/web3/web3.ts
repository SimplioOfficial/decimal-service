import web3 from "web3";

export interface Web3List {
  ticker: string;
  lib: web3;
}

export class Web3 {
  web3: Web3List[] = [];

  constructor() {}

  init(rpcUrls): void {
    rpcUrls.forEach((element) => {
      this.web3.push({
        ticker: element.ticker,
        lib: new web3(element.url),
      });
    });
  }

  getDecimals(data: {
    abi: any;
    lib: web3;
    contractAddress: string;
  }): Promise<number> {
    return new Promise((resolve) => {
      let abi = data.abi;
      if (typeof data.abi == "string") {
        abi = JSON.parse(data.abi);
      }
      const contract = new data.lib.eth.Contract(abi, data.contractAddress);

      //get decimals to multiply by token amount
      try {
        contract.methods.decimals().call(function (error, d) {
          // console.log("decimals:", error, d);
          resolve(parseInt(d));
        });
      } catch (err) {
        resolve(18);
      }
    });
  }
}

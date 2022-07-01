import { Express } from "express";
import express from "express";
import cors from "cors";
import BodyParse from "body-parser";
import { Web3 } from "./blockchain/web3/web3";
import { Platforms } from "./blockchain/web3/platforms";
import { abi } from "./blockchain/web3/abi";
import { Solana } from "./blockchain/solana/solana";
export class RequestHandler {
  _app: Express;
  coingeckoCoins;
  _web3: Web3;
  _sol: Solana;
  constructor() {
    this._app = express();
    this._web3 = new Web3();
    this._web3.init(Platforms);
    this._sol = new Solana();
  }

  get() {
    return this._app;
  }

  init() {
    this._app.all("", function (req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, GET, POST, DELETE, OPTIONS"
      );
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
      );
      // Auth Each API Request created by user.
      next();
    });

    this._app.use(function (req, res, next) {
      if (req.path.indexOf(".") === -1) {
        res.setHeader("Content-Type", "text/html");
      }
      next();
    });
    this._app.use("/", express.static(__dirname + "/.well-known"));
    this._app.use(express.static(__dirname + "/"));
    this._app.use(
      BodyParse.urlencoded({
        extended: false,
      })
    );
    this._app.use(BodyParse.json());
    this._app.use(cors());

    this._app.get("/token/decimal", async (req, res) => {
      try {
        if (!req.query.ticker || !req.query.contractAddress) {
          throw new Error("Missing ticker or contract address");
        } else {
          let decimal = 0;
          switch ((req.query.ticker as string).toLowerCase()) {
            case "eth":
            case "bsc":
            case "matic":
            case "avax":
              decimal = await this._web3.getDecimals(
                req.query.ticker as string,
                req.query.contractAddress as string
              );
              break;
            case "sol":
            case "soltest":
            case "soldev":
              decimal = await this._sol.getDecimals(
                req.query.ticker as string,
                req.query.contractAddress as string
              );
              break;
            default:
              throw new Error("Not supported chain");
          }
          res.status(200);
          res.send(decimal.toString());
          res.end();
        }
      } catch (err) {
        res.status(400);
        res.send(err.message);
        res.end();
      }
    });

    this._app.listen(19334);
    console.log("App listening on port 19334");
  }
}

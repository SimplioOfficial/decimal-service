import { Express } from "express";
import express from "express";
import cors from "cors";
import BodyParse from "body-parser";
import { Web3 } from "./blockchain/web3/web3";
import { Platforms } from "./blockchain/web3/platforms";
import { abi } from "./blockchain/web3/abi";
export class RequestHandler {
  _app: Express;
  coingeckoCoins;
  _web3: Web3;
  constructor() {
    this._app = express();
    this._web3 = new Web3();
    this._web3.init(Platforms);
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
      if (!req.query.ticker || !req.query.contractAddress) {
        res.status(400);
        res.send("Missing ticker or contract address");
        res.end;
      } else {
        const libs = this._web3.web3.filter(
          (e) =>
            e.ticker.toLowerCase() ===
            (req.query.ticker as string).toLowerCase()
        );

        if (libs.length > 0) {
          const lib = libs[Math.floor(Math.random() * libs.length)];
          const decimal = await this._web3.getDecimals({
            abi: abi,
            contractAddress: req.query.contractAddress as string,
            lib: lib.lib,
          });
          res.status(200);
          res.send(decimal.toString());
          res.end();
        } else {
          res.status(400);
          res.end();
        }
      }
    });

    this._app.listen(19334);
    console.log("App listening on port 19334");
  }
}

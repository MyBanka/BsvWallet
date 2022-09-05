"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
const TxCache_1 = __importDefault(require("./TxCache"));
const Tx_1 = require("./Utils/Tx");
const network = "main";
const txCache = TxCache_1.default;
class BlochainCache {
    static getUnspendTxOuput(address) {
        const txs = _1.TxCache.getAllTx();
        // console.log({ allTx: txs });
        const utxo = (0, Tx_1.getUtxos)(txs, address);
        return utxo;
    }
}
exports.default = BlochainCache;

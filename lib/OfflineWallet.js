"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const HDPrivateKey_1 = __importDefault(require("./HDPrivateKey"));
const Blockchain_1 = __importDefault(require("./Blockchain"));
const _1 = require(".");
const Tx_1 = require("./Utils/Tx");
class OfflineWallet extends HDPrivateKey_1.default {
    constructor(_a) {
        var { key = "", keyFormat = "mnemonic", language = "ENGLISH", network = "testnet" } = _a, options = __rest(_a, ["key", "keyFormat", "language", "network"]);
        super(Object.assign({ key, keyFormat, language, network }, options));
        this.index = 0;
        this.blockchain = new Blockchain_1.default(network);
        this.cache = new _1.BlockchainCache();
    }
    sync() {
        throw new Error("not yet implemented");
    }
    // * UsingCache
    getBalance(start, end) {
        if (start == undefined) {
            start = 0;
        }
        if (end == undefined) {
            end = 200;
        }
        const adrs = this.getAddresses(start, end);
        // on récupère tout les utxo
        const satoshis = adrs.map((adr) => {
            const utxo = _1.BlockchainCache.getUnspendTxOuput(adr);
            const sat = (0, Tx_1.getTotalSatoshisInUtxos)(utxo);
            return sat;
        });
        const total = satoshis.reduce((total, next) => total + next, 0);
        return total;
    }
}
exports.default = OfflineWallet;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_1 = __importDefault(require("bsv/lib/transaction/transaction"));
const Crypto_1 = require("./Utils/Crypto");
const Tx_1 = require("./Utils/Tx");
// * pour avoir un localStorage dans node
if (typeof localStorage === "undefined" || localStorage === null) {
    const { LocalStorage } = require("node-localstorage");
    global.localStorage = new LocalStorage("./MyLocalStorage");
}
class TxCache {
    constructor() {
        this.transactions = [];
        this.transactions = this.loadTransactionsFromLocalStorage();
    }
    importFromHex(hex_str) {
        console.warn("transaction validation should be done before registering it into the cache");
        this.transactions.push(new transaction_1.default(hex_str));
        this.saveTransactionsIntoLocalStorage(this.transactions);
    }
    getUtxo(adr) {
        // check si ça marche
        const txs = this.transactions.map((tx) => tx.toString());
        return (0, Tx_1.getUtxos)(txs, adr);
    }
    getTxById(tx_hash) {
        // TODO: trouver la fonction qui sert à hash les transactions
        return this.transactions.find((tr) => tx_hash == (0, Crypto_1.getTxId)(tr.toString()));
    }
    computeBalanceOf(address) {
        const totalSatoshi = 0;
        for (let tx of this.transactions) {
        }
    }
    /**
     * @returns all transaction in bsv object format
     */
    getAllTx() {
        return this.transactions.map((tx) => tx.toString());
    }
    loadTransactionsFromLocalStorage() {
        const tx_hexs_json = localStorage.getItem("transactions") || "[]";
        // console.log({ tx_hexs_json });
        /**
         * @type {string[]}
         */
        const tx_hexs = JSON.parse(tx_hexs_json);
        return tx_hexs.map((hex) => new transaction_1.default(hex));
    }
    /**
     * pour sauvegarder les instances dans le localStorage
     * @param {Transaction[]} txs
     */
    saveTransactionsIntoLocalStorage(txs) {
        const tx_hexs = txs.map((tx) => tx.toString());
        /**
         * @type {string[]}
         */
        const tx_hexs_json = JSON.stringify(tx_hexs);
        localStorage.setItem("transactions", tx_hexs_json);
    }
}
const txCache = new TxCache();
exports.default = txCache;

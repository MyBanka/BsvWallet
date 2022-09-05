"use strict";
// * j'aurai pu faire des fonctions
// * mais je préfère une classe
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const GroupBy_1 = require("./Utils/GroupBy");
const translateNetworkNameFromBSVJSToWoC = (network) => {
    switch (network) {
        case "livenet":
            return "main";
        case "testnet":
            return "test";
        default:
            throw Error("untranslatable network name");
    }
};
class Blockchain {
    constructor(network) {
        const networkName = translateNetworkNameFromBSVJSToWoC(network);
        this.api = axios_1.default.create({
            baseURL: `https://api.whatsonchain.com/v1/bsv/${networkName}`,
        });
        // this.api.interceptors.request.use((req) => {
        //   console.log(`${req.method.toUpperCase()} ${req.baseURL}${req.url}`);
        //   console.log(req.data);
        //   return req;
        // });
    }
    static getNetwork(network) {
        return new Blockchain(network);
    }
    /**
     * @param address
     * @returns the balance at a given adress
     */
    getBalance(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.api.get(`/address/${address}/balance`);
            return data;
        });
    }
    /**
     * @param address
     * @returns
     */
    getBalancesFromAddresses(address) {
        return __awaiter(this, void 0, void 0, function* () {
            // il faut split en groupe de 20
            const chunks = (0, GroupBy_1.splitInGroupOf)(address, 20);
            let res = [];
            for (let addresses of chunks) {
                const { data } = yield this.api.post("/addresses/balance", {
                    addresses,
                });
                res = [...res, ...data];
            }
            return res;
        });
    }
    getAddressInfo(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.api.get(`/address/${address}/info`);
            return data;
        });
    }
    getBulkUTXO(addresses) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressesGroups = (0, GroupBy_1.splitInGroupOf)(addresses, 20);
            const allUTXO = [];
            let i = 0;
            for (let addresses of addressesGroups) {
                const { data: UTXOData } = yield this.api.post(`/addresses/unspent`, {
                    addresses,
                });
                for (let { unspent, address } of UTXOData) {
                    unspent.forEach((unspentOuput) => {
                        allUTXO.push(Object.assign(Object.assign({}, unspentOuput), { privateKeyIndex: i, ownerAddress: address }));
                    });
                    ++i;
                }
            }
            return allUTXO;
        });
    }
    getUnspendTxOuput(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                var { data } = yield this.api.get(`/address/${address}/unspent`);
            }
            catch (err) {
                console.log("error");
                console.log(err.response);
            }
            return data;
        });
    }
    broadcast(txhex) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.api.post(`/tx/raw`, { txhex });
                return data;
            }
            catch (err) {
                throw Error(err.response ? err.response.data : err);
            }
        });
    }
    getRawTx(txhash) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data } = yield this.api.get(`/tx/${txhash}/hex`);
                return data;
            }
            catch (err) {
                console.log(err.response.data);
            }
        });
    }
    getTxDetails(txHash) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.api.get(`tx/hash/${txHash}`);
            return data;
        });
    }
    getHistory(address) {
        return __awaiter(this, void 0, void 0, function* () {
            const { data } = yield this.api.get(`/address/${address}/history`);
            return data;
        });
    }
}
exports.default = Blockchain;

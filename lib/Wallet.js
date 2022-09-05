"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const bsv_1 = __importDefault(require("bsv"));
const address_1 = __importDefault(require("bsv/lib/address"));
const Blockchain_1 = __importDefault(require("./Blockchain"));
// * little helper function (a move dans un autre fichier)
const computeTotalInChunk = (data) => {
    return data.reduce((total, { balance: { confirmed, unconfirmed }, address: adr }) => {
        const localTotal = confirmed + unconfirmed;
        return localTotal + total;
    }, 0);
};
class BSVWallet extends HDPrivateKey_1.default {
    constructor(_a) {
        var { key = "", keyFormat = "mnemonic", language = "ENGLISH", network = "livenet" } = _a, options = __rest(_a, ["key", "keyFormat", "language", "network"]);
        super(Object.assign({ key, keyFormat, language, network }, options));
        this.lastUnusedAddressIndex = 10;
        this.blockchain = new Blockchain_1.default(network);
    }
    // * adresse ou on va recevoir
    getUnusedAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            // * TODO : FAIRE EN SORTE QUE LE PREMIER APPEL SOIT MOINS LONG
            do {
                var adr = this.getDerivatedAddress(++this.lastUnusedAddressIndex);
                var history = yield this.blockchain.getHistory(adr);
            } while (history.length > 0);
            return adr;
        });
    }
    // * will return an unused address
    getAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getUnusedAddress();
        });
    }
    /**
     * @param debitedAddressIndex index of the key to use in the wallet
     * @param amount amount of BTC to send
     * @returns tx encoded in hexadicimal format
     */
    signTxv1(debitedAddressIndex, recipientAdr, amount, changeAdr) {
        return __awaiter(this, void 0, void 0, function* () {
            changeAdr = !changeAdr ? yield this.getUnusedAddress() : changeAdr;
            const myAddress = this.getDerivatedAddress(debitedAddressIndex);
            const privKey = this.getDerivatedPrivateKey(debitedAddressIndex);
            const unspendTransactions = yield this.blockchain.getUnspendTxOuput(myAddress);
            const myInputs = [];
            for (let transaction of unspendTransactions) {
                // * récupérer son script en hexa depuis la blockchain
                const rawTxScript = yield this.blockchain.getRawTx(transaction["tx_hash"]);
                // * l'interpèter avec la lib
                const tx = new bsv_1.default.Transaction(rawTxScript);
                console.log({ tx });
                // * et extrait les utxo
                const data = tx.toObject();
                const { satoshis, script } = data.outputs[transaction.tx_pos]; // très exactement ça // pas sur pour le tx_pos
                myInputs.push({
                    txid: transaction.tx_hash,
                    satoshis: satoshis,
                    vout: transaction.tx_pos,
                    scriptPubKey: script,
                });
            }
            // * all the stuff above is garbage to understand juste focus on this
            const finalTx = new bsv_1.default.Transaction();
            finalTx.from(myInputs);
            finalTx.to(new address_1.default(recipientAdr), amount);
            finalTx.change(new address_1.default(changeAdr || myAddress));
            finalTx.sign(this._getPrivateKey(debitedAddressIndex));
            return finalTx.toString();
        });
    }
    /**
     * @param maxIndex this function with download the history of each derivated address from 0 to this
     * @returns
     */
    getUtxo(maxIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            // au cas ou cette fonction n'est jamais été appelée
            maxIndex || (yield this.getUnusedAddress());
            const numberOfAddressToCheck = maxIndex || this.lastUnusedAddressIndex + 3;
            const addresses = this.getAddresses(0, Math.max(numberOfAddressToCheck, 100));
            // * we will for all of the address of this wallet
            // * load it's utxo into an array
            const utxo = yield this.blockchain.getBulkUTXO(addresses);
            const allUTXO = utxo.map((utxo) => {
                const ownerAddress = this.getDerivatedAddress(utxo.privateKeyIndex);
                const improvedData = {
                    privKeyIndex: utxo.privateKeyIndex,
                    txId: utxo.tx_hash,
                    satoshis: utxo.value,
                    outputIndex: utxo.tx_pos,
                    script: bsv_1.default.Script(new address_1.default(ownerAddress)),
                    fromAddress: ownerAddress,
                    ownerAddress: utxo.ownerAddress,
                };
                return improvedData;
            });
            return allUTXO;
        });
    }
    signTx(output) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO : checker si le montant en utxo est disponible
            const tx = new bsv_1.default.Transaction();
            // * on charge les inputs
            const utxo = yield this.getUtxo();
            tx.from(utxo);
            // * on charge les ouputs
            if (Array.isArray(output)) {
                output.forEach(({ to: address, amount }) => tx.to(address, amount));
            }
            else {
                tx.to(output.to, output.amount);
            }
            // * ou oublie pas l'addresse de change
            const unusedAdr = yield this.getUnusedAddress();
            tx.change(unusedAdr);
            // * on récupères la clef privée qui correspond à chaque utxo
            const privateKeys = utxo.map((utxo) => this.getDerivatedPrivateKey(utxo.privKeyIndex));
            // TODO: prendre en compte les clefs privées en double dans cette liste
            // * et enfin on signe la transaction
            const txHex = tx.sign(privateKeys);
            return txHex.toString();
        });
    }
    /**
     * broadcast the transaction
     * equivalent of
     * ```js
     * wallet.blockchain.boardcast(txHex)
     * ```
     * @param txHex
     * @returns
     */
    broadcast(txHex) {
        return this.blockchain.broadcast(txHex);
    }
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            const utxo = yield this.getUtxo();
            console.log({ utxo });
            const totalSat = utxo.reduce((total, utxo) => total + utxo.satoshis, 0);
            // TODO: return confirmed et unconfirmed seperatly
            return totalSat;
        });
    }
}
exports.default = BSVWallet;

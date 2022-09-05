"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = __importDefault(require("bsv/lib/address"));
const hdprivatekey_1 = __importDefault(require("bsv/lib/hdprivatekey"));
const words_1 = __importDefault(require("bsv/lib/mnemonic/words"));
const mnemonic_1 = __importDefault(require("bsv/mnemonic"));
const Words = __importStar(require("bsv/lib/mnemonic/words/index.js"));
const HDPrivateKeyFromMnemonic = (key, language, network) => {
    const mnemonicObj = (0, mnemonic_1.default)(key, Words[language]);
    return hdprivatekey_1.default.fromSeed(mnemonicObj.toSeed(), network);
};
class HDPrivateKeyManager {
    constructor({ key, keyFormat, language, network }) {
        // * si il n'y a pas de clef on crée un nouveau wallet
        if (!key) {
            const mnemonic = mnemonic_1.default.fromRandom(Words[language]);
            this.masterHDPrivateKey = hdprivatekey_1.default.fromSeed(mnemonic.toSeed(), network);
            this.mnemonic = mnemonic.toString();
            return;
        }
        if (keyFormat == "seed") {
            // * c'est de la merde on peut pas recup le mnemonic avec ça
            this.masterHDPrivateKey = hdprivatekey_1.default.fromString(key);
        }
        if (keyFormat == "mnemonic") {
            const mnemonic = key;
            const privKey = HDPrivateKeyFromMnemonic(mnemonic, language, network);
            this.masterHDPrivateKey = privKey;
            this.mnemonic = mnemonic;
        }
        this.network = network;
    }
    /**
     * ------ Wrapper BSV.JS ----
     */
    _getPrivateKey(index) {
        return this.masterHDPrivateKey.deriveChild(`m/44'/${this.network == "testnet" ? 1 : 0}'/0'/0/${index}`, false).privateKey;
    }
    _getPublicKey(index) {
        return this._getPrivateKey(index).publicKey;
    }
    _getAddress(index) {
        return address_1.default.fromPublicKey(this._getPublicKey(index), this.network);
    }
    // * clean interface
    getDerivatedPublicKey(index) {
        return this._getPublicKey(index).toString();
    }
    getDerivatedPrivateKey(index) {
        return this._getPrivateKey(index).toString();
    }
    getDerivatedAddress(index) {
        return this._getAddress(index).toString();
    }
    getMnemonic(language = "ENGLISH") {
        if (!this.mnemonic) {
            throw new Error('you should create the private key instance from the "mnemonic" KeyFormat if you would like to use this feature');
        }
        if (language != "ENGLISH") {
            throw new Error("sorry mnemonic language other than english are not yet implemented");
        }
        // todo: changement de langage
        const wordList = words_1.default[language];
        return this.mnemonic;
    }
    /**
     * give out a range of adresses
     */
    getAddresses(start, end) {
        // * in case of wreid input
        if (end < start) {
            const tmp = start;
            start = end;
            end = tmp;
        }
        // console.log({ start, end });
        const addresses = [];
        for (let n = start; n <= end; ++n) {
            addresses.push(this.getDerivatedAddress(n));
        }
        return addresses;
    }
    toString() {
        return this.getMnemonic();
    }
}
exports.default = HDPrivateKeyManager;

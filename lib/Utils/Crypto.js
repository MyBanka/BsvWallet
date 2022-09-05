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
Object.defineProperty(exports, "__esModule", { value: true });
exports.adrToAdrHash = exports.sha256ripemd160 = exports.getTxId = void 0;
const bsv = __importStar(require("bsv"));
const getTxId = (tx_hex) => {
    const tx_buffer = Buffer.from(tx_hex, "hex");
    const hash_buff = bsv.crypto.Hash.sha256sha256(tx_buffer);
    const big_endian_str = hash_buff.toString("hex");
    const little_endian_str = big_endian_str.match(/../g).reverse().join("");
    return little_endian_str;
};
exports.getTxId = getTxId;
const sha256ripemd160 = (buffer) => {
    return bsv.crypto.sha256ripemd160(buffer);
};
exports.sha256ripemd160 = sha256ripemd160;
const adrToAdrHash = (adr) => {
    // * note:
    // adr: sha256ripemd160(
    //   Encoders.Base58StrToBuffer(adrAntho).toString("hex")
    // ),
    // ajouter les imports
    const Script = require("bsv/lib/script/script");
    const Address = require("bsv/lib/address");
    const script = Script.fromAddress(new Address(adr));
    const hashedAdr = script.toASM().split(" ")[2];
    return hashedAdr;
};
exports.adrToAdrHash = adrToAdrHash;

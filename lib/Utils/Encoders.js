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
exports.Base58StrToBuffer = exports.BufferToBase58 = void 0;
const bsv = __importStar(require("bsv"));
const base58_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const create_base58_map = () => {
    const base58M = Array(256).fill(-1);
    for (let i = 0; i < base58_chars.length; ++i)
        base58M[base58_chars.charCodeAt(i)] = i;
    return base58M;
};
const base58Map = create_base58_map();
const BufferToBase58 = (buff) => {
    const uint8array = buff.toJSON().data;
    const result = [];
    for (const byte of uint8array) {
        let carry = byte;
        for (let j = 0; j < result.length; ++j) {
            const x = (base58Map[result[j]] << 8) + carry;
            result[j] = base58_chars.charCodeAt(x % 58);
            carry = (x / 58) | 0;
        }
        while (carry) {
            result.push(base58_chars.charCodeAt(carry % 58));
            carry = (carry / 58) | 0;
        }
    }
    for (const byte of uint8array)
        if (byte)
            break;
        else
            result.push("1".charCodeAt(0));
    result.reverse();
    return String.fromCharCode(...result);
};
exports.BufferToBase58 = BufferToBase58;
const Base58StrToBuffer = (str) => {
    return bsv.encoding.Base58.decode(str);
};
exports.Base58StrToBuffer = Base58StrToBuffer;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalSatoshisInTxForAdr = exports.verifyTxTotalAmount = exports.getTotalSatoshisInUtxos = exports.getUtxos = exports.getTxUnspendOutput = void 0;
const Crypto_1 = require("./Crypto");
const bsv_1 = __importDefault(require("bsv"));
class Tx {
    addInput(input) { }
    addOutput(output) { }
    sign(keyOrKeys) {
        return "";
    }
}
/**
 * retourne les outputs d'une transaction
 * sous une forme qui permet de s'en servir comme donnée d'input
 * pour signer une transaction
 * depuis une tx en hexa
 * @param {string} tx_hex la tx en hexa
 */
const getTxUnspendOutput = (tx_hex, givenAdr) => {
    // TODO: checker si il y a pas une transaction dans le cache qui fait référence à celle si
    const tx = new bsv_1.default.Transaction(tx_hex);
    const outputsData = tx.toObject().outputs;
    // * à faire : fonction getTxOutputInfo qui fait très exactement ça
    const outputs = outputsData.map(({ satoshis, script }) => {
        const scriptData = new bsv_1.default.Script(script);
        const targetAdrHash = scriptData.toASM().split(" ")[2];
        return { satoshis, script, targetAdrHash };
    });
    const utxo = outputs.filter((txOutput) => txOutput.targetAdrHash == (0, Crypto_1.adrToAdrHash)(givenAdr));
    return utxo.map((tx, i) => {
        const { satoshis, script } = tx;
        // * je prend juste pas targetAdrHash & j'ajoute l'identifiant de la tx
        return { satoshis, script, txid: (0, Crypto_1.getTxId)(tx_hex), vout: i };
    });
};
exports.getTxUnspendOutput = getTxUnspendOutput;
/**
 * retourne les utxo dans une liste de transaction encodé en hexadécimal
 */
const getUtxos = (hex_txs, ofAdr) => {
    const utxoData = hex_txs.map((tx) => getTxUnspendOutput(tx, ofAdr));
    const utxo = utxoData.flatMap((e) => e);
    return utxo;
};
exports.getUtxos = getUtxos;
/**
 * retourne le montant total transferé à un adresse donnée à partir d'une liste de transaction
 */
const getTotalSatoshisInUtxos = (utxo) => {
    const totalSatoshis = utxo.reduce((total, nextUtxo) => total + nextUtxo.satoshis, 0);
    return totalSatoshis;
};
exports.getTotalSatoshisInUtxos = getTotalSatoshisInUtxos;
/**
 * retourne le montant en satoshis pour une adresse donnée dans une liste de tx
 */
const getTotalSatoshisInTxForAdr = (txs, adr) => {
    const utxoForThisAdr = getUtxos(txs, adr);
    return getTotalSatoshisInUtxos(utxoForThisAdr);
};
exports.getTotalSatoshisInTxForAdr = getTotalSatoshisInTxForAdr;
/**
 * verifie si un montant donnée à bien été transferé à une adresse donnée
 */
const verifyTxTotalAmount = (txs, requiredAmount, toAdr) => {
    const totalAmountOfSatoshisInTxs = getTotalSatoshisInTxForAdr(txs, toAdr);
    return totalAmountOfSatoshisInTxs >= requiredAmount;
};
exports.verifyTxTotalAmount = verifyTxTotalAmount;

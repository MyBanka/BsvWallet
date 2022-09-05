export declare type WoCUtxo = {
    satoshis: number;
    script: any;
    txid: string;
    vout: number;
};
/**
 * retourne les outputs d'une transaction
 * sous une forme qui permet de s'en servir comme donnée d'input
 * pour signer une transaction
 * depuis une tx en hexa
 * @param {string} tx_hex la tx en hexa
 */
declare const getTxUnspendOutput: (tx_hex: string, givenAdr: string) => Array<WoCUtxo>;
/**
 * retourne les utxo dans une liste de transaction encodé en hexadécimal
 */
declare const getUtxos: (hex_txs: string[], ofAdr: string) => WoCUtxo[];
/**
 * retourne le montant total transferé à un adresse donnée à partir d'une liste de transaction
 */
declare const getTotalSatoshisInUtxos: (utxo: WoCUtxo[]) => number;
/**
 * retourne le montant en satoshis pour une adresse donnée dans une liste de tx
 */
declare const getTotalSatoshisInTxForAdr: (txs: string[], adr: string) => number;
/**
 * verifie si un montant donnée à bien été transferé à une adresse donnée
 */
declare const verifyTxTotalAmount: (txs: string[], requiredAmount: number, toAdr: string) => boolean;
export { getTxUnspendOutput, getUtxos, getTotalSatoshisInUtxos, verifyTxTotalAmount, getTotalSatoshisInTxForAdr, };

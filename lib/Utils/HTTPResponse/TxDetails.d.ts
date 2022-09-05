export interface ScriptSig {
    asm: string;
    hex: string;
}
export interface Vin {
    txid: string;
    vout: number;
    scriptSig: ScriptSig;
    sequence: number;
    coinbase: string;
}
export interface ScriptPubKey {
    asm: string;
    hex: string;
    reqSigs: number;
    type: number;
    addresses: string[];
    opReturn?: any;
    isTruncated: boolean;
}
export interface Vout {
    value: number;
    n: number;
    scriptPubKey: ScriptPubKey;
}
export interface TxDetails {
    txid: string;
    hash: string;
    size: number;
    version: number;
    locktime: number;
    vin: Vin[];
    vout: Vout[];
    blockhash: string;
    confirmations: number;
    time: number;
    blocktime: number;
}

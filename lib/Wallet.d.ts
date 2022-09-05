import HDPrivateKeyManager, { WalletConstructorParams } from "./HDPrivateKey";
import Blockchain from "./Blockchain";
export declare type OutputRequest = {
    type: "normal" | "op return";
    to: string;
    amount: number;
    opReturnData: string;
};
export declare type UTXO = {
    privKeyIndex: number;
    txId: string;
    satoshis: number;
    outputIndex: number;
    script: any;
    ownerAddress: string;
};
declare class BSVWallet extends HDPrivateKeyManager {
    lastUnusedAddressIndex: number;
    blockchain: Blockchain;
    constructor({ key, keyFormat, language, network, ...options }: WalletConstructorParams);
    private getUnusedAddress;
    getAddress(): Promise<string>;
    /**
     * @param debitedAddressIndex index of the key to use in the wallet
     * @param amount amount of BTC to send
     * @returns tx encoded in hexadicimal format
     */
    private signTxv1;
    /**
     * @param maxIndex this function with download the history of each derivated address from 0 to this
     * @returns
     */
    getUtxo(maxIndex?: number): Promise<UTXO[]>;
    signTx(output: OutputRequest | OutputRequest[]): Promise<any>;
    /**
     * broadcast the transaction
     * equivalent of
     * ```js
     * wallet.blockchain.boardcast(txHex)
     * ```
     * @param txHex
     * @returns
     */
    broadcast(txHex: string): Promise<any>;
    getBalance(): Promise<number>;
}
export default BSVWallet;

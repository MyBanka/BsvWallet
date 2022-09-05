declare class TxCache {
    private transactions;
    constructor();
    importFromHex(hex_str: any): void;
    getUtxo(adr: string): import("./Utils/Tx").WoCUtxo[];
    getTxById(tx_hash: string): any;
    computeBalanceOf(address: any): void;
    /**
     * @returns all transaction in bsv object format
     */
    getAllTx(): any[];
    loadTransactionsFromLocalStorage(): any;
    /**
     * pour sauvegarder les instances dans le localStorage
     * @param {Transaction[]} txs
     */
    saveTransactionsIntoLocalStorage(txs: any): void;
}
declare const txCache: TxCache;
export default txCache;

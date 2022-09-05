import { BsvNetwork } from "./HDPrivateKey";
import AddressBalance from "./Utils/HTTPResponse/AddressBalance";
import { TxDetails } from "./Utils/HTTPResponse/TxDetails";
import { UnspendTransactionWoC } from "./Utils/HTTPResponse/UnspendTransaction";
import { AccountTxHistory } from "./Utils/TxHistory";
declare class Blockchain {
    private api;
    constructor(network: BsvNetwork);
    static getNetwork(network: BsvNetwork): Blockchain;
    /**
     * @param address
     * @returns the balance at a given adress
     */
    getBalance(address: string): Promise<AddressBalance>;
    /**
     * @param address
     * @returns
     */
    getBalancesFromAddresses(address: string[]): Promise<any[]>;
    getAddressInfo(address: string): Promise<any>;
    getBulkUTXO(addresses: string[]): Promise<{
        height: number;
        tx_pos: number;
        tx_hash: string;
        value: number;
        privateKeyIndex: number;
        ownerAddress: string;
    }[]>;
    getUnspendTxOuput(address: string): Promise<UnspendTransactionWoC[]>;
    broadcast(txhex: string): Promise<any>;
    getRawTx(txhash: any): Promise<string>;
    getTxDetails(txHash: any): Promise<TxDetails>;
    getHistory(address: string): Promise<AccountTxHistory>;
}
export default Blockchain;

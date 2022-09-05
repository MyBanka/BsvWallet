import { WoCUtxo } from "./Utils/Tx";
declare class BlochainCache {
    static getUnspendTxOuput(address: string): WoCUtxo[];
}
export default BlochainCache;

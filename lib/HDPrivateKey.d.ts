import { KeyFormat } from "./Utils/KeyFormat";
import MnemonicLanguage from "./Utils/MnemonicLanguages";
export declare type BsvNetwork = "testnet" | "livenet";
/**
 * in the mnemonic format
 */
declare type PrivateKeyString = string;
export declare type WalletConstructorParams = {
    key?: PrivateKeyString;
    network?: BsvNetwork;
    language?: MnemonicLanguage;
    keyFormat?: KeyFormat;
};
declare class HDPrivateKeyManager {
    private masterHDPrivateKey;
    private network;
    private mnemonic;
    constructor({ key, keyFormat, language, network }: WalletConstructorParams);
    /**
     * ------ Wrapper BSV.JS ----
     */
    protected _getPrivateKey(index: number): any;
    protected _getPublicKey(index: number): any;
    protected _getAddress(index: number): any;
    protected getDerivatedPublicKey(index: number): string;
    protected getDerivatedPrivateKey(index: number): string;
    protected getDerivatedAddress(index: number): string;
    getMnemonic(language?: MnemonicLanguage): string;
    /**
     * give out a range of adresses
     */
    getAddresses(start: number, end: number): string[];
    toString(): string;
}
export default HDPrivateKeyManager;

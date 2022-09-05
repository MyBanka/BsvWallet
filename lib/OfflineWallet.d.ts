import HDPrivateKeyManager, { WalletConstructorParams } from "./HDPrivateKey";
import Blockchain from "./Blockchain";
import { BlockchainCache } from ".";
declare class OfflineWallet extends HDPrivateKeyManager {
    private index;
    blockchain: Blockchain;
    cache: BlockchainCache;
    constructor({ key, keyFormat, language, network, ...options }: WalletConstructorParams);
    sync(): void;
    getBalance(start: number, end: number): number;
}
export default OfflineWallet;

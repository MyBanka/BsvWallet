/// <reference types="node" />
declare const getTxId: (tx_hex: any) => any;
declare const sha256ripemd160: (buffer: Buffer) => Buffer;
declare const adrToAdrHash: (adr: any) => any;
export { getTxId, sha256ripemd160, adrToAdrHash };

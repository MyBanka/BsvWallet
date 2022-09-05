/// <reference types="node" />
declare const BufferToBase58: (buff: Buffer) => string;
declare const Base58StrToBuffer: (str: string) => Buffer;
export { BufferToBase58, Base58StrToBuffer };

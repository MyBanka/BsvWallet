"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitInGroupOf = void 0;
// * pour faire des sortes de chunck d'addresses
const splitInGroupOf = (arr, chunkSize) => arr.reduce((chunks, newElement) => {
    const lastChunk = chunks[chunks.length - 1];
    if (lastChunk.length < chunkSize) {
        lastChunk.push(newElement);
    }
    else {
        chunks.push([newElement]);
    }
    return chunks;
}, [[]]);
exports.splitInGroupOf = splitInGroupOf;

import { Buffer } from '@craftzdog/react-native-buffer';
import type { BinaryLike, Encoding } from './utils';
export interface Blake3Options {
    dkLen?: number;
    key?: Uint8Array;
    context?: string;
}
export declare class Blake3 {
    private native;
    private mode;
    private keyData?;
    private contextData?;
    constructor(opts?: Blake3Options);
    update(data: BinaryLike, inputEncoding?: Encoding): this;
    digest(): Buffer;
    digest(encoding: Encoding): string;
    digest(length: number): Buffer;
    digestLength(length: number): Buffer;
    reset(): this;
    copy(): Blake3;
    static getVersion(): string;
}
export declare function createBlake3(opts?: Blake3Options): Blake3;
export declare function blake3(data: BinaryLike, opts?: Blake3Options): Uint8Array;
export declare namespace blake3 {
    var create: typeof createBlake3;
}
export declare const blake3Exports: {
    Blake3: typeof Blake3;
    createBlake3: typeof createBlake3;
    blake3: typeof blake3;
};
//# sourceMappingURL=blake3.d.ts.map
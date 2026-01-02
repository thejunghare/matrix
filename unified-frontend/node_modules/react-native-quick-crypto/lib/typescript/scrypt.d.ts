import { Buffer } from '@craftzdog/react-native-buffer';
import type { BinaryLike } from './utils';
type Password = BinaryLike;
type Salt = BinaryLike;
export interface ScryptOptions {
    N?: number;
    r?: number;
    p?: number;
    cost?: number;
    blockSize?: number;
    parallelization?: number;
    maxmem?: number;
}
type ScryptCallback = (err: Error | null, derivedKey?: Buffer) => void;
export declare function scrypt(password: Password, salt: Salt, keylen: number, options?: ScryptOptions | ScryptCallback, callback?: ScryptCallback): void;
export declare function scryptSync(password: Password, salt: Salt, keylen: number, options?: ScryptOptions): Buffer;
export {};
//# sourceMappingURL=scrypt.d.ts.map
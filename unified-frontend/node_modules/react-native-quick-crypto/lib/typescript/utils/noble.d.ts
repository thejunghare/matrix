import type { Hex } from './types';
/**
 * Takes hex string or Uint8Array, converts to Uint8Array.
 * Validates output length.
 * Will throw error for other types.
 * @param title descriptive title for an error e.g. 'private key'
 * @param hex hex string or Uint8Array
 * @param expectedLength optional, will compare to result array's length
 * @returns
 */
export declare function ensureBytes(title: string, hex: Hex, expectedLength?: number): Uint8Array;
/** Checks if something is Uint8Array. Be careful: nodejs Buffer will return true. */
export declare function isBytes(a: unknown): a is Uint8Array;
/**
 * Convert hex string to byte array. Uses built-in function, when available.
 * @example hexToBytes('cafe0123') // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
 */
export declare function hexToBytes(hex: string): Uint8Array;
//# sourceMappingURL=noble.d.ts.map
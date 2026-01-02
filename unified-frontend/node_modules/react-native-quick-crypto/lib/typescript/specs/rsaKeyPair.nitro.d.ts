import type { HybridObject } from 'react-native-nitro-modules';
interface KeyObject {
    extractable: boolean;
}
export interface RsaKeyPair extends HybridObject<{
    ios: 'c++';
    android: 'c++';
}> {
    generateKeyPair(): Promise<void>;
    generateKeyPairSync(): void;
    setModulusLength(modulusLength: number): void;
    setPublicExponent(publicExponent: ArrayBuffer): void;
    setHashAlgorithm(hashAlgorithm: string): void;
    importKey(format: string, keyData: ArrayBuffer, algorithm: string, extractable: boolean, keyUsages: string[]): KeyObject;
    exportKey(key: KeyObject, format: string): ArrayBuffer;
    getPublicKey(): ArrayBuffer;
    getPrivateKey(): ArrayBuffer;
}
export {};
//# sourceMappingURL=rsaKeyPair.nitro.d.ts.map
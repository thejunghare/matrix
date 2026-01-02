import type { MlDsaKeyPair } from './specs/mlDsaKeyPair.nitro';
import type { CryptoKeyPair, KeyUsage } from './utils';
export type MlDsaVariant = 'ML-DSA-44' | 'ML-DSA-65' | 'ML-DSA-87';
export declare class MlDsa {
    variant: MlDsaVariant;
    native: MlDsaKeyPair;
    constructor(variant: MlDsaVariant);
    generateKeyPair(): Promise<void>;
    generateKeyPairSync(): void;
    getPublicKey(): ArrayBuffer;
    getPrivateKey(): ArrayBuffer;
    sign(message: ArrayBuffer): Promise<ArrayBuffer>;
    signSync(message: ArrayBuffer): ArrayBuffer;
    verify(signature: ArrayBuffer, message: ArrayBuffer): Promise<boolean>;
    verifySync(signature: ArrayBuffer, message: ArrayBuffer): boolean;
}
export declare function mldsa_generateKeyPairWebCrypto(variant: MlDsaVariant, extractable: boolean, keyUsages: KeyUsage[]): Promise<CryptoKeyPair>;
//# sourceMappingURL=mldsa.d.ts.map
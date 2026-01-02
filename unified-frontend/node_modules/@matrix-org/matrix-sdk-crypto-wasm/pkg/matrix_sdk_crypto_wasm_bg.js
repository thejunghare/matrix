let wasm;
export function __wbg_set_wasm(val) {
    wasm = val;
}


let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

const lTextDecoder = typeof TextDecoder === 'undefined' ? (0, module.require)('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new lTextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return decodeText(ptr, len);
}

let WASM_VECTOR_LEN = 0;

const lTextEncoder = typeof TextEncoder === 'undefined' ? (0, module.require)('util').TextEncoder : TextEncoder;

const cachedTextEncoder = new lTextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_4.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function makeClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        try {
            return f(state.a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b);
                state.a = 0;
                CLOSURE_DTORS.unregister(state);
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_4.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

function passArrayJsValueToWasm0(array, malloc) {
    const ptr = malloc(array.length * 4, 4) >>> 0;
    for (let i = 0; i < array.length; i++) {
        const add = addToExternrefTable0(array[i]);
        getDataViewMemory0().setUint32(ptr + 4 * i, add, true);
    }
    WASM_VECTOR_LEN = array.length;
    return ptr;
}

function getArrayJsValueFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    const mem = getDataViewMemory0();
    const result = [];
    for (let i = ptr; i < ptr + 4 * len; i += 4) {
        result.push(wasm.__wbindgen_export_4.get(mem.getUint32(i, true)));
    }
    wasm.__externref_drop_slice(ptr, len);
    return result;
}

let cachedUint16ArrayMemory0 = null;

function getUint16ArrayMemory0() {
    if (cachedUint16ArrayMemory0 === null || cachedUint16ArrayMemory0.byteLength === 0) {
        cachedUint16ArrayMemory0 = new Uint16Array(wasm.memory.buffer);
    }
    return cachedUint16ArrayMemory0;
}

function getArrayU16FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint16ArrayMemory0().subarray(ptr / 2, ptr / 2 + len);
}
/**
 * Get the versions of the Rust libraries we are using.
 * @returns {Versions}
 */
export function getVersions() {
    const ret = wasm.getVersions();
    return Versions.__wrap(ret);
}

/**
 * Run some stuff when the Wasm module is instantiated.
 *
 * Right now, it does the following:
 *
 * * Redirect Rust panics to JavaScript console.
 */
export function start() {
    wasm.start();
}

function __wbg_adapter_58(arg0, arg1, arg2) {
    const ret = wasm.closure41_externref_shim_multivalue_shim(arg0, arg1, arg2);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function __wbg_adapter_61(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__h8861d869601ff522(arg0, arg1);
}

function __wbg_adapter_64(arg0, arg1, arg2) {
    wasm.closure756_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_67(arg0, arg1, arg2) {
    wasm.closure438_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_70(arg0, arg1) {
    wasm.wasm_bindgen__convert__closures_____invoke__hce61fd14ea1a6ce1(arg0, arg1);
}

function __wbg_adapter_836(arg0, arg1, arg2, arg3) {
    wasm.closure451_externref_shim(arg0, arg1, arg2, arg3);
}

/**
 * Decryption error codes
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6 | 7}
 */
export const DecryptionErrorCode = Object.freeze({
    /**
     * The room key is not known
     */
    MissingRoomKey: 0, "0": "MissingRoomKey",
    /**
     * The room key is known but ratcheted
     */
    UnknownMessageIndex: 1, "1": "UnknownMessageIndex",
    /**
     * Decryption failed because of a mismatch between the identity keys of the
     * device we received the room key from and the identity keys recorded in
     * the plaintext of the room key to-device message.
     */
    MismatchedIdentityKeys: 2, "2": "MismatchedIdentityKeys",
    /**
     * We weren't able to link the message back to any known device.
     */
    UnknownSenderDevice: 3, "3": "UnknownSenderDevice",
    /**
     * The sender device is not cross-signed.
     */
    UnsignedSenderDevice: 4, "4": "UnsignedSenderDevice",
    /**
     * The sender's identity is unverified, but was previously verified.
     */
    SenderIdentityVerificationViolation: 5, "5": "SenderIdentityVerificationViolation",
    /**
     * Other failure.
     */
    UnableToDecrypt: 6, "6": "UnableToDecrypt",
    /**
     * The `sender` field on the event does not match the owner of the device
     * that established the Megolm session.
     */
    MismatchedSender: 7, "7": "MismatchedSender",
});
/**
 * The basic key algorithm names in the specification.
 * @enum {0 | 1 | 3}
 */
export const DeviceKeyAlgorithmName = Object.freeze({
    /**
     * The Ed25519 signature algorithm.
     */
    Ed25519: 0, "0": "Ed25519",
    /**
     * The Curve25519 ECDH algorithm.
     */
    Curve25519: 1, "1": "Curve25519",
    /**
     * An unknown device key algorithm.
     */
    Unknown: 3, "3": "Unknown",
});
/**
 * An enum over the different key types a device can have.
 *
 * Currently devices have a curve25519 and ed25519 keypair. The keys
 * transport format is a base64 encoded string, any unknown key type
 * will be left as such a string.
 * @enum {0 | 1 | 2}
 */
export const DeviceKeyName = Object.freeze({
    /**
     * The curve25519 device key.
     */
    Curve25519: 0, "0": "Curve25519",
    /**
     * The ed25519 device key.
     */
    Ed25519: 1, "1": "Ed25519",
    /**
     * An unknown device key.
     */
    Unknown: 2, "2": "Unknown",
});
/**
 * An encryption algorithm to be used to encrypt messages sent to a
 * room.
 * @enum {0 | 1 | 2}
 */
export const EncryptionAlgorithm = Object.freeze({
    /**
     * Olm version 1 using Curve25519, AES-256, and SHA-256.
     */
    OlmV1Curve25519AesSha2: 0, "0": "OlmV1Curve25519AesSha2",
    /**
     * Megolm version 1 using AES-256 and SHA-256.
     */
    MegolmV1AesSha2: 1, "1": "MegolmV1AesSha2",
    /**
     * Unsupported algorithm.
     *
     * Applications should ignore this value if it is received, and should
     * never set it.
     */
    Unknown: 2, "2": "Unknown",
});
/**
 * Who can see a room's history.
 * @enum {0 | 1 | 2 | 3}
 */
export const HistoryVisibility = Object.freeze({
    /**
     * Previous events are accessible to newly joined members from
     * the point they were invited onwards.
     *
     * Events stop being accessible when the member's state changes
     * to something other than *invite* or *join*.
     */
    Invited: 0, "0": "Invited",
    /**
     * Previous events are accessible to newly joined members from
     * the point they joined the room onwards.
     *
     * Events stop being accessible when the member's state changes
     * to something other than *join*.
     */
    Joined: 1, "1": "Joined",
    /**
     * Previous events are always accessible to newly joined members.
     *
     * All events in the room are accessible, even those sent when
     * the member was not a part of the room.
     */
    Shared: 2, "2": "Shared",
    /**
     * All events while this is the `HistoryVisibility` value may be
     * shared by any participating homeserver with anyone, regardless
     * of whether they have ever joined the room.
     */
    WorldReadable: 3, "3": "WorldReadable",
});
/**
 * The local trust state of a device.
 * @enum {0 | 1 | 2 | 3}
 */
export const LocalTrust = Object.freeze({
    /**
     * The device has been verified and is trusted.
     */
    Verified: 0, "0": "Verified",
    /**
     * The device been blacklisted from communicating.
     */
    BlackListed: 1, "1": "BlackListed",
    /**
     * The trust state of the device is being ignored.
     */
    Ignored: 2, "2": "Ignored",
    /**
     * The trust state is unset.
     */
    Unset: 3, "3": "Unset",
});
/**
 * Logger level.
 * @enum {0 | 1 | 2 | 3 | 4}
 */
export const LoggerLevel = Object.freeze({
    /**
     * `TRACE` level.
     *
     * Designate very low priority, often extremely verbose,
     * information.
     */
    Trace: 0, "0": "Trace",
    /**
     * `DEBUG` level.
     *
     * Designate lower priority information.
     */
    Debug: 1, "1": "Debug",
    /**
     * `INFO` level.
     *
     * Designate useful information.
     */
    Info: 2, "2": "Info",
    /**
     * `WARN` level.
     *
     * Designate hazardous situations.
     */
    Warn: 3, "3": "Warn",
    /**
     * `ERROR` level.
     *
     * Designate very serious errors.
     */
    Error: 4, "4": "Error",
});
/**
 * The type of a {@link ProcessedToDeviceEvent}.
 * @enum {0 | 1 | 2 | 3}
 */
export const ProcessedToDeviceEventType = Object.freeze({
    /**
     * A successfully-decrypted encrypted to-device message.
     */
    Decrypted: 0, "0": "Decrypted",
    /**
     * An encrypted to-device message which could not be decrypted.
     */
    UnableToDecrypt: 1, "1": "UnableToDecrypt",
    /**
     * An unencrypted to-device message (sent in clear).
     */
    PlainText: 2, "2": "PlainText",
    /**
     * An invalid to-device message that was ignored because it is missing some
     * required information to be processed (like no event `type` for
     * example)
     */
    Invalid: 3, "3": "Invalid",
});
/**
 * The mode of the QR code login.
 *
 * The QR code login mechanism supports both, the new device, as well as the
 * existing device to display the QR code.
 *
 * The different modes have an explicit one-byte identifier which gets added to
 * the QR code data.
 * @enum {0 | 1}
 */
export const QrCodeMode = Object.freeze({
    /**
     * The new device is displaying the QR code.
     */
    Login: 0, "0": "Login",
    /**
     * The existing device is displaying the QR code.
     */
    Reciprocate: 1, "1": "Reciprocate",
});
/**
 * List of `Qr` states
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const QrState = Object.freeze({
    /**
     * We have received the other device's details (from the
     * `m.key.verification.request` or `m.key.verification.ready`) and
     * established the shared secret, so can
     * display the QR code.
     */
    Created: 0, "0": "Created",
    /**
     * The other side has scanned our QR code and sent an
     * `m.key.verification.start` message with `method: m.reciprocate.v1` with
     * matching shared secret.
     */
    Scanned: 1, "1": "Scanned",
    /**
     * Our user has confirmed that the other device scanned successfully. We
     * have sent an `m.key.verification.done`.
     */
    Confirmed: 2, "2": "Confirmed",
    /**
     * We have scanned the other side's QR code and are able to send a
     * `m.key.verification.start` message with `method: m.reciprocate.v1`.
     *
     * Call `Qr::reciprocate` to build the start message.
     *
     * Note that, despite the name of this state, we have not necessarily
     * yet sent the `m.reciprocate.v1` message.
     */
    Reciprocated: 3, "3": "Reciprocated",
    /**
     * Verification complete: we have received an `m.key.verification.done`
     * from the other side.
     */
    Done: 4, "4": "Done",
    /**
     * Verification cancelled or failed.
     */
    Cancelled: 5, "5": "Cancelled",
});
/**
 * Represent the type of a request.
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6}
 */
export const RequestType = Object.freeze({
    /**
     * Represents a `KeysUploadRequest`.
     */
    KeysUpload: 0, "0": "KeysUpload",
    /**
     * Represents a `KeysQueryRequest`.
     */
    KeysQuery: 1, "1": "KeysQuery",
    /**
     * Represents a `KeysClaimRequest`.
     */
    KeysClaim: 2, "2": "KeysClaim",
    /**
     * Represents a `ToDeviceRequest`.
     */
    ToDevice: 3, "3": "ToDevice",
    /**
     * Represents a `SignatureUploadRequest`.
     */
    SignatureUpload: 4, "4": "SignatureUpload",
    /**
     * Represents a `RoomMessageRequest`.
     */
    RoomMessage: 5, "5": "RoomMessage",
    /**
     * Represents a `KeysBackupRequest`.
     */
    KeysBackup: 6, "6": "KeysBackup",
});
/**
 * Take a look at [`matrix_sdk_common::deserialized_responses::ShieldState`]
 * for more info.
 * @enum {0 | 1 | 2}
 */
export const ShieldColor = Object.freeze({
    /**
     * Important warning
     */
    Red: 0, "0": "Red",
    /**
     * Low warning
     */
    Grey: 1, "1": "Grey",
    /**
     * No warning
     */
    None: 2, "2": "None",
});
/**
 * A machine-readable representation of the authenticity for a `ShieldState`.
 * @enum {0 | 1 | 2 | 3 | 4 | 5 | 6}
 */
export const ShieldStateCode = Object.freeze({
    /**
     * Not enough information available to check the authenticity.
     */
    AuthenticityNotGuaranteed: 0, "0": "AuthenticityNotGuaranteed",
    /**
     * The sending device isn't yet known by the Client.
     */
    UnknownDevice: 1, "1": "UnknownDevice",
    /**
     * The sending device hasn't been verified by the sender.
     */
    UnsignedDevice: 2, "2": "UnsignedDevice",
    /**
     * The sender hasn't been verified by the Client's user.
     */
    UnverifiedIdentity: 3, "3": "UnverifiedIdentity",
    /**
     * An unencrypted event in an encrypted room.
     */
    SentInClear: 4, "4": "SentInClear",
    /**
     * The sender was previously verified but changed their identity.
     */
    VerificationViolation: 5, "5": "VerificationViolation",
    /**
     * The `sender` field on the event does not match the owner of the device
     * that established the Megolm session.
     */
    MismatchedSender: 6, "6": "MismatchedSender",
});
/**
 * The result of a signature check.
 * @enum {0 | 1 | 2 | 3}
 */
export const SignatureState = Object.freeze({
    /**
     * The signature is missing.
     */
    Missing: 0, "0": "Missing",
    /**
     * The signature is invalid.
     */
    Invalid: 1, "1": "Invalid",
    /**
     * The signature is valid but the device or user identity that created the
     * signature is not trusted.
     */
    ValidButNotTrusted: 2, "2": "ValidButNotTrusted",
    /**
     * The signature is valid and the device or user identity that created the
     * signature is trusted.
     */
    ValidAndTrusted: 3, "3": "ValidAndTrusted",
});
/**
 * Reason code for a to-device decryption failure
 * @enum {0 | 1 | 2 | 3}
 */
export const ToDeviceUnableToDecryptReason = Object.freeze({
    /**
     * An error occurred while encrypting the event. This covers all
     * `OlmError` types.
     */
    DecryptionFailure: 0, "0": "DecryptionFailure",
    /**
     * We refused to decrypt the message because the sender's device is not
     * verified, or more generally, the sender's identity did not match the
     * trust requirement we were asked to provide.
     */
    UnverifiedSenderDevice: 1, "1": "UnverifiedSenderDevice",
    /**
     * We have no `OlmMachine`. This should not happen unless we forget to set
     * things up by calling `OlmMachine::activate()`.
     */
    NoOlmMachine: 2, "2": "NoOlmMachine",
    /**
     * The Matrix SDK was compiled without encryption support.
     */
    EncryptionIsDisabled: 3, "3": "EncryptionIsDisabled",
});
/**
 * The trust level required to decrypt an event
 * @enum {0 | 1 | 2}
 */
export const TrustRequirement = Object.freeze({
    /**
     * Decrypt events from everyone regardless of trust
     */
    Untrusted: 0, "0": "Untrusted",
    /**
     * Only decrypt events from cross-signed or legacy devices
     */
    CrossSignedOrLegacy: 1, "1": "CrossSignedOrLegacy",
    /**
     * Only decrypt events from cross-signed devices
     */
    CrossSigned: 2, "2": "CrossSigned",
});
/**
 * List of available verification methods.
 * @enum {0 | 1 | 2 | 3}
 */
export const VerificationMethod = Object.freeze({
    /**
     * The `m.sas.v1` verification method.
     *
     * SAS means Short Authentication String.
     */
    SasV1: 0, "0": "SasV1",
    /**
     * The `m.qr_code.scan.v1` verification method.
     */
    QrCodeScanV1: 1, "1": "QrCodeScanV1",
    /**
     * The `m.qr_code.show.v1` verification method.
     */
    QrCodeShowV1: 2, "2": "QrCodeShowV1",
    /**
     * The `m.reciprocate.v1` verification method.
     */
    ReciprocateV1: 3, "3": "ReciprocateV1",
});
/**
 * List of VerificationRequestState phases
 * @enum {0 | 1 | 2 | 3 | 4 | 5}
 */
export const VerificationRequestPhase = Object.freeze({
    /**
     * The verification request has been newly created by us.
     */
    Created: 0, "0": "Created",
    /**
     * The verification request was received from the other party.
     */
    Requested: 1, "1": "Requested",
    /**
     * The verification request is ready to start a verification flow.
     */
    Ready: 2, "2": "Ready",
    /**
     * The verification request has transitioned into a concrete verification
     * flow. For example it transitioned into the emoji based SAS
     * verification.
     */
    Transitioned: 3, "3": "Transitioned",
    /**
     * The verification flow that was started with this request has finished.
     */
    Done: 4, "4": "Done",
    /**
     * The verification process has been cancelled.
     */
    Cancelled: 5, "5": "Cancelled",
});

const __wbindgen_enum_IdbRequestReadyState = ["pending", "done"];

const __wbindgen_enum_IdbTransactionMode = ["readonly", "readwrite", "versionchange", "readwriteflush", "cleanup"];

const AttachmentFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_attachment_free(ptr >>> 0, 1));
/**
 * A type to encrypt and to decrypt anything that can fit in an
 * `Uint8Array`, usually big buffer.
 */
export class Attachment {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        AttachmentFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_attachment_free(ptr, 0);
    }
    /**
     * Encrypt the content of the `Uint8Array`.
     *
     * It produces an `EncryptedAttachment`, which can be used to
     * retrieve the media encryption information, or the encrypted
     * data.
     * @param {Uint8Array} array
     * @returns {EncryptedAttachment}
     */
    static encrypt(array) {
        const ptr0 = passArray8ToWasm0(array, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.attachment_encrypt(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return EncryptedAttachment.__wrap(ret[0]);
    }
    /**
     * Decrypt an `EncryptedAttachment`.
     *
     * The encrypted attachment can be created manually, or from the
     * `encrypt` method.
     *
     * **Warning**: The encrypted attachment can be used only
     * **once**! The encrypted data will still be present, but the
     * media encryption info (which contain secrets) will be
     * destroyed. It is still possible to get a JSON-encoded backup
     * by calling `EncryptedAttachment.mediaEncryptionInfo`.
     * @param {EncryptedAttachment} attachment
     * @returns {Uint8Array}
     */
    static decrypt(attachment) {
        _assertClass(attachment, EncryptedAttachment);
        const ret = wasm.attachment_decrypt(attachment.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}

const BackupDecryptionKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_backupdecryptionkey_free(ptr >>> 0, 1));
/**
 * The private part of the backup key, the one used for recovery.
 */
export class BackupDecryptionKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BackupDecryptionKey.prototype);
        obj.__wbg_ptr = ptr;
        BackupDecryptionKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BackupDecryptionKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_backupdecryptionkey_free(ptr, 0);
    }
    /**
     * Create a new random [`BackupDecryptionKey`].
     * @returns {BackupDecryptionKey}
     */
    static createRandomKey() {
        const ret = wasm.backupdecryptionkey_createRandomKey();
        return BackupDecryptionKey.__wrap(ret);
    }
    /**
     * Try to create a [`BackupDecryptionKey`] from a base 64 encoded string.
     * @param {string} key
     * @returns {BackupDecryptionKey}
     */
    static fromBase64(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.backupdecryptionkey_fromBase64(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return BackupDecryptionKey.__wrap(ret[0]);
    }
    /**
     * Convert the backup decryption key to a base 64 encoded string.
     * @returns {string}
     */
    toBase64() {
        const ret = wasm.backupdecryptionkey_toBase64(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the public part of the backup key.
     * @returns {MegolmV1BackupKey}
     */
    get megolmV1PublicKey() {
        const ret = wasm.backupdecryptionkey_megolmV1PublicKey(this.__wbg_ptr);
        return MegolmV1BackupKey.__wrap(ret);
    }
    /**
     * Try to decrypt a message that was encrypted using the public part of the
     * backup key.
     * @param {string} ephemeral_key
     * @param {string} mac
     * @param {string} ciphertext
     * @returns {string}
     */
    decryptV1(ephemeral_key, mac, ciphertext) {
        let deferred5_0;
        let deferred5_1;
        try {
            const ptr0 = passStringToWasm0(ephemeral_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(mac, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ptr2 = passStringToWasm0(ciphertext, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len2 = WASM_VECTOR_LEN;
            const ret = wasm.backupdecryptionkey_decryptV1(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
            var ptr4 = ret[0];
            var len4 = ret[1];
            if (ret[3]) {
                ptr4 = 0; len4 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred5_0 = ptr4;
            deferred5_1 = len4;
            return getStringFromWasm0(ptr4, len4);
        } finally {
            wasm.__wbindgen_free(deferred5_0, deferred5_1, 1);
        }
    }
}

const BackupKeysFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_backupkeys_free(ptr >>> 0, 1));
/**
 * Stored versions of the backup keys.
 */
export class BackupKeys {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BackupKeys.prototype);
        obj.__wbg_ptr = ptr;
        BackupKeysFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BackupKeysFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_backupkeys_free(ptr, 0);
    }
    /**
     * The key used to decrypt backed up room keys
     * @returns {BackupDecryptionKey | undefined}
     */
    get decryptionKey() {
        const ret = wasm.__wbg_get_backupkeys_decryptionKey(this.__wbg_ptr);
        return ret === 0 ? undefined : BackupDecryptionKey.__wrap(ret);
    }
    /**
     * The key used to decrypt backed up room keys
     * @param {BackupDecryptionKey | null} [arg0]
     */
    set decryptionKey(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, BackupDecryptionKey);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_backupkeys_decryptionKey(this.__wbg_ptr, ptr0);
    }
    /**
     * The version that we are using for backups.
     * @returns {string | undefined}
     */
    get backupVersion() {
        const ret = wasm.__wbg_get_backupkeys_backupVersion(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The version that we are using for backups.
     * @param {string | null} [arg0]
     */
    set backupVersion(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupkeys_backupVersion(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The key used to decrypt backed up room keys, encoded as base64
     *
     * @deprecated Use `BackupKeys.decryptionKey.toBase64()`
     * @returns {string | undefined}
     */
    get decryptionKeyBase64() {
        const ret = wasm.backupkeys_decryptionKeyBase64(this.__wbg_ptr);
        return ret;
    }
}

const BackupSecretsBundleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_backupsecretsbundle_free(ptr >>> 0, 1));
/**
 * The backup-specific parts of a secrets bundle.
 */
export class BackupSecretsBundle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(BackupSecretsBundle.prototype);
        obj.__wbg_ptr = ptr;
        BackupSecretsBundleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BackupSecretsBundleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_backupsecretsbundle_free(ptr, 0);
    }
    /**
     * The backup decryption key, encoded as unpadded base64.
     * @returns {string}
     */
    get key() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_backupsecretsbundle_key(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The backup decryption key, encoded as unpadded base64.
     * @param {string} arg0
     */
    set key(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The backup version which this backup decryption key is used with.
     * @returns {string}
     */
    get backup_version() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_backupsecretsbundle_backup_version(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The backup version which this backup decryption key is used with.
     * @param {string} arg0
     */
    set backup_version(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_backup_version(this.__wbg_ptr, ptr0, len0);
    }
}

const Base64EncodedPkMessageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_base64encodedpkmessage_free(ptr >>> 0, 1));
/**
 * The base64-encoded variant of a {@link PkMessage}.
 *
 * This can be useful if the encrypted message should be put into JSON.
 */
export class Base64EncodedPkMessage {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Base64EncodedPkMessage.prototype);
        obj.__wbg_ptr = ptr;
        Base64EncodedPkMessageFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Base64EncodedPkMessageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_base64encodedpkmessage_free(ptr, 0);
    }
    /**
     * The base64-encoded ciphertext.
     * @returns {string}
     */
    get ciphertext() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_base64encodedpkmessage_ciphertext(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The base64-encoded ciphertext.
     * @param {string} arg0
     */
    set ciphertext(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The base64-encoded message authentication code (MAC).
     * @returns {string}
     */
    get mac() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_base64encodedpkmessage_mac(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The base64-encoded message authentication code (MAC).
     * @param {string} arg0
     */
    set mac(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_backup_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The base64-encoded ephemeral public key.
     * @returns {string}
     */
    get ephemeralKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_base64encodedpkmessage_ephemeralKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The base64-encoded ephemeral public key.
     * @param {string} arg0
     */
    set ephemeralKey(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_base64encodedpkmessage_ephemeralKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Creates a new base64-encoded encrypted message from its parts.
     * @param {string} ciphertext
     * @param {string} mac
     * @param {string} ephemeral_key
     */
    constructor(ciphertext, mac, ephemeral_key) {
        const ptr0 = passStringToWasm0(ciphertext, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(mac, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(ephemeral_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.base64encodedpkmessage_new(ptr0, len0, ptr1, len1, ptr2, len2);
        this.__wbg_ptr = ret >>> 0;
        Base64EncodedPkMessageFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const BaseMigrationDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_basemigrationdata_free(ptr >>> 0, 1));
/**
 * The base dataset that is important to migrate to the Rust SDK.
 *
 * Can be imported into the rust store with {@link Migration::migrateBaseData}.
 */
export class BaseMigrationData {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        BaseMigrationDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_basemigrationdata_free(ptr, 0);
    }
    /**
     * The user id of the account owner.
     * @returns {UserId | undefined}
     */
    get userId() {
        const ret = wasm.__wbg_get_basemigrationdata_userId(this.__wbg_ptr);
        return ret === 0 ? undefined : UserId.__wrap(ret);
    }
    /**
     * The user id of the account owner.
     * @param {UserId | null} [arg0]
     */
    set userId(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, UserId);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_basemigrationdata_userId(this.__wbg_ptr, ptr0);
    }
    /**
     * The device ID of the account owner.
     * @returns {DeviceId | undefined}
     */
    get deviceId() {
        const ret = wasm.__wbg_get_basemigrationdata_deviceId(this.__wbg_ptr);
        return ret === 0 ? undefined : DeviceId.__wrap(ret);
    }
    /**
     * The device ID of the account owner.
     * @param {DeviceId | null} [arg0]
     */
    set deviceId(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, DeviceId);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_basemigrationdata_deviceId(this.__wbg_ptr, ptr0);
    }
    /**
     * The pickle string holding the Olm Account, as returned by
     * `olm_pickle_account` in libolm.
     * @returns {string}
     */
    get pickledAccount() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_basemigrationdata_pickledAccount(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The pickle string holding the Olm Account, as returned by
     * `olm_pickle_account` in libolm.
     * @param {string} arg0
     */
    set pickledAccount(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The backup version that is currently active.
     * @returns {string | undefined}
     */
    get backupVersion() {
        const ret = wasm.__wbg_get_basemigrationdata_backupVersion(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The backup version that is currently active.
     * @param {string | null} [arg0]
     */
    set backupVersion(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_basemigrationdata_backupVersion(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The backup recovery key, as a base64-encoded string.
     * @returns {string | undefined}
     */
    get backupRecoveryKey() {
        const ret = wasm.__wbg_get_basemigrationdata_backupRecoveryKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The backup recovery key, as a base64-encoded string.
     * @param {string | null} [arg0]
     */
    set backupRecoveryKey(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_basemigrationdata_backupRecoveryKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The private, base64-encoded, master cross-signing key.
     * @returns {string | undefined}
     */
    get privateCrossSigningMasterKey() {
        const ret = wasm.__wbg_get_basemigrationdata_privateCrossSigningMasterKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The private, base64-encoded, master cross-signing key.
     * @param {string | null} [arg0]
     */
    set privateCrossSigningMasterKey(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_basemigrationdata_privateCrossSigningMasterKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The private, base64-encoded, self-signing key.
     * @returns {string | undefined}
     */
    get privateCrossSigningSelfSigningKey() {
        const ret = wasm.__wbg_get_basemigrationdata_privateCrossSigningSelfSigningKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The private, base64-encoded, self-signing key.
     * @param {string | null} [arg0]
     */
    set privateCrossSigningSelfSigningKey(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_basemigrationdata_privateCrossSigningSelfSigningKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The private, base64-encoded, user-signing key.
     * @returns {string | undefined}
     */
    get privateCrossSigningUserSigningKey() {
        const ret = wasm.__wbg_get_basemigrationdata_privateCrossSigningUserSigningKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The private, base64-encoded, user-signing key.
     * @param {string | null} [arg0]
     */
    set privateCrossSigningUserSigningKey(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_basemigrationdata_privateCrossSigningUserSigningKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Create a new `BaseMigrationData` with default values.
     */
    constructor() {
        const ret = wasm.basemigrationdata_new();
        this.__wbg_ptr = ret >>> 0;
        BaseMigrationDataFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const CancelInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cancelinfo_free(ptr >>> 0, 1));
/**
 * Information about the cancellation of a verification request or
 * verification flow.
 */
export class CancelInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CancelInfo.prototype);
        obj.__wbg_ptr = ptr;
        CancelInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CancelInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cancelinfo_free(ptr, 0);
    }
    /**
     * Get the human readable reason of the cancellation.
     * @returns {string}
     */
    reason() {
        const ret = wasm.cancelinfo_reason(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the `code` (e.g. `m.user`) that was used to cancel the
     * verification.
     * @returns {string}
     */
    cancelCode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.cancelinfo_cancelCode(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Was the verification cancelled by us?
     * @returns {boolean}
     */
    cancelledbyUs() {
        const ret = wasm.cancelinfo_cancelledbyUs(this.__wbg_ptr);
        return ret !== 0;
    }
}

const CheckCodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_checkcode_free(ptr >>> 0, 1));
/**
 * A check code that can be used to confirm that two [`EstablishedEcies`]
 * objects share the same secret. This is supposed to be shared out-of-band to
 * protect against active Man-in-the-middle (MITM) attacks.
 *
 * Since the initiator device can always tell whether a MITM attack is in
 * progress after channel establishment, this code technically carries only a
 * single bit of information, representing whether the initiator has determined
 * that the channel is "secure" or "not secure".
 *
 * However, given this will need to be interactively confirmed by the user,
 * there is risk that the user would confirm the dialogue without paying
 * attention to its content. By expanding this single bit into a deterministic
 * two-digit check code, the user is forced to pay more attention by having to
 * enter it instead of just clicking through a dialogue.
 */
export class CheckCode {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CheckCode.prototype);
        obj.__wbg_ptr = ptr;
        CheckCodeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CheckCodeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_checkcode_free(ptr, 0);
    }
    /**
     * Convert the check code to an array of two bytes.
     *
     * The bytes can be converted to a more user-friendly representation. The
     * [`CheckCode::to_digit`] converts the bytes to a two-digit number.
     * @returns {Uint8Array}
     */
    as_bytes() {
        const ret = wasm.checkcode_as_bytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Convert the check code to two base-10 numbers.
     *
     * The number should be displayed with a leading 0 in case the first digit
     * is a 0.
     * @returns {number}
     */
    to_digit() {
        const ret = wasm.checkcode_to_digit(this.__wbg_ptr);
        return ret;
    }
}

const CollectStrategyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_collectstrategy_free(ptr >>> 0, 1));
/**
 * Strategy to collect the devices that should receive room keys for the
 * current discussion.
 */
export class CollectStrategy {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CollectStrategy.prototype);
        obj.__wbg_ptr = ptr;
        CollectStrategyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CollectStrategyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_collectstrategy_free(ptr, 0);
    }
    /**
     * Tests for equality between two [`CollectStrategy`]s.
     * @param {CollectStrategy} other
     * @returns {boolean}
     */
    eq(other) {
        _assertClass(other, CollectStrategy);
        const ret = wasm.collectstrategy_eq(this.__wbg_ptr, other.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Device based sharing strategy.
     *
     * @deprecated: use one of {@link allDevices}, {@link
     * errorOnUnverifiedUserProblem} or {@link onlyTrustedDevices}.
     * @param {boolean} only_allow_trusted_devices
     * @param {boolean} error_on_verified_user_problem
     * @returns {CollectStrategy}
     */
    static deviceBasedStrategy(only_allow_trusted_devices, error_on_verified_user_problem) {
        const ret = wasm.collectstrategy_deviceBasedStrategy(only_allow_trusted_devices, error_on_verified_user_problem);
        return CollectStrategy.__wrap(ret);
    }
    /**
     * Share with all (unblacklisted) devices.
     * @returns {CollectStrategy}
     */
    static allDevices() {
        const ret = wasm.collectstrategy_allDevices();
        return CollectStrategy.__wrap(ret);
    }
    /**
     * Share with all devices, except that errors for *verified* users cause
     * sharing to fail with an error.
     *
     * In this strategy, if a verified user has an unsigned device, or
     * a verified user has replaced their identity, key
     * sharing will fail with an error.
     *
     * Otherwise, keys are shared with unsigned devices as normal.
     *
     * Once the problematic devices are blacklisted or whitelisted the
     * caller can try sharing a second time.
     * @returns {CollectStrategy}
     */
    static errorOnUnverifiedUserProblem() {
        const ret = wasm.collectstrategy_errorOnUnverifiedUserProblem();
        return CollectStrategy.__wrap(ret);
    }
    /**
     * Share based on identity. Only distribute to devices signed by their
     * owner. If a user has no published identity he will not receive
     * any room keys.
     * @returns {CollectStrategy}
     */
    static identityBasedStrategy() {
        const ret = wasm.collectstrategy_identityBasedStrategy();
        return CollectStrategy.__wrap(ret);
    }
    /**
     * Only share keys with devices that we "trust". A device is trusted if any
     * of the following is true:
     *     - It was manually marked as trusted.
     *     - It was marked as verified via interactive verification.
     *     - It is signed by its owner identity, and this identity has been
     *       trusted via interactive verification.
     *     - It is the current own device of the user.
     * @returns {CollectStrategy}
     */
    static onlyTrustedDevices() {
        const ret = wasm.collectstrategy_onlyTrustedDevices();
        return CollectStrategy.__wrap(ret);
    }
}

const CrossSigningBootstrapRequestsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_crosssigningbootstraprequests_free(ptr >>> 0, 1));
/**
 * A set of requests to be executed when bootstrapping cross-signing using
 * {@link OlmMachine.bootstrapCrossSigning}.
 */
export class CrossSigningBootstrapRequests {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CrossSigningBootstrapRequests.prototype);
        obj.__wbg_ptr = ptr;
        CrossSigningBootstrapRequestsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CrossSigningBootstrapRequestsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_crosssigningbootstraprequests_free(ptr, 0);
    }
    /**
     * An optional request to upload a device key.
     *
     * This will either be `undefined`, or an "outgoing request" as returned by
     * {@link OlmMachine.outgoingRequests}.
     *
     * If it is defined, the request should be sent first, and the result sent
     * back with {@link OlmMachine.markRequestAsSent}.
     * @returns {any}
     */
    get uploadKeysRequest() {
        const ret = wasm.__wbg_get_crosssigningbootstraprequests_uploadKeysRequest(this.__wbg_ptr);
        return ret;
    }
    /**
     * Request to upload the cross-signing keys.
     *
     * Should be sent second.
     * @returns {UploadSigningKeysRequest}
     */
    get uploadSigningKeysRequest() {
        const ret = wasm.__wbg_get_crosssigningbootstraprequests_uploadSigningKeysRequest(this.__wbg_ptr);
        return UploadSigningKeysRequest.__wrap(ret);
    }
    /**
     * Request to upload key signatures, including those for the cross-signing
     * keys, and maybe some for the optional uploaded key too.
     *
     * Should be sent last.
     * @returns {SignatureUploadRequest}
     */
    get uploadSignaturesRequest() {
        const ret = wasm.__wbg_get_crosssigningbootstraprequests_uploadSignaturesRequest(this.__wbg_ptr);
        return SignatureUploadRequest.__wrap(ret);
    }
}

const CrossSigningKeyExportFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_crosssigningkeyexport_free(ptr >>> 0, 1));
/**
 * A struct containing private cross signing keys that can be backed
 * up or uploaded to the secret store.
 */
export class CrossSigningKeyExport {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CrossSigningKeyExport.prototype);
        obj.__wbg_ptr = ptr;
        CrossSigningKeyExportFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CrossSigningKeyExportFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_crosssigningkeyexport_free(ptr, 0);
    }
    /**
     * The seed of the master key encoded as unpadded base64.
     * @returns {string | undefined}
     */
    get masterKey() {
        const ret = wasm.crosssigningkeyexport_masterKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The seed of the self signing key encoded as unpadded base64.
     * @returns {string | undefined}
     */
    get self_signing_key() {
        const ret = wasm.crosssigningkeyexport_self_signing_key(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The seed of the user signing key encoded as unpadded base64.
     * @returns {string | undefined}
     */
    get userSigningKey() {
        const ret = wasm.crosssigningkeyexport_userSigningKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
}

const CrossSigningStatusFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_crosssigningstatus_free(ptr >>> 0, 1));
/**
 * Struct representing the state of our private cross signing keys,
 * it shows which private cross signing keys we have locally stored.
 */
export class CrossSigningStatus {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(CrossSigningStatus.prototype);
        obj.__wbg_ptr = ptr;
        CrossSigningStatusFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CrossSigningStatusFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_crosssigningstatus_free(ptr, 0);
    }
    /**
     * Do we have the master key?
     * @returns {boolean}
     */
    get hasMaster() {
        const ret = wasm.crosssigningstatus_hasMaster(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Do we have the self signing key? This one is necessary to sign
     * our own devices.
     * @returns {boolean}
     */
    get hasSelfSigning() {
        const ret = wasm.crosssigningstatus_hasSelfSigning(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Do we have the user signing key? This one is necessary to sign
     * other users.
     * @returns {boolean}
     */
    get hasUserSigning() {
        const ret = wasm.crosssigningstatus_hasUserSigning(this.__wbg_ptr);
        return ret !== 0;
    }
}

const Curve25519PublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_curve25519publickey_free(ptr >>> 0, 1));
/**
 * A Curve25519 public key.
 */
export class Curve25519PublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Curve25519PublicKey.prototype);
        obj.__wbg_ptr = ptr;
        Curve25519PublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Curve25519PublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_curve25519publickey_free(ptr, 0);
    }
    /**
     * Create a new [`Curve25519PublicKey`] from a base64 encoded string.
     * @param {string} key
     */
    constructor(key) {
        const ptr0 = passStringToWasm0(key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.curve25519publickey_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        Curve25519PublicKeyFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * The number of bytes a Curve25519 public key has.
     * @returns {number}
     */
    get length() {
        const ret = wasm.curve25519publickey_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Serialize an Curve25519 public key to an unpadded base64
     * representation.
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.curve25519publickey_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const Curve25519SecretKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_curve25519secretkey_free(ptr >>> 0, 1));
/**
 * A Curve25519 secret key.
 */
export class Curve25519SecretKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Curve25519SecretKey.prototype);
        obj.__wbg_ptr = ptr;
        Curve25519SecretKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Curve25519SecretKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_curve25519secretkey_free(ptr, 0);
    }
    /**
     * Generates a new random Curve25519 secret key.
     * @returns {Curve25519SecretKey}
     */
    static new() {
        const ret = wasm.curve25519secretkey_new();
        return Curve25519SecretKey.__wrap(ret);
    }
    /**
     * Creates a `Curve25519SecretKey` from a base64-encoded representation of
     * the key.
     * @param {string} string
     * @returns {Curve25519SecretKey}
     */
    static fromBase64(string) {
        const ptr0 = passStringToWasm0(string, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.curve25519secretkey_fromBase64(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Curve25519SecretKey.__wrap(ret[0]);
    }
    /**
     * Encodes the secret key into a base64 string.
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.curve25519secretkey_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Converts the secret key into a raw byte vector.
     * @returns {Uint8Array}
     */
    toUint8Array() {
        const ret = wasm.curve25519secretkey_toUint8Array(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Creates a `Curve25519SecretKey` from a raw byte slice.
     * @param {Uint8Array} slice
     * @returns {Curve25519SecretKey}
     */
    static fromUint8Array(slice) {
        const ptr0 = passArray8ToWasm0(slice, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.curve25519secretkey_fromUint8Array(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return Curve25519SecretKey.__wrap(ret[0]);
    }
}

const DecryptedRoomEventFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_decryptedroomevent_free(ptr >>> 0, 1));
/**
 * A decrypted room event.
 */
export class DecryptedRoomEvent {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DecryptedRoomEvent.prototype);
        obj.__wbg_ptr = ptr;
        DecryptedRoomEventFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DecryptedRoomEventFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_decryptedroomevent_free(ptr, 0);
    }
    /**
     * The JSON-encoded decrypted event.
     * @returns {string}
     */
    get event() {
        const ret = wasm.__wbg_get_decryptedroomevent_event(this.__wbg_ptr);
        return ret;
    }
    /**
     * The user ID of the event sender, note this is untrusted data
     * unless the `verification_state` is as well trusted.
     * @returns {UserId}
     */
    get sender() {
        const ret = wasm.decryptedroomevent_sender(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The device ID of the device that sent us the event, note this
     * is untrusted data unless `verification_state` is as well
     * trusted.
     * @returns {DeviceId | undefined}
     */
    get senderDevice() {
        const ret = wasm.decryptedroomevent_senderDevice(this.__wbg_ptr);
        return ret === 0 ? undefined : DeviceId.__wrap(ret);
    }
    /**
     * The Curve25519 key of the device that created the megolm
     * decryption key originally.
     * @returns {string}
     */
    get senderCurve25519Key() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.decryptedroomevent_senderCurve25519Key(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The signing Ed25519 key that have created the megolm key that
     * was used to decrypt this session.
     * @returns {string | undefined}
     */
    get senderClaimedEd25519Key() {
        const ret = wasm.decryptedroomevent_senderClaimedEd25519Key(this.__wbg_ptr);
        return ret;
    }
    /**
     * Returns an empty array
     *
     * Previously, this returned the chain of Curve25519 keys through which
     * this session was forwarded, via `m.forwarded_room_key` events.
     * However, that is not cryptographically reliable, and clients should not
     * be using it.
     *
     * @see https://github.com/matrix-org/matrix-spec/issues/1089
     * @returns {Array<any>}
     */
    get forwardingCurve25519KeyChain() {
        const ret = wasm.decryptedroomevent_forwardingCurve25519KeyChain(this.__wbg_ptr);
        return ret;
    }
    /**
     * The verification state of the device that sent us the event.
     * Note this is the state of the device at the time of
     * decryption. It may change in the future if a device gets
     * verified or deleted.
     * @param {boolean} strict
     * @returns {ShieldState}
     */
    shieldState(strict) {
        const ret = wasm.decryptedroomevent_shieldState(this.__wbg_ptr, strict);
        return ShieldState.__wrap(ret);
    }
}

const DecryptedToDeviceEventFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_decryptedtodeviceevent_free(ptr >>> 0, 1));
/**
 * Represents an encrypted to-device event, after it has been decrypted.
 */
export class DecryptedToDeviceEvent {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DecryptedToDeviceEvent.prototype);
        obj.__wbg_ptr = ptr;
        DecryptedToDeviceEventFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DecryptedToDeviceEventFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_decryptedtodeviceevent_free(ptr, 0);
    }
    /**
     * The decrypted event, as if it had been sent in the clear, encoded as
     * JSON.
     *
     * Typically contains properties `type`, `sender` and `content`.
     *
     * (For room keys or secrets, some part of the content might have been
     * zeroized).
     * @returns {string}
     */
    get rawEvent() {
        const ret = wasm.__wbg_get_decryptedtodeviceevent_rawEvent(this.__wbg_ptr);
        return ret;
    }
    /**
     * The encryption information for the event.
     * @returns {ToDeviceEncryptionInfo}
     */
    get encryptionInfo() {
        const ret = wasm.__wbg_get_decryptedtodeviceevent_encryptionInfo(this.__wbg_ptr);
        return ToDeviceEncryptionInfo.__wrap(ret);
    }
    /**
     * The type of processed to-device event. Always {@link
     * ProcessedToDeviceEventType.Decrypted} for this type.
     * @returns {ProcessedToDeviceEventType}
     */
    get type() {
        const ret = wasm.decryptedtodeviceevent_type(this.__wbg_ptr);
        return ret;
    }
}

const DecryptionSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_decryptionsettings_free(ptr >>> 0, 1));
/**
 * Settings for decrypting messages
 */
export class DecryptionSettings {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DecryptionSettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_decryptionsettings_free(ptr, 0);
    }
    /**
     * The trust level required to decrypt the event
     * @returns {TrustRequirement}
     */
    get sender_device_trust_requirement() {
        const ret = wasm.__wbg_get_decryptionsettings_sender_device_trust_requirement(this.__wbg_ptr);
        return ret;
    }
    /**
     * The trust level required to decrypt the event
     * @param {TrustRequirement} arg0
     */
    set sender_device_trust_requirement(arg0) {
        wasm.__wbg_set_decryptionsettings_sender_device_trust_requirement(this.__wbg_ptr, arg0);
    }
    /**
     * Create a new `DecryptionSettings` with the given trust requirement.
     * @param {TrustRequirement} sender_device_trust_requirement
     */
    constructor(sender_device_trust_requirement) {
        const ret = wasm.decryptionsettings_new(sender_device_trust_requirement);
        this.__wbg_ptr = ret >>> 0;
        DecryptionSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const DehydratedDeviceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dehydrateddevice_free(ptr >>> 0, 1));
/**
 * A dehydrated device that can be uploaded to the server
 */
export class DehydratedDevice {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DehydratedDevice.prototype);
        obj.__wbg_ptr = ptr;
        DehydratedDeviceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DehydratedDeviceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dehydrateddevice_free(ptr, 0);
    }
    /**
     * Create the request to upload the dehydrated device
     * @param {string} initial_device_display_name
     * @param {DehydratedDeviceKey} dehydrated_device_key
     * @returns {Promise<PutDehydratedDeviceRequest>}
     */
    keysForUpload(initial_device_display_name, dehydrated_device_key) {
        _assertClass(dehydrated_device_key, DehydratedDeviceKey);
        const ret = wasm.dehydrateddevice_keysForUpload(this.__wbg_ptr, initial_device_display_name, dehydrated_device_key.__wbg_ptr);
        return ret;
    }
}

const DehydratedDeviceKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dehydrateddevicekey_free(ptr >>> 0, 1));
/**
 * Dehydrated device key
 */
export class DehydratedDeviceKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DehydratedDeviceKey.prototype);
        obj.__wbg_ptr = ptr;
        DehydratedDeviceKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DehydratedDeviceKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dehydrateddevicekey_free(ptr, 0);
    }
    /**
     * Generates a new random dehydrated device key.
     * @returns {DehydratedDeviceKey}
     */
    static createRandomKey() {
        const ret = wasm.dehydrateddevicekey_createRandomKey();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DehydratedDeviceKey.__wrap(ret[0]);
    }
    /**
     * Generates a dehydrated device key from a given array.
     * @param {Uint8Array} array
     * @returns {DehydratedDeviceKey}
     */
    static createKeyFromArray(array) {
        const ret = wasm.dehydrateddevicekey_createKeyFromArray(array);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return DehydratedDeviceKey.__wrap(ret[0]);
    }
    /**
     * Convert the dehydrated device key to a base64-encoded string.
     * @returns {string}
     */
    toBase64() {
        const ret = wasm.dehydrateddevicekey_toBase64(this.__wbg_ptr);
        return ret;
    }
}

const DehydratedDevicesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_dehydrateddevices_free(ptr >>> 0, 1));
/**
 * Struct collecting methods to create and rehydrate dehydrated devices.
 */
export class DehydratedDevices {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DehydratedDevices.prototype);
        obj.__wbg_ptr = ptr;
        DehydratedDevicesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DehydratedDevicesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_dehydrateddevices_free(ptr, 0);
    }
    /**
     * Create a new {@link DehydratedDevice} which can be uploaded to the
     * server.
     * @returns {Promise<DehydratedDevice>}
     */
    create() {
        const ret = wasm.dehydrateddevices_create(this.__wbg_ptr);
        return ret;
    }
    /**
     * Rehydrate a dehydrated device.
     * @param {DehydratedDeviceKey} dehydrated_device_key
     * @param {DeviceId} device_id
     * @param {string} device_data
     * @returns {Promise<RehydratedDevice>}
     */
    rehydrate(dehydrated_device_key, device_id, device_data) {
        _assertClass(dehydrated_device_key, DehydratedDeviceKey);
        _assertClass(device_id, DeviceId);
        const ptr0 = passStringToWasm0(device_data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.dehydrateddevices_rehydrate(this.__wbg_ptr, dehydrated_device_key.__wbg_ptr, device_id.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get the cached dehydrated device key if any.
     *
     * `None` if the key was not previously cached (via
     * {@link DehydratedDevices.saveDehydratedDeviceKey}).
     * @returns {Promise<DehydratedDeviceKey | undefined>}
     */
    getDehydratedDeviceKey() {
        const ret = wasm.dehydrateddevices_getDehydratedDeviceKey(this.__wbg_ptr);
        return ret;
    }
    /**
     * Store the dehydrated device key in the crypto store.
     * @param {DehydratedDeviceKey} dehydrated_device_key
     * @returns {Promise<void>}
     */
    saveDehydratedDeviceKey(dehydrated_device_key) {
        _assertClass(dehydrated_device_key, DehydratedDeviceKey);
        const ret = wasm.dehydrateddevices_saveDehydratedDeviceKey(this.__wbg_ptr, dehydrated_device_key.__wbg_ptr);
        return ret;
    }
    /**
     * Clear the dehydrated device key saved in the crypto store.
     * @returns {Promise<void>}
     */
    deleteDehydratedDeviceKey() {
        const ret = wasm.dehydrateddevices_deleteDehydratedDeviceKey(this.__wbg_ptr);
        return ret;
    }
}

const DeviceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_device_free(ptr >>> 0, 1));
/**
 * A device represents a E2EE capable client of an user.
 */
export class Device {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Device.prototype);
        obj.__wbg_ptr = ptr;
        DeviceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DeviceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_device_free(ptr, 0);
    }
    /**
     * Request an interactive verification with this device.
     *
     * Returns a 2-element array `[VerificationRequest, ToDeviceRequest]`.
     * @param {any[] | null} [methods]
     * @returns {Array<any>}
     */
    requestVerification(methods) {
        var ptr0 = isLikeNone(methods) ? 0 : passArrayJsValueToWasm0(methods, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.device_requestVerification(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Encrypt a to-device message to be sent to this device, using Olm
     * encryption.
     *
     * Prior to calling this method you must ensure that an Olm session is
     * available for the target device. This can be done by calling
     * {@link OlmMachine.getMissingSessions}.
     *
     * The caller is responsible for sending the encrypted
     * event to the target device. If multiple messages are
     * encrypted for the same device using this method they should be sent in
     * the same order as they are encrypted.
     *
     * # Returns
     *
     * Returns a promise for a JSON string containing the `content` of an
     * encrypted event, which be used to create the payload for a
     * `/sendToDevice` API.
     * @param {string} event_type
     * @param {any} content
     * @param {CollectStrategy | null} [share_strategy]
     * @returns {Promise<string>}
     */
    encryptToDeviceEvent(event_type, content, share_strategy) {
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        let ptr1 = 0;
        if (!isLikeNone(share_strategy)) {
            _assertClass(share_strategy, CollectStrategy);
            ptr1 = share_strategy.__destroy_into_raw();
        }
        const ret = wasm.device_encryptToDeviceEvent(this.__wbg_ptr, ptr0, len0, content, ptr1);
        return ret;
    }
    /**
     * Is this device considered to be verified.
     *
     * This method returns true if either the `is_locally_trusted`
     * method returns `true` or if the `is_cross_signing_trusted`
     * method returns `true`.
     * @returns {boolean}
     */
    isVerified() {
        const ret = wasm.device_isVerified(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is this device considered to be verified using cross signing.
     * @returns {boolean}
     */
    isCrossSigningTrusted() {
        const ret = wasm.device_isCrossSigningTrusted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is this device cross-signed by its owner?
     * @returns {boolean}
     */
    isCrossSignedByOwner() {
        const ret = wasm.device_isCrossSignedByOwner(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Set the local trust state of the device to the given state.
     *
     * This won’t affect any cross signing trust state, this only
     * sets a flag marking to have the given trust state.
     *
     * `trust_state` represents the new trust state that should be
     * set for the device.
     * @param {LocalTrust} local_state
     * @returns {Promise<any>}
     */
    setLocalTrust(local_state) {
        const ret = wasm.device_setLocalTrust(this.__wbg_ptr, local_state);
        return ret;
    }
    /**
     * The user ID of the device owner.
     * @returns {UserId}
     */
    get userId() {
        const ret = wasm.device_userId(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The unique ID of the device.
     * @returns {DeviceId}
     */
    get deviceId() {
        const ret = wasm.device_deviceId(this.__wbg_ptr);
        return DeviceId.__wrap(ret);
    }
    /**
     * Get the human readable name of the device.
     * @returns {string | undefined}
     */
    get displayName() {
        const ret = wasm.device_displayName(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Get the key of the given key algorithm belonging to this device.
     * @param {DeviceKeyAlgorithmName} algorithm
     * @returns {DeviceKey | undefined}
     */
    getKey(algorithm) {
        const ret = wasm.device_getKey(this.__wbg_ptr, algorithm);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return ret[0] === 0 ? undefined : DeviceKey.__wrap(ret[0]);
    }
    /**
     * Get the Curve25519 key of the given device.
     * @returns {Curve25519PublicKey | undefined}
     */
    get curve25519Key() {
        const ret = wasm.device_curve25519Key(this.__wbg_ptr);
        return ret === 0 ? undefined : Curve25519PublicKey.__wrap(ret);
    }
    /**
     * Get the Ed25519 key of the given device.
     * @returns {Ed25519PublicKey | undefined}
     */
    get ed25519Key() {
        const ret = wasm.device_ed25519Key(this.__wbg_ptr);
        return ret === 0 ? undefined : Ed25519PublicKey.__wrap(ret);
    }
    /**
     * Get a map containing all the device keys.
     * @returns {Map<any, any>}
     */
    get keys() {
        const ret = wasm.device_keys(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the list of algorithms this device supports.
     *
     * Returns `Array<EncryptionAlgorithm>`.
     * @returns {Array<any>}
     */
    get algorithms() {
        const ret = wasm.device_algorithms(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get a map containing all the device signatures.
     * @returns {Signatures}
     */
    get signatures() {
        const ret = wasm.device_signatures(this.__wbg_ptr);
        return Signatures.__wrap(ret);
    }
    /**
     * Get the trust state of the device.
     * @returns {LocalTrust}
     */
    get localTrustState() {
        const ret = wasm.device_localTrustState(this.__wbg_ptr);
        return ret;
    }
    /**
     * Is the device locally marked as trusted?
     * @returns {boolean}
     */
    isLocallyTrusted() {
        const ret = wasm.device_isLocallyTrusted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is the device locally marked as blacklisted?
     *
     * Blacklisted devices won’t receive any group sessions.
     * @returns {boolean}
     */
    isBlacklisted() {
        const ret = wasm.device_isBlacklisted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is the device deleted?
     * @returns {boolean}
     */
    isDeleted() {
        const ret = wasm.device_isDeleted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Timestamp representing the first time this device has been seen (in
     * milliseconds).
     * @returns {bigint}
     */
    firstTimeSeen() {
        const ret = wasm.device_firstTimeSeen(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * Mark this device as verified.
     * Works only if the device is owned by the current user.
     *
     * Returns a signature upload request that needs to be sent out.
     * @returns {Promise<any>}
     */
    verify() {
        const ret = wasm.device_verify(this.__wbg_ptr);
        return ret;
    }
    /**
     * Whether or not the device is a dehydrated device.
     * @returns {boolean}
     */
    get isDehydrated() {
        const ret = wasm.device_isDehydrated(this.__wbg_ptr);
        return ret !== 0;
    }
}

const DeviceIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_deviceid_free(ptr >>> 0, 1));
/**
 * A Matrix key ID.
 *
 * Device identifiers in Matrix are completely opaque character
 * sequences. This type is provided simply for its semantic value.
 */
export class DeviceId {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DeviceId.prototype);
        obj.__wbg_ptr = ptr;
        DeviceIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DeviceIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_deviceid_free(ptr, 0);
    }
    /**
     * Create a new `DeviceId`.
     * @param {string} id
     */
    constructor(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.deviceid_new(ptr0, len0);
        this.__wbg_ptr = ret >>> 0;
        DeviceIdFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return the device ID as a string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.deviceid_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const DeviceKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_devicekey_free(ptr >>> 0, 1));
/**
 * An enum over the different key types a device can have.
 *
 * Currently devices have a curve25519 and ed25519 keypair. The keys
 * transport format is a base64 encoded string, any unknown key type
 * will be left as such a string.
 */
export class DeviceKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DeviceKey.prototype);
        obj.__wbg_ptr = ptr;
        DeviceKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DeviceKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_devicekey_free(ptr, 0);
    }
    /**
     * Get the name of the device key.
     * @returns {DeviceKeyName}
     */
    get name() {
        const ret = wasm.devicekey_name(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the value associated to the `Curve25519` device key name.
     * @returns {Curve25519PublicKey | undefined}
     */
    get curve25519() {
        const ret = wasm.devicekey_curve25519(this.__wbg_ptr);
        return ret === 0 ? undefined : Curve25519PublicKey.__wrap(ret);
    }
    /**
     * Get the value associated to the `Ed25519` device key name.
     * @returns {Ed25519PublicKey | undefined}
     */
    get ed25519() {
        const ret = wasm.devicekey_ed25519(this.__wbg_ptr);
        return ret === 0 ? undefined : Ed25519PublicKey.__wrap(ret);
    }
    /**
     * Get the value associated to the `Unknown` device key name.
     * @returns {string | undefined}
     */
    get unknown() {
        const ret = wasm.devicekey_unknown(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Convert the `DeviceKey` into a base64 encoded string.
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.devicekey_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const DeviceKeyAlgorithmFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_devicekeyalgorithm_free(ptr >>> 0, 1));
/**
 * The basic key algorithms in the specification.
 */
export class DeviceKeyAlgorithm {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DeviceKeyAlgorithm.prototype);
        obj.__wbg_ptr = ptr;
        DeviceKeyAlgorithmFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DeviceKeyAlgorithmFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_devicekeyalgorithm_free(ptr, 0);
    }
    /**
     * Read the device key algorithm's name. If the name is
     * `Unknown`, one may be interested by the `to_string` method to
     * read the original name.
     * @returns {DeviceKeyAlgorithmName}
     */
    get name() {
        const ret = wasm.devicekeyalgorithm_name(this.__wbg_ptr);
        return ret;
    }
    /**
     * Return the device key algorithm as a string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.devicekeyalgorithm_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const DeviceKeyIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_devicekeyid_free(ptr >>> 0, 1));
/**
 * A Matrix device key ID.
 *
 * A key algorithm and a device ID, combined with a ‘:’.
 */
export class DeviceKeyId {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(DeviceKeyId.prototype);
        obj.__wbg_ptr = ptr;
        DeviceKeyIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DeviceKeyIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_devicekeyid_free(ptr, 0);
    }
    /**
     * Parse/validate and create a new `DeviceKeyId`.
     * @param {string} id
     */
    constructor(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.devicekeyid_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DeviceKeyIdFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Returns key algorithm of the device key ID.
     * @returns {DeviceKeyAlgorithm}
     */
    get algorithm() {
        const ret = wasm.devicekeyid_algorithm(this.__wbg_ptr);
        return DeviceKeyAlgorithm.__wrap(ret);
    }
    /**
     * Returns device ID of the device key ID.
     * @returns {DeviceId}
     */
    get deviceId() {
        const ret = wasm.devicekeyid_deviceId(this.__wbg_ptr);
        return DeviceId.__wrap(ret);
    }
    /**
     * Return the device key ID as a string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.devicekeyid_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const DeviceListsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_devicelists_free(ptr >>> 0, 1));
/**
 * Information on E2E device updates.
 */
export class DeviceLists {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        DeviceListsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_devicelists_free(ptr, 0);
    }
    /**
     * Create an empty `DeviceLists`.
     *
     * `changed` and `left` must be an array of `UserId`.
     *
     * Items inside `changed` and `left` will be invalidated by this method. Be
     * careful not to use the `UserId`s after this method has been called.
     * @param {UserId[] | null} [changed]
     * @param {UserId[] | null} [left]
     */
    constructor(changed, left) {
        var ptr0 = isLikeNone(changed) ? 0 : passArrayJsValueToWasm0(changed, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(left) ? 0 : passArrayJsValueToWasm0(left, wasm.__wbindgen_malloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.devicelists_new(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        DeviceListsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Returns true if there are no device list updates.
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.devicelists_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * List of users who have updated their device identity keys or
     * who now share an encrypted room with the client since the
     * previous sync
     * @returns {UserId[]}
     */
    get changed() {
        const ret = wasm.devicelists_changed(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
    /**
     * List of users who no longer share encrypted rooms since the
     * previous sync response.
     * @returns {UserId[]}
     */
    get left() {
        const ret = wasm.devicelists_left(this.__wbg_ptr);
        var v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        return v1;
    }
}

const EciesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ecies_free(ptr >>> 0, 1));
/**
 * An unestablished ECIES session.
 */
export class Ecies {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EciesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ecies_free(ptr, 0);
    }
    /**
     * Create a new, random, unestablished ECIES session.
     *
     * This method will use the
     * [`MATRIX_QR_CODE_LOGIN`](https://github.com/matrix-org/matrix-spec-proposals/pull/4108)
     * info for domain separation when creating the session.
     */
    constructor() {
        const ret = wasm.ecies_new();
        this.__wbg_ptr = ret >>> 0;
        EciesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get our [`Curve25519PublicKey`].
     *
     * This public key needs to be sent to the other side to be able to
     * establish an ECIES channel.
     * @returns {Curve25519PublicKey}
     */
    public_key() {
        const ret = wasm.ecies_public_key(this.__wbg_ptr);
        return Curve25519PublicKey.__wrap(ret);
    }
    /**
     * Create a [`EstablishedEcies`] from an initial message encrypted by the
     * other side.
     * @param {string} initial_message
     * @returns {InboundCreationResult}
     */
    establish_inbound_channel(initial_message) {
        const ptr0 = passStringToWasm0(initial_message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ecies_establish_inbound_channel(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return InboundCreationResult.__wrap(ret[0]);
    }
    /**
     * Create an [`EstablishedEcies`] session using the other side's Curve25519
     * public key and an initial plaintext.
     *
     * After the channel has been established, we can encrypt messages to send
     * to the other side. The other side uses the initial message to
     * establishes the same channel on its side.
     * @param {Curve25519PublicKey} public_key
     * @param {string} initial_message
     * @returns {OutboundCreationResult}
     */
    establish_outbound_channel(public_key, initial_message) {
        _assertClass(public_key, Curve25519PublicKey);
        const ptr0 = passStringToWasm0(initial_message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ecies_establish_outbound_channel(this.__wbg_ptr, public_key.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return OutboundCreationResult.__wrap(ret[0]);
    }
}

const Ed25519PublicKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ed25519publickey_free(ptr >>> 0, 1));
/**
 * An Ed25519 public key, used to verify digital signatures.
 */
export class Ed25519PublicKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Ed25519PublicKey.prototype);
        obj.__wbg_ptr = ptr;
        Ed25519PublicKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Ed25519PublicKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ed25519publickey_free(ptr, 0);
    }
    /**
     * The number of bytes an Ed25519 public key has.
     * @returns {number}
     */
    get length() {
        const ret = wasm.ed25519publickey_length(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Serialize an Ed25519 public key to an unpadded base64
     * representation.
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.ed25519publickey_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const Ed25519SignatureFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ed25519signature_free(ptr >>> 0, 1));
/**
 * An Ed25519 digital signature, can be used to verify the
 * authenticity of a message.
 */
export class Ed25519Signature {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Ed25519Signature.prototype);
        obj.__wbg_ptr = ptr;
        Ed25519SignatureFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        Ed25519SignatureFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ed25519signature_free(ptr, 0);
    }
    /**
     * Try to create an Ed25519 signature from an unpadded base64
     * representation.
     * @param {string} signature
     */
    constructor(signature) {
        const ptr0 = passStringToWasm0(signature, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.ed25519signature_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        Ed25519SignatureFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Serialize a Ed25519 signature to an unpadded base64
     * representation.
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.ed25519signature_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const EmojiFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_emoji_free(ptr >>> 0, 1));
/**
 * An emoji that is used for interactive verification using a short
 * auth string.
 *
 * This will contain a single emoji and description from the list of
 * emojis from [the specification].
 *
 * [the specification]: https://spec.matrix.org/unstable/client-server-api/#sas-method-emoji
 */
export class Emoji {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Emoji.prototype);
        obj.__wbg_ptr = ptr;
        EmojiFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EmojiFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_emoji_free(ptr, 0);
    }
    /**
     * The emoji symbol that represents a part of the short auth
     * string, for example: 🐶
     * @returns {string}
     */
    get symbol() {
        const ret = wasm.emoji_symbol(this.__wbg_ptr);
        return ret;
    }
    /**
     * The description of the emoji, for example ‘Dog’.
     * @returns {string}
     */
    get description() {
        const ret = wasm.emoji_description(this.__wbg_ptr);
        return ret;
    }
}

const EncryptedAttachmentFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encryptedattachment_free(ptr >>> 0, 1));
/**
 * An encrypted attachment, usually created from `Attachment.encrypt`.
 */
export class EncryptedAttachment {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EncryptedAttachment.prototype);
        obj.__wbg_ptr = ptr;
        EncryptedAttachmentFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptedAttachmentFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptedattachment_free(ptr, 0);
    }
    /**
     * Create a new encrypted attachment manually.
     *
     * It needs encrypted data, stored in an `Uint8Array`, and a
     * [media encryption
     * information](https://docs.rs/matrix-sdk-crypto/latest/matrix_sdk_crypto/struct.MediaEncryptionInfo.html),
     * as a JSON-encoded object.
     *
     * The media encryption information aren't stored as a string:
     * they are parsed, validated and fully deserialized.
     *
     * See [the specification to learn
     * more](https://spec.matrix.org/unstable/client-server-api/#extensions-to-mroommessage-msgtypes).
     * @param {Uint8Array} encrypted_data
     * @param {string} media_encryption_info
     */
    constructor(encrypted_data, media_encryption_info) {
        const ptr0 = passArray8ToWasm0(encrypted_data, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(media_encryption_info, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.encryptedattachment_new(ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        EncryptedAttachmentFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * The actual encrypted data.
     *
     * **Warning**: It returns a **copy** of the entire encrypted
     * data; be nice with your memory.
     * @returns {Uint8Array}
     */
    get encryptedData() {
        const ret = wasm.encryptedattachment_encryptedData(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Return the media encryption info as a JSON-encoded object. The
     * structure is fully valid.
     *
     * If the media encryption info have been consumed already, it
     * will return `null`.
     * @returns {string | undefined}
     */
    get mediaEncryptionInfo() {
        const ret = wasm.encryptedattachment_mediaEncryptionInfo(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Check whether the media encryption info has been consumed by
     * `Attachment.decrypt` already.
     * @returns {boolean}
     */
    get hasMediaEncryptionInfoBeenConsumed() {
        const ret = wasm.encryptedattachment_hasMediaEncryptionInfoBeenConsumed(this.__wbg_ptr);
        return ret !== 0;
    }
}

const EncryptionInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encryptioninfo_free(ptr >>> 0, 1));
/**
 * Struct containing information on how a room event was decrypted.
 */
export class EncryptionInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EncryptionInfo.prototype);
        obj.__wbg_ptr = ptr;
        EncryptionInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptionInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptioninfo_free(ptr, 0);
    }
    /**
     * The user ID of the sender of the event.
     *
     * Note this is untrusted data unless {@link shieldState} shows that the
     * sender is verified.
     * @returns {UserId}
     */
    get sender() {
        const ret = wasm.__wbg_get_encryptioninfo_sender(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The user ID of the sender of the event.
     *
     * Note this is untrusted data unless {@link shieldState} shows that the
     * sender is verified.
     * @param {UserId} arg0
     */
    set sender(arg0) {
        _assertClass(arg0, UserId);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_encryptioninfo_sender(this.__wbg_ptr, ptr0);
    }
    /**
     * The device ID of the device that sent us the event.
     *
     * Note this is untrusted data unless {@link shieldState} shows that the
     * sender is verified.
     * @returns {DeviceId | undefined}
     */
    get senderDevice() {
        const ret = wasm.__wbg_get_encryptioninfo_senderDevice(this.__wbg_ptr);
        return ret === 0 ? undefined : DeviceId.__wrap(ret);
    }
    /**
     * The device ID of the device that sent us the event.
     *
     * Note this is untrusted data unless {@link shieldState} shows that the
     * sender is verified.
     * @param {DeviceId | null} [arg0]
     */
    set senderDevice(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, DeviceId);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_encryptioninfo_senderDevice(this.__wbg_ptr, ptr0);
    }
    /**
     * The base64-encoded public Curve25519 key of the device that created the
     * megolm decryption key originally.
     * @returns {string}
     */
    get senderCurve25519Key() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_encryptioninfo_senderCurve25519Key(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The base64-encoded public Curve25519 key of the device that created the
     * megolm decryption key originally.
     * @param {string} arg0
     */
    set senderCurve25519Key(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The signing Ed25519 key that created the megolm key that
     * was used to decrypt this session.
     * @returns {string | undefined}
     */
    get senderClaimedEd25519Key() {
        const ret = wasm.__wbg_get_encryptioninfo_senderClaimedEd25519Key(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The signing Ed25519 key that created the megolm key that
     * was used to decrypt this session.
     * @param {string | null} [arg0]
     */
    set senderClaimedEd25519Key(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_basemigrationdata_backupVersion(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The verification state of the device that sent us the event.
     * Note this is the state of the device at the time of
     * decryption. It may change in the future if a device gets
     * verified or deleted.
     *
     * # Arguments
     *
     * * `strict` - whether to enable "strict mode" verification. In non-strict
     *   mode, unverified users are given no shield, and keys that have been
     *   forwarded or restored from an insecure backup are given a grey shield
     *   (both get a red shield in strict mode).
     * @param {boolean} strict
     * @returns {ShieldState}
     */
    shieldState(strict) {
        const ret = wasm.encryptioninfo_shieldState(this.__wbg_ptr, strict);
        return ShieldState.__wrap(ret);
    }
}

const EncryptionSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_encryptionsettings_free(ptr >>> 0, 1));
/**
 * Settings for an encrypted room.
 *
 * This determines the algorithm and rotation periods of a group
 * session.
 */
export class EncryptionSettings {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EncryptionSettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_encryptionsettings_free(ptr, 0);
    }
    /**
     * The encryption algorithm that should be used in the room.
     * @returns {EncryptionAlgorithm}
     */
    get algorithm() {
        const ret = wasm.__wbg_get_encryptionsettings_algorithm(this.__wbg_ptr);
        return ret;
    }
    /**
     * The encryption algorithm that should be used in the room.
     * @param {EncryptionAlgorithm} arg0
     */
    set algorithm(arg0) {
        wasm.__wbg_set_encryptionsettings_algorithm(this.__wbg_ptr, arg0);
    }
    /**
     * Whether state event encryption is enabled.
     * @returns {boolean}
     */
    get encryptStateEvents() {
        const ret = wasm.__wbg_get_encryptionsettings_encryptStateEvents(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Whether state event encryption is enabled.
     * @param {boolean} arg0
     */
    set encryptStateEvents(arg0) {
        wasm.__wbg_set_encryptionsettings_encryptStateEvents(this.__wbg_ptr, arg0);
    }
    /**
     * How long the session should be used before changing it,
     * expressed in microseconds.
     * @returns {bigint}
     */
    get rotationPeriod() {
        const ret = wasm.__wbg_get_encryptionsettings_rotationPeriod(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * How long the session should be used before changing it,
     * expressed in microseconds.
     * @param {bigint} arg0
     */
    set rotationPeriod(arg0) {
        wasm.__wbg_set_encryptionsettings_rotationPeriod(this.__wbg_ptr, arg0);
    }
    /**
     * How many messages should be sent before changing the session.
     * @returns {bigint}
     */
    get rotationPeriodMessages() {
        const ret = wasm.__wbg_get_encryptionsettings_rotationPeriodMessages(this.__wbg_ptr);
        return BigInt.asUintN(64, ret);
    }
    /**
     * How many messages should be sent before changing the session.
     * @param {bigint} arg0
     */
    set rotationPeriodMessages(arg0) {
        wasm.__wbg_set_encryptionsettings_rotationPeriodMessages(this.__wbg_ptr, arg0);
    }
    /**
     * The history visibility of the room when the session was
     * created.
     * @returns {HistoryVisibility}
     */
    get historyVisibility() {
        const ret = wasm.__wbg_get_encryptionsettings_historyVisibility(this.__wbg_ptr);
        return ret;
    }
    /**
     * The history visibility of the room when the session was
     * created.
     * @param {HistoryVisibility} arg0
     */
    set historyVisibility(arg0) {
        wasm.__wbg_set_encryptionsettings_historyVisibility(this.__wbg_ptr, arg0);
    }
    /**
     * Should untrusted devices receive the room key, or should they be
     * excluded from the conversation.
     * @returns {CollectStrategy}
     */
    get sharingStrategy() {
        const ret = wasm.__wbg_get_encryptionsettings_sharingStrategy(this.__wbg_ptr);
        return CollectStrategy.__wrap(ret);
    }
    /**
     * Should untrusted devices receive the room key, or should they be
     * excluded from the conversation.
     * @param {CollectStrategy} arg0
     */
    set sharingStrategy(arg0) {
        _assertClass(arg0, CollectStrategy);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_encryptionsettings_sharingStrategy(this.__wbg_ptr, ptr0);
    }
    /**
     * Create a new `EncryptionSettings` with default values.
     */
    constructor() {
        const ret = wasm.encryptionsettings_new();
        this.__wbg_ptr = ret >>> 0;
        EncryptionSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const EstablishedEciesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_establishedecies_free(ptr >>> 0, 1));
/**
 * An established ECIES session.
 *
 * This session can be used to encrypt and decrypt messages between the two
 * sides of the channel.
 */
export class EstablishedEcies {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(EstablishedEcies.prototype);
        obj.__wbg_ptr = ptr;
        EstablishedEciesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EstablishedEciesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_establishedecies_free(ptr, 0);
    }
    /**
     * Get our [`Curve25519PublicKey`].
     *
     * This public key needs to be sent to the other side so that it can
     * complete the ECIES channel establishment.
     * @returns {Curve25519PublicKey}
     */
    public_key() {
        const ret = wasm.establishedecies_public_key(this.__wbg_ptr);
        return Curve25519PublicKey.__wrap(ret);
    }
    /**
     * Encrypt the given plaintext using this [`EstablishedEcies`] session.
     * @param {string} message
     * @returns {string}
     */
    encrypt(message) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.establishedecies_encrypt(this.__wbg_ptr, ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Decrypt the given message using this [`EstablishedEcies`] session.
     * @param {string} message
     * @returns {string}
     */
    decrypt(message) {
        let deferred3_0;
        let deferred3_1;
        try {
            const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.establishedecies_decrypt(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Get the [`CheckCode`] which uniquely identifies this
     * [`EstablishedEcies`] session.
     *
     * This check code can be used to verify and confirm that both sides of the
     * session are indeed using the same shared secret.
     * @returns {CheckCode}
     */
    check_code() {
        const ret = wasm.establishedecies_check_code(this.__wbg_ptr);
        return CheckCode.__wrap(ret);
    }
}

const EventIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_eventid_free(ptr >>> 0, 1));
/**
 * A Matrix [event ID].
 *
 * An `EventId` is generated randomly or converted from a string
 * slice, and can be converted back into a string as needed.
 *
 * [event ID]: https://spec.matrix.org/v1.2/appendices/#room-ids-and-event-ids
 */
export class EventId {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        EventIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_eventid_free(ptr, 0);
    }
    /**
     * Parse/validate and create a new `EventId`.
     * @param {string} id
     */
    constructor(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.eventid_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        EventIdFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Returns the event's localpart.
     * @returns {string}
     */
    get localpart() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.eventid_localpart(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Returns the server name of the event ID.
     * @returns {ServerName | undefined}
     */
    get serverName() {
        const ret = wasm.eventid_serverName(this.__wbg_ptr);
        return ret === 0 ? undefined : ServerName.__wrap(ret);
    }
    /**
     * Return the event ID as a string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.eventid_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const IdentityKeysFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_identitykeys_free(ptr >>> 0, 1));
/**
 * Struct holding the two public identity keys of an account.
 */
export class IdentityKeys {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(IdentityKeys.prototype);
        obj.__wbg_ptr = ptr;
        IdentityKeysFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        IdentityKeysFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_identitykeys_free(ptr, 0);
    }
    /**
     * The Ed25519 public key, used for signing.
     * @returns {Ed25519PublicKey}
     */
    get ed25519() {
        const ret = wasm.__wbg_get_identitykeys_ed25519(this.__wbg_ptr);
        return Ed25519PublicKey.__wrap(ret);
    }
    /**
     * The Ed25519 public key, used for signing.
     * @param {Ed25519PublicKey} arg0
     */
    set ed25519(arg0) {
        _assertClass(arg0, Ed25519PublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_identitykeys_ed25519(this.__wbg_ptr, ptr0);
    }
    /**
     * The Curve25519 public key, used for establish shared secrets.
     * @returns {Curve25519PublicKey}
     */
    get curve25519() {
        const ret = wasm.__wbg_get_identitykeys_curve25519(this.__wbg_ptr);
        return Curve25519PublicKey.__wrap(ret);
    }
    /**
     * The Curve25519 public key, used for establish shared secrets.
     * @param {Curve25519PublicKey} arg0
     */
    set curve25519(arg0) {
        _assertClass(arg0, Curve25519PublicKey);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_identitykeys_curve25519(this.__wbg_ptr, ptr0);
    }
}

const InboundCreationResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_inboundcreationresult_free(ptr >>> 0, 1));
/**
 * The result of an inbound ECIES channel establishment.
 */
export class InboundCreationResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(InboundCreationResult.prototype);
        obj.__wbg_ptr = ptr;
        InboundCreationResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InboundCreationResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_inboundcreationresult_free(ptr, 0);
    }
    /**
     * The established ECIES channel.
     * @returns {EstablishedEcies}
     */
    get channel() {
        const ret = wasm.__wbg_get_inboundcreationresult_channel(this.__wbg_ptr);
        return EstablishedEcies.__wrap(ret);
    }
    /**
     * The established ECIES channel.
     * @param {EstablishedEcies} arg0
     */
    set channel(arg0) {
        _assertClass(arg0, EstablishedEcies);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_inboundcreationresult_channel(this.__wbg_ptr, ptr0);
    }
    /**
     * The plaintext of the initial message.
     * @returns {string}
     */
    get message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_inboundcreationresult_message(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The plaintext of the initial message.
     * @param {string} arg0
     */
    set message(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
}

const InboundGroupSessionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_inboundgroupsession_free(ptr >>> 0, 1));
/**
 * Inbound group session.
 *
 * Inbound group sessions are used to exchange room messages between a group of
 * participants. Inbound group sessions are used to decrypt the room messages.
 */
export class InboundGroupSession {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(InboundGroupSession.prototype);
        obj.__wbg_ptr = ptr;
        InboundGroupSessionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InboundGroupSessionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_inboundgroupsession_free(ptr, 0);
    }
    /**
     * The room where this session is used in.
     * @returns {RoomId}
     */
    get roomId() {
        const ret = wasm.inboundgroupsession_roomId(this.__wbg_ptr);
        return RoomId.__wrap(ret);
    }
    /**
     * The Curve25519 key of the sender of this session, as a
     * [Curve25519PublicKey].
     * @returns {Curve25519PublicKey}
     */
    get senderKey() {
        const ret = wasm.inboundgroupsession_senderKey(this.__wbg_ptr);
        return Curve25519PublicKey.__wrap(ret);
    }
    /**
     * Returns the unique identifier for this session.
     * @returns {string}
     */
    get sessionId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.inboundgroupsession_sessionId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Has the session been imported from a file or server-side backup? As
     * opposed to being directly received as an `m.room_key` event.
     * @returns {boolean}
     */
    hasBeenImported() {
        const ret = wasm.inboundgroupsession_hasBeenImported(this.__wbg_ptr);
        return ret !== 0;
    }
}

const InvalidToDeviceEventFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_invalidtodeviceevent_free(ptr >>> 0, 1));
/**
 * Represents an invalid to-device event that was ignored (because it is
 * missing some mandatory fields, for example).
 */
export class InvalidToDeviceEvent {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(InvalidToDeviceEvent.prototype);
        obj.__wbg_ptr = ptr;
        InvalidToDeviceEventFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        InvalidToDeviceEventFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_invalidtodeviceevent_free(ptr, 0);
    }
    /**
     * The original message as received from sync, encoded as JSON.
     * @returns {string}
     */
    get rawEvent() {
        const ret = wasm.__wbg_get_invalidtodeviceevent_rawEvent(this.__wbg_ptr);
        return ret;
    }
    /**
     * The type of processed to-device event. Always {@link
     * ProcessedToDeviceEventType.Invalid} for this type.
     * @returns {ProcessedToDeviceEventType}
     */
    get type() {
        const ret = wasm.invalidtodeviceevent_type(this.__wbg_ptr);
        return ret;
    }
}

const KeysBackupRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_keysbackuprequest_free(ptr >>> 0, 1));
/**
 * A request that will back up a batch of room keys to the server
 * ([specification]).
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#put_matrixclientv3room_keyskeys
 */
export class KeysBackupRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(KeysBackupRequest.prototype);
        obj.__wbg_ptr = ptr;
        KeysBackupRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeysBackupRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keysbackuprequest_free(ptr, 0);
    }
    /**
     * The request ID.
     * @returns {string}
     */
    get id() {
        const ret = wasm.__wbg_get_keysbackuprequest_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A JSON-encoded object containing the rest of the payload: `rooms`.
     *
     * It represents the body of the HTTP request.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_keysbackuprequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * The backup version that these room keys should be part of.
     * @returns {string}
     */
    get version() {
        const ret = wasm.__wbg_get_keysbackuprequest_version(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `KeysBackupRequest`.
     * @param {string} id
     * @param {string} body
     * @param {string} version
     */
    constructor(id, body, version) {
        const ret = wasm.keysbackuprequest_new(id, body, version);
        this.__wbg_ptr = ret >>> 0;
        KeysBackupRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get its request type.
     * @returns {RequestType}
     */
    get type() {
        const ret = wasm.keysbackuprequest_type(this.__wbg_ptr);
        return ret;
    }
}

const KeysClaimRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_keysclaimrequest_free(ptr >>> 0, 1));
/**
 * Data for a request to the `/keys/claim` API endpoint
 * ([specification]).
 *
 * Claims one-time keys that can be used to establish 1-to-1 E2EE
 * sessions.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#post_matrixclientv3keysclaim
 */
export class KeysClaimRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(KeysClaimRequest.prototype);
        obj.__wbg_ptr = ptr;
        KeysClaimRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeysClaimRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keysclaimrequest_free(ptr, 0);
    }
    /**
     * The request ID.
     * @returns {string}
     */
    get id() {
        const ret = wasm.__wbg_get_keysclaimrequest_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A JSON-encoded object containing the rest of the payload: `timeout`,
     * `one_time_keys`.
     *
     * It represents the body of the HTTP request.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_keysclaimrequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `KeysClaimRequest`.
     * @param {string} id
     * @param {string} body
     */
    constructor(id, body) {
        const ret = wasm.keysclaimrequest_new(id, body);
        this.__wbg_ptr = ret >>> 0;
        KeysClaimRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get its request type.
     * @returns {RequestType}
     */
    get type() {
        const ret = wasm.keysclaimrequest_type(this.__wbg_ptr);
        return ret;
    }
}

const KeysQueryRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_keysqueryrequest_free(ptr >>> 0, 1));
/**
 * Data for a request to the `/keys/query` API endpoint
 * ([specification]).
 *
 * Returns the current devices and identity keys for the given users.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#post_matrixclientv3keysquery
 */
export class KeysQueryRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(KeysQueryRequest.prototype);
        obj.__wbg_ptr = ptr;
        KeysQueryRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeysQueryRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keysqueryrequest_free(ptr, 0);
    }
    /**
     * The request ID.
     * @returns {string}
     */
    get id() {
        const ret = wasm.__wbg_get_keysqueryrequest_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A JSON-encoded object containing the rest of the payload: `timeout`,
     * `device_keys`, `token`.
     *
     * It represents the body of the HTTP request.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_keysqueryrequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `KeysQueryRequest`.
     * @param {string} id
     * @param {string} body
     */
    constructor(id, body) {
        const ret = wasm.keysqueryrequest_new(id, body);
        this.__wbg_ptr = ret >>> 0;
        KeysQueryRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get its request type.
     * @returns {RequestType}
     */
    get type() {
        const ret = wasm.keysqueryrequest_type(this.__wbg_ptr);
        return ret;
    }
}

const KeysUploadRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_keysuploadrequest_free(ptr >>> 0, 1));
/**
 * Outgoing Requests *
 * Data for a request to the `/keys/upload` API endpoint
 * ([specification]).
 *
 * Publishes end-to-end encryption keys for the device.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#post_matrixclientv3keysupload
 */
export class KeysUploadRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(KeysUploadRequest.prototype);
        obj.__wbg_ptr = ptr;
        KeysUploadRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        KeysUploadRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_keysuploadrequest_free(ptr, 0);
    }
    /**
     * The request ID.
     * @returns {string}
     */
    get id() {
        const ret = wasm.__wbg_get_keysuploadrequest_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A JSON-encoded object containing the rest of the payload: `device_keys`,
     * `one_time_keys`, `fallback_keys`.
     *
     * It represents the body of the HTTP request.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_keysuploadrequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `KeysUploadRequest`.
     * @param {string} id
     * @param {string} body
     */
    constructor(id, body) {
        const ret = wasm.keysuploadrequest_new(id, body);
        this.__wbg_ptr = ret >>> 0;
        KeysUploadRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get its request type.
     * @returns {RequestType}
     */
    get type() {
        const ret = wasm.keysuploadrequest_type(this.__wbg_ptr);
        return ret;
    }
}

const MaybeSignatureFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_maybesignature_free(ptr >>> 0, 1));
/**
 * Represents a signature that is either valid _or_ that could not be
 * decoded.
 */
export class MaybeSignature {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MaybeSignature.prototype);
        obj.__wbg_ptr = ptr;
        MaybeSignatureFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MaybeSignatureFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_maybesignature_free(ptr, 0);
    }
    /**
     * Check whether the signature has been successfully decoded.
     * @returns {boolean}
     */
    isValid() {
        const ret = wasm.maybesignature_isValid(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Check whether the signature could not be successfully decoded.
     * @returns {boolean}
     */
    isInvalid() {
        const ret = wasm.maybesignature_isInvalid(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * The signature, if successfully decoded.
     * @returns {Signature | undefined}
     */
    get signature() {
        const ret = wasm.maybesignature_signature(this.__wbg_ptr);
        return ret === 0 ? undefined : Signature.__wrap(ret);
    }
    /**
     * The base64 encoded string that is claimed to contain a
     * signature but could not be decoded, if any.
     * @returns {string | undefined}
     */
    get invalidSignatureSource() {
        const ret = wasm.maybesignature_invalidSignatureSource(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
}

const MegolmDecryptionErrorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_megolmdecryptionerror_free(ptr >>> 0, 1));
/**
 * Js Decryption error with code.
 */
export class MegolmDecryptionError {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MegolmDecryptionError.prototype);
        obj.__wbg_ptr = ptr;
        MegolmDecryptionErrorFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MegolmDecryptionErrorFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_megolmdecryptionerror_free(ptr, 0);
    }
    /**
     * Description code for the error. See `DecryptionErrorCode`
     * @returns {DecryptionErrorCode}
     */
    get code() {
        const ret = wasm.__wbg_get_megolmdecryptionerror_code(this.__wbg_ptr);
        return ret;
    }
    /**
     * detailed description
     * @returns {string}
     */
    get description() {
        const ret = wasm.__wbg_get_megolmdecryptionerror_description(this.__wbg_ptr);
        return ret;
    }
    /**
     * Withheld code if any. Only for `UnknownMessageIndex` error code
     * @returns {string | undefined}
     */
    get maybe_withheld() {
        const ret = wasm.__wbg_get_megolmdecryptionerror_maybe_withheld(this.__wbg_ptr);
        return ret;
    }
}

const MegolmV1BackupKeyFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_megolmv1backupkey_free(ptr >>> 0, 1));
/**
 * The public part of the backup key.
 */
export class MegolmV1BackupKey {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(MegolmV1BackupKey.prototype);
        obj.__wbg_ptr = ptr;
        MegolmV1BackupKeyFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MegolmV1BackupKeyFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_megolmv1backupkey_free(ptr, 0);
    }
    /**
     * The actual base64 encoded public key.
     * @returns {string}
     */
    get publicKeyBase64() {
        const ret = wasm.megolmv1backupkey_publicKeyBase64(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the full name of the backup algorithm this backup key supports.
     * @returns {string}
     */
    get algorithm() {
        const ret = wasm.megolmv1backupkey_algorithm(this.__wbg_ptr);
        return ret;
    }
}

const MigrationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_migration_free(ptr >>> 0, 1));
/**
 * Migration routines
 *
 * The public methods are exposed as static methods on this class, for
 * namespacing and to enable easier mocking in unit tests.
 */
export class Migration {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        MigrationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_migration_free(ptr, 0);
    }
    /**
     * Import the base dataset from a libolm-based setup to a vodozemac-based
     * setup stored in IndexedDB.
     *
     * Populates the user credentials, Olm account, backup data, etc. This is
     * the first step in the migration process. Once this base data is
     * imported, further data can be imported with {@link
     * migrateOlmSessions}, {@link migrateMegolmSessions}, and TODO room
     * settings.
     *
     * # Arguments
     *
     * * `data` - The data to be migrated
     * * `pickle_key` - The libolm pickle key that was used to pickle the olm
     *   account objects.
     * * `store_handle` - A connection to the CryptoStore which will be used to
     *   store the vodozemac data.
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the migration operation. An instance of `JsLogger`.
     * @param {BaseMigrationData} data
     * @param {Uint8Array} pickle_key
     * @param {StoreHandle} store_handle
     * @param {any | null} [logger]
     * @returns {Promise<void>}
     */
    static migrateBaseData(data, pickle_key, store_handle, logger) {
        _assertClass(data, BaseMigrationData);
        _assertClass(store_handle, StoreHandle);
        const ret = wasm.migration_migrateBaseData(data.__wbg_ptr, pickle_key, store_handle.__wbg_ptr, isLikeNone(logger) ? 0 : addToExternrefTable0(logger));
        return ret;
    }
    /**
     * Migrate Olm sessions of a libolm-based setup to a vodozemac-based setup
     * stored in an indexedDB crypto store.
     *
     * Before this method can be used, {@link migrateBaseData} must be used to
     * import the base data into the crypto store.
     *
     * This method should be called a number of times, with separate batches of
     * `sessions`. If a progress display is given, it can be updated after
     * each batch is successfully imported.
     *
     * # Arguments
     *
     * * `sessions` - An `Array` of {@link PickledSession}s to import. Items
     *   inside `sessions` will be invalidated by this method.
     * * `pickle_key` - The libolm pickle key that was used to pickle the olm
     *   session objects.
     * * `store_handle` - A connection to the CryptoStore which will be used to
     *   store the vodozemac data.
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the migration operation. An instance of `JsLogger`.
     * @param {PickledSession[]} sessions
     * @param {Uint8Array} pickle_key
     * @param {StoreHandle} store_handle
     * @param {any | null} [logger]
     * @returns {Promise<void>}
     */
    static migrateOlmSessions(sessions, pickle_key, store_handle, logger) {
        const ptr0 = passArrayJsValueToWasm0(sessions, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(store_handle, StoreHandle);
        const ret = wasm.migration_migrateOlmSessions(ptr0, len0, pickle_key, store_handle.__wbg_ptr, isLikeNone(logger) ? 0 : addToExternrefTable0(logger));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Migrate Megolm sessions of a libolm-based setup to a vodozemac-based
     * setup stored in an indexedDB crypto store.
     *
     * Before this method can be used, {@link migrateBaseData} must be used to
     * import the base data into the crypto store.
     *
     * This method should be called a number of times, with separate batches of
     * `sessions`. If a progress display is given, it can be updated after
     * each batch is successfully imported.
     *
     * # Arguments
     *
     * * `sessions` - An `Array` of {@link PickledInboundGroupSession}s to
     *   import. Items inside `sessions` will be invalidated by this method.
     * * `pickle_key` - The libolm pickle key that was used to pickle the
     *   megolm session objects.
     * * `store_handle` - A connection to the CryptoStore which will be used to
     *   store the vodozemac data.
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the migration operation. An instance of `JsLogger`.
     * @param {PickledInboundGroupSession[]} sessions
     * @param {Uint8Array} pickle_key
     * @param {StoreHandle} store_handle
     * @param {any | null} [logger]
     * @returns {Promise<void>}
     */
    static migrateMegolmSessions(sessions, pickle_key, store_handle, logger) {
        const ptr0 = passArrayJsValueToWasm0(sessions, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(store_handle, StoreHandle);
        const ret = wasm.migration_migrateMegolmSessions(ptr0, len0, pickle_key, store_handle.__wbg_ptr, isLikeNone(logger) ? 0 : addToExternrefTable0(logger));
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}

const OlmMachineFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_olmmachine_free(ptr >>> 0, 1));
/**
 * State machine implementation of the Olm/Megolm encryption protocol
 * used for Matrix end to end encryption.
 */
export class OlmMachine {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OlmMachine.prototype);
        obj.__wbg_ptr = ptr;
        OlmMachineFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OlmMachineFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_olmmachine_free(ptr, 0);
    }
    /**
     * Constructor will always fail. To create a new `OlmMachine`, please use
     * the `initialize` method.
     *
     * Why this pattern? `initialize` returns a `Promise`. Returning a
     * `Promise` from a constructor is not idiomatic in JavaScript.
     */
    constructor() {
        const ret = wasm.olmmachine_new();
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        OlmMachineFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Create a new `OlmMachine`.
     *
     * The created machine will keep the encryption keys either in a IndexedDB
     * based store, or in a memory store and once the objects is dropped,
     * the keys will be lost.
     *
     * # Arguments
     *
     * * `user_id` - represents the unique ID of the user that owns this
     * machine.
     *
     * * `device_id` - represents the unique ID of the device
     * that owns this machine.
     *
     * * `store_name` - The name that should be used to open the IndexedDB
     *   based database. If this isn't provided, a memory-only store will be
     *   used. *Note* the memory-only store will lose your E2EE keys when the
     *   `OlmMachine` gets dropped.
     *
     * * `store_passphrase` - The passphrase that should be used to encrypt the
     *   IndexedDB-based store.
     *
     * * `logger` - Optional logger to use for all operations on this machine.
     *   An instance of `JsLogger`.
     * @param {UserId} user_id
     * @param {DeviceId} device_id
     * @param {string | null} [store_name]
     * @param {string | null} [store_passphrase]
     * @param {any | null} [logger]
     * @returns {Promise<OlmMachine>}
     */
    static initialize(user_id, device_id, store_name, store_passphrase, logger) {
        _assertClass(user_id, UserId);
        _assertClass(device_id, DeviceId);
        var ptr0 = isLikeNone(store_name) ? 0 : passStringToWasm0(store_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(store_passphrase) ? 0 : passStringToWasm0(store_passphrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_initialize(user_id.__wbg_ptr, device_id.__wbg_ptr, ptr0, len0, ptr1, len1, isLikeNone(logger) ? 0 : addToExternrefTable0(logger));
        return ret;
    }
    /**
     * Create a new `OlmMachine` backed by an existing store.
     *
     * # Arguments
     *
     * * `user_id` - represents the unique ID of the user that owns this
     * machine.
     *
     * * `device_id` - represents the unique ID of the device
     * that owns this machine.
     *
     * * `store_handle` - the connection to the crypto store to be used for
     *   this machine.
     *
     * * `logger` - Optional logger to use for all operations on this machine.
     *   An instance of `JsLogger`.
     * @param {UserId} user_id
     * @param {DeviceId} device_id
     * @param {StoreHandle} store_handle
     * @param {any | null} [logger]
     * @returns {Promise<OlmMachine>}
     */
    static initFromStore(user_id, device_id, store_handle, logger) {
        _assertClass(user_id, UserId);
        _assertClass(device_id, DeviceId);
        _assertClass(store_handle, StoreHandle);
        const ret = wasm.olmmachine_initFromStore(user_id.__wbg_ptr, device_id.__wbg_ptr, store_handle.__wbg_ptr, isLikeNone(logger) ? 0 : addToExternrefTable0(logger));
        return ret;
    }
    /**
     * The unique user ID that owns this `OlmMachine` instance.
     * @returns {UserId}
     */
    get userId() {
        const ret = wasm.olmmachine_userId(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The unique device ID that identifies this `OlmMachine`.
     * @returns {DeviceId}
     */
    get deviceId() {
        const ret = wasm.olmmachine_deviceId(this.__wbg_ptr);
        return DeviceId.__wrap(ret);
    }
    /**
     * The time, in milliseconds since the unix epoch, at which the `Account`
     * backing this `OlmMachine` was created.
     *
     * An `Account` is created when an `OlmMachine` is first instantiated
     * against a given `Store`, at which point it creates identity keys etc.
     * This method returns the timestamp, according to the local clock, at
     * which that happened.
     * @returns {number}
     */
    get deviceCreationTimeMs() {
        const ret = wasm.olmmachine_deviceCreationTimeMs(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the public parts of our Olm identity keys.
     * @returns {IdentityKeys}
     */
    get identityKeys() {
        const ret = wasm.olmmachine_identityKeys(this.__wbg_ptr);
        return IdentityKeys.__wrap(ret);
    }
    /**
     * Get the display name of our own device.
     * @returns {Promise<any>}
     */
    get displayName() {
        const ret = wasm.olmmachine_displayName(this.__wbg_ptr);
        return ret;
    }
    /**
     * Whether automatic transmission of room key requests is enabled.
     *
     * Room key requests allow the device to request room keys that it might
     * have missed in the original share using `m.room_key_request`
     * events.
     * @returns {boolean}
     */
    get roomKeyRequestsEnabled() {
        const ret = wasm.olmmachine_roomKeyRequestsEnabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Enable or disable automatic transmission of room key requests.
     * @param {boolean} enabled
     */
    set roomKeyRequestsEnabled(enabled) {
        wasm.olmmachine_set_roomKeyRequestsEnabled(this.__wbg_ptr, enabled);
    }
    /**
     * Whether room key forwarding is enabled.
     *
     * If room key forwarding is enabled, we will automatically reply to
     * incoming `m.room_key_request` messages from verified devices by
     * forwarding the requested key (if we have it).
     * @returns {boolean}
     */
    get roomKeyForwardingEnabled() {
        const ret = wasm.olmmachine_roomKeyForwardingEnabled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Enable or disable room key forwarding.
     * @param {boolean} enabled
     */
    set roomKeyForwardingEnabled(enabled) {
        wasm.olmmachine_set_roomKeyForwardingEnabled(this.__wbg_ptr, enabled);
    }
    /**
     * Get the list of users whose devices we are currently tracking.
     *
     * A user can be marked for tracking using the
     * [`update_tracked_users`](#method.update_tracked_users) method.
     *
     * Returns a `Set<UserId>`.
     * @returns {Promise<any>}
     */
    trackedUsers() {
        const ret = wasm.olmmachine_trackedUsers(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Update the list of tracked users.
     *
     * The OlmMachine maintains a list of users whose devices we are keeping
     * track of: these are known as "tracked users". These must be users
     * that we share a room with, so that the server sends us updates for
     * their device lists.
     *
     * # Arguments
     *
     * * `users` - An array of user ids that should be added to the list of
     *   tracked users
     *
     * Any users that hadn't been seen before will be flagged for a key query
     * immediately, and whenever `receive_sync_changes` receives a
     * "changed" notification for that user in the future.
     *
     * Users that were already in the list are unaffected.
     *
     * Items inside `users` will be invalidated by this method. Be careful not
     * to use the `UserId`s after this method has been called.
     * @param {UserId[]} users
     * @returns {Promise<any>}
     */
    updateTrackedUsers(users) {
        const ptr0 = passArrayJsValueToWasm0(users, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_updateTrackedUsers(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Mark all tracked users as dirty.
     *
     * All users *whose device lists we are tracking* are flagged as needing a
     * key query. Users whose devices we are not tracking are ignored.
     * @returns {Promise<void>}
     */
    markAllTrackedUsersAsDirty() {
        const ret = wasm.olmmachine_markAllTrackedUsersAsDirty(this.__wbg_ptr);
        return ret;
    }
    /**
     * Handle to-device events and one-time key counts from a sync
     * response.
     *
     * This will decrypt and handle to-device events returning the
     * decrypted versions of them.
     *
     * To decrypt an event from the room timeline call
     * `decrypt_room_event`.
     *
     * # Arguments
     *
     * * `to_device_events`: the JSON-encoded to-device evens from the `/sync`
     *   response
     * * `changed_devices`: the mapping of changed and left devices, from the
     *   `/sync` response
     * * `one_time_keys_counts`: The number of one-time keys on the server,
     *   from the `/sync` response. A `Map` from string (encryption algorithm)
     *   to number (number of keys).
     * * `unused_fallback_keys`: Optionally, a `Set` of unused fallback keys on
     *   the server, from the `/sync` response. If this is set, it is used to
     *   determine if new fallback keys should be uploaded.
     * * `decryption_settings`: Optionally, the settings to use when decrypting
     *   to-device events. If not set, to-device events will be decrypted with
     *   a {@link TrustRequirement} of `Untrusted`.
     *
     * # Returns
     *
     * A list of values, each of which can be any of:
     *   * {@link DecryptedToDeviceEvent}
     *   * {@link PlainTextToDeviceEvent}
     *   * {@link UTDToDeviceEvent}
     *   * {@link InvalidToDeviceEvent}
     * @param {string} to_device_events
     * @param {DeviceLists} changed_devices
     * @param {Map<any, any>} one_time_keys_counts
     * @param {Set<any> | null} [unused_fallback_keys]
     * @param {DecryptionSettings | null} [decryption_settings]
     * @returns {Promise<any>}
     */
    receiveSyncChanges(to_device_events, changed_devices, one_time_keys_counts, unused_fallback_keys, decryption_settings) {
        const ptr0 = passStringToWasm0(to_device_events, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(changed_devices, DeviceLists);
        let ptr1 = 0;
        if (!isLikeNone(decryption_settings)) {
            _assertClass(decryption_settings, DecryptionSettings);
            ptr1 = decryption_settings.__destroy_into_raw();
        }
        const ret = wasm.olmmachine_receiveSyncChanges(this.__wbg_ptr, ptr0, len0, changed_devices.__wbg_ptr, one_time_keys_counts, isLikeNone(unused_fallback_keys) ? 0 : addToExternrefTable0(unused_fallback_keys), ptr1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Get the outgoing requests that need to be sent out.
     *
     * This returns a list of values, each of which can be any of:
     *   * {@link KeysUploadRequest},
     *   * {@link KeysQueryRequest},
     *   * {@link KeysClaimRequest},
     *   * {@link ToDeviceRequest},
     *   * {@link SignatureUploadRequest},
     *   * {@link RoomMessageRequest}, or
     *   * {@link KeysBackupRequest}.
     *
     * Those requests need to be sent out to the server and the
     * responses need to be passed back to the state machine
     * using {@link OlmMachine.markRequestAsSent}.
     * @returns {Promise<any>}
     */
    outgoingRequests() {
        const ret = wasm.olmmachine_outgoingRequests(this.__wbg_ptr);
        return ret;
    }
    /**
     * Mark the request with the given request ID as sent (see
     * `outgoing_requests`).
     *
     * Arguments are:
     *
     * * `request_id` represents the unique ID of the request that was sent
     *   out. This is needed to couple the response with the now sent out
     *   request.
     * * `response_type` represents the type of the request that was sent out.
     * * `response` represents the response that was received from the server
     *   after the outgoing request was sent out.
     * @param {string} request_id
     * @param {RequestType} request_type
     * @param {string} response
     * @returns {Promise<any>}
     */
    markRequestAsSent(request_id, request_type, response) {
        const ptr0 = passStringToWasm0(request_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(response, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_markRequestAsSent(this.__wbg_ptr, ptr0, len0, request_type, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Encrypt a room message for the given room.
     *
     * **Note**: A room key needs to be shared with the group of users that are
     * members in the given room. If this is not done this method will panic.
     *
     * The usual flow to encrypt an event using this state machine is as
     * follows:
     *
     * 1. Get the one-time key claim request to establish 1:1 Olm sessions for
     *    the room members of the room we wish to participate in. This is done
     *    using the [`get_missing_sessions()`](Self::get_missing_sessions)
     *    method. This method call should be locked per call.
     *
     * 2. Share a room key with all the room members using the
     *    [`share_room_key()`](Self::share_room_key). This method call should
     *    be locked per room.
     *
     * 3. Encrypt the event using this method.
     *
     * 4. Send the encrypted event to the server.
     *
     * After the room key is shared steps 1 and 2 will become noops, unless
     * there's some changes in the room membership or in the list of devices a
     * member has.
     *
     *
     * `room_id` is the ID of the room for which the message should
     * be encrypted. `event_type` is the type of the event. `content`
     * is the plaintext content of the message that should be
     * encrypted.
     *
     * # Panics
     *
     * Panics if a group session for the given room wasn't shared
     * beforehand.
     * @param {RoomId} room_id
     * @param {string} event_type
     * @param {string} content
     * @returns {Promise<any>}
     */
    encryptRoomEvent(room_id, event_type, content) {
        _assertClass(room_id, RoomId);
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_encryptRoomEvent(this.__wbg_ptr, room_id.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Encrypt a state event for the given room.
     *
     * This method encrypts a state event for the specified room, using the
     * current group session. The event will be encrypted so that only
     * authorized room members can decrypt it.
     *
     * **Note**: A room key must have been shared with the group of users in
     * the room before calling this method. If not, this method will panic.
     *
     * The usual flow to encrypt a state event using this machine is identical
     * to that outlined for [`OlmMachine::encrypt_room_event`].
     *
     * # Arguments
     *
     * * `room_id` - The ID of the room for which the state event should be
     *   encrypted.
     * * `event_type` - The type of the state event.
     * * `state_key` - The state key for the event.
     * * `content` - The plaintext JSON content of the event to encrypt.
     *
     * # Returns
     *
     * A `Promise` resolving to a JSON string containing the encrypted event.
     *
     * # Panics
     *
     * Panics if a group session for the given room was not previously shared.
     * @param {RoomId} room_id
     * @param {string} event_type
     * @param {string} state_key
     * @param {string} content
     * @returns {Promise<any>}
     */
    encryptStateEvent(room_id, event_type, state_key, content) {
        _assertClass(room_id, RoomId);
        const ptr0 = passStringToWasm0(event_type, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(state_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(content, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_encryptStateEvent(this.__wbg_ptr, room_id.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Decrypt an event from a room timeline.
     *
     * # Arguments
     *
     * * `event`, the event that should be decrypted.
     * * `room_id`, the ID of the room where the event was sent to.
     *
     * # Returns
     *
     * A `Promise` which resolves to a {@link DecryptedRoomEvent} instance, or
     * rejects with a {@link MegolmDecryptionError} instance.
     * @param {string} event
     * @param {RoomId} room_id
     * @param {DecryptionSettings} decryption_settings
     * @returns {Promise<any>}
     */
    decryptRoomEvent(event, room_id, decryption_settings) {
        const ptr0 = passStringToWasm0(event, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(room_id, RoomId);
        _assertClass(decryption_settings, DecryptionSettings);
        const ret = wasm.olmmachine_decryptRoomEvent(this.__wbg_ptr, ptr0, len0, room_id.__wbg_ptr, decryption_settings.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Get encryption info for a decrypted timeline event.
     *
     * This recalculates the `EncryptionInfo` data that is returned by
     * `decryptRoomEvent`, based on the current
     * verification status of the sender, etc.
     *
     * Returns an error for an unencrypted event.
     *
     * # Arguments
     *
     * * `event` - The event to get information for.
     * * `room_id` - The ID of the room where the event was sent to.
     *
     * # Returns
     *
     * {@link EncryptionInfo}
     * @param {string} event
     * @param {RoomId} room_id
     * @returns {Promise<any>}
     */
    getRoomEventEncryptionInfo(event, room_id) {
        const ptr0 = passStringToWasm0(event, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(room_id, RoomId);
        const ret = wasm.olmmachine_getRoomEventEncryptionInfo(this.__wbg_ptr, ptr0, len0, room_id.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Get the status of the private cross signing keys.
     *
     * This can be used to check which private cross signing keys we
     * have stored locally.
     * @returns {Promise<any>}
     */
    crossSigningStatus() {
        const ret = wasm.olmmachine_crossSigningStatus(this.__wbg_ptr);
        return ret;
    }
    /**
     * Export all the secrets we have in the store into a {@link
     * SecretsBundle}.
     *
     * This method will export all the private cross-signing keys and, if
     * available, the private part of a backup key and its accompanying
     * version.
     *
     * The method will fail if we don't have all three private cross-signing
     * keys available.
     *
     * **Warning**: Only export this and share it with a trusted recipient,
     * i.e. if an existing device is sharing this with a new device.
     * @returns {Promise<SecretsBundle>}
     */
    exportSecretsBundle() {
        const ret = wasm.olmmachine_exportSecretsBundle(this.__wbg_ptr);
        return ret;
    }
    /**
     * Import and persists secrets from a {@link SecretsBundle}.
     *
     * This method will import all the private cross-signing keys and, if
     * available, the private part of a backup key and its accompanying
     * version into the store.
     *
     * **Warning**: Only import this from a trusted source, i.e. if an existing
     * device is sharing this with a new device. The imported cross-signing
     * keys will create a {@link OwnUserIdentity} and mark it as verified.
     *
     * The backup key will be persisted in the store and can be enabled using
     * the BackupMachine.
     *
     * The provided `SecretsBundle` is freed by this method; be careful not to
     * use it once this method has been called.
     * @param {SecretsBundle} bundle
     * @returns {Promise<void>}
     */
    importSecretsBundle(bundle) {
        _assertClass(bundle, SecretsBundle);
        var ptr0 = bundle.__destroy_into_raw();
        const ret = wasm.olmmachine_importSecretsBundle(this.__wbg_ptr, ptr0);
        return ret;
    }
    /**
     * Export all the private cross signing keys we have.
     *
     * The export will contain the seeds for the ed25519 keys as
     * unpadded base64 encoded strings.
     *
     * Returns `null` if we don’t have any private cross signing keys;
     * otherwise returns a `CrossSigningKeyExport`.
     * @returns {Promise<any>}
     */
    exportCrossSigningKeys() {
        const ret = wasm.olmmachine_exportCrossSigningKeys(this.__wbg_ptr);
        return ret;
    }
    /**
     * Import our private cross signing keys.
     *
     * The keys should be provided as unpadded-base64-encoded strings.
     *
     * Returns a `CrossSigningStatus`.
     * @param {string | null} [master_key]
     * @param {string | null} [self_signing_key]
     * @param {string | null} [user_signing_key]
     * @returns {Promise<any>}
     */
    importCrossSigningKeys(master_key, self_signing_key, user_signing_key) {
        var ptr0 = isLikeNone(master_key) ? 0 : passStringToWasm0(master_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(self_signing_key) ? 0 : passStringToWasm0(self_signing_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(user_signing_key) ? 0 : passStringToWasm0(user_signing_key, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_importCrossSigningKeys(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2);
        return ret;
    }
    /**
     * Create a new cross signing identity and get the upload request
     * to push the new public keys to the server.
     *
     * Warning: This will delete any existing cross signing keys that
     * might exist on the server and thus will reset the trust
     * between all the devices.
     *
     * Uploading these keys will require user interactive auth.
     *
     * # Arguments
     *
     * * `reset`, whether the method should create a new identity or use the
     *   existing one during the request. If set to true, the request will
     *   attempt to upload a new identity. If set to false, the request will
     *   attempt to upload the existing identity. Since the uploading process
     *   requires user interactive authentication, which involves sending out
     *   the same request multiple times, setting this argument to false
     *   enables you to reuse the same request.
     *
     * Returns a {@link CrossSigningBootstrapRequests}.
     * @param {boolean} reset
     * @returns {Promise<any>}
     */
    bootstrapCrossSigning(reset) {
        const ret = wasm.olmmachine_bootstrapCrossSigning(this.__wbg_ptr, reset);
        return ret;
    }
    /**
     * Get the cross signing user identity of a user.
     *
     * Returns a promise for an {@link OwnUserIdentity}, a
     * {@link OtherUserIdentity}, or `undefined`.
     * @param {UserId} user_id
     * @returns {Promise<any>}
     */
    getIdentity(user_id) {
        _assertClass(user_id, UserId);
        const ret = wasm.olmmachine_getIdentity(this.__wbg_ptr, user_id.__wbg_ptr);
        return ret;
    }
    /**
     * Sign the given message using our device key and if available
     * cross-signing master key.
     * @param {string} message
     * @returns {Promise<any>}
     */
    sign(message) {
        const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_sign(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Invalidate the currently active outbound group session for the
     * given room.
     *
     * Returns true if a session was invalidated, false if there was
     * no session to invalidate.
     * @param {RoomId} room_id
     * @returns {Promise<any>}
     */
    invalidateGroupSession(room_id) {
        _assertClass(room_id, RoomId);
        const ret = wasm.olmmachine_invalidateGroupSession(this.__wbg_ptr, room_id.__wbg_ptr);
        return ret;
    }
    /**
     * Get to-device requests to share a room key with users in a room.
     *
     * `room_id` is the room ID. `users` is an array of `UserId`
     * objects. `encryption_settings` are an `EncryptionSettings`
     * object.
     *
     * Note: Care should be taken that only one such request at a
     * time is in flight for the same room, e.g. using a lock.
     *
     * Returns an array of `ToDeviceRequest`s.
     *
     * Items inside `users` will be invalidated by this method. Be careful not
     * to use the `UserId`s after this method has been called.
     * @param {RoomId} room_id
     * @param {UserId[]} users
     * @param {EncryptionSettings} encryption_settings
     * @returns {Promise<any>}
     */
    shareRoomKey(room_id, users, encryption_settings) {
        _assertClass(room_id, RoomId);
        const ptr0 = passArrayJsValueToWasm0(users, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(encryption_settings, EncryptionSettings);
        const ret = wasm.olmmachine_shareRoomKey(this.__wbg_ptr, room_id.__wbg_ptr, ptr0, len0, encryption_settings.__wbg_ptr);
        return ret;
    }
    /**
     * Generate an "out-of-band" key query request for the given set of users.
     *
     * This can be useful if we need the results from `getIdentity` or
     * `getUserDevices` to be as up-to-date as possible.
     *
     * Returns a `KeysQueryRequest` object. The response of the request should
     * be passed to the `OlmMachine` with the `mark_request_as_sent`.
     *
     * Items inside `users` will be invalidated by this method. Be careful not
     * to use the `UserId`s after this method has been called.
     * @param {UserId[]} users
     * @returns {KeysQueryRequest}
     */
    queryKeysForUsers(users) {
        const ptr0 = passArrayJsValueToWasm0(users, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_queryKeysForUsers(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return KeysQueryRequest.__wrap(ret[0]);
    }
    /**
     * Get the a key claiming request for the user/device pairs that
     * we are missing Olm sessions for.
     *
     * Returns `null` if no key claiming request needs to be sent
     * out, otherwise it returns a `KeysClaimRequest` object.
     *
     * Sessions need to be established between devices so group
     * sessions for a room can be shared with them.
     *
     * This should be called every time a group session needs to be
     * shared as well as between sync calls. After a sync some
     * devices may request room keys without us having a valid Olm
     * session with them, making it impossible to server the room key
     * request, thus it’s necessary to check for missing sessions
     * between sync as well.
     *
     * Note: Care should be taken that only one such request at a
     * time is in flight, e.g. using a lock.
     *
     * The response of a successful key claiming requests needs to be
     * passed to the `OlmMachine` with the `mark_request_as_sent`.
     *
     * `users` represents the list of users that we should check if
     * we lack a session with one of their devices. This can be an
     * empty iterator when calling this method between sync requests.
     *
     * Items inside `users` will be invalidated by this method. Be careful not
     * to use the `UserId`s after this method has been called.
     * @param {UserId[]} users
     * @returns {Promise<any>}
     */
    getMissingSessions(users) {
        const ptr0 = passArrayJsValueToWasm0(users, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_getMissingSessions(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get a map holding all the devices of a user.
     *
     * ### Parameters
     *
     * * `user_id` - The unique ID of the user that the device belongs to.
     *
     * * `timeout_secs` - The amount of time we should wait for a `/keys/query`
     *   response before returning if the user's device list has been marked as
     *   stale. **Note**, this assumes that the requests from {@link
     *   OlmMachine.outgoingRequests} are being processed and sent out.
     *
     *   If unset, we will return immediately even if the device list is stale.
     *
     * ### Returns
     *
     * A {@link UserDevices} object.
     * @param {UserId} user_id
     * @param {number | null} [timeout_secs]
     * @returns {Promise<any>}
     */
    getUserDevices(user_id, timeout_secs) {
        _assertClass(user_id, UserId);
        const ret = wasm.olmmachine_getUserDevices(this.__wbg_ptr, user_id.__wbg_ptr, !isLikeNone(timeout_secs), isLikeNone(timeout_secs) ? 0 : timeout_secs);
        return ret;
    }
    /**
     * Get a specific device of a user.
     *
     * ### Parameters
     *
     * * `user_id` - The unique ID of the user that the device belongs to.
     *
     * * `device_id` - The unique ID of the device.
     *
     * * `timeout_secs` - The amount of time we should wait for a `/keys/query`
     *   response before returning if the user's device list has been marked as
     *   stale. **Note**, this assumes that the requests from {@link
     *   OlmMachine.outgoingRequests} are being processed and sent out.
     *
     *   If unset, we will return immediately even if the device list is stale.
     *
     * ### Returns
     *
     * If the device is known, a {@link Device}. Otherwise, `undefined`.
     * @param {UserId} user_id
     * @param {DeviceId} device_id
     * @param {number | null} [timeout_secs]
     * @returns {Promise<any>}
     */
    getDevice(user_id, device_id, timeout_secs) {
        _assertClass(user_id, UserId);
        _assertClass(device_id, DeviceId);
        const ret = wasm.olmmachine_getDevice(this.__wbg_ptr, user_id.__wbg_ptr, device_id.__wbg_ptr, !isLikeNone(timeout_secs), isLikeNone(timeout_secs) ? 0 : timeout_secs);
        return ret;
    }
    /**
     * Get a verification object for the given user ID with the given
     * flow ID (a to-device request ID if the verification has been
     * requested by a to-device request, or a room event ID if the
     * verification has been requested by a room event).
     *
     * It returns a “`Verification` object”, which is either a `Sas`
     * or `Qr` object.
     * @param {UserId} user_id
     * @param {string} flow_id
     * @returns {any}
     */
    getVerification(user_id, flow_id) {
        _assertClass(user_id, UserId);
        const ptr0 = passStringToWasm0(flow_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_getVerification(this.__wbg_ptr, user_id.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Get a verification request object with the given flow ID.
     * @param {UserId} user_id
     * @param {string} flow_id
     * @returns {VerificationRequest | undefined}
     */
    getVerificationRequest(user_id, flow_id) {
        _assertClass(user_id, UserId);
        const ptr0 = passStringToWasm0(flow_id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_getVerificationRequest(this.__wbg_ptr, user_id.__wbg_ptr, ptr0, len0);
        return ret === 0 ? undefined : VerificationRequest.__wrap(ret);
    }
    /**
     * Get all the verification requests of a given user.
     * @param {UserId} user_id
     * @returns {Array<any>}
     */
    getVerificationRequests(user_id) {
        _assertClass(user_id, UserId);
        const ret = wasm.olmmachine_getVerificationRequests(this.__wbg_ptr, user_id.__wbg_ptr);
        return ret;
    }
    /**
     * Receive a verification event.
     *
     * This method can be used to pass verification events that are happening
     * in rooms to the `OlmMachine`. The event should be in the decrypted form.
     * @param {string} event
     * @param {RoomId} room_id
     * @returns {Promise<any>}
     */
    receiveVerificationEvent(event, room_id) {
        const ptr0 = passStringToWasm0(event, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        _assertClass(room_id, RoomId);
        const ret = wasm.olmmachine_receiveVerificationEvent(this.__wbg_ptr, ptr0, len0, room_id.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Export the keys that match the given predicate.
     *
     * `predicate` is a closure that will be called for every known
     * `InboundGroupSession`, which represents a room key. If the closure
     * returns `true`, the `InboundGroupSession` will be included in the
     * export; otherwise it won't.
     *
     * Returns a Promise containing a Result containing a String which is a
     * JSON-encoded array of ExportedRoomKey objects.
     * @param {Function} predicate
     * @returns {Promise<any>}
     */
    exportRoomKeys(predicate) {
        const ret = wasm.olmmachine_exportRoomKeys(this.__wbg_ptr, predicate);
        return ret;
    }
    /**
     * Import the given room keys into our store.
     *
     * Mostly, a deprecated alias for `importExportedRoomKeys`, though the
     * return type is different.
     *
     * Returns a String containing a JSON-encoded object, holding three
     * properties:
     *  * `total_count` (the total number of keys found in the export data).
     *  * `imported_count` (the number of keys that were imported).
     *  * `keys` (the keys that were imported; a map from room id to a map of
     *    the sender key to a list of session ids).
     *
     * @deprecated Use `importExportedRoomKeys` or `importBackedUpRoomKeys`.
     * @param {string} exported_room_keys
     * @param {Function} progress_listener
     * @returns {Promise<any>}
     */
    importRoomKeys(exported_room_keys, progress_listener) {
        const ptr0 = passStringToWasm0(exported_room_keys, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_importRoomKeys(this.__wbg_ptr, ptr0, len0, progress_listener);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Import the given room keys into our store.
     *
     * `exported_keys` is a JSON-encoded list of previously exported keys that
     * should be imported into our store. If we already have a better
     * version of a key, the key will _not_ be imported.
     *
     * `progress_listener` is a closure that takes 2 `BigInt` arguments:
     * `progress` and `total`, and returns nothing.
     *
     * Returns a {@link RoomKeyImportResult}.
     * @param {string} exported_room_keys
     * @param {Function} progress_listener
     * @returns {Promise<any>}
     */
    importExportedRoomKeys(exported_room_keys, progress_listener) {
        const ptr0 = passStringToWasm0(exported_room_keys, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_importExportedRoomKeys(this.__wbg_ptr, ptr0, len0, progress_listener);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Import the given room keys into our store.
     *
     * # Arguments
     *
     * * `backed_up_room_keys`: keys that were retrieved from backup and that
     *   should be added to our store (provided they are better than our
     *   current versions of those keys). Specifically, it should be a Map from
     *   {@link RoomId}, to a Map from session ID to a (decrypted) session data
     *   structure.
     *
     * * `progress_listener`: an optional callback that takes 3 arguments:
     *   `progress` (the number of keys that have successfully been imported),
     *   `total` (the total number of keys), and `failures` (the number of keys
     *   that failed to import), and returns nothing.
     *
     * # Returns
     *
     * A {@link RoomKeyImportResult}.
     * @param {Map<any, any>} backed_up_room_keys
     * @param {Function | null | undefined} progress_listener
     * @param {string} backup_version
     * @returns {Promise<any>}
     */
    importBackedUpRoomKeys(backed_up_room_keys, progress_listener, backup_version) {
        const ptr0 = passStringToWasm0(backup_version, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_importBackedUpRoomKeys(this.__wbg_ptr, backed_up_room_keys, isLikeNone(progress_listener) ? 0 : addToExternrefTable0(progress_listener), ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Store the backup decryption key in the crypto store.
     *
     * This is useful if the client wants to support gossiping of the backup
     * key.
     *
     * Returns `Promise<void>`.
     * @param {BackupDecryptionKey} decryption_key
     * @param {string} version
     * @returns {Promise<any>}
     */
    saveBackupDecryptionKey(decryption_key, version) {
        _assertClass(decryption_key, BackupDecryptionKey);
        const ptr0 = passStringToWasm0(version, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_saveBackupDecryptionKey(this.__wbg_ptr, decryption_key.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Get the backup keys we have saved in our store.
     * Returns a `Promise` for {@link BackupKeys}.
     * @returns {Promise<any>}
     */
    getBackupKeys() {
        const ret = wasm.olmmachine_getBackupKeys(this.__wbg_ptr);
        return ret;
    }
    /**
     * Check if the given backup has been verified by us or by another of our
     * devices that we trust.
     *
     * The `backup_info` should be a Javascript object with the following
     * format:
     *
     * ```json
     * {
     *     "algorithm": "m.megolm_backup.v1.curve25519-aes-sha2",
     *     "auth_data": {
     *         "public_key":"XjhWTCjW7l59pbfx9tlCBQolfnIQWARoKOzjTOPSlWM",
     *         "signatures": {}
     *     }
     * }
     * ```
     *
     * Returns a {@link SignatureVerification} object.
     * @param {any} backup_info
     * @returns {Promise<any>}
     */
    verifyBackup(backup_info) {
        const ret = wasm.olmmachine_verifyBackup(this.__wbg_ptr, backup_info);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Activate the given backup key to be used with the given backup version.
     *
     * **Warning**: The caller needs to make sure that the given `BackupKey` is
     * trusted, otherwise we might be encrypting room keys that a malicious
     * party could decrypt.
     *
     * The {@link verifyBackup} method can be used to do so.
     *
     * Returns `Promise<void>`.
     * @param {string} public_key_base_64
     * @param {string} version
     * @returns {Promise<any>}
     */
    enableBackupV1(public_key_base_64, version) {
        const ptr0 = passStringToWasm0(public_key_base_64, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(version, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_enableBackupV1(this.__wbg_ptr, ptr0, len0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Are we able to encrypt room keys.
     *
     * This returns true if we have an active `BackupKey` and backup version
     * registered with the state machine.
     *
     * Returns `Promise<bool>`.
     * @returns {Promise<any>}
     */
    isBackupEnabled() {
        const ret = wasm.olmmachine_isBackupEnabled(this.__wbg_ptr);
        return ret;
    }
    /**
     * Disable and reset our backup state.
     *
     * This will remove any pending backup request, remove the backup key and
     * reset the backup state of each room key we have.
     *
     * Returns `Promise<void>`.
     * @returns {Promise<any>}
     */
    disableBackup() {
        const ret = wasm.olmmachine_disableBackup(this.__wbg_ptr);
        return ret;
    }
    /**
     * Encrypt a batch of room keys and return a request that needs to be sent
     * out to backup the room keys.
     *
     * Returns an optional {@link KeysBackupRequest}.
     * @returns {Promise<any>}
     */
    backupRoomKeys() {
        const ret = wasm.olmmachine_backupRoomKeys(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the number of backed up room keys and the total number of room keys.
     * Returns a {@link RoomKeyCounts}.
     * @returns {Promise<any>}
     */
    roomKeyCounts() {
        const ret = wasm.olmmachine_roomKeyCounts(this.__wbg_ptr);
        return ret;
    }
    /**
     * Encrypt the list of exported room keys using the given passphrase.
     *
     * `exported_room_keys` is a list of sessions that should be encrypted
     * (it's generally returned by `export_room_keys`). `passphrase` is the
     * passphrase that will be used to encrypt the exported room keys. And
     * `rounds` is the number of rounds that should be used for the key
     * derivation when the passphrase gets turned into an AES key. More rounds
     * are increasingly computationnally intensive and as such help against
     * brute-force attacks. Should be at least `10_000`, while values in the
     * `100_000` ranges should be preferred.
     * @param {string} exported_room_keys
     * @param {string} passphrase
     * @param {number} rounds
     * @returns {string}
     */
    static encryptExportedRoomKeys(exported_room_keys, passphrase, rounds) {
        let deferred4_0;
        let deferred4_1;
        try {
            const ptr0 = passStringToWasm0(exported_room_keys, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(passphrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.olmmachine_encryptExportedRoomKeys(ptr0, len0, ptr1, len1, rounds);
            var ptr3 = ret[0];
            var len3 = ret[1];
            if (ret[3]) {
                ptr3 = 0; len3 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
     * Try to decrypt a reader into a list of exported room keys.
     *
     * `encrypted_exported_room_keys` is the result from
     * `encrypt_exported_room_keys`. `passphrase` is the passphrase that was
     * used when calling `encrypt_exported_room_keys`.
     * @param {string} encrypted_exported_room_keys
     * @param {string} passphrase
     * @returns {string}
     */
    static decryptExportedRoomKeys(encrypted_exported_room_keys, passphrase) {
        let deferred4_0;
        let deferred4_1;
        try {
            const ptr0 = passStringToWasm0(encrypted_exported_room_keys, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ptr1 = passStringToWasm0(passphrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len1 = WASM_VECTOR_LEN;
            const ret = wasm.olmmachine_decryptExportedRoomKeys(ptr0, len0, ptr1, len1);
            var ptr3 = ret[0];
            var len3 = ret[1];
            if (ret[3]) {
                ptr3 = 0; len3 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred4_0 = ptr3;
            deferred4_1 = len3;
            return getStringFromWasm0(ptr3, len3);
        } finally {
            wasm.__wbindgen_free(deferred4_0, deferred4_1, 1);
        }
    }
    /**
     * Register a callback which will be called whenever there is an update to
     * a room key.
     *
     * `callback` should be a function that takes a single argument (an array
     * of {@link RoomKeyInfo}) and returns a Promise.
     * @param {Function} callback
     */
    registerRoomKeyUpdatedCallback(callback) {
        wasm.olmmachine_registerRoomKeyUpdatedCallback(this.__wbg_ptr, callback);
    }
    /**
     * Register a callback which will be called whenever we receive a
     * notification that some room keys have been withheld.
     *
     * `callback` should be a function that takes a single argument (an array
     * of {@link RoomKeyWithheldInfo}) and returns a Promise.
     * @param {Function} callback
     */
    registerRoomKeysWithheldCallback(callback) {
        wasm.olmmachine_registerRoomKeysWithheldCallback(this.__wbg_ptr, callback);
    }
    /**
     * Register a callback which will be called whenever there is an update to
     * a user identity.
     *
     * `callback` should be a function that takes a single argument (a {@link
     * UserId}) and returns a Promise.
     * @param {Function} callback
     */
    registerUserIdentityUpdatedCallback(callback) {
        wasm.olmmachine_registerUserIdentityUpdatedCallback(this.__wbg_ptr, callback);
    }
    /**
     * Register a callback which will be called whenever there is an update to
     * a device.
     *
     * `callback` should be a function that takes a single argument (an array
     * of user IDs as strings) and returns a Promise.
     * @param {Function} callback
     */
    registerDevicesUpdatedCallback(callback) {
        wasm.olmmachine_registerDevicesUpdatedCallback(this.__wbg_ptr, callback);
    }
    /**
     * Register a callback which will be called whenever a secret
     * (`m.secret.send`) is received.
     *
     * The only secret this will currently broadcast is the
     * `m.megolm_backup.v1` (the cross signing secrets are handled internally).
     *
     * To request a secret from other devices, a client sends an
     * `m.secret.request` device event with `action` set to `request` and
     * `name` set to the identifier of the secret. A device that wishes to
     * share the secret will reply with an `m.secret.send` event, encrypted
     * using olm.
     *
     * The secrets are guaranteed to have been received over a 1-to-1 encrypted
     * to_device message from a one of the user's own verified devices.
     *
     * See https://matrix-org.github.io/matrix-rust-sdk/matrix_sdk_crypto/store/struct.Store.html#method.secrets_stream for more information.
     *
     * `callback` should be a function that takes 2 arguments: the secret name
     * (string) and value (string).
     *
     * **Note**: if the secret is valid and handled on the javascript side, the
     * secret inbox should be cleared by calling
     * `delete_secrets_from_inbox`.
     * @param {Function} callback
     */
    registerReceiveSecretCallback(callback) {
        wasm.olmmachine_registerReceiveSecretCallback(this.__wbg_ptr, callback);
    }
    /**
     * Get all the secrets with the given secret_name we have currently
     * stored.
     * The only secret this will currently return is the
     * `m.megolm_backup.v1` secret.
     *
     * Usually you would just register a callback with
     * [`register_receive_secret_callback`], but if the client is shut down
     * before handling them, this method can be used to retrieve them.
     * This method should therefore be called at client startup to retrieve any
     * secrets received during the previous session.
     *
     * The secrets are guaranteed to have been received over a 1-to-1 encrypted
     * to_device message from one of the user's own verified devices.
     *
     * Returns a `Promise` for a `Set` of `String` corresponding to the secret
     * values.
     *
     * If the secret is valid and handled, the secret inbox should be cleared
     * by calling `delete_secrets_from_inbox`.
     * @param {string} secret_name
     * @returns {Promise<any>}
     */
    getSecretsFromInbox(secret_name) {
        const ptr0 = passStringToWasm0(secret_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_getSecretsFromInbox(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Delete all secrets with the given secret name from the inbox.
     *
     * Should be called after handling the secrets with
     * `get_secrets_from_inbox`.
     *
     * # Arguments
     *
     * * `secret_name` - The name of the secret to delete.
     * @param {string} secret_name
     * @returns {Promise<any>}
     */
    deleteSecretsFromInbox(secret_name) {
        const ptr0 = passStringToWasm0(secret_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_deleteSecretsFromInbox(this.__wbg_ptr, ptr0, len0);
        return ret;
    }
    /**
     * Request missing local secrets from our other trusted devices.
     *
     * "Local secrets" refers to secrets which can be shared between trusted
     * devices, such as private cross-signing keys, and the megolm backup
     * decryption key.
     *
     * This method will cause the sdk to generated outgoing secret requests
     * (`m.secret.request`) to get the missing secrets. These requests will
     * then be returned by a future call to {@link
     * OlmMachine#outgoingRequests}.
     *
     * # Returns
     *
     * A `Promise` for a `bool` result, which will be true if  secrets were
     * missing, and a request was generated.
     * @returns {Promise<any>}
     */
    requestMissingSecretsIfNeeded() {
        const ret = wasm.olmmachine_requestMissingSecretsIfNeeded(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the stored room settings, such as the encryption algorithm or
     * whether to encrypt only for trusted devices.
     *
     * These settings can be modified via {@link setRoomSettings}.
     *
     * # Returns
     *
     * `Promise<RoomSettings|undefined>`
     * @param {RoomId} room_id
     * @returns {Promise<RoomSettings|undefined>}
     */
    getRoomSettings(room_id) {
        _assertClass(room_id, RoomId);
        const ret = wasm.olmmachine_getRoomSettings(this.__wbg_ptr, room_id.__wbg_ptr);
        return ret;
    }
    /**
     * Store encryption settings for the given room.
     *
     * This method checks if the new settings are "safe" -- ie, that they do
     * not represent a downgrade in encryption security from any previous
     * settings. Attempts to downgrade security will result in an error.
     *
     * If the settings are valid, they will be persisted to the crypto store.
     * These settings are not used directly by this library, but the saved
     * settings can be retrieved via {@link getRoomSettings}.
     * @param {RoomId} room_id
     * @param {RoomSettings} room_settings
     * @returns {Promise<void>}
     */
    setRoomSettings(room_id, room_settings) {
        _assertClass(room_id, RoomId);
        _assertClass(room_settings, RoomSettings);
        const ret = wasm.olmmachine_setRoomSettings(this.__wbg_ptr, room_id.__wbg_ptr, room_settings.__wbg_ptr);
        return ret;
    }
    /**
     * Manage dehydrated devices
     * @returns {DehydratedDevices}
     */
    dehydratedDevices() {
        const ret = wasm.olmmachine_dehydratedDevices(this.__wbg_ptr);
        return DehydratedDevices.__wrap(ret);
    }
    /**
     * Assemble, and encrypt, a room key bundle for sharing encrypted history,
     * as per {@link https://github.com/matrix-org/matrix-spec-proposals/pull/4268|MSC4268}.
     *
     * Returns `undefined` if there are no keys to share in the given room,
     * otherwise an {@link EncryptedAttachment}.
     *
     * The data should be uploaded to the media server, and the details then
     * passed to {@link shareRoomKeyBundleData}.
     *
     * @experimental
     * @param {RoomId} room_id
     * @returns {Promise<EncryptedAttachment | undefined>}
     */
    buildRoomKeyBundle(room_id) {
        _assertClass(room_id, RoomId);
        const ret = wasm.olmmachine_buildRoomKeyBundle(this.__wbg_ptr, room_id.__wbg_ptr);
        return ret;
    }
    /**
     * Collect the devices belonging to the given user, and send the details
     * of a room key bundle to those devices.
     *
     * Returns a list of to-device requests which must be sent.
     *
     * @experimental
     * @param {UserId} user
     * @param {RoomId} room
     * @param {string} url
     * @param {string | null | undefined} media_encryption_info
     * @param {CollectStrategy} sharing_strategy
     * @returns {Promise<ToDeviceRequest[]>}
     */
    shareRoomKeyBundleData(user, room, url, media_encryption_info, sharing_strategy) {
        _assertClass(user, UserId);
        _assertClass(room, RoomId);
        const ptr0 = passStringToWasm0(url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(media_encryption_info) ? 0 : passStringToWasm0(media_encryption_info, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        _assertClass(sharing_strategy, CollectStrategy);
        var ptr2 = sharing_strategy.__destroy_into_raw();
        const ret = wasm.olmmachine_shareRoomKeyBundleData(this.__wbg_ptr, user.__wbg_ptr, room.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * See if we have received an {@link https://github.com/matrix-org/matrix-spec-proposals/pull/4268|MSC4268}
     * room key bundle for the given room from the given user.
     *
     * Before calling this, the application must make sure that we have an
     * up-to-date copy of the inviter's cross-signing keys, so that we can
     * verify the device that sent us the key bundle data message. (For
     * now, the easiest way to do that is by calling {@link queryKeysForUsers}
     * for the inviter, and making the resultant request.)
     *
     * Returns either `undefined` if no suitable bundle has been received,
     * or an {@link StoredRoomKeyBundleData}, in which case, the bundle
     * should be downloaded, and then passed to {@link
     * receiveRoomKeyBundle}.
     *
     * @experimental
     * @param {RoomId} room_id
     * @param {UserId} inviter
     * @returns {Promise<StoredRoomKeyBundleData | undefined>}
     */
    getReceivedRoomKeyBundleData(room_id, inviter) {
        _assertClass(room_id, RoomId);
        _assertClass(inviter, UserId);
        const ret = wasm.olmmachine_getReceivedRoomKeyBundleData(this.__wbg_ptr, room_id.__wbg_ptr, inviter.__wbg_ptr);
        return ret;
    }
    /**
     * Import the message keys from a downloaded room key bundle.
     *
     * After {@link getReceivedRoomKeyBundleData} returns a truthy result, the
     * media file should be downloaded and then passed into this method to
     * actually do the import.
     *
     * @experimental
     * @param {StoredRoomKeyBundleData} bundle_data
     * @param {Uint8Array} encrypted_bundle
     * @returns {Promise<undefined>}
     */
    receiveRoomKeyBundle(bundle_data, encrypted_bundle) {
        _assertClass(bundle_data, StoredRoomKeyBundleData);
        var ptr0 = bundle_data.__destroy_into_raw();
        const ptr1 = passArray8ToWasm0(encrypted_bundle, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.olmmachine_receiveRoomKeyBundle(this.__wbg_ptr, ptr0, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Shut down the `OlmMachine`.
     *
     * The `OlmMachine` cannot be used after this method has been called.
     *
     * All associated resources will be closed too, like IndexedDB
     * connections.
     */
    close() {
        const ptr = this.__destroy_into_raw();
        wasm.olmmachine_close(ptr);
    }
}

const OtherUserIdentityFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_otheruseridentity_free(ptr >>> 0, 1));
/**
 * Struct representing a cross signing identity of a user.
 *
 * This is the user identity of a user that isn't our own. Other users will
 * only contain a master key and a self signing key, meaning that only device
 * signatures can be checked with this identity.
 *
 * This struct wraps a read-only version of the struct and allows verifications
 * to be requested to verify our own device with the user identity.
 */
export class OtherUserIdentity {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OtherUserIdentity.prototype);
        obj.__wbg_ptr = ptr;
        OtherUserIdentityFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OtherUserIdentityFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_otheruseridentity_free(ptr, 0);
    }
    /**
     * Is this user identity verified?
     * @returns {boolean}
     */
    isVerified() {
        const ret = wasm.otheruseridentity_isVerified(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Manually verify this user.
     *
     * This method will attempt to sign the user identity using our private
     * cross signing key.
     *
     * This method fails if we don't have the private part of our user-signing
     * key.
     *
     * Returns a request that needs to be sent out for the user to be marked as
     * verified.
     * @returns {Promise<any>}
     */
    verify() {
        const ret = wasm.otheruseridentity_verify(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a `VerificationRequest` object after the verification
     * request content has been sent out.
     * @param {RoomId} room_id
     * @param {EventId} request_event_id
     * @param {any[] | null} [methods]
     * @returns {VerificationRequest}
     */
    requestVerification(room_id, request_event_id, methods) {
        _assertClass(room_id, RoomId);
        _assertClass(request_event_id, EventId);
        var ptr0 = isLikeNone(methods) ? 0 : passArrayJsValueToWasm0(methods, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.otheruseridentity_requestVerification(this.__wbg_ptr, room_id.__wbg_ptr, request_event_id.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return VerificationRequest.__wrap(ret[0]);
    }
    /**
     * Send a verification request to the given user.
     *
     * The returned content needs to be sent out into a DM room with the given
     * user.
     *
     * After the content has been sent out a VerificationRequest can be started
     * with the `request_verification` method.
     * @param {any[] | null} [methods]
     * @returns {string}
     */
    verificationRequestContent(methods) {
        let deferred3_0;
        let deferred3_1;
        try {
            var ptr0 = isLikeNone(methods) ? 0 : passArrayJsValueToWasm0(methods, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            const ret = wasm.otheruseridentity_verificationRequestContent(this.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Get the master key of the identity.
     * @returns {string}
     */
    get masterKey() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.otheruseridentity_masterKey(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Get the self-signing key of the identity.
     * @returns {string}
     */
    get selfSigningKey() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.otheruseridentity_selfSigningKey(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Pin the current identity (public part of the master signing key).
     * @returns {Promise<any>}
     */
    pinCurrentMasterKey() {
        const ret = wasm.otheruseridentity_pinCurrentMasterKey(this.__wbg_ptr);
        return ret;
    }
    /**
     * Has the identity changed in a way that requires approval from the user?
     *
     * A user identity needs approval if it changed after the crypto machine
     * has already observed ("pinned") a different identity for that user,
     * unless it is an explicitly verified identity (using for example
     * interactive verification).
     *
     * This situation can be resolved by:
     *
     * - Verifying the new identity with {@link requestVerification}, or:
     * - Updating the pin to the new identity with {@link pinCurrentMasterKey}.
     * @returns {boolean}
     */
    identityNeedsUserApproval() {
        const ret = wasm.otheruseridentity_identityNeedsUserApproval(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * True if we verified this identity (with any own identity, at any
     * point).
     *
     * To set this latch back to false, call {@link withdrawVerification}.
     * @returns {boolean}
     */
    wasPreviouslyVerified() {
        const ret = wasm.otheruseridentity_wasPreviouslyVerified(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Remove the requirement for this identity to be verified.
     *
     * If an identity was previously verified and is not anymore it will be
     * reported to the user. In order to remove this notice users have to
     * verify again or to withdraw the verification requirement.
     * @returns {Promise<any>}
     */
    withdrawVerification() {
        const ret = wasm.otheruseridentity_withdrawVerification(this.__wbg_ptr);
        return ret;
    }
    /**
     * Was this identity verified since initial observation and is not anymore?
     *
     * Such a violation should be reported to the local user by the
     * application, and resolved by
     *
     * - Verifying the new identity with {@link requestVerification}, or:
     * - Withdrawing the verification requirement with {@link
     *   withdrawVerification}.
     * @returns {boolean}
     */
    hasVerificationViolation() {
        const ret = wasm.otheruseridentity_hasVerificationViolation(this.__wbg_ptr);
        return ret !== 0;
    }
}

const OutboundCreationResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_outboundcreationresult_free(ptr >>> 0, 1));
/**
 * The result of an outbound ECIES channel establishment.
 */
export class OutboundCreationResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OutboundCreationResult.prototype);
        obj.__wbg_ptr = ptr;
        OutboundCreationResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OutboundCreationResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_outboundcreationresult_free(ptr, 0);
    }
    /**
     * The established ECIES channel.
     * @returns {EstablishedEcies}
     */
    get channel() {
        const ret = wasm.__wbg_get_inboundcreationresult_channel(this.__wbg_ptr);
        return EstablishedEcies.__wrap(ret);
    }
    /**
     * The established ECIES channel.
     * @param {EstablishedEcies} arg0
     */
    set channel(arg0) {
        _assertClass(arg0, EstablishedEcies);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_inboundcreationresult_channel(this.__wbg_ptr, ptr0);
    }
    /**
     * The initial encrypted message.
     * @returns {string}
     */
    get initial_message() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_outboundcreationresult_initial_message(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The initial encrypted message.
     * @param {string} arg0
     */
    set initial_message(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
}

const OwnUserIdentityFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_ownuseridentity_free(ptr >>> 0, 1));
/**
 * Struct representing a cross signing identity of a user.
 *
 * This is the user identity of a user that is our own.
 */
export class OwnUserIdentity {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(OwnUserIdentity.prototype);
        obj.__wbg_ptr = ptr;
        OwnUserIdentityFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        OwnUserIdentityFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_ownuseridentity_free(ptr, 0);
    }
    /**
     * Is this user identity verified?
     * @returns {boolean}
     */
    isVerified() {
        const ret = wasm.ownuseridentity_isVerified(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Mark our user identity as verified.
     *
     * This will mark the identity locally as verified and sign it with our own
     * device.
     *
     * Returns a signature upload request that needs to be sent out.
     * @returns {Promise<any>}
     */
    verify() {
        const ret = wasm.ownuseridentity_verify(this.__wbg_ptr);
        return ret;
    }
    /**
     * Send a verification request to our other devices.
     * @param {any[] | null} [methods]
     * @returns {Promise<any>}
     */
    requestVerification(methods) {
        var ptr0 = isLikeNone(methods) ? 0 : passArrayJsValueToWasm0(methods, wasm.__wbindgen_malloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.ownuseridentity_requestVerification(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Does our user identity trust our own device, i.e. have we signed our own
     * device keys with our self-signing key?
     * @returns {Promise<any>}
     */
    trustsOurOwnDevice() {
        const ret = wasm.ownuseridentity_trustsOurOwnDevice(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the master key of the identity.
     * @returns {string}
     */
    get masterKey() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.ownuseridentity_masterKey(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Get the self-signing key of the identity.
     * @returns {string}
     */
    get selfSigningKey() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.ownuseridentity_selfSigningKey(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Get the user-signing key of the identity. This is only present for our
     * own user identity.
     * @returns {string}
     */
    get userSigningKey() {
        let deferred2_0;
        let deferred2_1;
        try {
            const ret = wasm.ownuseridentity_userSigningKey(this.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * True if we verified our own identity at some point in the past.
     *
     * To reset this latch back to `false`, call {@link withdrawVerification}.
     * @returns {boolean}
     */
    wasPreviouslyVerified() {
        const ret = wasm.ownuseridentity_wasPreviouslyVerified(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Remove the requirement for this identity to be verified.
     *
     * If an identity was previously verified and is not any longer, it will be
     * reported to the user. In order to remove this notice users have to
     * verify again or to withdraw the verification requirement.
     * @returns {Promise<any>}
     */
    withdrawVerification() {
        const ret = wasm.ownuseridentity_withdrawVerification(this.__wbg_ptr);
        return ret;
    }
    /**
     * Was this identity verified since initial observation and is not anymore?
     *
     * Such a violation should be reported to the local user by the
     * application, and resolved by
     *
     * - Verifying the new identity with {@link requestVerification}, or:
     * - Withdrawing the verification requirement with {@link
     *   withdrawVerification}.
     * @returns {boolean}
     */
    hasVerificationViolation() {
        const ret = wasm.ownuseridentity_hasVerificationViolation(this.__wbg_ptr);
        return ret !== 0;
    }
}

const PickledInboundGroupSessionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pickledinboundgroupsession_free(ptr >>> 0, 1));
/**
 * A pickled version of an `InboundGroupSession`.
 *
 * Holds all the information that needs to be stored in a database to restore
 * an InboundGroupSession.
 */
export class PickledInboundGroupSession {

    static __unwrap(jsValue) {
        if (!(jsValue instanceof PickledInboundGroupSession)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PickledInboundGroupSessionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pickledinboundgroupsession_free(ptr, 0);
    }
    /**
     * The pickle string holding the Megolm Session, as returned by
     * `olm_pickle_inbound_group_session` in libolm.
     * @returns {string}
     */
    get pickle() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pickledinboundgroupsession_pickle(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The pickle string holding the Megolm Session, as returned by
     * `olm_pickle_inbound_group_session` in libolm.
     * @param {string} arg0
     */
    set pickle(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The public curve25519 key of the account that sent us the session.
     * @returns {string}
     */
    get senderKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pickledinboundgroupsession_senderKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The public curve25519 key of the account that sent us the session.
     * @param {string} arg0
     */
    set senderKey(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_backup_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The public ed25519 key of the account that is believed to have initiated
     * the session, if known.
     *
     * If the session was received directly from the creator via an
     * Olm-encrypted `m.room_key` event, this value is taken from the `keys`
     * property of the plaintext payload of that event (see
     * [`m.olm.v1.curve25519-aes-sha2`]).
     *
     * If the session was forwarded to us using an [`m.forwarded_room_key`],
     * this value is a copy of the `sender_claimed_ed25519_key` from the
     * content of the event.
     *
     * [`m.olm.v1.curve25519-aes-sha2`]: https://spec.matrix.org/v1.9/client-server-api/#molmv1curve25519-aes-sha2
     * [`m.forwarded_room_key`]: https://spec.matrix.org/v1.9/client-server-api/#mforwarded_room_key
     * @returns {string | undefined}
     */
    get senderSigningKey() {
        const ret = wasm.__wbg_get_pickledinboundgroupsession_senderSigningKey(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * The public ed25519 key of the account that is believed to have initiated
     * the session, if known.
     *
     * If the session was received directly from the creator via an
     * Olm-encrypted `m.room_key` event, this value is taken from the `keys`
     * property of the plaintext payload of that event (see
     * [`m.olm.v1.curve25519-aes-sha2`]).
     *
     * If the session was forwarded to us using an [`m.forwarded_room_key`],
     * this value is a copy of the `sender_claimed_ed25519_key` from the
     * content of the event.
     *
     * [`m.olm.v1.curve25519-aes-sha2`]: https://spec.matrix.org/v1.9/client-server-api/#molmv1curve25519-aes-sha2
     * [`m.forwarded_room_key`]: https://spec.matrix.org/v1.9/client-server-api/#mforwarded_room_key
     * @param {string | null} [arg0]
     */
    set senderSigningKey(arg0) {
        var ptr0 = isLikeNone(arg0) ? 0 : passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_basemigrationdata_backupRecoveryKey(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The id of the room that the session is used in.
     *
     * Nullable so that a `PickledInboundGroupSession` can be constructed
     * incrementally. Must be populated!
     * @returns {RoomId | undefined}
     */
    get roomId() {
        const ret = wasm.__wbg_get_pickledinboundgroupsession_roomId(this.__wbg_ptr);
        return ret === 0 ? undefined : RoomId.__wrap(ret);
    }
    /**
     * The id of the room that the session is used in.
     *
     * Nullable so that a `PickledInboundGroupSession` can be constructed
     * incrementally. Must be populated!
     * @param {RoomId | null} [arg0]
     */
    set roomId(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, RoomId);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_pickledinboundgroupsession_roomId(this.__wbg_ptr, ptr0);
    }
    /**
     * Flag remembering if the session was directly sent to us by the sender
     * or if it was imported.
     * @returns {boolean}
     */
    get imported() {
        const ret = wasm.__wbg_get_pickledinboundgroupsession_imported(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Flag remembering if the session was directly sent to us by the sender
     * or if it was imported.
     * @param {boolean} arg0
     */
    set imported(arg0) {
        wasm.__wbg_set_pickledinboundgroupsession_imported(this.__wbg_ptr, arg0);
    }
    /**
     * Flag remembering if the session has been backed up.
     * @returns {boolean}
     */
    get backedUp() {
        const ret = wasm.__wbg_get_pickledinboundgroupsession_backedUp(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Flag remembering if the session has been backed up.
     * @param {boolean} arg0
     */
    set backedUp(arg0) {
        wasm.__wbg_set_pickledinboundgroupsession_backedUp(this.__wbg_ptr, arg0);
    }
    /**
     * Construct a new `PickledInboundGroupSession`, with default values.
     */
    constructor() {
        const ret = wasm.pickledinboundgroupsession_new();
        this.__wbg_ptr = ret >>> 0;
        PickledInboundGroupSessionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const PickledSessionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pickledsession_free(ptr >>> 0, 1));
/**
 * A pickled version of a `Session`.
 *
 * Holds all the information that needs to be stored in a database to restore
 * an Olm Session. Can be imported into the rust store with {@link
 * Migration::migrateOlmSessions}.
 */
export class PickledSession {

    static __unwrap(jsValue) {
        if (!(jsValue instanceof PickledSession)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PickledSessionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pickledsession_free(ptr, 0);
    }
    /**
     * The pickle string holding the Olm Session, as returned by
     * `olm_pickle_session` in libolm.
     * @returns {string}
     */
    get pickle() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pickledsession_pickle(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The pickle string holding the Olm Session, as returned by
     * `olm_pickle_session` in libolm.
     * @param {string} arg0
     */
    set pickle(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The base64-encoded public curve25519 key of the other user that we share
     * this session with.
     * @returns {string}
     */
    get senderKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_pickledsession_senderKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The base64-encoded public curve25519 key of the other user that we share
     * this session with.
     * @param {string} arg0
     */
    set senderKey(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_backup_version(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * Was the session created using a fallback key?
     * @returns {boolean}
     */
    get createdUsingFallbackKey() {
        const ret = wasm.__wbg_get_pickledsession_createdUsingFallbackKey(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Was the session created using a fallback key?
     * @param {boolean} arg0
     */
    set createdUsingFallbackKey(arg0) {
        wasm.__wbg_set_pickledsession_createdUsingFallbackKey(this.__wbg_ptr, arg0);
    }
    /**
     * When the session was created.
     * @returns {Date}
     */
    get creationTime() {
        const ret = wasm.__wbg_get_pickledsession_creationTime(this.__wbg_ptr);
        return ret;
    }
    /**
     * When the session was created.
     * @param {Date} arg0
     */
    set creationTime(arg0) {
        wasm.__wbg_set_pickledsession_creationTime(this.__wbg_ptr, arg0);
    }
    /**
     * When the session was last used.
     * @returns {Date}
     */
    get lastUseTime() {
        const ret = wasm.__wbg_get_pickledsession_lastUseTime(this.__wbg_ptr);
        return ret;
    }
    /**
     * When the session was last used.
     * @param {Date} arg0
     */
    set lastUseTime(arg0) {
        wasm.__wbg_set_pickledsession_lastUseTime(this.__wbg_ptr, arg0);
    }
    /**
     * Construct a new `PickledSession`, with default values.
     */
    constructor() {
        const ret = wasm.pickledsession_new();
        this.__wbg_ptr = ret >>> 0;
        PickledSessionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const PkDecryptionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pkdecryption_free(ptr >>> 0, 1));
/**
 * A class representing a public-key decryption instance.
 *
 * This implements the decryption part of the
 * `m.megolm_backup.v1.curve25519-aes-sha2` algorithm described in the Matrix
 * {@link https://spec.matrix.org/v1.11/client-server-api/#backup-algorithm-mmegolm_backupv1curve25519-aes-sha2 | spec}.
 *
 * @see {@link PkEncryption}
 *
 * More details can be found in the official {@link https://docs.rs/vodozemac/latest/vodozemac/pk_encryption/ | vodozemac documentation}.
 */
export class PkDecryption {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PkDecryption.prototype);
        obj.__wbg_ptr = ptr;
        PkDecryptionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PkDecryptionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pkdecryption_free(ptr, 0);
    }
    /**
     * Creates a new `PkDecryption` instance with a newly generated key pair.
     */
    constructor() {
        const ret = wasm.pkdecryption_new();
        this.__wbg_ptr = ret >>> 0;
        PkDecryptionFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Creates a `PkDecryption` instance from a secret key.
     * @param {Curve25519SecretKey} key
     * @returns {PkDecryption}
     */
    static fromKey(key) {
        _assertClass(key, Curve25519SecretKey);
        const ret = wasm.pkdecryption_fromKey(key.__wbg_ptr);
        return PkDecryption.__wrap(ret);
    }
    /**
     * Returns the secret key associated with this `PkDecryption` instance.
     * @returns {Curve25519SecretKey}
     */
    secretKey() {
        const ret = wasm.pkdecryption_secretKey(this.__wbg_ptr);
        return Curve25519SecretKey.__wrap(ret);
    }
    /**
     * Returns the public key associated with this decryption instance.
     *
     * This can be used to construct a {@link PkEncryption} object to encrypt a
     * message for this `PkDecryption` object.
     * @returns {Curve25519PublicKey}
     */
    publicKey() {
        const ret = wasm.pkdecryption_publicKey(this.__wbg_ptr);
        return Curve25519PublicKey.__wrap(ret);
    }
    /**
     * Decrypts an encrypted message and returns the plaintext as a UTF-8
     * string.
     * @param {PkMessage} message
     * @returns {string}
     */
    decryptString(message) {
        let deferred2_0;
        let deferred2_1;
        try {
            _assertClass(message, PkMessage);
            const ret = wasm.pkdecryption_decryptString(this.__wbg_ptr, message.__wbg_ptr);
            var ptr1 = ret[0];
            var len1 = ret[1];
            if (ret[3]) {
                ptr1 = 0; len1 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred2_0 = ptr1;
            deferred2_1 = len1;
            return getStringFromWasm0(ptr1, len1);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * Decrypts an encrypted message and returns the raw `Uint8Array`.
     * @param {PkMessage} message
     * @returns {Uint8Array}
     */
    decrypt(message) {
        _assertClass(message, PkMessage);
        const ret = wasm.pkdecryption_decrypt(this.__wbg_ptr, message.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
}

const PkEncryptionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pkencryption_free(ptr >>> 0, 1));
/**
 * A class representing a public-key encryption instance.
 *
 * This implements the encryption part of the
 * `m.megolm_backup.v1.curve25519-aes-sha2` algorithm described in the Matrix
 * {@link https://spec.matrix.org/v1.11/client-server-api/#backup-algorithm-mmegolm_backupv1curve25519-aes-sha2 | spec}.
 *
 * @see {@link PkDecryption}
 *
 * More details can be found in the official {@link https://docs.rs/vodozemac/latest/vodozemac/pk_encryption/ | vodozemac documentation}.
 */
export class PkEncryption {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PkEncryption.prototype);
        obj.__wbg_ptr = ptr;
        PkEncryptionFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PkEncryptionFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pkencryption_free(ptr, 0);
    }
    /**
     * Creates a new `PkEncryption` instance from a public key.
     * @param {Curve25519PublicKey} public_key
     * @returns {PkEncryption}
     */
    static fromKey(public_key) {
        _assertClass(public_key, Curve25519PublicKey);
        const ret = wasm.pkencryption_fromKey(public_key.__wbg_ptr);
        return PkEncryption.__wrap(ret);
    }
    /**
     * Encrypts a byte message and returns an encrypted {@link PkMessage}.
     * @param {Uint8Array} message
     * @returns {PkMessage}
     */
    encrypt(message) {
        const ptr0 = passArray8ToWasm0(message, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.pkencryption_encrypt(this.__wbg_ptr, ptr0, len0);
        return PkMessage.__wrap(ret);
    }
    /**
     * Encrypts a string message and returns an encrypted {@link PkMessage}.
     * @param {string} message
     * @returns {PkMessage}
     */
    encryptString(message) {
        const ptr0 = passStringToWasm0(message, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.pkencryption_encrypt(this.__wbg_ptr, ptr0, len0);
        return PkMessage.__wrap(ret);
    }
}

const PkMessageFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_pkmessage_free(ptr >>> 0, 1));
/**
 * A class representing an encrypted message using {@link PkEncryption}.
 */
export class PkMessage {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PkMessage.prototype);
        obj.__wbg_ptr = ptr;
        PkMessageFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PkMessageFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_pkmessage_free(ptr, 0);
    }
    /**
     * Returns the raw ciphertext as a `Uint8Array`.
     * @returns {Uint8Array}
     */
    ciphertext() {
        const ret = wasm.pkmessage_ciphertext(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Returns the raw message authentication code (MAC) as a `Uint8Array`.
     * @returns {Uint8Array}
     */
    mac() {
        const ret = wasm.pkmessage_mac(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Returns the ephemeral public key used during encryption.
     * @returns {Curve25519PublicKey}
     */
    ephemeralKey() {
        const ret = wasm.pkmessage_ephemeralKey(this.__wbg_ptr);
        return Curve25519PublicKey.__wrap(ret);
    }
    /**
     * Constructs a `PkMessage` from its parts: ciphertext, MAC, and ephemeral
     * key.
     * @param {Uint8Array} ciphertext
     * @param {Uint8Array} mac
     * @param {Curve25519PublicKey} ephemeral_key
     * @returns {PkMessage}
     */
    static fromParts(ciphertext, mac, ephemeral_key) {
        const ptr0 = passArray8ToWasm0(ciphertext, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(mac, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        _assertClass(ephemeral_key, Curve25519PublicKey);
        const ret = wasm.pkmessage_fromParts(ptr0, len0, ptr1, len1, ephemeral_key.__wbg_ptr);
        return PkMessage.__wrap(ret);
    }
    /**
     * Constructs a `PkMessage` from a base64-encoded representation.
     * @param {Base64EncodedPkMessage} message
     * @returns {PkMessage}
     */
    static fromBase64(message) {
        _assertClass(message, Base64EncodedPkMessage);
        const ret = wasm.pkmessage_fromBase64(message.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return PkMessage.__wrap(ret[0]);
    }
    /**
     * Converts the `PkMessage` into a base64-encoded representation.
     * @returns {Base64EncodedPkMessage}
     */
    toBase64() {
        const ret = wasm.pkmessage_toBase64(this.__wbg_ptr);
        return Base64EncodedPkMessage.__wrap(ret);
    }
}

const PlainTextToDeviceEventFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_plaintexttodeviceevent_free(ptr >>> 0, 1));
/**
 * Represents a to-device event sent in the clear.
 */
export class PlainTextToDeviceEvent {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PlainTextToDeviceEvent.prototype);
        obj.__wbg_ptr = ptr;
        PlainTextToDeviceEventFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PlainTextToDeviceEventFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_plaintexttodeviceevent_free(ptr, 0);
    }
    /**
     * The to-device message, containing `type`, `sender` and `content` fields,
     * encoded as JSON.
     * @returns {string}
     */
    get rawEvent() {
        const ret = wasm.__wbg_get_plaintexttodeviceevent_rawEvent(this.__wbg_ptr);
        return ret;
    }
    /**
     * The type of processed to-device event. Always {@link
     * ProcessedToDeviceEventType.PlainText} for this type.
     * @returns {ProcessedToDeviceEventType}
     */
    get type() {
        const ret = wasm.plaintexttodeviceevent_type(this.__wbg_ptr);
        return ret;
    }
}

const PutDehydratedDeviceRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_putdehydrateddevicerequest_free(ptr >>> 0, 1));
/**
 * A request that will upload a dehydrated device to the server.
 */
export class PutDehydratedDeviceRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(PutDehydratedDeviceRequest.prototype);
        obj.__wbg_ptr = ptr;
        PutDehydratedDeviceRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PutDehydratedDeviceRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_putdehydrateddevicerequest_free(ptr, 0);
    }
    /**
     * A JSON-encoded object containing the rest of the payload: `rooms`.
     *
     * It represents the body of the HTTP request.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_putdehydrateddevicerequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `PutDehydratedDeviceRequest`
     * @param {string} body
     */
    constructor(body) {
        const ret = wasm.putdehydrateddevicerequest_new(body);
        this.__wbg_ptr = ret >>> 0;
        PutDehydratedDeviceRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const QrFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_qr_free(ptr >>> 0, 1));
/**
 * QR code based verification.
 */
export class Qr {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Qr.prototype);
        obj.__wbg_ptr = ptr;
        QrFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QrFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_qr_free(ptr, 0);
    }
    /**
     * Get the current state of this request.
     *
     * Returns a `QrState`.
     * @returns {QrState}
     */
    state() {
        const ret = wasm.qr_state(this.__wbg_ptr);
        return ret;
    }
    /**
     * Has the QR verification been scanned by the other side.
     *
     * When the verification object is in this state it’s required
     * that the user confirms that the other side has scanned the QR
     * code.
     * @returns {boolean}
     */
    hasBeenScanned() {
        const ret = wasm.qr_hasBeenScanned(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Has the scanning of the QR code been confirmed by us?
     * @returns {boolean}
     */
    hasBeenConfirmed() {
        const ret = wasm.qr_hasBeenConfirmed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get our own user ID.
     * @returns {UserId}
     */
    get userId() {
        const ret = wasm.qr_userId(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * Get the user id of the other user that is participating in
     * this verification flow.
     * @returns {UserId}
     */
    get otherUserId() {
        const ret = wasm.qr_otherUserId(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * Get the device ID of the other side.
     * @returns {DeviceId}
     */
    get otherDeviceId() {
        const ret = wasm.qr_otherDeviceId(this.__wbg_ptr);
        return DeviceId.__wrap(ret);
    }
    /**
     * Did we initiate the verification request?
     * @returns {boolean}
     */
    weStarted() {
        const ret = wasm.qr_weStarted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get info about the cancellation if the verification flow has
     * been cancelled.
     * @returns {CancelInfo | undefined}
     */
    cancelInfo() {
        const ret = wasm.qr_cancelInfo(this.__wbg_ptr);
        return ret === 0 ? undefined : CancelInfo.__wrap(ret);
    }
    /**
     * Has the verification flow completed?
     * @returns {boolean}
     */
    isDone() {
        const ret = wasm.qr_isDone(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Has the verification flow been cancelled?
     * @returns {boolean}
     */
    isCancelled() {
        const ret = wasm.qr_isCancelled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is this a verification that is verifying one of our own devices?
     * @returns {boolean}
     */
    isSelfVerification() {
        const ret = wasm.qr_isSelfVerification(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Have we successfully scanned the QR code and are able to send
     * a reciprocation event?
     * @returns {boolean}
     */
    reciprocated() {
        const ret = wasm.qr_reciprocated(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the unique ID that identifies this QR verification flow,
     * be either a to-device request ID or a room event ID.
     * @returns {string}
     */
    get flowId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.qr_flowId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the room id if the verification is happening inside a
     * room.
     * @returns {RoomId | undefined}
     */
    get roomId() {
        const ret = wasm.qr_roomId(this.__wbg_ptr);
        return ret === 0 ? undefined : RoomId.__wrap(ret);
    }
    /**
     * Generate a QR code object that is representing this
     * verification flow.
     *
     * The QrCode can then be rendered as an image or as an unicode
     * string.
     *
     * The `to_bytes` method can be used to instead output the raw
     * bytes that should be encoded as a QR code.
     *
     * Returns a `QrCode`.
     * @returns {QrCode}
     */
    toQrCode() {
        const ret = wasm.qr_toQrCode(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QrCode.__wrap(ret[0]);
    }
    /**
     * Generate a the raw bytes that should be encoded as a QR code
     * is representing this verification flow.
     *
     * The `to_qr_code` method can be used to instead output a QrCode
     * object that can be rendered.
     * @returns {Uint8ClampedArray}
     */
    toBytes() {
        const ret = wasm.qr_toBytes(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Notify the other side that we have successfully scanned the QR
     * code and that the QR verification flow can start.
     *
     * This will return some OutgoingContent if the object is in the
     * correct state to start the verification flow, otherwise None.
     * @returns {any}
     */
    reciprocate() {
        const ret = wasm.qr_reciprocate(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Confirm that the other side has scanned our QR code.
     *
     * Returns either an `OutgoingRequest` which should be sent out, or
     * `undefined` if the verification is already confirmed.
     * @returns {any}
     */
    confirmScanning() {
        const ret = wasm.qr_confirmScanning(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Cancel the verification flow.
     *
     * Returns either an `OutgoingRequest` which should be sent out, or
     * `undefined` if the verification is already cancelled.
     * @returns {any}
     */
    cancel() {
        const ret = wasm.qr_cancel(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Cancel the verification.
     *
     * This cancels the verification with given code (e.g. `m.user`).
     *
     * Returns either an `OutgoingRequest` which should be sent out, or
     * `undefined` if the verification is already cancelled.
     * @param {string} code
     * @returns {any}
     */
    cancelWithCode(code) {
        const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.qr_cancelWithCode(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Register a callback which will be called whenever there is an update to
     * the request
     *
     * The `callback` is called with no parameters.
     * @param {Function} callback
     */
    registerChangesCallback(callback) {
        wasm.qr_registerChangesCallback(this.__wbg_ptr, callback);
    }
}

const QrCodeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_qrcode_free(ptr >>> 0, 1));
/**
 * A QR code.
 */
export class QrCode {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QrCode.prototype);
        obj.__wbg_ptr = ptr;
        QrCodeFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QrCodeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_qrcode_free(ptr, 0);
    }
    /**
     * Render the QR code into a `Uint8ClampedArray` where 1 represents a
     * dark pixel and 0 a white pixel.
     * @returns {Uint8ClampedArray}
     */
    renderIntoBuffer() {
        const ret = wasm.qrcode_renderIntoBuffer(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}

const QrCodeDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_qrcodedata_free(ptr >>> 0, 1));
/**
 * Data for the QR code login mechanism.
 *
 * The {@link QrCodeData} can be serialized and encoded as a QR code or it can
 * be decoded from a QR code.
 */
export class QrCodeData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QrCodeData.prototype);
        obj.__wbg_ptr = ptr;
        QrCodeDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QrCodeDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_qrcodedata_free(ptr, 0);
    }
    /**
     * Create new {@link QrCodeData} from a given public key, a rendezvous URL
     * and, optionally, a server name for the homeserver.
     *
     * If a server name is given, then the {@link QrCodeData} mode will be
     * {@link QrCodeMode.Reciprocate}, i.e. the QR code will contain data for
     * the existing device to display the QR code.
     *
     * If no server name is given, the {@link QrCodeData} mode will be
     * {@link QrCodeMode.Login}, i.e. the QR code will contain data for the
     * new device to display the QR code.
     * @param {Curve25519PublicKey} public_key
     * @param {string} rendezvous_url
     * @param {string | null} [server_name]
     */
    constructor(public_key, rendezvous_url, server_name) {
        _assertClass(public_key, Curve25519PublicKey);
        var ptr0 = public_key.__destroy_into_raw();
        const ptr1 = passStringToWasm0(rendezvous_url, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        var ptr2 = isLikeNone(server_name) ? 0 : passStringToWasm0(server_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len2 = WASM_VECTOR_LEN;
        const ret = wasm.qrcodedata_new(ptr0, ptr1, len1, ptr2, len2);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        QrCodeDataFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Attempt to decode a slice of bytes into a {@link QrCodeData} object.
     *
     * The slice of bytes would generally be returned by a QR code decoder.
     * @param {Uint8Array} bytes
     * @returns {QrCodeData}
     */
    static fromBytes(bytes) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.qrcodedata_fromBytes(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QrCodeData.__wrap(ret[0]);
    }
    /**
     * Encode the {@link QrCodeData} into a list of bytes.
     *
     * The list of bytes can be used by a QR code generator to create an image
     * containing a QR code.
     * @returns {Uint8Array}
     */
    toBytes() {
        const ret = wasm.qrcodedata_toBytes(this.__wbg_ptr);
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Attempt to decode a base64 encoded string into a {@link QrCodeData}
     * object.
     * @param {string} data
     * @returns {QrCodeData}
     */
    static fromBase64(data) {
        const ptr0 = passStringToWasm0(data, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.qrcodedata_fromBase64(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QrCodeData.__wrap(ret[0]);
    }
    /**
     * Encode the {@link QrCodeData} into a string using base64.
     *
     * This format can be used for debugging purposes and the
     * [`QrcodeData::from_base64()`] method can be used to parse the string
     * again.
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.qrcodedata_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the Curve25519 public key embedded in the {@link QrCodeData}.
     *
     * This Curve25519 public key should be used to establish an
     * [ECIES](https://en.wikipedia.org/wiki/Integrated_Encryption_Scheme)
     * (Elliptic Curve Integrated Encryption Scheme) channel with the other
     * device.
     * @returns {Curve25519PublicKey}
     */
    get publicKey() {
        const ret = wasm.qrcodedata_publicKey(this.__wbg_ptr);
        return Curve25519PublicKey.__wrap(ret);
    }
    /**
     * Get the URL of the rendezvous server which will be used to exchange
     * messages between the two devices.
     * @returns {string}
     */
    get rendezvousUrl() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.qrcodedata_rendezvousUrl(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the server name of the homeserver which the new device will be
     * logged in to.
     *
     * This will be only available if the existing device has generated the QR
     * code and the new device is the one scanning the QR code.
     * @returns {string | undefined}
     */
    get serverName() {
        const ret = wasm.qrcodedata_serverName(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Get the mode of this {@link QrCodeData} instance.
     * @returns {QrCodeMode}
     */
    get mode() {
        const ret = wasm.qrcodedata_mode(this.__wbg_ptr);
        return ret;
    }
}

const QrCodeScanFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_qrcodescan_free(ptr >>> 0, 1));
/**
 * A scanned QR code.
 */
export class QrCodeScan {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(QrCodeScan.prototype);
        obj.__wbg_ptr = ptr;
        QrCodeScanFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        QrCodeScanFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_qrcodescan_free(ptr, 0);
    }
    /**
     * Parse the decoded payload of a QR code in byte slice form.
     *
     * This method is useful if you would like to do your own custom QR code
     * decoding.
     * @param {Uint8ClampedArray} buffer
     * @returns {QrCodeScan}
     */
    static fromBytes(buffer) {
        const ret = wasm.qrcodescan_fromBytes(buffer);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return QrCodeScan.__wrap(ret[0]);
    }
}

const RehydratedDeviceFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_rehydrateddevice_free(ptr >>> 0, 1));
/**
 * A rehydrated device
 *
 * This device can receive to-device events to get room keys that were send to
 * it.
 */
export class RehydratedDevice {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RehydratedDevice.prototype);
        obj.__wbg_ptr = ptr;
        RehydratedDeviceFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RehydratedDeviceFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_rehydrateddevice_free(ptr, 0);
    }
    /**
     * Receive the to-device events that sent to the dehydrated device
     *
     * The rehydrated device will decrypt the events and pass the room keys
     * into the `OlmMachine`.
     *
     * # Arguments
     *
     * * `to_device_events` is a JSON-encoded result of the `events` array from
     *   `/dehydrated_device/{device_id}/events`.
     * * `decryption_settings`: Optionally, the settings to use when decrypting
     *   to-device events. If not set, to-device events will be decrypted with
     *   a {@link TrustRequirement} of `Untrusted`.
     *
     * Returns an array of `RoomKeyInfo`, indicating the room keys that were
     * received.
     * @param {string} to_device_events
     * @param {DecryptionSettings | null} [decryption_settings]
     * @returns {Promise<Array<any>>}
     */
    receiveEvents(to_device_events, decryption_settings) {
        const ptr0 = passStringToWasm0(to_device_events, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        let ptr1 = 0;
        if (!isLikeNone(decryption_settings)) {
            _assertClass(decryption_settings, DecryptionSettings);
            ptr1 = decryption_settings.__destroy_into_raw();
        }
        const ret = wasm.rehydrateddevice_receiveEvents(this.__wbg_ptr, ptr0, len0, ptr1);
        return ret;
    }
}

const RoomIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roomid_free(ptr >>> 0, 1));
/**
 * A Matrix [room ID].
 *
 * [room ID]: https://spec.matrix.org/v1.2/appendices/#room-ids-and-event-ids
 */
export class RoomId {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RoomId.prototype);
        obj.__wbg_ptr = ptr;
        RoomIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof RoomId)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoomIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roomid_free(ptr, 0);
    }
    /**
     * Parse/validate and create a new `RoomId`.
     * @param {string} id
     */
    constructor(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.roomid_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        RoomIdFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Return the room ID as a string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.roomid_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const RoomKeyCountsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roomkeycounts_free(ptr >>> 0, 1));
/**
 * Struct holding the number of room keys we have.
 */
export class RoomKeyCounts {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RoomKeyCounts.prototype);
        obj.__wbg_ptr = ptr;
        RoomKeyCountsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoomKeyCountsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roomkeycounts_free(ptr, 0);
    }
    /**
     * The total number of room keys.
     * @returns {number}
     */
    get total() {
        const ret = wasm.__wbg_get_roomkeycounts_total(this.__wbg_ptr);
        return ret;
    }
    /**
     * The total number of room keys.
     * @param {number} arg0
     */
    set total(arg0) {
        wasm.__wbg_set_roomkeycounts_total(this.__wbg_ptr, arg0);
    }
    /**
     * The number of backed up room keys.
     * @returns {number}
     */
    get backedUp() {
        const ret = wasm.__wbg_get_roomkeycounts_backedUp(this.__wbg_ptr);
        return ret;
    }
    /**
     * The number of backed up room keys.
     * @param {number} arg0
     */
    set backedUp(arg0) {
        wasm.__wbg_set_roomkeycounts_backedUp(this.__wbg_ptr, arg0);
    }
}

const RoomKeyImportResultFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roomkeyimportresult_free(ptr >>> 0, 1));
/**
 * The result of a call to {@link OlmMachine.importExportedRoomKeys} or
 * {@link OlmMachine.importBackedUpRoomKeys}.
 */
export class RoomKeyImportResult {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RoomKeyImportResult.prototype);
        obj.__wbg_ptr = ptr;
        RoomKeyImportResultFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoomKeyImportResultFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roomkeyimportresult_free(ptr, 0);
    }
    /**
     * The number of room keys that were imported.
     * @returns {number}
     */
    get importedCount() {
        const ret = wasm.__wbg_get_roomkeyimportresult_importedCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * The total number of room keys that were found in the export.
     * @returns {number}
     */
    get totalCount() {
        const ret = wasm.__wbg_get_roomkeyimportresult_totalCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * The keys that were imported.
     *
     * A Map from room id to a Map of the sender key to a Set of session ids.
     *
     * Typescript type: `Map<string, Map<string, Set<string>>`.
     * @returns {Map<any, any>}
     */
    keys() {
        const ret = wasm.roomkeyimportresult_keys(this.__wbg_ptr);
        return ret;
    }
}

const RoomKeyInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roomkeyinfo_free(ptr >>> 0, 1));
/**
 * Information on a room key that has been received or imported.
 */
export class RoomKeyInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RoomKeyInfo.prototype);
        obj.__wbg_ptr = ptr;
        RoomKeyInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoomKeyInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roomkeyinfo_free(ptr, 0);
    }
    /**
     * The {@link EncryptionAlgorithm} that this key is used for. Will be one
     * of the `m.megolm.*` algorithms.
     * @returns {EncryptionAlgorithm}
     */
    get algorithm() {
        const ret = wasm.roomkeyinfo_algorithm(this.__wbg_ptr);
        return ret;
    }
    /**
     * The room where the key is used.
     * @returns {RoomId}
     */
    get roomId() {
        const ret = wasm.roomkeyinfo_roomId(this.__wbg_ptr);
        return RoomId.__wrap(ret);
    }
    /**
     * The Curve25519 key of the device which initiated the session originally.
     * @returns {Curve25519PublicKey}
     */
    get senderKey() {
        const ret = wasm.roomkeyinfo_senderKey(this.__wbg_ptr);
        return Curve25519PublicKey.__wrap(ret);
    }
    /**
     * The ID of the session that the key is for.
     * @returns {string}
     */
    get sessionId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.roomkeyinfo_sessionId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const RoomKeyWithheldInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roomkeywithheldinfo_free(ptr >>> 0, 1));
/**
 * Information on a received `m.room_key.withheld` event.
 */
export class RoomKeyWithheldInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RoomKeyWithheldInfo.prototype);
        obj.__wbg_ptr = ptr;
        RoomKeyWithheldInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoomKeyWithheldInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roomkeywithheldinfo_free(ptr, 0);
    }
    /**
     * The User ID of the user that sent us the `m.room_key.withheld` message.
     * @returns {UserId}
     */
    get sender() {
        const ret = wasm.roomkeywithheldinfo_sender(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The encryption algorithm of the session that is being withheld.
     * @returns {EncryptionAlgorithm}
     */
    get algorithm() {
        const ret = wasm.roomkeywithheldinfo_algorithm(this.__wbg_ptr);
        return ret;
    }
    /**
     * The `code` from the `m.room_key.withheld` message, such as
     * `m.unverified`.
     * @returns {string}
     */
    get withheldCode() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.roomkeywithheldinfo_withheldCode(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The room ID of the session that is being withheld.
     * @returns {RoomId}
     */
    get roomId() {
        const ret = wasm.roomkeywithheldinfo_roomId(this.__wbg_ptr);
        return RoomId.__wrap(ret);
    }
    /**
     * The session ID of the session that is being withheld.
     * @returns {string}
     */
    get sessionId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.roomkeywithheldinfo_sessionId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const RoomMessageRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roommessagerequest_free(ptr >>> 0, 1));
/**
 * A customized owned request type for sending out room messages
 * ([specification]).
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#put_matrixclientv3roomsroomidsendeventtypetxnid
 */
export class RoomMessageRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RoomMessageRequest.prototype);
        obj.__wbg_ptr = ptr;
        RoomMessageRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoomMessageRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roommessagerequest_free(ptr, 0);
    }
    /**
     * The request ID.
     * @returns {string}
     */
    get id() {
        const ret = wasm.__wbg_get_roommessagerequest_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A string representing the room to send the event to.
     * @returns {string}
     */
    get room_id() {
        const ret = wasm.__wbg_get_roommessagerequest_room_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A string representing the transaction ID for this event.
     *
     * Clients should generate an ID unique across requests with the same
     * access token; it will be used by the server to ensure idempotency of
     * requests.
     * @returns {string}
     */
    get txn_id() {
        const ret = wasm.__wbg_get_roommessagerequest_txn_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A string representing the type of event to be sent.
     * @returns {string}
     */
    get event_type() {
        const ret = wasm.__wbg_get_roommessagerequest_event_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * A JSON-encoded object containing the message's content.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_roommessagerequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `RoomMessageRequest`.
     * @param {string} id
     * @param {string} room_id
     * @param {string} txn_id
     * @param {string} event_type
     * @param {string} content
     */
    constructor(id, room_id, txn_id, event_type, content) {
        const ret = wasm.roommessagerequest_new(id, room_id, txn_id, event_type, content);
        this.__wbg_ptr = ret >>> 0;
        RoomMessageRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get its request type.
     * @returns {RequestType}
     */
    get type() {
        const ret = wasm.roommessagerequest_type(this.__wbg_ptr);
        return ret;
    }
}

const RoomSettingsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_roomsettings_free(ptr >>> 0, 1));
/**
 * Room encryption settings which are modified by state events or user options
 */
export class RoomSettings {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(RoomSettings.prototype);
        obj.__wbg_ptr = ptr;
        RoomSettingsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        RoomSettingsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_roomsettings_free(ptr, 0);
    }
    /**
     * The encryption algorithm that should be used in the room.
     *
     * Should be one of the members of {@link EncryptionAlgorithm}.
     * @returns {EncryptionAlgorithm}
     */
    get algorithm() {
        const ret = wasm.__wbg_get_roomsettings_algorithm(this.__wbg_ptr);
        return ret;
    }
    /**
     * The encryption algorithm that should be used in the room.
     *
     * Should be one of the members of {@link EncryptionAlgorithm}.
     * @param {EncryptionAlgorithm} arg0
     */
    set algorithm(arg0) {
        wasm.__wbg_set_roomsettings_algorithm(this.__wbg_ptr, arg0);
    }
    /**
     * Whether state event encryption is enabled.
     * @returns {boolean}
     */
    get encryptStateEvents() {
        const ret = wasm.__wbg_get_roomsettings_encryptStateEvents(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Whether state event encryption is enabled.
     * @param {boolean} arg0
     */
    set encryptStateEvents(arg0) {
        wasm.__wbg_set_roomsettings_encryptStateEvents(this.__wbg_ptr, arg0);
    }
    /**
     * Whether untrusted devices should receive room keys. If this is `false`,
     * they will be excluded from the conversation.
     * @returns {boolean}
     */
    get onlyAllowTrustedDevices() {
        const ret = wasm.__wbg_get_roomsettings_onlyAllowTrustedDevices(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Whether untrusted devices should receive room keys. If this is `false`,
     * they will be excluded from the conversation.
     * @param {boolean} arg0
     */
    set onlyAllowTrustedDevices(arg0) {
        wasm.__wbg_set_roomsettings_onlyAllowTrustedDevices(this.__wbg_ptr, arg0);
    }
    /**
     * The maximum time, in milliseconds, that an encryption session should be
     * used for, before it is rotated.
     * @returns {number | undefined}
     */
    get sessionRotationPeriodMs() {
        const ret = wasm.__wbg_get_roomsettings_sessionRotationPeriodMs(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * The maximum time, in milliseconds, that an encryption session should be
     * used for, before it is rotated.
     * @param {number | null} [arg0]
     */
    set sessionRotationPeriodMs(arg0) {
        wasm.__wbg_set_roomsettings_sessionRotationPeriodMs(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
     * The maximum number of messages an encryption session should be used for,
     * before it is rotated.
     * @returns {number | undefined}
     */
    get sessionRotationPeriodMessages() {
        const ret = wasm.__wbg_get_roomsettings_sessionRotationPeriodMessages(this.__wbg_ptr);
        return ret[0] === 0 ? undefined : ret[1];
    }
    /**
     * The maximum number of messages an encryption session should be used for,
     * before it is rotated.
     * @param {number | null} [arg0]
     */
    set sessionRotationPeriodMessages(arg0) {
        wasm.__wbg_set_roomsettings_sessionRotationPeriodMessages(this.__wbg_ptr, !isLikeNone(arg0), isLikeNone(arg0) ? 0 : arg0);
    }
    /**
     * Create a new `RoomSettings` with default values.
     */
    constructor() {
        const ret = wasm.roomsettings_new();
        this.__wbg_ptr = ret >>> 0;
        RoomSettingsFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const SasFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_sas_free(ptr >>> 0, 1));
/**
 * Short Authentication String (SAS) verification.
 */
export class Sas {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Sas.prototype);
        obj.__wbg_ptr = ptr;
        SasFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SasFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_sas_free(ptr, 0);
    }
    /**
     * Get our own user ID.
     * @returns {UserId}
     */
    get userId() {
        const ret = wasm.sas_userId(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * Get our own device ID.
     * @returns {DeviceId}
     */
    get deviceId() {
        const ret = wasm.sas_deviceId(this.__wbg_ptr);
        return DeviceId.__wrap(ret);
    }
    /**
     * Get the user id of the other side.
     * @returns {UserId}
     */
    get otherUserId() {
        const ret = wasm.sas_otherUserId(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * Get the device ID of the other side.
     * @returns {DeviceId}
     */
    get otherDeviceId() {
        const ret = wasm.sas_otherDeviceId(this.__wbg_ptr);
        return DeviceId.__wrap(ret);
    }
    /**
     * Get the unique ID that identifies this SAS verification flow,
     * be either a to-device request ID or a room event ID.
     * @returns {string}
     */
    get flowId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.sas_flowId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Get the room ID if the verification is happening inside a
     * room.
     * @returns {RoomId | undefined}
     */
    get roomId() {
        const ret = wasm.sas_roomId(this.__wbg_ptr);
        return ret === 0 ? undefined : RoomId.__wrap(ret);
    }
    /**
     * Does this verification flow support displaying emoji for the
     * short authentication string?
     * @returns {boolean}
     */
    supportsEmoji() {
        const ret = wasm.sas_supportsEmoji(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Did this verification flow start from a verification request?
     * @returns {boolean}
     */
    startedFromRequest() {
        const ret = wasm.sas_startedFromRequest(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is this a verification that is verifying one of our own
     * devices?
     * @returns {boolean}
     */
    isSelfVerification() {
        const ret = wasm.sas_isSelfVerification(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Have we confirmed that the short auth string matches?
     * @returns {boolean}
     */
    haveWeConfirmed() {
        const ret = wasm.sas_haveWeConfirmed(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Has the verification been accepted by both parties?
     * @returns {boolean}
     */
    hasBeenAccepted() {
        const ret = wasm.sas_hasBeenAccepted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get info about the cancellation if the verification flow has
     * been cancelled.
     * @returns {CancelInfo | undefined}
     */
    cancelInfo() {
        const ret = wasm.sas_cancelInfo(this.__wbg_ptr);
        return ret === 0 ? undefined : CancelInfo.__wrap(ret);
    }
    /**
     * True if we initiated the verification flow (ie, we sent the
     * `m.key.verification.request`).
     * @returns {boolean}
     */
    weStarted() {
        const ret = wasm.sas_weStarted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Accept the SAS verification.
     *
     * This does nothing (and returns `undefined`) if the verification was
     * already accepted, otherwise it returns an `OutgoingRequest`
     * that needs to be sent out.
     * @returns {any}
     */
    accept() {
        const ret = wasm.sas_accept(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Confirm the SAS verification.
     *
     * This confirms that the short auth strings match on both sides.
     *
     * Does nothing if we’re not in a state where we can confirm the
     * short auth string.
     *
     * Returns a `Promise` for an array of `OutgoingRequest`s.
     * @returns {Promise<any>}
     */
    confirm() {
        const ret = wasm.sas_confirm(this.__wbg_ptr);
        return ret;
    }
    /**
     * Cancel the verification.
     *
     * Returns either an `OutgoingRequest` which should be sent out, or
     * `undefined` if the verification is already cancelled.
     * @returns {any}
     */
    cancel() {
        const ret = wasm.sas_cancel(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Cancel the verification.
     *
     * This cancels the verification with given code (e.g. `m.user`).
     *
     * Returns either an `OutgoingRequest` which should be sent out, or
     * `undefined` if the verification is already cancelled.
     * @param {string} code
     * @returns {any}
     */
    cancelWithCode(code) {
        const ptr0 = passStringToWasm0(code, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.sas_cancelWithCode(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Has the SAS verification flow timed out?
     * @returns {boolean}
     */
    timedOut() {
        const ret = wasm.sas_timedOut(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Are we in a state where we can show the short auth string?
     * @returns {boolean}
     */
    canBePresented() {
        const ret = wasm.sas_canBePresented(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is the SAS flow done?
     * @returns {boolean}
     */
    isDone() {
        const ret = wasm.sas_isDone(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is the SAS flow cancelled?
     * @returns {boolean}
     */
    isCancelled() {
        const ret = wasm.sas_isCancelled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the emoji version of the short auth string.
     *
     * Returns `undefined` if we can't yet present the short auth string,
     * otherwise an array of seven `Emoji` objects.
     * @returns {Emoji[] | undefined}
     */
    emoji() {
        const ret = wasm.sas_emoji(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * Get the index of the emoji representing the short auth string
     *
     * Returns `undefined` if we can’t yet present the short auth
     * string, otherwise seven `u8` numbers in the range from 0 to 63
     * inclusive which can be converted to an emoji using [the
     * relevant specification
     * entry](https://spec.matrix.org/unstable/client-server-api/#sas-method-emoji).
     * @returns {Uint8Array | undefined}
     */
    emojiIndex() {
        const ret = wasm.sas_emojiIndex(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
    /**
     * Get the decimal version of the short auth string.
     *
     * Returns None if we can’t yet present the short auth string,
     * otherwise a tuple containing three 4-digit integers that
     * represent the short auth string.
     * @returns {Uint16Array | undefined}
     */
    decimals() {
        const ret = wasm.sas_decimals(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayU16FromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 2, 2);
        }
        return v1;
    }
    /**
     * Register a callback which will be called whenever there is an update to
     * the request.
     *
     * The `callback` is called with no parameters.
     * @param {Function} callback
     */
    registerChangesCallback(callback) {
        wasm.sas_registerChangesCallback(this.__wbg_ptr, callback);
    }
}

const SecretsBundleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_secretsbundle_free(ptr >>> 0, 1));
/**
 * Struct containing the bundle of secrets to fully activate a new device for
 * end-to-end encryption.
 */
export class SecretsBundle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SecretsBundle.prototype);
        obj.__wbg_ptr = ptr;
        SecretsBundleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SecretsBundleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_secretsbundle_free(ptr, 0);
    }
    /**
     * The seed of the master key encoded as unpadded base64.
     * @returns {string}
     */
    get masterKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.secretsbundle_masterKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The seed of the self signing key encoded as unpadded base64.
     * @returns {string}
     */
    get selfSigningKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.secretsbundle_selfSigningKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The seed of the user signing key encoded as unpadded base64.
     * @returns {string}
     */
    get userSigningKey() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.secretsbundle_userSigningKey(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The bundle of the backup decryption key and backup version if any.
     * @returns {BackupSecretsBundle | undefined}
     */
    get backupBundle() {
        const ret = wasm.secretsbundle_backupBundle(this.__wbg_ptr);
        return ret === 0 ? undefined : BackupSecretsBundle.__wrap(ret);
    }
    /**
     * Serialize the [`SecretsBundle`] to a JSON object.
     * @returns {any}
     */
    to_json() {
        const ret = wasm.secretsbundle_to_json(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Deserialize the [`SecretsBundle`] from a JSON object.
     * @param {any} json
     * @returns {SecretsBundle}
     */
    static from_json(json) {
        const ret = wasm.secretsbundle_from_json(json);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return SecretsBundle.__wrap(ret[0]);
    }
}

const ServerNameFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_servername_free(ptr >>> 0, 1));
/**
 * A Matrix-spec compliant [server name].
 *
 * It consists of a host and an optional port (separated by a colon if
 * present).
 *
 * [server name]: https://spec.matrix.org/v1.2/appendices/#server-name
 */
export class ServerName {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ServerName.prototype);
        obj.__wbg_ptr = ptr;
        ServerNameFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ServerNameFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_servername_free(ptr, 0);
    }
    /**
     * Parse/validate and create a new `ServerName`.
     * @param {string} name
     */
    constructor(name) {
        const ptr0 = passStringToWasm0(name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.servername_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        ServerNameFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Returns the host of the server name.
     *
     * That is: Return the part of the server before `:<port>` or the
     * full server name if there is no port.
     * @returns {string}
     */
    get host() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.servername_host(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Returns the port of the server name if any.
     * @returns {number | undefined}
     */
    get port() {
        const ret = wasm.servername_port(this.__wbg_ptr);
        return ret === 0xFFFFFF ? undefined : ret;
    }
    /**
     * Returns true if and only if the server name is an IPv4 or IPv6
     * address.
     * @returns {boolean}
     */
    isIpLiteral() {
        const ret = wasm.servername_isIpLiteral(this.__wbg_ptr);
        return ret !== 0;
    }
}

const ShieldStateFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_shieldstate_free(ptr >>> 0, 1));
/**
 * Take a look at [`matrix_sdk_common::deserialized_responses::ShieldState`]
 * for more info.
 */
export class ShieldState {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ShieldState.prototype);
        obj.__wbg_ptr = ptr;
        ShieldStateFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ShieldStateFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_shieldstate_free(ptr, 0);
    }
    /**
     * The shield color
     * @returns {ShieldColor}
     */
    get color() {
        const ret = wasm.__wbg_get_shieldstate_color(this.__wbg_ptr);
        return ret;
    }
    /**
     * The shield color
     * @param {ShieldColor} arg0
     */
    set color(arg0) {
        wasm.__wbg_set_shieldstate_color(this.__wbg_ptr, arg0);
    }
    /**
     * A machine-readable representation of the authenticity for a
     * `ShieldState`.
     * @returns {ShieldStateCode | undefined}
     */
    get code() {
        const ret = wasm.__wbg_get_shieldstate_code(this.__wbg_ptr);
        return ret === 7 ? undefined : ret;
    }
    /**
     * A machine-readable representation of the authenticity for a
     * `ShieldState`.
     * @param {ShieldStateCode | null} [arg0]
     */
    set code(arg0) {
        wasm.__wbg_set_shieldstate_code(this.__wbg_ptr, isLikeNone(arg0) ? 7 : arg0);
    }
    /**
     * Error message that can be displayed as a tooltip
     * @returns {string | undefined}
     */
    get message() {
        const ret = wasm.shieldstate_message(this.__wbg_ptr);
        let v1;
        if (ret[0] !== 0) {
            v1 = getStringFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        }
        return v1;
    }
}

const SignatureFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signature_free(ptr >>> 0, 1));
/**
 * Represents a potentially decoded signature (but not a validated
 * one).
 */
export class Signature {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Signature.prototype);
        obj.__wbg_ptr = ptr;
        SignatureFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignatureFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signature_free(ptr, 0);
    }
    /**
     * Get the Ed25519 signature, if this is one.
     * @returns {Ed25519Signature | undefined}
     */
    get ed25519() {
        const ret = wasm.signature_ed25519(this.__wbg_ptr);
        return ret === 0 ? undefined : Ed25519Signature.__wrap(ret);
    }
    /**
     * Convert the signature to a base64 encoded string.
     * @returns {string}
     */
    toBase64() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.signature_toBase64(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const SignatureUploadRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signatureuploadrequest_free(ptr >>> 0, 1));
/**
 * Data for a request to the `/keys/signatures/upload` API endpoint
 * ([specification]).
 *
 * Publishes cross-signing signatures for the user.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#post_matrixclientv3keyssignaturesupload
 */
export class SignatureUploadRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SignatureUploadRequest.prototype);
        obj.__wbg_ptr = ptr;
        SignatureUploadRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignatureUploadRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signatureuploadrequest_free(ptr, 0);
    }
    /**
     * The request ID.
     * Some signature upload will have to an `id` field, some won't.
     * They have one when they are created automatically during an interactive
     * verification, otherwise they don't.
     * @returns {string | undefined}
     */
    get id() {
        const ret = wasm.__wbg_get_signatureuploadrequest_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A JSON-encoded object containing the payload of the request
     *
     * It represents the body of the HTTP request.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_signatureuploadrequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `SignatureUploadRequest`.
     * @param {string} id
     * @param {string} signed_keys
     */
    constructor(id, signed_keys) {
        const ret = wasm.signatureuploadrequest_new(id, signed_keys);
        this.__wbg_ptr = ret >>> 0;
        SignatureUploadRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get its request type.
     * @returns {RequestType}
     */
    get type() {
        const ret = wasm.signatureuploadrequest_type(this.__wbg_ptr);
        return ret;
    }
}

const SignatureVerificationFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signatureverification_free(ptr >>> 0, 1));
/**
 * The result of a signature verification of a signed JSON object.
 */
export class SignatureVerification {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(SignatureVerification.prototype);
        obj.__wbg_ptr = ptr;
        SignatureVerificationFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignatureVerificationFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signatureverification_free(ptr, 0);
    }
    /**
     * Give the backup signature state from the current device.
     * See SignatureState for values
     * @returns {SignatureState}
     */
    get deviceState() {
        const ret = wasm.signatureverification_deviceState(this.__wbg_ptr);
        return ret;
    }
    /**
     * Give the backup signature state from the current user identity.
     * See SignatureState for values
     * @returns {SignatureState}
     */
    get userState() {
        const ret = wasm.signatureverification_userState(this.__wbg_ptr);
        return ret;
    }
    /**
     * Is the result considered to be trusted?
     *
     * This tells us if the result has a valid signature from any of the
     * following:
     *
     * * Our own device
     * * Our own user identity, provided the identity is trusted as well
     * * Any of our own devices, provided the device is trusted as well
     * @returns {boolean}
     */
    trusted() {
        const ret = wasm.signatureverification_trusted(this.__wbg_ptr);
        return ret !== 0;
    }
}

const SignaturesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_signatures_free(ptr >>> 0, 1));
/**
 * A collection of `Signature`.
 */
export class Signatures {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Signatures.prototype);
        obj.__wbg_ptr = ptr;
        SignaturesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        SignaturesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_signatures_free(ptr, 0);
    }
    /**
     * Creates a new, empty, signatures collection.
     */
    constructor() {
        const ret = wasm.signatures_new();
        this.__wbg_ptr = ret >>> 0;
        SignaturesFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Add the given signature from the given signer and the given key ID to
     * the collection.
     * @param {UserId} signer
     * @param {DeviceKeyId} key_id
     * @param {Ed25519Signature} signature
     * @returns {MaybeSignature | undefined}
     */
    addSignature(signer, key_id, signature) {
        _assertClass(signer, UserId);
        _assertClass(key_id, DeviceKeyId);
        _assertClass(signature, Ed25519Signature);
        const ret = wasm.signatures_addSignature(this.__wbg_ptr, signer.__wbg_ptr, key_id.__wbg_ptr, signature.__wbg_ptr);
        return ret === 0 ? undefined : MaybeSignature.__wrap(ret);
    }
    /**
     * Try to find an Ed25519 signature from the given signer with
     * the given key ID.
     * @param {UserId} signer
     * @param {DeviceKeyId} key_id
     * @returns {Ed25519Signature | undefined}
     */
    getSignature(signer, key_id) {
        _assertClass(signer, UserId);
        _assertClass(key_id, DeviceKeyId);
        const ret = wasm.signatures_getSignature(this.__wbg_ptr, signer.__wbg_ptr, key_id.__wbg_ptr);
        return ret === 0 ? undefined : Ed25519Signature.__wrap(ret);
    }
    /**
     * Get the map of signatures that belong to the given user.
     * @param {UserId} signer
     * @returns {Map<any, any> | undefined}
     */
    get(signer) {
        _assertClass(signer, UserId);
        const ret = wasm.signatures_get(this.__wbg_ptr, signer.__wbg_ptr);
        return ret;
    }
    /**
     * Remove all the signatures we currently hold.
     */
    clear() {
        wasm.signatures_clear(this.__wbg_ptr);
    }
    /**
     * Do we hold any signatures or is our collection completely
     * empty.
     * @returns {boolean}
     */
    isEmpty() {
        const ret = wasm.signatures_isEmpty(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * How many signatures do we currently hold.
     * @returns {number}
     */
    get count() {
        const ret = wasm.signatures_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Get the json with all signatures
     * @returns {string}
     */
    asJSON() {
        const ret = wasm.signatures_asJSON(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}

const StoreHandleFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_storehandle_free(ptr >>> 0, 1));
/**
 * A struct containing an open connection to a CryptoStore.
 *
 * Opening the CryptoStore can take some time, due to the PBKDF calculation
 * involved, so if multiple operations are being done on the same store, it is
 * more efficient to open it once.
 */
export class StoreHandle {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StoreHandle.prototype);
        obj.__wbg_ptr = ptr;
        StoreHandleFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StoreHandleFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_storehandle_free(ptr, 0);
    }
    /**
     * Open a crypto store.
     *
     * The created store will be based on IndexedDB if a `store_name` is
     * provided; otherwise it will be based on a memory store and once the
     * objects is dropped, the keys will be lost.
     *
     * # Arguments
     *
     * * `store_name` - The name that should be used to open the IndexedDB
     *   based database. If this isn't provided, a memory-only store will be
     *   used. *Note* the memory-only store will lose your E2EE keys when the
     *   `StoreHandle` gets dropped.
     *
     * * `store_passphrase` - The passphrase that should be used to encrypt the
     *   store, for IndexedDB-based stores
     *
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the open operation. An instance of `JsLogger`.
     * @param {string | null} [store_name]
     * @param {string | null} [store_passphrase]
     * @param {any | null} [logger]
     * @returns {Promise<StoreHandle>}
     */
    static open(store_name, store_passphrase, logger) {
        var ptr0 = isLikeNone(store_name) ? 0 : passStringToWasm0(store_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        var ptr1 = isLikeNone(store_passphrase) ? 0 : passStringToWasm0(store_passphrase, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        const ret = wasm.storehandle_open(ptr0, len0, ptr1, len1, isLikeNone(logger) ? 0 : addToExternrefTable0(logger));
        return ret;
    }
    /**
     * Open a crypto store based on IndexedDB, using the given key for
     * encryption.
     *
     * # Arguments
     *
     * * `store_name` - The name that should be used to open the IndexedDB
     *   based database.
     *
     * * `store_key` - The key that should be used to encrypt the store, for
     *   IndexedDB-based stores. Must be a 32-byte array.
     *
     * * `logger` - An optional logger instance to use for writing log messages
     *   during the open operation. An instance of `JsLogger`.
     * @param {string} store_name
     * @param {Uint8Array} store_key
     * @param {any | null} [logger]
     * @returns {Promise<StoreHandle>}
     */
    static openWithKey(store_name, store_key, logger) {
        const ptr0 = passStringToWasm0(store_name, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passArray8ToWasm0(store_key, wasm.__wbindgen_malloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.storehandle_openWithKey(ptr0, len0, ptr1, len1, isLikeNone(logger) ? 0 : addToExternrefTable0(logger));
        return ret;
    }
}

const StoredRoomKeyBundleDataFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_storedroomkeybundledata_free(ptr >>> 0, 1));
/**
 * Information on a stored room key bundle data event.
 */
export class StoredRoomKeyBundleData {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StoredRoomKeyBundleData.prototype);
        obj.__wbg_ptr = ptr;
        StoredRoomKeyBundleDataFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StoredRoomKeyBundleDataFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_storedroomkeybundledata_free(ptr, 0);
    }
    /**
     * The user that sent us this data.
     * @returns {UserId}
     */
    get senderUser() {
        const ret = wasm.storedroomkeybundledata_senderUser(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The room that these keys are for.
     * @returns {RoomId}
     */
    get roomId() {
        const ret = wasm.storedroomkeybundledata_roomId(this.__wbg_ptr);
        return RoomId.__wrap(ret);
    }
    /**
     * The location of the bundle.
     * @returns {string}
     */
    get url() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.storedroomkeybundledata_url(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The JSON-encoded encryption info for the key bundle.
     *
     * @deprecated Should not be used within applications.
     * @returns {string}
     */
    get encryptionInfo() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.storedroomkeybundledata_encryptionInfo(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
}

const ToDeviceEncryptionInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_todeviceencryptioninfo_free(ptr >>> 0, 1));
/**
 * Struct containing information on how a to-device message was decrypted.
 */
export class ToDeviceEncryptionInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ToDeviceEncryptionInfo.prototype);
        obj.__wbg_ptr = ptr;
        ToDeviceEncryptionInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ToDeviceEncryptionInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_todeviceencryptioninfo_free(ptr, 0);
    }
    /**
     * The base64-encoded public Curve25519 key of the device that encrypted
     * the message.
     * @returns {string}
     */
    get senderCurve25519Key() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.__wbg_get_todeviceencryptioninfo_senderCurve25519Key(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * The base64-encoded public Curve25519 key of the device that encrypted
     * the message.
     * @param {string} arg0
     */
    set senderCurve25519Key(arg0) {
        const ptr0 = passStringToWasm0(arg0, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        wasm.__wbg_set_backupsecretsbundle_key(this.__wbg_ptr, ptr0, len0);
    }
    /**
     * The user ID of the sender of the event.
     *
     * Note this is untrusted data unless {@link isSenderVerified} is true.
     * @returns {UserId}
     */
    get sender() {
        const ret = wasm.__wbg_get_todeviceencryptioninfo_sender(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The user ID of the sender of the event.
     *
     * Note this is untrusted data unless {@link isSenderVerified} is true.
     * @param {UserId} arg0
     */
    set sender(arg0) {
        _assertClass(arg0, UserId);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_todeviceencryptioninfo_sender(this.__wbg_ptr, ptr0);
    }
    /**
     * The device ID of the device that sent us the to-device message.
     *
     * Could be `undefined` in the case where the to-device message sender
     * checks are delayed. There is no delay for to-device messages other
     * than `m.room_key`, so this will always be truthy for other
     * message types (the decryption would fail if the sender device keys
     * cannot be found).
     *
     * Note this is untrusted data unless {@link isSenderVerified} is true.
     * @returns {DeviceId | undefined}
     */
    get senderDevice() {
        const ret = wasm.__wbg_get_todeviceencryptioninfo_senderDevice(this.__wbg_ptr);
        return ret === 0 ? undefined : DeviceId.__wrap(ret);
    }
    /**
     * The device ID of the device that sent us the to-device message.
     *
     * Could be `undefined` in the case where the to-device message sender
     * checks are delayed. There is no delay for to-device messages other
     * than `m.room_key`, so this will always be truthy for other
     * message types (the decryption would fail if the sender device keys
     * cannot be found).
     *
     * Note this is untrusted data unless {@link isSenderVerified} is true.
     * @param {DeviceId | null} [arg0]
     */
    set senderDevice(arg0) {
        let ptr0 = 0;
        if (!isLikeNone(arg0)) {
            _assertClass(arg0, DeviceId);
            ptr0 = arg0.__destroy_into_raw();
        }
        wasm.__wbg_set_todeviceencryptioninfo_senderDevice(this.__wbg_ptr, ptr0);
    }
    /**
     * Returns whether the sender device is in a verified state.
     * This reflects the state at the time of decryption.
     * @returns {boolean}
     */
    isSenderVerified() {
        const ret = wasm.todeviceencryptioninfo_isSenderVerified(this.__wbg_ptr);
        return ret !== 0;
    }
}

const ToDeviceRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_todevicerequest_free(ptr >>> 0, 1));
/**
 * Data for a request to the `/sendToDevice` API endpoint
 * ([specification]).
 *
 * Send an event to a single device or to a group of devices.
 *
 * [specification]: https://spec.matrix.org/unstable/client-server-api/#put_matrixclientv3sendtodeviceeventtypetxnid
 */
export class ToDeviceRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ToDeviceRequest.prototype);
        obj.__wbg_ptr = ptr;
        ToDeviceRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ToDeviceRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_todevicerequest_free(ptr, 0);
    }
    /**
     * The request ID.
     * For to-device request this would be the same value as `txn_id`. It is
     * exposed also as `id` so that the js bindings are consistent with the
     * other request types by using this field to mark as sent.
     * @returns {string}
     */
    get id() {
        const ret = wasm.__wbg_get_todevicerequest_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A string representing the type of event being sent to each devices.
     * @returns {string}
     */
    get event_type() {
        const ret = wasm.__wbg_get_todevicerequest_event_type(this.__wbg_ptr);
        return ret;
    }
    /**
     * A string representing a request identifier unique to the access token
     * used to send the request.
     * @returns {string}
     */
    get txn_id() {
        const ret = wasm.__wbg_get_todevicerequest_txn_id(this.__wbg_ptr);
        return ret;
    }
    /**
     * A JSON-encoded object containing the rest of the payload: `messages`.
     *
     * It represents the body of the HTTP request.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_todevicerequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `ToDeviceRequest`.
     * @param {string} id
     * @param {string} event_type
     * @param {string} txn_id
     * @param {string} body
     */
    constructor(id, event_type, txn_id, body) {
        const ret = wasm.todevicerequest_new(id, event_type, txn_id, body);
        this.__wbg_ptr = ret >>> 0;
        ToDeviceRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Get its request type.
     * @returns {RequestType}
     */
    get type() {
        const ret = wasm.todevicerequest_type(this.__wbg_ptr);
        return ret;
    }
}

const ToDeviceUnableToDecryptInfoFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_todeviceunabletodecryptinfo_free(ptr >>> 0, 1));
/**
 * Metadata about a to-device event that could not be decrypted.
 */
export class ToDeviceUnableToDecryptInfo {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(ToDeviceUnableToDecryptInfo.prototype);
        obj.__wbg_ptr = ptr;
        ToDeviceUnableToDecryptInfoFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ToDeviceUnableToDecryptInfoFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_todeviceunabletodecryptinfo_free(ptr, 0);
    }
    /**
     * Reason code for the decryption failure
     * @returns {ToDeviceUnableToDecryptReason}
     */
    get reason() {
        const ret = wasm.__wbg_get_todeviceunabletodecryptinfo_reason(this.__wbg_ptr);
        return ret;
    }
    /**
     * Reason code for the decryption failure
     * @param {ToDeviceUnableToDecryptReason} arg0
     */
    set reason(arg0) {
        wasm.__wbg_set_todeviceunabletodecryptinfo_reason(this.__wbg_ptr, arg0);
    }
}

const TracingFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tracing_free(ptr >>> 0, 1));
/**
 * Type to install and to manipulate the tracing layer.
 */
export class Tracing {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TracingFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tracing_free(ptr, 0);
    }
    /**
     * Check whether the `tracing` feature has been enabled.
     *
     * @deprecated: `tracing` is now always enabled.
     * @returns {boolean}
     */
    static isAvailable() {
        const ret = wasm.tracing_isAvailable();
        return ret !== 0;
    }
    /**
     * Install the tracing layer.
     * @param {LoggerLevel} min_level
     */
    constructor(min_level) {
        const ret = wasm.tracing_new(min_level);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        TracingFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Re-define the minimum logger level.
     * @param {LoggerLevel} min_level
     */
    set minLevel(min_level) {
        const ret = wasm.tracing_set_minLevel(this.__wbg_ptr, min_level);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Turn the logger on, i.e. it emits logs again if it was turned
     * off.
     */
    turnOn() {
        const ret = wasm.tracing_turnOn(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Turn the logger off, i.e. it no longer emits logs.
     */
    turnOff() {
        const ret = wasm.tracing_turnOff(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
}

const UTDToDeviceEventFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_utdtodeviceevent_free(ptr >>> 0, 1));
/**
 * Represents an encrypted to-device event that could not be decrypted.
 */
export class UTDToDeviceEvent {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UTDToDeviceEvent.prototype);
        obj.__wbg_ptr = ptr;
        UTDToDeviceEventFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UTDToDeviceEventFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_utdtodeviceevent_free(ptr, 0);
    }
    /**
     * The original message (of type `m.room.encrypted`) that failed to be
     * decrypted, encoded as JSON.
     * @returns {string}
     */
    get rawEvent() {
        const ret = wasm.__wbg_get_utdtodeviceevent_rawEvent(this.__wbg_ptr);
        return ret;
    }
    /**
     * Information on the reason we failed to decrypt
     * @returns {ToDeviceUnableToDecryptInfo}
     */
    get utdInfo() {
        const ret = wasm.__wbg_get_utdtodeviceevent_utdInfo(this.__wbg_ptr);
        return ToDeviceUnableToDecryptInfo.__wrap(ret);
    }
    /**
     * The type of processed to-device event. Always {@link
     * ProcessedToDeviceEventType.UnableToDecrypt} for this type.
     * @returns {ProcessedToDeviceEventType}
     */
    get type() {
        const ret = wasm.utdtodeviceevent_type(this.__wbg_ptr);
        return ret;
    }
}

const UploadSigningKeysRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_uploadsigningkeysrequest_free(ptr >>> 0, 1));
/**
 * Other Requests *
 * Request that will publish a cross signing identity.
 *
 * This uploads the public cross signing key triplet.
 */
export class UploadSigningKeysRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UploadSigningKeysRequest.prototype);
        obj.__wbg_ptr = ptr;
        UploadSigningKeysRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UploadSigningKeysRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_uploadsigningkeysrequest_free(ptr, 0);
    }
    /**
     * A JSON-encoded object containing the rest of the payload: `master_key`,
     * `self_signing_key`, `user_signing_key`.
     *
     * It represents the body of the HTTP request.
     * @returns {string}
     */
    get body() {
        const ret = wasm.__wbg_get_uploadsigningkeysrequest_body(this.__wbg_ptr);
        return ret;
    }
    /**
     * Create a new `UploadSigningKeysRequest`.
     * @param {string} body
     */
    constructor(body) {
        const ret = wasm.uploadsigningkeysrequest_new(body);
        this.__wbg_ptr = ret >>> 0;
        UploadSigningKeysRequestFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
}

const UserDevicesFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_userdevices_free(ptr >>> 0, 1));
/**
 * A read only view over all devices belonging to a user.
 */
export class UserDevices {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UserDevices.prototype);
        obj.__wbg_ptr = ptr;
        UserDevicesFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UserDevicesFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_userdevices_free(ptr, 0);
    }
    /**
     * Get the specific device with the given device ID.
     * @param {DeviceId} device_id
     * @returns {Device | undefined}
     */
    get(device_id) {
        _assertClass(device_id, DeviceId);
        const ret = wasm.userdevices_get(this.__wbg_ptr, device_id.__wbg_ptr);
        return ret === 0 ? undefined : Device.__wrap(ret);
    }
    /**
     * Returns true if there is at least one devices of this user
     * that is considered to be verified, false otherwise.
     *
     * This won't consider your own device as verified, as your own
     * device is always implicitly verified.
     * @returns {boolean}
     */
    isAnyVerified() {
        const ret = wasm.userdevices_isAnyVerified(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Array over all the device IDs of the user devices.
     * @returns {Array<any>}
     */
    keys() {
        const ret = wasm.userdevices_keys(this.__wbg_ptr);
        return ret;
    }
    /**
     * Iterator over all the devices of the user devices.
     * @returns {Array<any>}
     */
    devices() {
        const ret = wasm.userdevices_devices(this.__wbg_ptr);
        return ret;
    }
}

const UserIdFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_userid_free(ptr >>> 0, 1));
/**
 * A Matrix [user ID].
 *
 * [user ID]: https://spec.matrix.org/v1.2/appendices/#user-identifiers
 */
export class UserId {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(UserId.prototype);
        obj.__wbg_ptr = ptr;
        UserIdFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    static __unwrap(jsValue) {
        if (!(jsValue instanceof UserId)) {
            return 0;
        }
        return jsValue.__destroy_into_raw();
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        UserIdFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_userid_free(ptr, 0);
    }
    /**
     * Parse/validate and create a new `UserId`.
     * @param {string} id
     */
    constructor(id) {
        const ptr0 = passStringToWasm0(id, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.userid_new(ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        this.__wbg_ptr = ret[0] >>> 0;
        UserIdFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * Returns the user's localpart.
     * @returns {string}
     */
    get localpart() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.userid_localpart(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Returns the server name of the user ID.
     * @returns {ServerName}
     */
    get serverName() {
        const ret = wasm.userid_serverName(this.__wbg_ptr);
        return ServerName.__wrap(ret);
    }
    /**
     * Whether this user ID is a historical one.
     *
     * A historical user ID is one that doesn't conform to the latest
     * specification of the user ID grammar but is still accepted
     * because it was previously allowed.
     * @returns {boolean}
     */
    isHistorical() {
        const ret = wasm.userid_isHistorical(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Return the user ID as a string.
     * @returns {string}
     */
    toString() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.userid_toString(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Create a clone of this `UserId`.
     *
     * This can be useful when passing a `UserId` instance to methods such as
     * {@link OlmMachine.updateTrackedUsers} which destroy the instance.
     * @returns {UserId}
     */
    clone() {
        const ret = wasm.userid_clone(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
}

const VerificationRequestFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_verificationrequest_free(ptr >>> 0, 1));
/**
 * An object controlling key verification requests.
 *
 * Interactive verification flows usually start with a verification
 * request, this object lets you send and reply to such a
 * verification request.
 *
 * After the initial handshake the verification flow transitions into
 * one of the verification methods.
 */
export class VerificationRequest {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(VerificationRequest.prototype);
        obj.__wbg_ptr = ptr;
        VerificationRequestFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VerificationRequestFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_verificationrequest_free(ptr, 0);
    }
    /**
     * Create an event content that can be sent as a room event to
     * request verification from the other side. This should be used
     * only for verifications of other users and it should be sent to
     * a room we consider to be a DM with the other user.
     * @param {UserId} own_user_id
     * @param {DeviceId} own_device_id
     * @param {UserId} other_user_id
     * @param {any[] | null} [methods]
     * @returns {string}
     */
    static request(own_user_id, own_device_id, other_user_id, methods) {
        let deferred3_0;
        let deferred3_1;
        try {
            _assertClass(own_user_id, UserId);
            _assertClass(own_device_id, DeviceId);
            _assertClass(other_user_id, UserId);
            var ptr0 = isLikeNone(methods) ? 0 : passArrayJsValueToWasm0(methods, wasm.__wbindgen_malloc);
            var len0 = WASM_VECTOR_LEN;
            const ret = wasm.verificationrequest_request(own_user_id.__wbg_ptr, own_device_id.__wbg_ptr, other_user_id.__wbg_ptr, ptr0, len0);
            var ptr2 = ret[0];
            var len2 = ret[1];
            if (ret[3]) {
                ptr2 = 0; len2 = 0;
                throw takeFromExternrefTable0(ret[2]);
            }
            deferred3_0 = ptr2;
            deferred3_1 = len2;
            return getStringFromWasm0(ptr2, len2);
        } finally {
            wasm.__wbindgen_free(deferred3_0, deferred3_1, 1);
        }
    }
    /**
     * Our own user id.
     * @returns {UserId}
     */
    get ownUserId() {
        const ret = wasm.verificationrequest_ownUserId(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The ID of the other user that is participating in this
     * verification request.
     * @returns {UserId}
     */
    get otherUserId() {
        const ret = wasm.verificationrequest_otherUserId(this.__wbg_ptr);
        return UserId.__wrap(ret);
    }
    /**
     * The ID of the other device that is participating in this
     * verification.
     * @returns {DeviceId | undefined}
     */
    get otherDeviceId() {
        const ret = wasm.verificationrequest_otherDeviceId(this.__wbg_ptr);
        return ret === 0 ? undefined : DeviceId.__wrap(ret);
    }
    /**
     * Get the room ID if the verification is happening inside a
     * room.
     * @returns {RoomId | undefined}
     */
    get roomId() {
        const ret = wasm.verificationrequest_roomId(this.__wbg_ptr);
        return ret === 0 ? undefined : RoomId.__wrap(ret);
    }
    /**
     * Get info about the cancellation if the verification request
     * has been cancelled.
     * @returns {CancelInfo | undefined}
     */
    get cancelInfo() {
        const ret = wasm.verificationrequest_cancelInfo(this.__wbg_ptr);
        return ret === 0 ? undefined : CancelInfo.__wrap(ret);
    }
    /**
     * Has the verification request been answered by another device?
     * @returns {boolean}
     */
    isPassive() {
        const ret = wasm.verificationrequest_isPassive(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Is the verification request ready to start a verification flow?
     * @returns {boolean}
     */
    isReady() {
        const ret = wasm.verificationrequest_isReady(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Has the verification flow timed out?
     * @returns {boolean}
     */
    timedOut() {
        const ret = wasm.verificationrequest_timedOut(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * The number of milliseconds remaining before this verification flow times
     * out.
     *
     * Returns zero if the time has already passed.
     * @returns {number}
     */
    timeRemainingMillis() {
        const ret = wasm.verificationrequest_timeRemainingMillis(this.__wbg_ptr);
        return ret;
    }
    /**
     * Get the supported verification methods of the other side.
     *
     * Will be present only if the other side requested the
     * verification or if we’re in the ready state.
     *
     * # Returns
     *
     * `undefined` if we do not yet know the supported methods; otherwise, an
     * array of `VerificationMethod`s.
     * @returns {any[] | undefined}
     */
    get theirSupportedMethods() {
        const ret = wasm.verificationrequest_theirSupportedMethods(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * Get our own supported verification methods that we advertised.
     *
     * Will be present only we requested the verification or if we’re
     * in the ready state.
     * @returns {any[] | undefined}
     */
    get ourSupportedMethods() {
        const ret = wasm.verificationrequest_ourSupportedMethods(this.__wbg_ptr);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        let v1;
        if (ret[0] !== 0) {
            v1 = getArrayJsValueFromWasm0(ret[0], ret[1]).slice();
            wasm.__wbindgen_free(ret[0], ret[1] * 4, 4);
        }
        return v1;
    }
    /**
     * Get the unique ID of this verification request.
     * @returns {string}
     */
    get flowId() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.verificationrequest_flowId(this.__wbg_ptr);
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * Is this a verification that is verifying one of our own
     * devices?
     * @returns {boolean}
     */
    isSelfVerification() {
        const ret = wasm.verificationrequest_isSelfVerification(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Did we initiate the verification request?
     * @returns {boolean}
     */
    weStarted() {
        const ret = wasm.verificationrequest_weStarted(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Has the verification flow that was started with this request
     * finished?
     * @returns {boolean}
     */
    isDone() {
        const ret = wasm.verificationrequest_isDone(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Get the current phase of this request.
     *
     * Returns a `VerificationRequestPhase`.
     * @returns {VerificationRequestPhase}
     */
    phase() {
        const ret = wasm.verificationrequest_phase(this.__wbg_ptr);
        return ret;
    }
    /**
     * If this request has transitioned into a concrete verification
     * flow (and not yet been completed or cancelled), returns a `Verification`
     * object.
     *
     * Returns: a `Sas`, a `Qr`, or `undefined`.
     * @returns {any}
     */
    getVerification() {
        const ret = wasm.verificationrequest_getVerification(this.__wbg_ptr);
        return ret;
    }
    /**
     * Register a callback which will be called whenever there is an update to
     * the request.
     *
     * The `callback` is called with no parameters.
     * @param {Function} callback
     */
    registerChangesCallback(callback) {
        wasm.verificationrequest_registerChangesCallback(this.__wbg_ptr, callback);
    }
    /**
     * Has the verification flow that was started with this request
     * been cancelled?
     * @returns {boolean}
     */
    isCancelled() {
        const ret = wasm.verificationrequest_isCancelled(this.__wbg_ptr);
        return ret !== 0;
    }
    /**
     * Accept the verification request signaling that our client
     * supports the given verification methods.
     *
     * `methods` represents the methods that we should advertise as
     * supported by us.
     *
     * It returns either a `ToDeviceRequest`, a `RoomMessageRequest`
     * or `undefined`.
     * @param {any[]} methods
     * @returns {any}
     */
    acceptWithMethods(methods) {
        const ptr0 = passArrayJsValueToWasm0(methods, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.verificationrequest_acceptWithMethods(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Accept the verification request.
     *
     * This method will accept the request and signal that it
     * supports the `m.sas.v1`, the `m.qr_code.show.v1`, and
     * `m.reciprocate.v1` method.
     *
     * `m.qr_code.show.v1` will only be signaled if the `qrcode`
     * feature is enabled. This feature is disabled by default. If
     * it's enabled and QR code scanning should be supported or QR
     * code showing shouldn't be supported the `accept_with_methods`
     * method should be used instead.
     *
     * It returns either a `ToDeviceRequest`, a `RoomMessageRequest`
     * or `undefined`.
     * @returns {any}
     */
    accept() {
        const ret = wasm.verificationrequest_accept(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Cancel the verification request.
     *
     * It returns either a `ToDeviceRequest`, a `RoomMessageRequest`
     * or `undefined`.
     * @returns {any}
     */
    cancel() {
        const ret = wasm.verificationrequest_cancel(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Transition from this verification request into a SAS verification flow.
     *
     * Returns `Promise<[Sas, RoomMessageRequest|ToDeviceRequest] | undefined>`
     * @returns {Promise<any>}
     */
    startSas() {
        const ret = wasm.verificationrequest_startSas(this.__wbg_ptr);
        return ret;
    }
    /**
     * Generate a QR code that can be used by another client to start
     * a QR code based verification.
     *
     * Returns a `Qr` or `undefined`.
     * @returns {Promise<any>}
     */
    generateQrCode() {
        const ret = wasm.verificationrequest_generateQrCode(this.__wbg_ptr);
        return ret;
    }
    /**
     * Start a QR code verification by providing a scanned QR code
     * for this verification flow.
     * @param {QrCodeScan} data
     * @returns {Promise<any>}
     */
    scanQrCode(data) {
        _assertClass(data, QrCodeScan);
        const ret = wasm.verificationrequest_scanQrCode(this.__wbg_ptr, data.__wbg_ptr);
        return ret;
    }
}

const VersionsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_versions_free(ptr >>> 0, 1));
/**
 * Object containing the versions of the Rust libraries we are using.
 */
export class Versions {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Versions.prototype);
        obj.__wbg_ptr = ptr;
        VersionsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        VersionsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_versions_free(ptr, 0);
    }
    /**
     * The version of the vodozemac crate.
     * @returns {string}
     */
    get vodozemac() {
        const ret = wasm.__wbg_get_versions_vodozemac(this.__wbg_ptr);
        return ret;
    }
    /**
     * The version of the matrix-sdk-crypto crate.
     * @returns {string}
     */
    get matrix_sdk_crypto() {
        const ret = wasm.__wbg_get_versions_matrix_sdk_crypto(this.__wbg_ptr);
        return ret;
    }
    /**
     * The Git commit hash of the crate's source tree at build time.
     * @returns {string}
     */
    get git_sha() {
        const ret = wasm.__wbg_get_versions_git_sha(this.__wbg_ptr);
        return ret;
    }
    /**
     * The build-time output of the `git describe` command of the source tree
     * of crate.
     * @returns {string}
     */
    get git_description() {
        const ret = wasm.__wbg_get_versions_git_description(this.__wbg_ptr);
        return ret;
    }
}

export function __wbg_Error_0497d5bdba9362e5(arg0, arg1) {
    const ret = Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_String_8f0eb39a4a4c2f66(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_Window_b0044ac7db258535(arg0) {
    const ret = arg0.Window;
    return ret;
};

export function __wbg_WorkerGlobalScope_b74cefefc62a37da(arg0) {
    const ret = arg0.WorkerGlobalScope;
    return ret;
};

export function __wbg_add_64c6e51ab0ed12dd() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.add(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_add_dd833f9f523abe36(arg0, arg1) {
    const ret = arg0.add(arg1);
    return ret;
};

export function __wbg_at_5b2884630cb66ea6(arg0, arg1) {
    const ret = arg0.at(arg1);
    return ret;
};

export function __wbg_backupkeys_new(arg0) {
    const ret = BackupKeys.__wrap(arg0);
    return ret;
};

export function __wbg_bound_0274374bea7f6bca() { return handleError(function (arg0, arg1) {
    const ret = IDBKeyRange.bound(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_bound_eb572b424befade3() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = IDBKeyRange.bound(arg0, arg1, arg2 !== 0, arg3 !== 0);
    return ret;
}, arguments) };

export function __wbg_buffer_a1a27a0dfa70165d(arg0) {
    const ret = arg0.buffer;
    return ret;
};

export function __wbg_call_1b920c3ac0afee4b() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.call(arg1, arg2, arg3);
    return ret;
}, arguments) };

export function __wbg_call_36f1bbf64b4cf7c7() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    const ret = arg0.call(arg1, arg2, arg3, arg4);
    return ret;
}, arguments) };

export function __wbg_call_f2db6205e5c51dc8() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_call_fbe8be8bf6436ce5() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

export function __wbg_clearTimeout_5a54f8841c30079a(arg0) {
    const ret = clearTimeout(arg0);
    return ret;
};

export function __wbg_clear_e6ec1cc113e1555e() { return handleError(function (arg0) {
    const ret = arg0.clear();
    return ret;
}, arguments) };

export function __wbg_close_2079e209ea5709b5(arg0) {
    arg0.close();
};

export function __wbg_code_5e459ca721f994f5(arg0) {
    const ret = arg0.code;
    return ret;
};

export function __wbg_continue_7d9cdafc888cb902() { return handleError(function (arg0) {
    arg0.continue();
}, arguments) };

export function __wbg_count_2941fdbb8154c02d() { return handleError(function (arg0) {
    const ret = arg0.count();
    return ret;
}, arguments) };

export function __wbg_count_5ceb291ba9a02b4b() { return handleError(function (arg0) {
    const ret = arg0.count();
    return ret;
}, arguments) };

export function __wbg_createIndex_32ba53785b2ef24e() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3);
    return ret;
}, arguments) };

export function __wbg_createIndex_a343510ba567e58c() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
    const ret = arg0.createIndex(getStringFromWasm0(arg1, arg2), arg3, arg4);
    return ret;
}, arguments) };

export function __wbg_createObjectStore_b1f08961900155dd() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.createObjectStore(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_crosssigningbootstraprequests_new(arg0) {
    const ret = CrossSigningBootstrapRequests.__wrap(arg0);
    return ret;
};

export function __wbg_crosssigningkeyexport_new(arg0) {
    const ret = CrossSigningKeyExport.__wrap(arg0);
    return ret;
};

export function __wbg_crosssigningstatus_new(arg0) {
    const ret = CrossSigningStatus.__wrap(arg0);
    return ret;
};

export function __wbg_crypto_574e78ad8b13b65f(arg0) {
    const ret = arg0.crypto;
    return ret;
};

export function __wbg_debug_58d16ea352cfbca1(arg0) {
    console.debug(arg0);
};

export function __wbg_debug_ada37632f0e8cdde(arg0, arg1) {
    arg0.debug(arg1);
};

export function __wbg_decryptedroomevent_new(arg0) {
    const ret = DecryptedRoomEvent.__wrap(arg0);
    return ret;
};

export function __wbg_decryptedtodeviceevent_new(arg0) {
    const ret = DecryptedToDeviceEvent.__wrap(arg0);
    return ret;
};

export function __wbg_dehydrateddevice_new(arg0) {
    const ret = DehydratedDevice.__wrap(arg0);
    return ret;
};

export function __wbg_dehydrateddevicekey_new(arg0) {
    const ret = DehydratedDeviceKey.__wrap(arg0);
    return ret;
};

export function __wbg_deleteObjectStore_7b427b19378475fd() { return handleError(function (arg0, arg1, arg2) {
    arg0.deleteObjectStore(getStringFromWasm0(arg1, arg2));
}, arguments) };

export function __wbg_delete_1af2aac87b36c0f1() { return handleError(function (arg0) {
    const ret = arg0.delete();
    return ret;
}, arguments) };

export function __wbg_delete_71b7921c73aa9378() { return handleError(function (arg0, arg1) {
    const ret = arg0.delete(arg1);
    return ret;
}, arguments) };

export function __wbg_device_new(arg0) {
    const ret = Device.__wrap(arg0);
    return ret;
};

export function __wbg_deviceid_new(arg0) {
    const ret = DeviceId.__wrap(arg0);
    return ret;
};

export function __wbg_devicekey_new(arg0) {
    const ret = DeviceKey.__wrap(arg0);
    return ret;
};

export function __wbg_devicekeyid_new(arg0) {
    const ret = DeviceKeyId.__wrap(arg0);
    return ret;
};

export function __wbg_done_4d01f352bade43b7(arg0) {
    const ret = arg0.done;
    return ret;
};

export function __wbg_emoji_new(arg0) {
    const ret = Emoji.__wrap(arg0);
    return ret;
};

export function __wbg_encryptedattachment_new(arg0) {
    const ret = EncryptedAttachment.__wrap(arg0);
    return ret;
};

export function __wbg_encryptioninfo_new(arg0) {
    const ret = EncryptionInfo.__wrap(arg0);
    return ret;
};

export function __wbg_entries_41651c850143b957(arg0) {
    const ret = Object.entries(arg0);
    return ret;
};

export function __wbg_entries_c951fa14164704e7(arg0) {
    const ret = arg0.entries();
    return ret;
};

export function __wbg_error_24afdcd463ac8bd9(arg0, arg1) {
    arg0.error(arg1);
};

export function __wbg_error_4e978abc9692c0c5() { return handleError(function (arg0) {
    const ret = arg0.error;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_error_51ecdd39ec054205(arg0) {
    console.error(arg0);
};

export function __wbg_error_7534b8e9a36f1ab4(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

export function __wbg_from_12ff8e47307bd4c7(arg0) {
    const ret = Array.from(arg0);
    return ret;
};

export function __wbg_getAllKeys_fce3f6ef8201c450() { return handleError(function (arg0) {
    const ret = arg0.getAllKeys();
    return ret;
}, arguments) };

export function __wbg_getAll_22a744d3b40f0fb5() { return handleError(function (arg0) {
    const ret = arg0.getAll();
    return ret;
}, arguments) };

export function __wbg_getAll_654e689108532352() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.getAll(arg1, arg2 >>> 0);
    return ret;
}, arguments) };

export function __wbg_getAll_864be044b219e256() { return handleError(function (arg0, arg1) {
    const ret = arg0.getAll(arg1);
    return ret;
}, arguments) };

export function __wbg_getRandomValues_38a1ff1ea09f6cc7() { return handleError(function (arg0, arg1) {
    globalThis.crypto.getRandomValues(getArrayU8FromWasm0(arg0, arg1));
}, arguments) };

export function __wbg_getRandomValues_b8f5dbd5f3995a9e() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments) };

export function __wbg_getTime_2afe67905d873e92(arg0) {
    const ret = arg0.getTime();
    return ret;
};

export function __wbg_get_92470be87867c2e5() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_get_a131a44bd1eb6979(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

export function __wbg_get_a4719581b0d717ad() { return handleError(function (arg0, arg1) {
    const ret = arg0.get(arg1);
    return ret;
}, arguments) };

export function __wbg_get_d37904b955701f99() { return handleError(function (arg0, arg1) {
    const ret = arg0.get(arg1);
    return ret;
}, arguments) };

export function __wbg_getwithrefkey_1dc361bd10053bfe(arg0, arg1) {
    const ret = arg0[arg1];
    return ret;
};

export function __wbg_global_b6f5c73312f62313(arg0) {
    const ret = arg0.global;
    return ret;
};

export function __wbg_inboundgroupsession_new(arg0) {
    const ret = InboundGroupSession.__wrap(arg0);
    return ret;
};

export function __wbg_index_405783ca8da5f008() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.index(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_indexedDB_317016dcb8a872d6() { return handleError(function (arg0) {
    const ret = arg0.indexedDB;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_indexedDB_601ec26c63e333de() { return handleError(function (arg0) {
    const ret = arg0.indexedDB;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_indexedDB_63b82e158eb67cbd() { return handleError(function (arg0) {
    const ret = arg0.indexedDB;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
}, arguments) };

export function __wbg_info_e56933705c348038(arg0) {
    console.info(arg0);
};

export function __wbg_info_f3589034369581f6(arg0, arg1) {
    arg0.info(arg1);
};

export function __wbg_instanceof_ArrayBuffer_a8b6f580b363f2bc(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Map_80cc65041c96417a(arg0) {
    let result;
    try {
        result = arg0 instanceof Map;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Promise_66f94afc64d9039f(arg0) {
    let result;
    try {
        result = arg0 instanceof Promise;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_instanceof_Uint8Array_ca460677bc155827(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

export function __wbg_invalidtodeviceevent_new(arg0) {
    const ret = InvalidToDeviceEvent.__wrap(arg0);
    return ret;
};

export function __wbg_isArray_2a07fd175d45c496(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

export function __wbg_isArray_5f090bed72bd4f89(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

export function __wbg_isSafeInteger_90d7c4674047d684(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
};

export function __wbg_item_15285ca2d766f142(arg0, arg1, arg2) {
    const ret = arg1.item(arg2 >>> 0);
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_iterator_4068add5b2aef7a6() {
    const ret = Symbol.iterator;
    return ret;
};

export function __wbg_key_a17a68df9ec1b180() { return handleError(function (arg0) {
    const ret = arg0.key;
    return ret;
}, arguments) };

export function __wbg_keysbackuprequest_new(arg0) {
    const ret = KeysBackupRequest.__wrap(arg0);
    return ret;
};

export function __wbg_keysclaimrequest_new(arg0) {
    const ret = KeysClaimRequest.__wrap(arg0);
    return ret;
};

export function __wbg_keysqueryrequest_new(arg0) {
    const ret = KeysQueryRequest.__wrap(arg0);
    return ret;
};

export function __wbg_keysuploadrequest_new(arg0) {
    const ret = KeysUploadRequest.__wrap(arg0);
    return ret;
};

export function __wbg_length_471141fa24df24b2(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_ab6d22b5ead75c72(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_length_f00ec12454a5d9fd(arg0) {
    const ret = arg0.length;
    return ret;
};

export function __wbg_lowerBound_13c8e875a3fb9f7d() { return handleError(function (arg0, arg1) {
    const ret = IDBKeyRange.lowerBound(arg0, arg1 !== 0);
    return ret;
}, arguments) };

export function __wbg_maybesignature_new(arg0) {
    const ret = MaybeSignature.__wrap(arg0);
    return ret;
};

export function __wbg_megolmdecryptionerror_new(arg0) {
    const ret = MegolmDecryptionError.__wrap(arg0);
    return ret;
};

export function __wbg_message_2d95ea5aff0d63b9(arg0, arg1) {
    const ret = arg1.message;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_msCrypto_a61aeb35a24c1329(arg0) {
    const ret = arg0.msCrypto;
    return ret;
};

export function __wbg_name_2acff1e83d9735f9(arg0, arg1) {
    const ret = arg1.name;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_new_07b483f72211fd66() {
    const ret = new Object();
    return ret;
};

export function __wbg_new_58353953ad2097cc() {
    const ret = new Array();
    return ret;
};

export function __wbg_new_8a6f238a6ece86ea() {
    const ret = new Error();
    return ret;
};

export function __wbg_new_a2957aa5684de228(arg0) {
    const ret = new Date(arg0);
    return ret;
};

export function __wbg_new_a979b4b45bd55c7f() {
    const ret = new Map();
    return ret;
};

export function __wbg_new_b3a08d2910ee5170(arg0) {
    const ret = new Uint8ClampedArray(arg0);
    return ret;
};

export function __wbg_new_db7d9b0ee94df522(arg0) {
    const ret = new Set(arg0);
    return ret;
};

export function __wbg_new_e30c39c06edaabf2(arg0, arg1) {
    try {
        var state0 = {a: arg0, b: arg1};
        var cb0 = (arg0, arg1) => {
            const a = state0.a;
            state0.a = 0;
            try {
                return __wbg_adapter_836(a, state0.b, arg0, arg1);
            } finally {
                state0.a = a;
            }
        };
        const ret = new Promise(cb0);
        return ret;
    } finally {
        state0.a = state0.b = 0;
    }
};

export function __wbg_new_e52b3efaaa774f96(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

export function __wbg_newnoargs_ff528e72d35de39a(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_06e8c938173769b5(arg0, arg1, arg2) {
    const ret = new Uint8ClampedArray(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithbyteoffsetandlength_3b01ecda099177e8(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_newwithlength_08f872dc1e3ada2e(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
};

export function __wbg_newwithlength_8a0d31010560ce9a(arg0) {
    const ret = new Uint8ClampedArray(arg0 >>> 0);
    return ret;
};

export function __wbg_newwithmessage_54042111509ba20c() { return handleError(function (arg0, arg1) {
    const ret = new DOMException(getStringFromWasm0(arg0, arg1));
    return ret;
}, arguments) };

export function __wbg_next_8bb824d217961b5d(arg0) {
    const ret = arg0.next;
    return ret;
};

export function __wbg_next_e2da48d8fff7439a() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };

export function __wbg_node_905d3e251edff8a2(arg0) {
    const ret = arg0.node;
    return ret;
};

export function __wbg_now_2c95c9de01293173(arg0) {
    const ret = arg0.now();
    return ret;
};

export function __wbg_now_eb0821f3bd9f6529() {
    const ret = Date.now();
    return ret;
};

export function __wbg_objectStoreNames_e82275eb2d403a92(arg0) {
    const ret = arg0.objectStoreNames;
    return ret;
};

export function __wbg_objectStore_b463d32c86d6b543() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.objectStore(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_oldVersion_af5af638a028177c(arg0) {
    const ret = arg0.oldVersion;
    return ret;
};

export function __wbg_olmmachine_new(arg0) {
    const ret = OlmMachine.__wrap(arg0);
    return ret;
};

export function __wbg_openCursor_7c13a2cd32c6258b() { return handleError(function (arg0) {
    const ret = arg0.openCursor();
    return ret;
}, arguments) };

export function __wbg_openCursor_a53133c898e0829c() { return handleError(function (arg0, arg1) {
    const ret = arg0.openCursor(arg1);
    return ret;
}, arguments) };

export function __wbg_openCursor_dbd279400634ae67() { return handleError(function (arg0) {
    const ret = arg0.openCursor();
    return ret;
}, arguments) };

export function __wbg_open_0f04f50fa4d98f67() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.open(getStringFromWasm0(arg1, arg2), arg3 >>> 0);
    return ret;
}, arguments) };

export function __wbg_open_b70fb421d97aad40() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.open(getStringFromWasm0(arg1, arg2));
    return ret;
}, arguments) };

export function __wbg_otheruseridentity_new(arg0) {
    const ret = OtherUserIdentity.__wrap(arg0);
    return ret;
};

export function __wbg_ownuseridentity_new(arg0) {
    const ret = OwnUserIdentity.__wrap(arg0);
    return ret;
};

export function __wbg_parse_c7ba327fb6231e7f() { return handleError(function (arg0, arg1) {
    const ret = JSON.parse(getStringFromWasm0(arg0, arg1));
    return ret;
}, arguments) };

export function __wbg_performance_7a3ffd0b17f663ad(arg0) {
    const ret = arg0.performance;
    return ret;
};

export function __wbg_pickledinboundgroupsession_unwrap(arg0) {
    const ret = PickledInboundGroupSession.__unwrap(arg0);
    return ret;
};

export function __wbg_pickledsession_unwrap(arg0) {
    const ret = PickledSession.__unwrap(arg0);
    return ret;
};

export function __wbg_plaintexttodeviceevent_new(arg0) {
    const ret = PlainTextToDeviceEvent.__wrap(arg0);
    return ret;
};

export function __wbg_process_dc0fbacc7c1c06f7(arg0) {
    const ret = arg0.process;
    return ret;
};

export function __wbg_push_73fd7b5550ebf707(arg0, arg1) {
    const ret = arg0.push(arg1);
    return ret;
};

export function __wbg_put_7f0b4dcc666f09e3() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.put(arg1, arg2);
    return ret;
}, arguments) };

export function __wbg_putdehydrateddevicerequest_new(arg0) {
    const ret = PutDehydratedDeviceRequest.__wrap(arg0);
    return ret;
};

export function __wbg_qr_new(arg0) {
    const ret = Qr.__wrap(arg0);
    return ret;
};

export function __wbg_queueMicrotask_46c1df247678729f(arg0) {
    queueMicrotask(arg0);
};

export function __wbg_queueMicrotask_8acf3ccb75ed8d11(arg0) {
    const ret = arg0.queueMicrotask;
    return ret;
};

export function __wbg_randomFillSync_ac0988aba3254290() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments) };

export function __wbg_readyState_249e5707a38b7a7a(arg0) {
    const ret = arg0.readyState;
    return (__wbindgen_enum_IdbRequestReadyState.indexOf(ret) + 1 || 3) - 1;
};

export function __wbg_rehydrateddevice_new(arg0) {
    const ret = RehydratedDevice.__wrap(arg0);
    return ret;
};

export function __wbg_require_60cc747a6bc5215a() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments) };

export function __wbg_resolve_0dac8c580ffd4678(arg0) {
    const ret = Promise.resolve(arg0);
    return ret;
};

export function __wbg_result_a0f1bf2fe64a516c() { return handleError(function (arg0) {
    const ret = arg0.result;
    return ret;
}, arguments) };

export function __wbg_roomid_unwrap(arg0) {
    const ret = RoomId.__unwrap(arg0);
    return ret;
};

export function __wbg_roomkeycounts_new(arg0) {
    const ret = RoomKeyCounts.__wrap(arg0);
    return ret;
};

export function __wbg_roomkeyimportresult_new(arg0) {
    const ret = RoomKeyImportResult.__wrap(arg0);
    return ret;
};

export function __wbg_roomkeyinfo_new(arg0) {
    const ret = RoomKeyInfo.__wrap(arg0);
    return ret;
};

export function __wbg_roomkeywithheldinfo_new(arg0) {
    const ret = RoomKeyWithheldInfo.__wrap(arg0);
    return ret;
};

export function __wbg_roommessagerequest_new(arg0) {
    const ret = RoomMessageRequest.__wrap(arg0);
    return ret;
};

export function __wbg_roomsettings_new(arg0) {
    const ret = RoomSettings.__wrap(arg0);
    return ret;
};

export function __wbg_sas_new(arg0) {
    const ret = Sas.__wrap(arg0);
    return ret;
};

export function __wbg_secretsbundle_new(arg0) {
    const ret = SecretsBundle.__wrap(arg0);
    return ret;
};

export function __wbg_setTimeout_db2dbaeefb6f39c7() { return handleError(function (arg0, arg1) {
    const ret = setTimeout(arg0, arg1);
    return ret;
}, arguments) };

export function __wbg_set_3f1d0b984ed272ed(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
};

export function __wbg_set_7422acbe992d64ab(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
};

export function __wbg_set_d6bdfd275fb8a4ce(arg0, arg1, arg2) {
    const ret = arg0.set(arg1, arg2);
    return ret;
};

export function __wbg_set_fd40eacc85c5ab66(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

export function __wbg_set_fe4e79d1ed3b0e9b(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

export function __wbg_setonabort_479ebb5884fcb171(arg0, arg1) {
    arg0.onabort = arg1;
};

export function __wbg_setonblocked_046331b614d6f8e3(arg0, arg1) {
    arg0.onblocked = arg1;
};

export function __wbg_setoncomplete_27bdbca012e45c05(arg0, arg1) {
    arg0.oncomplete = arg1;
};

export function __wbg_setonerror_537b68f474e27d4e(arg0, arg1) {
    arg0.onerror = arg1;
};

export function __wbg_setonerror_ce5c4d34aed931bb(arg0, arg1) {
    arg0.onerror = arg1;
};

export function __wbg_setonsuccess_0b2b45bd8cc13b95(arg0, arg1) {
    arg0.onsuccess = arg1;
};

export function __wbg_setonupgradeneeded_be2e0ae927917f82(arg0, arg1) {
    arg0.onupgradeneeded = arg1;
};

export function __wbg_setonversionchange_407ebf1ad930c84c(arg0, arg1) {
    arg0.onversionchange = arg1;
};

export function __wbg_setunique_727cefd7e14cf677(arg0, arg1) {
    arg0.unique = arg1 !== 0;
};

export function __wbg_signatures_new(arg0) {
    const ret = Signatures.__wrap(arg0);
    return ret;
};

export function __wbg_signatureuploadrequest_new(arg0) {
    const ret = SignatureUploadRequest.__wrap(arg0);
    return ret;
};

export function __wbg_signatureverification_new(arg0) {
    const ret = SignatureVerification.__wrap(arg0);
    return ret;
};

export function __wbg_stack_0ed75d68575b0f3c(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbg_static_accessor_GLOBAL_487c52c58d65314d() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_GLOBAL_THIS_ee9704f328b6b291() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_SELF_78c9e3071b912620() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_static_accessor_WINDOW_a093d21393777366() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_storedroomkeybundledata_new(arg0) {
    const ret = StoredRoomKeyBundleData.__wrap(arg0);
    return ret;
};

export function __wbg_storehandle_new(arg0) {
    const ret = StoreHandle.__wrap(arg0);
    return ret;
};

export function __wbg_stringify_c242842b97f054cc() { return handleError(function (arg0) {
    const ret = JSON.stringify(arg0);
    return ret;
}, arguments) };

export function __wbg_subarray_dd4ade7d53bd8e26(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
};

export function __wbg_target_15f1da583855ac4e(arg0) {
    const ret = arg0.target;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_then_82ab9fb4080f1707(arg0, arg1, arg2) {
    const ret = arg0.then(arg1, arg2);
    return ret;
};

export function __wbg_then_db882932c0c714c6(arg0, arg1) {
    const ret = arg0.then(arg1);
    return ret;
};

export function __wbg_todevicerequest_new(arg0) {
    const ret = ToDeviceRequest.__wrap(arg0);
    return ret;
};

export function __wbg_transaction_34c41b46ca391af6(arg0) {
    const ret = arg0.transaction;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

export function __wbg_transaction_36c8b28ed4349a9a() { return handleError(function (arg0, arg1, arg2, arg3) {
    const ret = arg0.transaction(getStringFromWasm0(arg1, arg2), __wbindgen_enum_IdbTransactionMode[arg3]);
    return ret;
}, arguments) };

export function __wbg_transaction_399fc15f5bba1880() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.transaction(arg1, __wbindgen_enum_IdbTransactionMode[arg2]);
    return ret;
}, arguments) };

export function __wbg_update_297181dae0cc0af4() { return handleError(function (arg0, arg1) {
    const ret = arg0.update(arg1);
    return ret;
}, arguments) };

export function __wbg_userdevices_new(arg0) {
    const ret = UserDevices.__wrap(arg0);
    return ret;
};

export function __wbg_userid_new(arg0) {
    const ret = UserId.__wrap(arg0);
    return ret;
};

export function __wbg_userid_unwrap(arg0) {
    const ret = UserId.__unwrap(arg0);
    return ret;
};

export function __wbg_utdtodeviceevent_new(arg0) {
    const ret = UTDToDeviceEvent.__wrap(arg0);
    return ret;
};

export function __wbg_value_17b896954e14f896(arg0) {
    const ret = arg0.value;
    return ret;
};

export function __wbg_value_648dc44894c8dc95() { return handleError(function (arg0) {
    const ret = arg0.value;
    return ret;
}, arguments) };

export function __wbg_values_81045499c3c8e670(arg0) {
    const ret = arg0.values();
    return ret;
};

export function __wbg_verificationrequest_new(arg0) {
    const ret = VerificationRequest.__wrap(arg0);
    return ret;
};

export function __wbg_version_2c3ed4a311fdabdf(arg0) {
    const ret = arg0.version;
    return ret;
};

export function __wbg_versions_c01dfd4722a88165(arg0) {
    const ret = arg0.versions;
    return ret;
};

export function __wbg_warn_9b968a0475b49f6b(arg0, arg1) {
    arg0.warn(arg1);
};

export function __wbg_warn_d89f6637da554c8d(arg0) {
    console.warn(arg0);
};

export function __wbindgen_array_new() {
    const ret = [];
    return ret;
};

export function __wbindgen_array_push(arg0, arg1) {
    arg0.push(arg1);
};

export function __wbindgen_as_number(arg0) {
    const ret = +arg0;
    return ret;
};

export function __wbindgen_bigint_from_i64(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_bigint_from_u64(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return ret;
};

export function __wbindgen_bigint_get_as_i64(arg0, arg1) {
    const v = arg1;
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_boolean_get(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

export function __wbindgen_cb_drop(arg0) {
    const obj = arg0.original;
    if (obj.cnt-- == 1) {
        obj.a = 0;
        return true;
    }
    const ret = false;
    return ret;
};

export function __wbindgen_closure_wrapper1160(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 40, __wbg_adapter_58);
    return ret;
};

export function __wbindgen_closure_wrapper2391(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 432, __wbg_adapter_61);
    return ret;
};

export function __wbindgen_closure_wrapper5618(arg0, arg1, arg2) {
    const ret = makeMutClosure(arg0, arg1, 432, __wbg_adapter_64);
    return ret;
};

export function __wbindgen_closure_wrapper7116(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 437, __wbg_adapter_67);
    return ret;
};

export function __wbindgen_closure_wrapper7121(arg0, arg1, arg2) {
    const ret = makeClosure(arg0, arg1, 437, __wbg_adapter_70);
    return ret;
};

export function __wbindgen_debug_string(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_in(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

export function __wbindgen_init_externref_table() {
    const table = wasm.__wbindgen_export_4;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

export function __wbindgen_is_bigint(arg0) {
    const ret = typeof(arg0) === 'bigint';
    return ret;
};

export function __wbindgen_is_function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

export function __wbindgen_is_null(arg0) {
    const ret = arg0 === null;
    return ret;
};

export function __wbindgen_is_object(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

export function __wbindgen_is_string(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};

export function __wbindgen_is_undefined(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

export function __wbindgen_jsval_eq(arg0, arg1) {
    const ret = arg0 === arg1;
    return ret;
};

export function __wbindgen_jsval_loose_eq(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

export function __wbindgen_memory() {
    const ret = wasm.memory;
    return ret;
};

export function __wbindgen_number_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

export function __wbindgen_number_new(arg0) {
    const ret = arg0;
    return ret;
};

export function __wbindgen_string_get(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

export function __wbindgen_string_new(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

export function __wbindgen_throw(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

export function __wbindgen_try_into_number(arg0) {
    let result;
    try { result = +arg0 } catch (e) { result = e }
    const ret = result;
    return ret;
};


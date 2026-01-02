import { type OidcClientConfig } from "./index.ts";
import { type NonEmptyArray } from "../@types/common.ts";
/**
 * Client metadata passed to registration endpoint
 */
export type OidcRegistrationClientMetadata = {
    clientName: OidcRegistrationRequestBody["client_name"];
    clientUri: OidcRegistrationRequestBody["client_uri"];
    logoUri?: OidcRegistrationRequestBody["logo_uri"];
    applicationType: OidcRegistrationRequestBody["application_type"];
    redirectUris: OidcRegistrationRequestBody["redirect_uris"];
    contacts: OidcRegistrationRequestBody["contacts"];
    tosUri: OidcRegistrationRequestBody["tos_uri"];
    policyUri: OidcRegistrationRequestBody["policy_uri"];
};
/**
 * Request body for dynamic registration as defined by https://github.com/matrix-org/matrix-spec-proposals/pull/2966
 */
interface OidcRegistrationRequestBody {
    client_name?: string;
    client_uri: string;
    logo_uri?: string;
    contacts?: string[];
    tos_uri?: string;
    policy_uri?: string;
    redirect_uris?: NonEmptyArray<string>;
    response_types?: NonEmptyArray<string>;
    grant_types?: NonEmptyArray<string>;
    id_token_signed_response_alg?: string;
    token_endpoint_auth_method: string;
    application_type: "web" | "native";
}
export declare const DEVICE_CODE_SCOPE = "urn:ietf:params:oauth:grant-type:device_code";
/**
 * Attempts dynamic registration against the configured registration endpoint.
 * Will ignore any URIs that do not use client_uri as a common base as per the spec.
 * @param delegatedAuthConfig - Auth config from {@link discoverAndValidateOIDCIssuerWellKnown}
 * @param clientMetadata - The metadata for the client which to register
 * @returns Promise<string> resolved with registered clientId
 * @throws when registration is not supported, on failed request or invalid response
 */
export declare const registerOidcClient: (delegatedAuthConfig: OidcClientConfig, clientMetadata: OidcRegistrationClientMetadata) => Promise<string>;
export {};
//# sourceMappingURL=register.d.ts.map
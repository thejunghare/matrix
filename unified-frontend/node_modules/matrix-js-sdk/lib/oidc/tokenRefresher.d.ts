import { type IdTokenClaims } from "oidc-client-ts";
import { type AccessTokens } from "../http-api/index.ts";
/**
 * @experimental
 * Class responsible for refreshing OIDC access tokens
 *
 * Client implementations will likely want to override {@link persistTokens} to persist tokens after successful refresh
 *
 */
export declare class OidcTokenRefresher {
    /**
     * idTokenClaims as returned from authorization grant
     * used to validate tokens
     */
    private readonly idTokenClaims;
    /**
     * Promise which will complete once the OidcClient has been initialised
     * and is ready to start refreshing tokens.
     *
     * Will reject if the client initialisation fails.
     */
    readonly oidcClientReady: Promise<void>;
    private oidcClient;
    private inflightRefreshRequest?;
    constructor(
    /**
     * The OIDC issuer as returned by the /auth_issuer API
     */
    issuer: string, 
    /**
     * id of this client as registered with the OP
     */
    clientId: string, 
    /**
     * redirectUri as registered with OP
     */
    redirectUri: string, 
    /**
     * Device ID of current session
     */
    deviceId: string, 
    /**
     * idTokenClaims as returned from authorization grant
     * used to validate tokens
     */
    idTokenClaims: IdTokenClaims);
    private initialiseOidcClient;
    /**
     * Attempt token refresh using given refresh token
     * @param refreshToken - refresh token to use in request with token issuer
     * @returns tokens - Promise that resolves with new access and refresh tokens
     * @throws when token refresh fails
     */
    doRefreshAccessToken(refreshToken: string): Promise<AccessTokens>;
    /**
     * Persist the new tokens, called after tokens are successfully refreshed.
     *
     * This function is intended to be overriden by the consumer when persistence is necessary.
     *
     * @param tokens.accessToken - new access token
     * @param tokens.refreshToken - OPTIONAL new refresh token
     */
    persistTokens(tokens: {
        accessToken: string;
        refreshToken?: string;
    }): Promise<void>;
    private getNewTokens;
}
//# sourceMappingURL=tokenRefresher.d.ts.map
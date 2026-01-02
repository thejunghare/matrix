import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/*
Copyright 2023 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import { OidcClient, WebStorageStateStore, ErrorResponse } from "oidc-client-ts";
import { TokenRefreshLogoutError } from "../http-api/index.js";
import { generateScope } from "./authorize.js";
import { discoverAndValidateOIDCIssuerWellKnown } from "./discovery.js";
import { logger } from "../logger.js";

/**
 * @experimental
 * Class responsible for refreshing OIDC access tokens
 *
 * Client implementations will likely want to override {@link persistTokens} to persist tokens after successful refresh
 *
 */
export class OidcTokenRefresher {
  constructor(
  /**
   * The OIDC issuer as returned by the /auth_issuer API
   */
  issuer,
  /**
   * id of this client as registered with the OP
   */
  clientId,
  /**
   * redirectUri as registered with OP
   */
  redirectUri,
  /**
   * Device ID of current session
   */
  deviceId,
  /**
   * idTokenClaims as returned from authorization grant
   * used to validate tokens
   */
  idTokenClaims) {
    this.idTokenClaims = idTokenClaims;
    /**
     * Promise which will complete once the OidcClient has been initialised
     * and is ready to start refreshing tokens.
     *
     * Will reject if the client initialisation fails.
     */
    _defineProperty(this, "oidcClientReady", void 0);
    _defineProperty(this, "oidcClient", void 0);
    _defineProperty(this, "inflightRefreshRequest", void 0);
    this.oidcClientReady = this.initialiseOidcClient(issuer, clientId, deviceId, redirectUri);
  }
  initialiseOidcClient(issuer, clientId, deviceId, redirectUri) {
    var _this = this;
    return _asyncToGenerator(function* () {
      try {
        var _config$signingKeys;
        var config = yield discoverAndValidateOIDCIssuerWellKnown(issuer);
        var scope = generateScope(deviceId);
        _this.oidcClient = new OidcClient({
          metadata: config,
          signingKeys: (_config$signingKeys = config.signingKeys) !== null && _config$signingKeys !== void 0 ? _config$signingKeys : undefined,
          client_id: clientId,
          scope,
          redirect_uri: redirectUri,
          authority: config.issuer,
          stateStore: new WebStorageStateStore({
            prefix: "mx_oidc_",
            store: window.sessionStorage
          })
        });
      } catch (error) {
        logger.error("Failed to initialise OIDC client.", error);
        throw new Error("Failed to initialise OIDC client.");
      }
    })();
  }

  /**
   * Attempt token refresh using given refresh token
   * @param refreshToken - refresh token to use in request with token issuer
   * @returns tokens - Promise that resolves with new access and refresh tokens
   * @throws when token refresh fails
   */
  doRefreshAccessToken(refreshToken) {
    var _this2 = this;
    return _asyncToGenerator(function* () {
      if (!_this2.inflightRefreshRequest) {
        _this2.inflightRefreshRequest = _this2.getNewTokens(refreshToken);
      }
      try {
        var tokens = yield _this2.inflightRefreshRequest;
        return tokens;
      } catch (e) {
        // If we encounter an OIDC error then signal that it should cause a logout by upgrading it to a TokenRefreshLogoutError
        if (e instanceof ErrorResponse) {
          throw new TokenRefreshLogoutError(e);
        }
        throw e;
      } finally {
        _this2.inflightRefreshRequest = undefined;
      }
    })();
  }

  /**
   * Persist the new tokens, called after tokens are successfully refreshed.
   *
   * This function is intended to be overriden by the consumer when persistence is necessary.
   *
   * @param tokens.accessToken - new access token
   * @param tokens.refreshToken - OPTIONAL new refresh token
   */
  persistTokens(tokens) {
    return _asyncToGenerator(function* () {})();
  } // NOOP
  getNewTokens(refreshToken) {
    var _this3 = this;
    return _asyncToGenerator(function* () {
      if (!_this3.oidcClient) {
        throw new Error("Cannot get new token before OIDC client is initialised.");
      }
      var refreshTokenState = {
        refresh_token: refreshToken,
        session_state: "test",
        data: undefined,
        profile: _this3.idTokenClaims
      };
      var requestStart = Date.now();
      var response = yield _this3.oidcClient.useRefreshToken({
        state: refreshTokenState,
        timeoutInSeconds: 300
      });
      var tokens = {
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        // We use the request start time to calculate the expiry time as we don't know when the server received our request
        expiry: response.expires_in ? new Date(requestStart + response.expires_in * 1000) : undefined
      };
      yield _this3.persistTokens(tokens);
      return tokens;
    })();
  }
}
//# sourceMappingURL=tokenRefresher.js.map
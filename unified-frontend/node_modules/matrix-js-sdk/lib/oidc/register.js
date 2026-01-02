import _asyncToGenerator from "@babel/runtime/helpers/asyncToGenerator";
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

import { OidcError } from "./error.js";
import { Method } from "../http-api/index.js";
import { logger } from "../logger.js";

/**
 * Client metadata passed to registration endpoint
 */

/**
 * Request body for dynamic registration as defined by https://github.com/matrix-org/matrix-spec-proposals/pull/2966
 */

export var DEVICE_CODE_SCOPE = "urn:ietf:params:oauth:grant-type:device_code";

// Check that URIs have a common base, as per the MSC2966 definition
var urlHasCommonBase = (base, urlStr) => {
  if (!urlStr) return false;
  var url = new URL(urlStr);
  if (url.protocol !== base.protocol) return false;
  if (url.hostname !== base.hostname && !url.hostname.endsWith(".".concat(base.hostname))) return false;
  return true;
};

/**
 * Attempts dynamic registration against the configured registration endpoint.
 * Will ignore any URIs that do not use client_uri as a common base as per the spec.
 * @param delegatedAuthConfig - Auth config from {@link discoverAndValidateOIDCIssuerWellKnown}
 * @param clientMetadata - The metadata for the client which to register
 * @returns Promise<string> resolved with registered clientId
 * @throws when registration is not supported, on failed request or invalid response
 */
export var registerOidcClient = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (delegatedAuthConfig, clientMetadata) {
    if (!delegatedAuthConfig.registration_endpoint) {
      throw new Error(OidcError.DynamicRegistrationNotSupported);
    }
    var grantTypes = ["authorization_code", "refresh_token"];
    if (grantTypes.some(scope => !delegatedAuthConfig.grant_types_supported.includes(scope))) {
      throw new Error(OidcError.DynamicRegistrationNotSupported);
    }
    var commonBase = new URL(clientMetadata.clientUri);

    // https://openid.net/specs/openid-connect-registration-1_0.html
    var metadata = {
      client_name: clientMetadata.clientName,
      client_uri: clientMetadata.clientUri,
      response_types: ["code"],
      grant_types: grantTypes,
      redirect_uris: clientMetadata.redirectUris,
      id_token_signed_response_alg: "RS256",
      token_endpoint_auth_method: "none",
      application_type: clientMetadata.applicationType,
      contacts: clientMetadata.contacts,
      logo_uri: urlHasCommonBase(commonBase, clientMetadata.logoUri) ? clientMetadata.logoUri : undefined,
      policy_uri: urlHasCommonBase(commonBase, clientMetadata.policyUri) ? clientMetadata.policyUri : undefined,
      tos_uri: urlHasCommonBase(commonBase, clientMetadata.tosUri) ? clientMetadata.tosUri : undefined
    };
    var headers = {
      "Accept": "application/json",
      "Content-Type": "application/json"
    };
    try {
      var response = yield fetch(delegatedAuthConfig.registration_endpoint, {
        method: Method.Post,
        headers,
        body: JSON.stringify(metadata)
      });
      if (response.status >= 400) {
        throw new Error(OidcError.DynamicRegistrationFailed);
      }
      var body = yield response.json();
      var clientId = body["client_id"];
      if (!clientId || typeof clientId !== "string") {
        throw new Error(OidcError.DynamicRegistrationInvalid);
      }
      return clientId;
    } catch (error) {
      if (Object.values(OidcError).includes(error.message)) {
        throw error;
      } else {
        logger.error("Dynamic registration request failed", error);
        throw new Error(OidcError.DynamicRegistrationFailed);
      }
    }
  });
  return function registerOidcClient(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
//# sourceMappingURL=register.js.map
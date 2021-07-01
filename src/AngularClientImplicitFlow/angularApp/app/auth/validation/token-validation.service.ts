﻿import { Injectable } from '@angular/core';
import { KEYUTIL, KJUR } from 'jsrsasign-reduced';
import { LoggerService } from '../logging/logger.service';
import { TokenHelperService } from '../utils/tokenHelper/token-helper.service';
import { JsrsAsignReducedService } from './jsrsasign-reduced.service';

// http://openid.net/specs/openid-connect-implicit-1_0.html

// id_token
// id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
// MUST exactly match the value of the iss (issuer) Claim.
//
// id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
// by the iss (issuer) Claim as an audience.The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience,
// or if it contains additional audiences not trusted by the Client.
//
// id_token C3: If the ID Token contains multiple audiences, the Client SHOULD verify that an azp Claim is present.
//
// id_token C4: If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
//
// id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the
// alg Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
//
// id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the OpenID Connect
// Core 1.0
// [OpenID.Core] specification.
//
// id_token C7: The current time MUST be before the time represented by the exp Claim (possibly allowing for some small leeway to account
// for clock skew).
//
// id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
// limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
//
// id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one that was sent
// in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.The precise method for detecting replay attacks
// is Client specific.
//
// id_token C10: If the acr Claim was requested, the Client SHOULD check that the asserted Claim Value is appropriate.
// The meaning and processing of acr Claim Values is out of scope for this document.
//
// id_token C11: When a max_age request is made, the Client SHOULD check the auth_time Claim value and request re- authentication
// if it determines too much time has elapsed since the last End- User authentication.

// Access Token Validation
// access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
// for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
// access_token C2: Take the left- most half of the hash and base64url- encode it.
// access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash is present
// in the ID Token.

@Injectable()
export class TokenValidationService {
  static refreshTokenNoncePlaceholder = '--RefreshToken--';
  keyAlgorithms: string[] = ['HS256', 'HS384', 'HS512', 'RS256', 'RS384', 'RS512', 'ES256', 'ES384', 'PS256', 'PS384', 'PS512'];

  constructor(
    private tokenHelperService: TokenHelperService,
    private loggerService: LoggerService,
    private jsrsAsignReducedService: JsrsAsignReducedService
  ) {}

  // id_token C7: The current time MUST be before the time represented by the exp Claim
  // (possibly allowing for some small leeway to account for clock skew).
  hasIdTokenExpired(token: string, configId: string, offsetSeconds?: number): boolean {
    const decoded = this.tokenHelperService.getPayloadFromToken(token, false, configId);

    return !this.validateIdTokenExpNotExpired(decoded, configId, offsetSeconds);
  }

  // id_token C7: The current time MUST be before the time represented by the exp Claim
  // (possibly allowing for some small leeway to account for clock skew).
  validateIdTokenExpNotExpired(decodedIdToken: string, configId: string, offsetSeconds?: number): boolean {
    const tokenExpirationDate = this.tokenHelperService.getTokenExpirationDate(decodedIdToken);
    offsetSeconds = offsetSeconds || 0;

    if (!tokenExpirationDate) {
      return false;
    }

    const tokenExpirationValue = tokenExpirationDate.valueOf();
    const nowWithOffset = new Date(new Date().toUTCString()).valueOf() + offsetSeconds * 1000;
    const tokenNotExpired = tokenExpirationValue > nowWithOffset;

    this.loggerService.logDebug(
      configId,
      `Has idToken expired: ${!tokenNotExpired} --> expires in ${this.millisToMinutesAndSeconds(
        tokenExpirationValue - nowWithOffset
      )} , ${new Date(tokenExpirationValue).toLocaleTimeString()} > ${new Date(nowWithOffset).toLocaleTimeString()}`
    );

    // Token not expired?
    return tokenNotExpired;
  }

  validateAccessTokenNotExpired(accessTokenExpiresAt: Date, configId: string, offsetSeconds?: number): boolean {
    // value is optional, so if it does not exist, then it has not expired
    if (!accessTokenExpiresAt) {
      return true;
    }

    offsetSeconds = offsetSeconds || 0;
    const accessTokenExpirationValue = accessTokenExpiresAt.valueOf();
    const nowWithOffset = new Date(new Date().toUTCString()).valueOf() + offsetSeconds * 1000;
    const tokenNotExpired = accessTokenExpirationValue > nowWithOffset;

    this.loggerService.logDebug(
      configId,
      `Has accessToken expired: ${!tokenNotExpired} --> expires in ${this.millisToMinutesAndSeconds(
        accessTokenExpirationValue - nowWithOffset
      )} , ${new Date(accessTokenExpirationValue).toLocaleTimeString()} > ${new Date(nowWithOffset).toLocaleTimeString()}`
    );

    // access token not expired?
    return tokenNotExpired;
  }

  // iss
  // REQUIRED. Issuer Identifier for the Issuer of the response.The iss value is a case-sensitive URL using the
  // https scheme that contains scheme, host,
  // and optionally, port number and path components and no query or fragment components.
  //
  // sub
  // REQUIRED. Subject Identifier.Locally unique and never reassigned identifier within the Issuer for the End- User,
  // which is intended to be consumed by the Client, e.g., 24400320 or AItOawmwtWwcT0k51BayewNvutrJUqsvl6qs7A4.
  // It MUST NOT exceed 255 ASCII characters in length.The sub value is a case-sensitive string.
  //
  // aud
  // REQUIRED. Audience(s) that this ID Token is intended for. It MUST contain the OAuth 2.0 client_id of the Relying Party as an
  // audience value.
  // It MAY also contain identifiers for other audiences.In the general case, the aud value is an array of case-sensitive strings.
  // In the common special case when there is one audience, the aud value MAY be a single case-sensitive string.
  //
  // exp
  // REQUIRED. Expiration time on or after which the ID Token MUST NOT be accepted for processing.
  // The processing of this parameter requires that the current date/ time MUST be before the expiration date/ time listed in the value.
  // Implementers MAY provide for some small leeway, usually no more than a few minutes, to account for clock skew.
  // Its value is a JSON [RFC7159] number representing the number of seconds from 1970- 01 - 01T00: 00:00Z as measured in UTC until
  // the date/ time.
  // See RFC 3339 [RFC3339] for details regarding date/ times in general and UTC in particular.
  //
  // iat
  // REQUIRED. Time at which the JWT was issued. Its value is a JSON number representing the number of seconds from
  // 1970- 01 - 01T00: 00: 00Z as measured
  // in UTC until the date/ time.
  validateRequiredIdToken(dataIdToken: any, configId: string): boolean {
    let validated = true;
    if (!dataIdToken.hasOwnProperty('iss')) {
      validated = false;
      this.loggerService.logWarning(configId, 'iss is missing, this is required in the id_token');
    }

    if (!dataIdToken.hasOwnProperty('sub')) {
      validated = false;
      this.loggerService.logWarning(configId, 'sub is missing, this is required in the id_token');
    }

    if (!dataIdToken.hasOwnProperty('aud')) {
      validated = false;
      this.loggerService.logWarning(configId, 'aud is missing, this is required in the id_token');
    }

    if (!dataIdToken.hasOwnProperty('exp')) {
      validated = false;
      this.loggerService.logWarning(configId, 'exp is missing, this is required in the id_token');
    }

    if (!dataIdToken.hasOwnProperty('iat')) {
      validated = false;
      this.loggerService.logWarning(configId, 'iat is missing, this is required in the id_token');
    }

    return validated;
  }

  // id_token C8: The iat Claim can be used to reject tokens that were issued too far away from the current time,
  // limiting the amount of time that nonces need to be stored to prevent attacks.The acceptable range is Client specific.
  validateIdTokenIatMaxOffset(
    dataIdToken: any,
    maxOffsetAllowedInSeconds: number,
    disableIatOffsetValidation: boolean,
    configId: string
  ): boolean {
    if (disableIatOffsetValidation) {
      return true;
    }

    if (!dataIdToken.hasOwnProperty('iat')) {
      return false;
    }

    const dateTimeIatIdToken = new Date(0); // The 0 here is the key, which sets the date to the epoch
    dateTimeIatIdToken.setUTCSeconds(dataIdToken.iat);
    maxOffsetAllowedInSeconds = maxOffsetAllowedInSeconds || 0;

    const nowInUtc = new Date(new Date().toUTCString());
    const diff = nowInUtc.valueOf() - dateTimeIatIdToken.valueOf();
    const maxOffsetAllowedInMilliseconds = maxOffsetAllowedInSeconds * 1000;

    this.loggerService.logDebug(configId, `validate id token iat max offset ${diff} < ${maxOffsetAllowedInMilliseconds}`);

    if (diff > 0) {
      return diff < maxOffsetAllowedInMilliseconds;
    }

    return -diff < maxOffsetAllowedInMilliseconds;
  }

  // id_token C9: The value of the nonce Claim MUST be checked to verify that it is the same value as the one
  // that was sent in the Authentication Request.The Client SHOULD check the nonce value for replay attacks.
  // The precise method for detecting replay attacks is Client specific.

  // However the nonce claim SHOULD not be present for the refresh_token grant type
  // https://bitbucket.org/openid/connect/issues/1025/ambiguity-with-how-nonce-is-handled-on
  // The current spec is ambiguous and KeyCloak does send it.
  validateIdTokenNonce(dataIdToken: any, localNonce: any, ignoreNonceAfterRefresh: boolean, configId: string): boolean {
    const isFromRefreshToken =
      (dataIdToken.nonce === undefined || ignoreNonceAfterRefresh) && localNonce === TokenValidationService.refreshTokenNoncePlaceholder;
    if (!isFromRefreshToken && dataIdToken.nonce !== localNonce) {
      this.loggerService.logDebug(
        configId,
        'Validate_id_token_nonce failed, dataIdToken.nonce: ' + dataIdToken.nonce + ' local_nonce:' + localNonce
      );

      return false;
    }

    return true;
  }

  // id_token C1: The Issuer Identifier for the OpenID Provider (which is typically obtained during Discovery)
  // MUST exactly match the value of the iss (issuer) Claim.
  validateIdTokenIss(dataIdToken: any, authWellKnownEndpointsIssuer: any, configId: string): boolean {
    if ((dataIdToken.iss as string) !== (authWellKnownEndpointsIssuer as string)) {
      this.loggerService.logDebug(
        configId,
        'Validate_id_token_iss failed, dataIdToken.iss: ' +
          dataIdToken.iss +
          ' authWellKnownEndpoints issuer:' +
          authWellKnownEndpointsIssuer
      );

      return false;
    }

    return true;
  }

  // id_token C2: The Client MUST validate that the aud (audience) Claim contains its client_id value registered at the Issuer identified
  // by the iss (issuer) Claim as an audience.
  // The ID Token MUST be rejected if the ID Token does not list the Client as a valid audience, or if it contains additional audiences
  // not trusted by the Client.
  validateIdTokenAud(dataIdToken: any, aud: any, configId: string): boolean {
    if (Array.isArray(dataIdToken.aud)) {
      const result = dataIdToken.aud.includes(aud);

      if (!result) {
        this.loggerService.logDebug(
          configId,
          'Validate_id_token_aud array failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud
        );

        return false;
      }

      return true;
    } else if (dataIdToken.aud !== aud) {
      this.loggerService.logDebug(configId, 'Validate_id_token_aud failed, dataIdToken.aud: ' + dataIdToken.aud + ' client_id:' + aud);

      return false;
    }

    return true;
  }

  validateIdTokenAzpExistsIfMoreThanOneAud(dataIdToken: any): boolean {
    if (!dataIdToken) {
      return false;
    }

    if (Array.isArray(dataIdToken.aud) && dataIdToken.aud.length > 1 && !dataIdToken.azp) {
      return false;
    }

    return true;
  }

  // If an azp (authorized party) Claim is present, the Client SHOULD verify that its client_id is the Claim Value.
  validateIdTokenAzpValid(dataIdToken: any, clientId: string): boolean {
    if (!dataIdToken?.azp) {
      return true;
    }

    if (dataIdToken.azp === clientId) {
      return true;
    }

    return false;
  }

  validateStateFromHashCallback(state: any, localState: any, configId: string): boolean {
    if ((state as string) !== (localState as string)) {
      this.loggerService.logDebug(configId, 'ValidateStateFromHashCallback failed, state: ' + state + ' local_state:' + localState);

      return false;
    }

    return true;
  }

  // id_token C5: The Client MUST validate the signature of the ID Token according to JWS [JWS] using the algorithm specified in the alg
  // Header Parameter of the JOSE Header.The Client MUST use the keys provided by the Issuer.
  // id_token C6: The alg value SHOULD be RS256. Validation of tokens using other signing algorithms is described in the
  // OpenID Connect Core 1.0 [OpenID.Core] specification.
  validateSignatureIdToken(idToken: any, jwtkeys: any, configId: string): boolean {
    if (!jwtkeys || !jwtkeys.keys) {
      return false;
    }

    const headerData = this.tokenHelperService.getHeaderFromToken(idToken, false, configId);

    if (Object.keys(headerData).length === 0 && headerData.constructor === Object) {
      this.loggerService.logWarning(configId, 'id token has no header data');

      return false;
    }

    const kid = headerData.kid;
    const alg = headerData.alg;

    if (!this.keyAlgorithms.includes(alg as string)) {
      this.loggerService.logWarning(configId, 'alg not supported', alg);

      return false;
    }

    let jwtKtyToUse = 'RSA';
    if ((alg as string).charAt(0) === 'E') {
      jwtKtyToUse = 'EC';
    }

    let isValid = false;

    // No kid in the Jose header
    if (!kid) {
      let keyToValidate;

      // If only one key, use it
      if (jwtkeys.keys.length === 1 && (jwtkeys.keys[0].kty as string) === jwtKtyToUse) {
        keyToValidate = jwtkeys.keys[0];
      } else {
        // More than one key
        // Make sure there's exactly 1 key candidate
        // kty "RSA" and "EC" uses "sig"
        let amountOfMatchingKeys = 0;
        for (const key of jwtkeys.keys) {
          if ((key.kty as string) === jwtKtyToUse && (key.use as string) === 'sig') {
            amountOfMatchingKeys++;
            keyToValidate = key;
          }
        }

        if (amountOfMatchingKeys > 1) {
          this.loggerService.logWarning(configId, 'no ID Token kid claim in JOSE header and multiple supplied in jwks_uri');

          return false;
        }
      }

      if (!keyToValidate) {
        this.loggerService.logWarning(configId, 'no keys found, incorrect Signature, validation failed for id_token');

        return false;
      }

      isValid = KJUR.jws.JWS.verify(idToken, KEYUTIL.getKey(keyToValidate), [alg]);

      if (!isValid) {
        this.loggerService.logWarning(configId, 'incorrect Signature, validation failed for id_token');
      }

      return isValid;
    } else {
      // kid in the Jose header of id_token
      for (const key of jwtkeys.keys) {
        if ((key.kid as string) === (kid as string)) {
          const publicKey = KEYUTIL.getKey(key);
          isValid = KJUR.jws.JWS.verify(idToken, publicKey, [alg]);
          if (!isValid) {
            this.loggerService.logWarning(configId, 'incorrect Signature, validation failed for id_token');
          }

          return isValid;
        }
      }
    }

    return isValid;
  }

  // Accepts ID Token without 'kid' claim in JOSE header if only one JWK supplied in 'jwks_url'
  //// private validate_no_kid_in_header_only_one_allowed_in_jwtkeys(header_data: any, jwtkeys: any): boolean {
  ////    this.oidcSecurityCommon.logDebug('amount of jwtkeys.keys: ' + jwtkeys.keys.length);
  ////    if (!header_data.hasOwnProperty('kid')) {
  ////        // no kid defined in Jose header
  ////        if (jwtkeys.keys.length != 1) {
  ////            this.oidcSecurityCommon.logDebug('jwtkeys.keys.length != 1 and no kid in header');
  ////            return false;
  ////        }
  ////    }

  ////    return true;
  //// }

  // Access Token Validation
  // access_token C1: Hash the octets of the ASCII representation of the access_token with the hash algorithm specified in JWA[JWA]
  // for the alg Header Parameter of the ID Token's JOSE Header. For instance, if the alg is RS256, the hash algorithm used is SHA-256.
  // access_token C2: Take the left- most half of the hash and base64url- encode it.
  // access_token C3: The value of at_hash in the ID Token MUST match the value produced in the previous step if at_hash
  // is present in the ID Token.
  validateIdTokenAtHash(accessToken: any, atHash: any, idTokenAlg: string, configId: string): boolean {
    this.loggerService.logDebug(configId, 'at_hash from the server:' + atHash);

    // 'sha256' 'sha384' 'sha512'
    let sha = 'sha256';
    if (idTokenAlg.includes('384')) {
      sha = 'sha384';
    } else if (idTokenAlg.includes('512')) {
      sha = 'sha512';
    }

    const testData = this.jsrsAsignReducedService.generateAtHash('' + accessToken, sha);
    this.loggerService.logDebug(configId, 'at_hash client validation not decoded:' + testData);
    if (testData === (atHash as string)) {
      return true; // isValid;
    } else {
      const testValue = this.jsrsAsignReducedService.generateAtHash('' + decodeURIComponent(accessToken), sha);
      this.loggerService.logDebug(configId, '-gen access--' + testValue);
      if (testValue === (atHash as string)) {
        return true; // isValid
      }
    }

    return false;
  }

  private millisToMinutesAndSeconds(millis: number): string {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);

    return minutes + ':' + (+seconds < 10 ? '0' : '') + seconds;
  }
}

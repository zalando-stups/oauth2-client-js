import {assertPresent} from './util';
import uuid from 'node-uuid';
import {IMPLICIT, ROPC} from './flow-types';

class OAuthRequest {
    constructor(config) {
        this.scope = config.scope;
        this._metadata = config.metadata || {};
    }
}

/**
 * As per RFC 6749, Section 4.2.1
 * ----
 * - response_type: REQUIRED, MUST be "token"
 * - client_id: REQUIRED
 * - redirect_uri: OPTIONAL
 * - scope: OPTIONAL
 * - state: RECOMMENDED
 */
class OAuthImplicitRequest extends OAuthRequest {
    constructor(config) {
        super(config);
        this.response_type = 'token';
        this.redirect_uri = config.redirect_uri;
        this.state = uuid.v4();
        this._flow_type = IMPLICIT;
    }
}

/**
 * As per RFC 6749, Section 4.3.2
 * ---
 * - grant_type: REQUIRED, MUST be "password"
 * - username: REQUIRED
 * - password: REQUIRED
 * - scope: OPTIONAL
 */
class OAuthROPCRequest extends OAuthRequest {
    constructor(config) {
        super(config);
        assertPresent(config, ['username', 'password']);
        this.grant_type = 'password';
        this._flow_type = ROPC;
    }
}

export default OAuthImplicitRequest;
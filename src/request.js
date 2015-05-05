import {assertPresent} from './util';
import uuid from 'node-uuid';

/**
 * As per RFC 6749, Section 4.2.1
 * ----
 * - response_type: REQUIRED, MUST be "token"
 * - client_id: REQUIRED
 * - redirect_uri: OPTIONAL
 * - scope: OPTIONAL
 * - state: RECOMMENDED
 */
class OAuthRequest {
    constructor(config) {
        assertPresent(config, ['response_type']);

        this.response_type = config.response_type;
        this.scope = config.scope;
        this.metadata = config.metadata || {};
    }
}

class OAuthImplicitRequest extends OAuthRequest {
    constructor(config) {
        config.response_type = 'token';
        super(config);
        assertPresent(config, ['client_id']);
        this.client_id = config.client_id;
        this.redirect_uri = config.redirect_uri;
        this.state = uuid.v4();
    }
}

export default OAuthImplicitRequest;
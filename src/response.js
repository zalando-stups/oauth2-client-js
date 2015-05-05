import {assertPresent} from './util';

/**
 * As per RFC 6749
 * ---
 * - access_token: REQUIRED
 * - token_type: REQUIRED
 * - expires_in: RECOMMENDED
 * - scope: OPTIONAL
 * - refresh_token: OPTIONAL
 */
class OAuthResponse {
    constructor(response) {
        this.response = response;
        assertPresent(response, ['access_token', 'token_type']);

        this.access_token = response.access_token;
        this.token_type = response.token_type;
        this.refresh_token = response.refresh_token || null;
        this.expires_in = response.expires_in ? parseInt(response.expires_in) : null;
        this.scope = response.scope;
    }
}

class OAuthImplicitResponse extends OAuthResponse {
    constructor(response) {
        super(response);
        assertPresent(response, ['state']);
        this.state = response.state;
    }
}

export {
    OAuthResponse as Response
};

export default OAuthImplicitResponse;
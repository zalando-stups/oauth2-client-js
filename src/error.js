import {assertPresent} from './util';

class OAuthErrorResponse {
    constructor(response) {
        assertPresent(response, ['error', 'state']);
        //TODO maybe check valid errors
        this.error = response.error;
        this.state = response.state;
        this.error_description = response.error_description;
    }

    getMessage() {
        //TODO RFC 6749 Section 4.2.2.1
        return this.error_description;
    }
}

export default OAuthErrorResponse;
import {assertPresent} from './util';

class OAuthErrorResponse {
    constructor(response) {
        assertPresent(response, 'error', 'state');
        //TODO maybe check valid errors
        this.error = response.error;
        this.state = response.state;
    }

    getMessage() {
        //TODO RFC 6749 Section 4.2.2.1
        return 'Some error';
    }
}

export default OAuthErrorResponse;
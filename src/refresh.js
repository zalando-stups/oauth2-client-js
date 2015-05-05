import {assertPresent} from './util';

class RefreshRequest {
    constructor(config) {
        assertPresent(config, ['refresh_token']);
        this.grant_type = 'refresh_token';
        this.refresh_token = config.refresh_token;
        this.scope = config.scope;
    }
}

export default RefreshRequest;
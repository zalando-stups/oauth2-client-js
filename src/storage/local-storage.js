import OAuthTokenStorage from './storage';

class LocalTokenStorage extends OAuthTokenStorage {
    constructor(prefix, localStorage) {
        super();
        assertPresent(prefix);
        assertPresent(localStorage);
        this.localStorage = localStorage;
        this.prefix = prefix;
    }

    get(key) {
        return this.localStorage.getItem(`${this.prefix}-${key}`);
    }

    set(key, val) {
        return this.localStorage.setItem(`${this.prefix}-${key}`, val);
    }

    remove(key) {
        return this.localStorage.removeItem(`${this.prefix}-${key}`);
    }

    _empty() {
        this.localStorage.clear();
    }
}

export default LocalTokenStorage;
import OAuthTokenStorage from './storage';

class MemoryTokenStorage extends OAuthTokenStorage {
    constructor() {
        super();
        this.items = {};
    }

    get(key) {
        return this.items[key];
    }

    set(key, val) {
        return this.items[key] = val;
    }

    remove(key) {
        delete this.items[key];
    }

    _empty() {
        this.items = {};
    }
}

export default MemoryTokenStorage;
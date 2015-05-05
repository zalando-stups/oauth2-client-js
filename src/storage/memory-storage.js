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
        this.items[key] = val;
        return this.get(key);
    }

    remove(key) {
        delete this.items[key];
    }

    _empty() {
        this.items = {};
    }
}

export default MemoryTokenStorage;
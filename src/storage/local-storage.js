import OAuthTokenStorage from './storage';
import {assertPresent} from '../util';

class LocalTokenStorage extends OAuthTokenStorage {
    constructor(prefix, localStorage) {
        super();
        assertPresent(prefix);
        assertPresent(localStorage);
        this.localStorage = localStorage;
        this.prefix = prefix;
    }

    get(key) {
        let item = this.localStorage.getItem(`${this.prefix}-${key}`);
        try {
            item = JSON.parse(item);
        } catch(err) {
            return item;
        }
        return item;
    }

    set(key, val) {
        let toSave = typeof val === 'object' ? JSON.stringify(val) : val;
        return this.localStorage.setItem(`${this.prefix}-${key}`, toSave);
    }

    remove(key) {
        return this.localStorage.removeItem(`${this.prefix}-${key}`);
    }

    _empty() {
        this.localStorage.clear();
    }
}

export default LocalTokenStorage;
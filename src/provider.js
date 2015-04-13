import querystring from 'querystring';
import {assertPresent} from './util';
import LocalTokenStorage from './storage/local-storage';
import Request from './request';
import Refresh from './refresh';
import Response from './response';
import OAuthError from './error';

class Provider {
    constructor(config) {
        this.config = config;
        assertPresent(config, 'authorization_url', 'id');
        this.id = config.id;
        this.hosts = config.hosts;
        this.authorization_url = config.authorization_url;
        this.store = config.store || new LocalTokenStorage(this.id, window.localStorage);

        if (this.authorization_url.endsWith('/') &&
            !this.authorization_url.includes('?')) {
            this.authorization_url += this.authorization_url.substring(0, this.authorization_url.length - 1);
        }
    }

    remember(request) {
        if (request.state){
            return this.store.set(request.state, JSON.stringify(request));
        }
        return false;
    }

    forget(request) {
        return this.store.remove(request.state);
    }

    isExpected(response) {
        if (response.state) {
            return !!this.store.get(response.state);
        }
        return false;
    }

    hasAccessToken() {
        return !!this.store.get('access_token');
    }

    getAccessToken() {
        return this.store.get('access_token');
    }

    setAccessToken(token) {
        return this.store.set('access_token', token);
    }

    hasRefreshToken() {
        return !!this.store.get('refresh_token');
    }

    getRefreshToken() {
        return this.store.get('refresh_token');
    }

    setRefreshToken(token) {
        return this.store.set('refresh_token', token);
    }

    encodeInUri(request) {
        if (request instanceof Request) {
            return this.authorization_url + '?' + querystring.stringify(request);
        }
        if (request instanceof Refresh) {
            return this.authorization_url + '?' + querystring.stringify(request);
        }
    }

    requestToken(request) {
        return this.encodeInUri(request);
    }

    refreshToken() {
        if (!this.hasRefreshToken()) {
            // TODO should throw here? i dunno
            return false;
        }
        return this.encodeInUri(new Refresh({
            refresh_token: this.getRefreshToken()
        }));
    }

    decodeFromUri(fragment) {
        let parsed = querystring.parse(fragment);
        return parsed.error ? new OAuthError(parsed) : new Response(parsed);
    }

    handleResponse(response) {
        if (!this.isExpected(response)) {
            throw new Error('Unexpected OAuth response', response);
        }
        // forget request. seems safe, dunno if replay attacks are possible here in principle
        let request = JSON.parse(this.store.get(response.state));
        this.forget(request);
        response.metadata = request.metadata;
        if (response instanceof OAuthError) {            
            return response;
        }
        // if we expected this response
        if (response instanceof Response) {
            // update the tokens
            this.setAccessToken(response.access_token);
            this.setRefreshToken(response.refresh_token);
            // return the request so that we know 
            return response;
        }
        throw new Error('Expected OAuth2 response is neither error nor success. This should not happen.');
    }

    parse(fragment) {
        if (!fragment) {
            throw new Error('No URL fragement provided.');
        }
        if (typeof fragment !== 'string') {
            throw new Error('URL fragment is not a string.');
        }
        let hash = fragment.startsWith('#') ? fragment.substring(1) : fragment;
        let response = this.decodeFromUri(hash);
        return this.handleResponse(response);
    }
}

export default Provider;
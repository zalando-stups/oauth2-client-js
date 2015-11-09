import querystring from 'querystring';
import {assertPresent, stripKeys, includes, endsWith, startsWith} from './util';
import LocalTokenStorage from './storage/local-storage';
import Refresh from './refresh';
import Response from './response';
import OAuthError from './error';

class Provider {
    constructor(config) {
        assertPresent(config, ['authorization_url', 'id']);
        this.id = config.id;
        this.authorization_url = config.authorization_url;
        this.storage = config.storage || new LocalTokenStorage(this.id, window.localStorage);
        this.auth_url_has_query = includes.call(this.authorization_url, '?');

        if (endsWith.call(this.authorization_url, '/') && !this.auth_url_has_query) {
            this.authorization_url += this.authorization_url.substring(0, this.authorization_url.length - 1);
        }
    }

    deleteTokens() {
        this.storage.remove('access_token');
        this.storage.remove('refresh_token');
    }

    remember(request) {
        if (request.state){
            return this.storage.set(request.state, request);
        }
        return false;
    }

    forget(request) {
        return this.storage.remove(request.state);
    }

    isExpected(response) {
        if (response.state) {
            return !!this.storage.get(response.state);
        }
        return false;
    }

    hasAccessToken() {
        return !!this.storage.get('access_token');
    }

    getAccessToken() {
        return this.storage.get('access_token');
    }

    setAccessToken(token) {
        return this.storage.set('access_token', token);
    }

    hasRefreshToken() {
        return !!this.storage.get('refresh_token');
    }

    getRefreshToken() {
        return this.storage.get('refresh_token');
    }

    setRefreshToken(token) {
        return this.storage.set('refresh_token', token);
    }

    encodeInUri(request) {
        let strippedRequest = stripKeys(request, ['metadata']);
        return this.authorization_url + (this.auth_url_has_query ? '&' : '?') + querystring.stringify(strippedRequest);
    }

    requestToken(request) {
        return this.encodeInUri(request);
    }

    refreshToken() {
        return this.hasRefreshToken() ? this.encodeInUri(new Refresh({ refresh_token: this.getRefreshToken() })) : false;
    }

    decodeFromUri(fragment) {
        let parsed = querystring.parse(fragment);
        return parsed.error ? new OAuthError(parsed) : new Response(parsed);
    }

    handleRefresh(response) {
        // no state here to check
        this.setAccessToken(response.access_token);
        if (response.refresh_token) {
            this.setRefreshToken(response.refresh_token);
        }
    }

    handleResponse(response) {
        if (!this.isExpected(response)) {
            throw new Error('Unexpected OAuth response', response);
        }
        // forget request. seems safe, dunno if replay attacks are possible here in principle
        let request = this.storage.get(response.state);
        this.forget(request);
        response.metadata = request.metadata;
        if (response instanceof OAuthError) {
            return response;
        }
        // if we expected this response
        if (response instanceof Response) {
            // update the tokens
            this.storage._empty();
            this.setAccessToken(response.access_token);
            this.setRefreshToken(response.refresh_token);
            // return the request so that we know
            return response;
        }
        throw new Error('Expected OAuth2 response is neither error nor success. This should not happen.');
    }

    parse(fragment) {
        if (!fragment) {
            throw new Error('No URL fragment provided.');
        }
        if (typeof fragment !== 'string') {
            throw new Error('URL fragment is not a string.');
        }
        let hash = startsWith.call(fragment, '#') ? fragment.substring(1) : fragment;
        let response = this.decodeFromUri(hash);
        return this.handleResponse(response);
    }
}

export default Provider;
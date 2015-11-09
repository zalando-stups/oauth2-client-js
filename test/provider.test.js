import querystring from 'querystring';
import Provider from '../src/provider';
import ImplicitRequest from '../src/request';
import ImplicitResponse from '../src/response';
import ErrorResponse from '../src/error';
import MemoryStorage from '../src/storage/memory-storage';

describe('Provider', () => {
    var provider,
        requestConfig,
        responseConfig,
        request;

    beforeEach(() => {
        provider = new Provider({
            id: 'test',
            authorization_url: 'auth',
            storage: new MemoryStorage()
        });
        requestConfig = {
            client_id: 'client',
            redirect_uri: 'http://localhost:8080/auth',
            scope: 'email user'
        };
        responseConfig = {
            token_type: 'access',
            access_token: 'access_token',
            refresh_token: 'refresh_token'
        };
        request = new ImplicitRequest(requestConfig);
    });

    afterEach(() => {
        provider.storage._empty();
    });

    it('should bail without authorization_url', () => {
        expect(() => new Provider({
                        id: true
                    })).to.throw;
    });

    it('should bail without id', () => {
        expect(() => new Provider({
                        authorization_url: true
                    })).to.throw;
    });

    it('should not have a trailing slash on the auth url', () => {
        provider = new Provider({
            id: 'test',
            authorization_url: 'auth/',
            storage: new MemoryStorage()
        });
        let lastCharacter = provider.authorization_url[provider.authorization_url.length - 1];
        expect(lastCharacter).to.equal('h');
    });

    it('should have a trailing slash on the auth url if it is in the query', () => {
        provider = new Provider({
            id: 'test',
            authorization_url: 'some.url?auth/',
            storage: new MemoryStorage()
        });
        let lastCharacter = provider.authorization_url[provider.authorization_url.length - 1];
        expect(lastCharacter).to.equal('/');
    });

    it('should build a valid url if the auth url already has a query', () => {
        provider = new Provider({
            id: 'test',
            authorization_url: 'http://some.url?realm=whatever',
            storage: new MemoryStorage()
        });
        let uri = provider.requestToken(request);
        expect(uri.lastIndexOf('?')).to.equal('http://some.url'.length);
    });

    it('should correctly request a token', () => {
        let uri = provider.requestToken(request);
        expect(uri.startsWith('auth')).to.be.true;
        let query = uri.substring('auth?'.length);
        let parsed = querystring.parse(query);

        expect(parsed.client_id).to.equal(requestConfig.client_id);
        expect(parsed.redirect_uri).to.equal(requestConfig.redirect_uri);
        expect(parsed.scope).to.equal(requestConfig.scope);
        expect(parsed.state).to.not.be.undefined;
        expect(parsed.response_type).to.equal('token');
    });

    it('should correctly request a new token via refresh token', () => {
        provider.setRefreshToken('refresh_token');
        let uri = provider.refreshToken();
        let parsed = querystring.parse(uri.substring('auth?'.length));
        expect(parsed.refresh_token).to.equal('refresh_token');
    });

    it('should correctly parse a successful response', () => {
        responseConfig.state = request.state;
        let fragment = querystring.stringify(responseConfig);
        let decoded = provider.decodeFromUri(fragment);
        // should not be an error
        expect(decoded instanceof ImplicitResponse).to.be.true;
        expect(responseConfig.state).to.equal(decoded.state);
        expect(responseConfig.access_token).to.equal(decoded.access_token);
        expect(responseConfig.refresh_token).to.equal(decoded.refresh_token);
        expect(responseConfig.token_type).to.equal(decoded.token_type);
    });

    it('should correctly parse an error response', () => {
        let fragment = querystring.stringify({
            error: 'access_denied',
            state: request.state
        });
        let decoded = provider.decodeFromUri(fragment);
        expect(decoded instanceof ErrorResponse).to.be.true;
    });

    it('#parse should throw without an url fragment', () => {
        expect( () => provider.parse() ).to.throw;
        expect( () => provider.parse('') ).to.throw;
        expect( () => provider.parse(true)).to.throw;
    });

    it('should remember a request', () => {
        provider.remember(request);
        expect(provider.storage.get(request.state)).to.be.ok;
    });

    it('should forget a request', () => {
        provider.remember(request);
        provider.forget(request);
        expect(provider.storage.get(request.state)).to.not.be.ok;
    });

    it('should expect a response after remembering the request', () => {
        provider.remember(request);
        expect(provider.isExpected({
            state: request.state
        })).to.be.true;
    });

    it('should not expect if the state differs', () => {
        provider.remember(request);
        expect(provider.isExpected({
            state: '123123'
        })).to.be.false;
    });

    it('#parse should return the response and save tokens and forget all requests', () => {
        provider.remember(request);
        provider.remember({
            state: 'foo'
        });
        responseConfig.state = request.state;
        let fragment = querystring.stringify(responseConfig);
        let response = provider.parse(fragment);

        // should not be an error
        expect(response instanceof ErrorResponse).to.be.false;
        expect(response instanceof ImplicitResponse).to.be.true;
        // should have saved access and request tokens
        expect(provider.getAccessToken()).to.equal(response.access_token);
        expect(provider.getRefreshToken()).to.equal(response.refresh_token);
        // should forget the request
        expect(provider.isExpected({
            state: request.state
        })).to.be.false;
        // should also not remember the other requests
        expect(provider.isExpected({
            state: 'foo'
        })).to.be.false;
    });

    it('#parse should return the error response', () => {
        provider.remember(request);
        let fragment = querystring.stringify({
            error: 'access_denied',
            state: request.state
        });
        let response = provider.parse(fragment);

        expect(response instanceof ErrorResponse).to.be.true;

        // there should not be any tokens
        expect(provider.getAccessToken()).to.not.be.ok;
        expect(provider.getRefreshToken()).to.not.be.ok;
    });

    it('#requestToken should not put metadata in uri', () => {
        let uri = provider.requestToken(request);
        let parsed = querystring.parse(uri.substring('?auth'.length));
        expect(parsed.metadata).to.be.undefined;
    });

    it('#refreshToken should return false if there is no token in the storage', () => {
        expect(provider.refreshToken()).to.be.false;
    });

    it('#refreshToken should use the token in the storage', () => {
        provider.setRefreshToken('refresh_me');
        let uri = provider.refreshToken();
        expect(uri).to.be.ok;
        expect(uri.indexOf('refresh_me') >= 0).to.be.true;
    });

    it('#handleRefresh should save new tokens', () => {
        provider.setAccessToken('old_access');
        provider.setRefreshToken('old_refresh');
        provider.handleRefresh({
            token_type: 'bearer',
            access_token: 'new_access',
            refresh_token: 'new_refresh'
        });
        expect(provider.getAccessToken()).to.equal('new_access');
        expect(provider.getRefreshToken()).to.equal('new_refresh');
    });

    it('the request metadata should be present on the response', () => {
        request.metadata = {
            timestamp: 123
        };
        provider.remember(request);
        responseConfig.state = request.state;
        let resp = provider.parse(querystring.stringify(responseConfig));
        expect(resp.metadata).to.not.be.undefined;
        expect(resp.metadata.timestamp).to.not.be.undefined;
        expect(resp.metadata.timestamp).to.equal(request.metadata.timestamp);
    });

    it('#deleteTokens should remove access and refresh token', () => {
        provider.setAccessToken('access');
        provider.setRefreshToken('refresh');
        provider.deleteTokens();
        expect(provider.hasAccessToken()).to.be.false;
        expect(provider.hasRefreshToken()).to.be.false;
    });
});
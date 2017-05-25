declare class OAuthErrorResponse  {
    constructor(response: {
        error: string;
        state: string;
        error_description: string;
    });
    error: string;
    state: string;
    error_description: string;
    getMessage(): string;
}

declare class RefreshRequest {
    constructor(config: {
        refresh_token: string;
        scope: string;
    });
    refresh_token: string;
    scope: string;
}

declare interface IOAuthRequest {
    response_type: string;
    scope: string;
    metadata: object;
}

declare class OAuthRequest implements IOAuthRequest {
    response_type: string;
    scope: string;
    metadata: object;
    constructor(config: IOAuthRequest);
}

declare interface IOAuthImplicitRequest extends IOAuthRequest {
    client_id: string;
    redirect_uri: string;
    state: string;
}

declare class OAuthImplicitRequest extends OAuthRequest implements IOAuthImplicitRequest {
    client_id: string;
    redirect_uri: string;
    state: string;
    constructor(config: IOAuthImplicitRequest);
}

declare interface IOAuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
}

declare class OAuthResponse implements IOAuthResponse {
    access_token: string;
    token_type: string;
    refresh_token: string;
    expires_in: number;
    scope: string;
    constructor(response: IOAuthResponse);
}

declare interface IOAuthImplicitResponse extends IOAuthResponse {
    state: string;
}

declare class OAuthImplicitResponse extends OAuthResponse implements IOAuthImplicitResponse {
    state: string;
    constructor(response: IOAuthImplicitResponse);
}

declare class OAuthTokenStorage {
    constructor();
    get(key: string): string;
    set(key: string, val: string): void;
    remove(key: string): void;
    _empty(): void;
    _purge(): void;
}

declare class MemoryTokenStorage extends OAuthTokenStorage {
    items: {
        [key: string]: string;
    }
}

declare class LocalTokenStorage extends OAuthTokenStorage {
    constructor(prefix: string, localStorage: WindowLocalStorage);
    localStorage: WindowLocalStorage;
    prefix: string;
}

declare interface IProvider {
    id: string;
    authorization_url: string;
    storage: WindowLocalStorage;
}

declare class Provider implements IProvider {
    id: string;
    authorization_url: string;
    storage: WindowLocalStorage;
    constructor(config: IProvider);
    auth_url_has_query: boolean;
    deleteTokens(): void;
    remember(request: OAuthImplicitRequest): void | boolean;
    forget(request: OAuthImplicitRequest): void;
    isExpected(response: OAuthImplicitResponse): boolean;
    hasAccessToken(): boolean;
    getAccessToken(): string;
    setAccessToken(token: string): void;
    hasRefreshToken(): boolean;
    getRefreshToken(): boolean;
    setRefreshToken(token: string): void;
    encodeInUri(request: OAuthRequest): string;
    requestToken(request: OAuthRequest): string;
    refreshToken(): string | boolean;
    decodeFromUri(fragment: string): OAuthErrorResponse | OAuthImplicitResponse;
    handleRefresh(response: OAuthResponse): void;
    handleResponse(response: OAuthImplicitResponse): OAuthErrorResponse | OAuthImplicitResponse;
    parse(fragment: string): Error | OAuthErrorResponse | OAuthImplicitResponse;
}

export {
    Provider,
    OAuthImplicitResponse as Response,
    OAuthImplicitRequest as Request,
    OAuthErrorResponse as Error,
    MemoryTokenStorage as MemoryStorage,
}

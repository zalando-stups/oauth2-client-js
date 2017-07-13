# OAuth2 Client

[![Build Status](http://img.shields.io/travis/zalando/oauth2-client-js.svg)](https://travis-ci.org/zalando/oauth2-client-js) [![Coverage Status](https://coveralls.io/repos/zalando/oauth2-client-js/badge.svg)](https://coveralls.io/r/zalando/oauth2-client-js) ![Latest version](https://badge.fury.io/js/%40zalando%2Foauth2-client-js.svg) [![Join the chat at https://gitter.im/zalando/oauth2-client-js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/zalando/oauth2-client-js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)


OAuth2 Client is a library to help you handle OAuth2 access and request tokens. It's for browser-only use (it came about because it was used for a single-page application), so it only includes the [OAuth2 Implicit Grant](https://tools.ietf.org/html/rfc6749#section-4.2) flow.

## Context/What OAuth2 Client Does

OAuth2 Client enables you to work with OAuth2-compliant APIs directly from the (browser) JS app. It encapsulates the gritty RFC parts, but leaves enough flexibility to be usable with any JS framework.

Others have created JavaScript OAuth 2.0 libraries like [JSO](https://github.com/andreassolberg/jso), but OAuth2 Client makes fewer assumptions about how your application works (where the token is needed/used, when a redirect is desirable, etc.). It also makes handling of scopes very simple.

## To-Do/Contribute

This project is looking primarily for users, but contributors are also welcome. If you'd like to help, here are some open to-do's:

- Remove refresh token support
- Add other grant flows that a non-confidential client is allowed to use
- Write docs


## Installation

NPM:

```shell
npm i --save @zalando/oauth2-client-js  
```

Bower:
   
```shell    
bower install --save oauth2-client-js
```

## Usage

A “provider” manages your tokens and knows how to handle responses from the authorization endpoint. Create a new provider like this:

```javascript
var OAuth = require('@zalando/oauth2-client-js');
var google = new OAuth.Provider({
    id: 'google',   // required
    authorization_url: 'https://google.com/auth' // required
});
```

By default a provider will use the localStorage to save its tokens, but with `storage` you can pass anything that adheres to the [Storage API](src/storage/storage.js).

Most of the time you will want to do two things: Request new tokens and check whether there are tokens available.

### Requesting Tokens

To get a new access token, redirect the user to the authorization endpoint. The full URI is constructed like this:

```javascript
// Create a new request
var request = new OAuth.Request({
    client_id: 'my_client_id',  // required
    redirect_uri: 'http://my.server.com/auth-answer'
});

// Give it to the provider
var uri = google.requestToken(request);

// Later we need to check if the response was expected
// so save the request
google.remember(request);

// Do the redirect
window.location.href = uri;
```

The auth endpoint will redirect the user back to the `redirect_uri` and encode its response in the URI fragment. Since your application completely lost its state by now, you may want to pass `metadata` to the request. It will be stored along with the request and loaded later on. E.g. your current application route could go in there.

To parse the response out of the uri, do it like this:

```javascript
var response = google.parse(window.location.hash);
```

This will either throw an error (e.g. when the `state` property doesn’t match both in request and response) or return the response. It will have `metadata` from the request on it. Access and refresh tokens are now available on the provider.

#### Refresh Tokens

They are not in the RFC spec, but you can use them as well (if your server supports them). To issue a refresh request:

```javascript
var uri = google.refreshToken();
yourHttpLibrary
    .get(uri)
    .then(function(response) {
        google.handleRefresh(response.body);
        // your tokens are now diamonds
        // ehm, up to date.
    });
```

### Get Tokens

`google.getAccessToken()` and `google.getRefreshToken()`.

## License

Apache 2.0 as stated in the [LICENSE](LICENSE).

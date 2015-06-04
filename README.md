# OAuth2 Client

[![Build Status](http://img.shields.io/travis/zalando/oauth2-client-js.svg)](https://travis-ci.org/zalando/oauth2-client-js) [![Coverage Status](https://coveralls.io/repos/zalando/oauth2-client-js/badge.svg)](https://coveralls.io/r/zalando/oauth2-client-js) [![Join the chat at https://gitter.im/zalando/oauth2-client-js](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/zalando/oauth2-client-js?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)



A library to help you handling OAuth2 access and request tokens. Since it is meant to be used in the browser it only includes the [OAuth2 Implicit Grant](https://tools.ietf.org/html/rfc6749#section-4.2) flow.

## Installation

NPM:

    npm i --save oauth2-client-js

Bower:
    
    bower install --save oauth2-client-js

## Usage

A “provider” manages your tokens and knows how to handle responses from the authorization endpoint. Create a new provider like this:

    var OAuth = require('oauth2-client-js');
    var google = new OAuth.Provider({
        id: 'google',   // required
        authorization_url: 'https://google.com/auth' // required
    });

By default a provider will use the localStorage to save its tokens, but with `storage` you can pass anything that adheres to the [Storage API](src/storage/storage.js).

Most of the time you will want to do two things: Request new tokens and check whether there are tokens available.

### Requesting tokens

To get a new access token you have to redirect the user to the authorization endpoint. The full URI is constructed like this:

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

The auth endpoint will redirect the user back to the `redirect_uri` and encode its response in the URI fragment. Since your application completely lost its state by now, you may want to pass `metadata` to the request. It will be stored along with the request and loaded later on. E.g. your current application route could go in there.

To parse the response out of the uri, do it like this:

    var response = google.parse(window.location.href);

This will either throw an error (e.g. when the `state` property doesn’t match both in request and response) or return the response. It will have `metadata` from the request on it. Access and refresh tokens are now available on the provider.

#### Refresh tokens

They are not in the RFC spec, but you can use them as well (if your server supports them). To issue a refresh request:

    var uri = google.refreshToken();
    yourHttpLibrary
        .get(uri)
        .then(function(response) {
            google.handleRefresh(response.body);
            // your tokens are now diamonds
            // ehm, up to date.
        });

### Get Tokens

`google.getAccessToken()` and `google.getRefreshToken()`.

## License

Apache 2.0 as stated in the [LICENSE](LICENSE).

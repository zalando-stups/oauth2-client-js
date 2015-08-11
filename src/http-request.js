class HttpRequest {
    constructor(method, url, body, headers) {
        this.method = method;
        this.url = url;
        this.body = body;
        this.headers = headers;
    }
}

export default HttpRequest;
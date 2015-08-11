class Client {
    constructor(id, secret) {
        assertPresent(id);
        assertPresent(secret);

        this.id = id;
        this.secret = secret;
    }
}

export default Client;
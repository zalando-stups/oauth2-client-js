import {stripKeys} from '../src/util';

describe('util#stripKeys', () => {
    var request;

    beforeEach(() => {
        request = {
            metadata: 12,
            redirect_uri: 'localhost'
        };
    });

    it('should return a new object', () => {
        expect(request === stripKeys(request)).to.be.false;
    });

    it('should strip keys', () => {
        let stripped = stripKeys(request, ['metadata']);
        expect(stripped.metadata).to.be.undefined;
    });

    it('should not alter the original', () => {
        let stripped = stripKeys(request, ['redirect_uri']);
        expect(stripped.redirect_uri).to.be.undefined;
        expect(request.redirect_uri).to.equal('localhost');
    });
});
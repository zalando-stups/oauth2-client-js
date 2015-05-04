import ErrorResponse from '../src/error';

describe('ErrorResponse', () => {
    it('should bail without state', () => {
        expect(() => new ErrorResponse({
            error: 'denied'
        })).to.throw;
    });
    
    it('should bail without error', () => {
        expect(() => new ErrorResponse({
            state: '123'
        })).to.throw;
    });

    it('should work with state and error', () => {
        expect(() => new ErrorResponse({
            state: '123',
            error: 'denied'
        })).to.not.throw;
    });

    it('#getMessage should display error_description', () => {
        let desc = 'Nope';
        let err = new ErrorResponse({
            state: '123',
            error: 'invalid_request',
            error_description: desc
        });
        expect(err.getMessage()).to.equal(desc);
    });
});
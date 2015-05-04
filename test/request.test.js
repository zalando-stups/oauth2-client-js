import {Request} from '../src/request';
import ImplicitRequest from '../src/request';

describe('Request', () => {
    it('should bail without response_type', () => {
        expect(() => new Request()).to.throw;
    });
});

describe('ImplicitRequest', () => {
    it('should bail without client_id', () => {
        expect(() => new ImplicitRequest()).to.throw;
    });

    it('should have a state', () => {
        let req = new ImplicitRequest({
            client_id: 'client'
        });
        expect(req.state).to.not.be.undefined;
        expect(typeof req.state).to.equal('string');
    });

    it('should have a response_type', () => {
        let req = new ImplicitRequest({
            client_id: 'client'
        });
        expect(req.response_type).to.equal('token');
    });
});
import {Response} from '../src/response';
import ImplicitResponse from '../src/response';

describe('Response', () => {
    it('should bail without access_token', () => {
        expect(() => new Response({
            token_type: true,
            state: true
        })).to.throw;
    });

    it('should bail without token_type', () => {
        expect(() => new Response({
            access_token: true,
            state: true
        })).to.throw;
    });
});

describe('ImplicitResponse', () => {
    it('should bail without state', () => {
        expect(() => new ImplicitResponse({
            token_type: true,
            access_token: 'access'
        })).to.throw;
    });
});
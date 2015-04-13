import Refresh from '../src/refresh';

describe('Refresh', () => {
    it('should bail without refresh_token', () => {
        expect( () => new Refresh() ).to.throw;
    });

    it('should have the correct grant_type', () => {
        let refresh = new Refresh({ refresh_token: 'refresh' });
        expect(refresh.grant_type).to.equal('refresh_token');
    });
});
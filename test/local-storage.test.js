import LocalTokenStorage from '../src/storage/local-storage';

describe('LocalTokenStorage', () => {
    it('should bail without prefix', () => {
        expect(() => new LocalTokenStorage()).to.throw;
    });
});
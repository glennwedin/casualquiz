const chai = require('chai');
const expect = chai.expect;

describe('this is a test', () => {
    it('should join with or for last item', () => {
        const list = [1, 2, 3, 4];
        const joined = list.slice(0, -1).join(', ') + ' or ' + list.slice(-1);
        expect(joined).to.equal('1, 2, 3 or 4');
    });
});

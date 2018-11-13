const chai = require('chai');
const welcome = require('../intents/welcome');
const expect = chai.expect;

describe('welcome', () => {
    it('should join with or for last item', () => {
        let string;
        const agentMock = {};
        agentMock.add = s => {
            string = s;
        };
        welcome(agentMock);
        expect(string).to.equal(
            'So you are ready to be challenged? Which category do you want to be quizzed about? music, sport, history or computers'
        );
    });
});

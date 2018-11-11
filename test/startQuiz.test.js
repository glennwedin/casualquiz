const chai = require('chai');
const questions = require('../questions');

const stringy = require('../intents/startQuiz').stringifyAlternatives;
const expect = chai.expect;

describe('startQuiz', () => {
    it('should add stuff to agent', () => {
        const list = ['one', 'two', 'three'];
        expect(stringy(list)).to.equal(' one, two or three');
    });
});

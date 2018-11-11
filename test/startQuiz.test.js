const chai = require('chai');
const questions = require('../questions');

const startQuiz = require('../intents/startQuiz');
const expect = chai.expect;

describe('startQuiz', () => {
    it('should add stuff to agent', () => {
        const agent = {};
        const addedStrings = [];
        let questionIdFromContext = 0;

        agent.add = string => {
            addedStrings.push(string);
        };
        agent.getContext = () => {
            return {
                parameters: {
                    category: 'music'
                }
            };
        };
        agent.setContext = obj => {};
        startQuiz(agent);

        console.log(addedStrings);
        expect(addedStrings).to.have.lengthOf(5);
    });
});

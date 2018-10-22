const questions = require('../questions');
const similarity = require('../utils/similarity');

exports.answerQuestion = function(agent) {
    const answer = request.body.queryResult.parameters.answer;
    const context = agent.getContext('question-id');
    const startQuiz = agent.getContext('start-quiz');
    const category = startQuiz.parameters.category;
    const questionId = context.parameters.id;

    const similar =
        similarity(answer, questions[category][questionId].correct_answer) *
        100;
    if (similar >= 70) {
        agent.add(`${answer} is correct! Do you want another question?`);
    } else {
        agent.add(
            `The answer is wrong, it was ${
                questions[category][questionId].correct_answer
            }. Do you want another question?`
        );
    }
    agent.setContext({
        name: 'want-new-question',
        lifespan: 1
    });
    agent.setContext(startQuiz);
};

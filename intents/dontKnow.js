const questions = require('../questions');

module.exports = function(agent) {
    const context = agent.getContext('question-id');
    const startQuiz = agent.getContext('start-quiz');
    const category = startQuiz.parameters.category;
    const questionId = context.parameters.id;

    agent.add(
        `Too bad, the answer was ${
            questions[category][questionId].correct_answer
        }. Do you want another question?`
    );
    agent.setContext({
        name: 'want-new-question',
        lifespan: 1
    });
    agent.setContext(startQuiz);
};

const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');

const questions = require('../questions');
const shuffle = require('../utils/shuffle');

module.exports = function(agent) {
    const startQuizContext = agent.getContext('start-quiz');
    const category = startQuizContext.parameters.category;

    const rand = Math.floor(Math.random() * questions[category].length);

    agent.setContext(startQuizContext);
    agent.setContext({
        name: 'question-id',
        lifespan: 5,
        parameters: {
            id: rand
        }
    });

    let suggs = [];

    suggs.push(questions[category][rand].correct_answer);

    let i = 0;
    while (questions[category][rand].incorrect_answers.length > i) {
        const sugg = questions[category][rand].incorrect_answers[i];
        suggs.push(sugg);
        i++;
    }

    suggs = shuffle(suggs);
    agent.add(questions[category][rand].question + ' ' + suggs.join(', '));
    for (i = 0; suggs.length > i; i++) {
        agent.add(new Suggestion(suggs[i]));
    }
};

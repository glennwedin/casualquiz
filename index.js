'use strict';

const { WebhookClient, Suggestion } = require('dialogflow-fulfillment');

const music = require('./questions/music.json');
const sport = require('./questions/sport.json');
const computers = require('./questions/computers.json');
const history = require('./questions/history.json');

const questions = { music, sport, computers, history };

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

function similarity(s1, s2) {
    var longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (
        (longerLength - editDistance(longer, shorter)) /
        parseFloat(longerLength)
    );
}

function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0) costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue =
                            Math.min(Math.min(newValue, lastValue), costs[j]) +
                            1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}

function shuffle(array) {
    let counter = array.length;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        let index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        let temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

exports.dialogflowFunction = (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
        'Dialogflow Request headers: ' + JSON.stringify(request.headers)
    );
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    function welcome(agent) {
        const categories = ['music', 'sport', 'history', 'computers'];
        agent.add(
            `So you are ready to be challenged? Which category do you want to be quizzed about? ${categories.join(
                ', '
            )}`
        );
    }

    function quizCategory(agent) {
        agent.setContext({
            name: 'start-quiz',
            lifespan: 1,
            parameters: {
                category: request.body.queryResult.parameters.category
            }
        });
        agent.setFollowupEvent('new-question');
        agent.add(
            `Allright, ${
                request.body.queryResult.parameters.category
            } it is then!`
        );
    }

    function fallback(agent) {
        agent.add(`I didn't understand`);
        agent.add(`I'm sorry, can you try again?`);
    }

    function wantNewQuestion(agent) {
        if (request.body.queryResult.parameters.yes === 'yes') {
            agent.setFollowupEvent('new-question');
        } else {
            agent.setFollowupEvent('actions_intent_CANCEL');
        }

        const startQuiz = agent.getContext('start-quiz');
        agent.setContext(startQuiz);
    }

    function startQuiz(agent) {
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
    }

    function answerQuestion(agent) {
        const answer = request.body.queryResult.parameters.answer;
        const context = agent.getContext('question-id');
        const startQuiz = agent.getContext('start-quiz');
        const category = startQuiz.parameters.category;
        const questionId = context.parameters.id;

        const likhet =
            similarity(answer, questions[category][questionId].correct_answer) *
            100;
        if (likhet >= 70) {
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
    }

    // Run the proper function handler based on the matched Dialogflow intent name
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intent', fallback);
    intentMap.set('quiz-category', quizCategory);
    intentMap.set('start-quiz', startQuiz);
    intentMap.set('answer-question', answerQuestion);
    intentMap.set('want-new-question', wantNewQuestion);
    agent.handleRequest(intentMap);
};

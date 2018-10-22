'use strict';

const { WebhookClient } = require('dialogflow-fulfillment');

// intents
const startQuiz = require('./intents/startQuiz');
const welcome = require('./intents/welcome');
const fallback = require('./intents/fallback');
const quizCategory = require('./intents/quizCategory');
const wantNewQuestion = require('./intents/wantNewQuestion');
const answerQuestion = require('./intents/answerQuestion');

process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements

exports.dialogflowFunction = (request, response) => {
    const agent = new WebhookClient({ request, response });
    console.log(
        'Dialogflow Request headers: ' + JSON.stringify(request.headers)
    );
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

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

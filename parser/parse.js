const fs = require('fs');
const Entities = require('html-entities').AllHtmlEntities;
const json = require('./questions.json');

const entities = new Entities();
const newArray = json.results.map(element => {
    const parsedQuestion = entities.decode(element.question);
    const parsedCorrect_answer = entities.decode(element.correct_answer);
    const parsedIncorrect_answers = element.incorrect_answers.map(inc => {
        return entities.decode(inc);
    });

    return {
        question: parsedQuestion,
        correct_answer: parsedCorrect_answer,
        incorrect_answers: parsedIncorrect_answers
    };
});

const fixedQuestions = JSON.stringify(newArray);

fs.writeFile('./parser/fixed-questions.json', fixedQuestions, function(err) {
    if (err) {
        return console.log(err);
    }
    console.log('The file was saved!');
});

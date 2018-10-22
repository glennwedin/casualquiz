exports.quizCategory = function(agent) {
    agent.setContext({
        name: 'start-quiz',
        lifespan: 1,
        parameters: {
            category: request.body.queryResult.parameters.category
        }
    });
    agent.setFollowupEvent('new-question');
    agent.add(
        `Allright, ${request.body.queryResult.parameters.category} it is then!`
    );
};

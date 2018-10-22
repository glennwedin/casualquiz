module.exports = function(agent) {
    agent.setContext({
        name: 'start-quiz',
        lifespan: 1,
        parameters: {
            category: agent.parameters.category
        }
    });
    agent.setFollowupEvent('new-question');
    agent.add(`Allright, ${agent.parameters.category} it is then!`);
};

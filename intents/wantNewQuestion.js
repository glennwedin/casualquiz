module.exports = function(agent) {
    if (agent.parameters.yes === 'yes') {
        agent.setFollowupEvent('new-question');
    } else {
        agent.setFollowupEvent('actions_intent_CANCEL');
    }

    const startQuiz = agent.getContext('start-quiz');
    agent.setContext(startQuiz);
};

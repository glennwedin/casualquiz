exports.welcome = function(agent) {
    const categories = ['music', 'sport', 'history', 'computers'];
    agent.add(
        `So you are ready to be challenged? Which category do you want to be quizzed about? ${categories.join(
            ', '
        )}`
    );
};

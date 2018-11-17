module.exports = function(agent) {
    const categories = [
        'music',
        'sport',
        'history',
        'computers',
        'film',
        'geography'
    ];
    agent.add(
        `So you are ready to be challenged? Which category do you want to be quizzed about? ${categories
            .slice(0, -1)
            .join(', ') +
            ' or ' +
            categories.slice(-1)}`
    );
};

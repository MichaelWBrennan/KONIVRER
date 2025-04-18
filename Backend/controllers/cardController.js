exports.getCards = async (req, res) => {
    res.json([
        { id: 'card1', name: 'Example Card 1', elements: ['🜁', '🜃'] },
        { id: 'card2', name: 'Example Card 2', elements: ['🜂', '🜄'] }
    ]);
};

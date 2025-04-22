router.post('/pairings/:tournamentId', async (req, res) => {
    const { round } = req.body;
    const tournament = await Tournament.findById(req.params.tournamentId).populate('players');

    // Simple shuffle + pair (replace with Swiss logic later)
    const players = [...tournament.players].sort(() => 0.5 - Math.random());
    const matches = [];

    for (let i = 0; i < players.length; i += 2) {
        if (players[i+1]) {
            matches.push({
                tournament: tournament._id,
                round,
                player1: players[i]._id,
                player2: players[i+1]._id
            });
        }
    }

    const created = await Match.insertMany(matches);
    res.json(created);

});

router.post('/submit/:matchId', async (req, res) => {
    const { result } = req.body; // 'P1', 'P2', or 'Draw'
    const match = await Match.findByIdAndUpdate(req.params.matchId, { result }, { new: true });
    res.json(match);
});

router.get('/standings/:tournamentId', async (req, res) => {
    const matches = await Match.find({ tournament: req.params.tournamentId });

    const stats = {};

    matches.forEach(({ player1, player2, result }) => {
        if (!stats[player1]) stats[player1] = { wins: 0, draws: 0 };
        if (!stats[player2]) stats[player2] = { wins: 0, draws: 0 };

        if (result === 'P1') stats[player1].wins++;
        else if (result === 'P2') stats[player2].wins++;
        else if (result === 'Draw') {
            stats[player1].draws++;
            stats[player2].draws++;
        }
    });

    res.json(stats);
});


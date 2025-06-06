const Game = require('../models/gameSchema');
const Outcome = require('../models/outcomeSchema');

// module three of project 5 (question 1) - set game result

const gameResult = async (req, res) => {
   
  try {
    const games = await Game.find({ status: 'completed' }).populate('outcomes');

    const results = await Promise.all(games.map(async (game) => {
      const outcomes = await Outcome.find({ game: game._id });
      const winning = outcomes.find(o => o.isWinning);

      return {
        game: game.name,
        sport: game.sport,
        startTime: game.startTime,
        winningOutcome: winning ? winning.type : 'Not Set'
      };
    }));

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = gameResult

const Game = require('../models/gameSchema');
const Outcome = require('../models/outcomeSchema');
const Bet = require('../models/betSchema');
const User = require('../models/userSchema');

// module three of project 5 (question 2) - calculate payout and update wallet
const payOut =  async (req, res) => {
  try {
    const { gameId, winningOutcomeId } = req.body;

    const game = await Game.findById(gameId);
    if (!game) return res.status(404).json({ message: 'Event not found' });

    if (game.status === 'completed') {
      return res.status(400).json({ message: 'Event already completed' });
    }

    // Set game as completed
    game.status = 'completed';
    await game.save();

    // Update outcome results
    await Outcome.updateMany({ game: gameId }, { isWinning: false });
    await Outcome.findByIdAndUpdate(winningOutcomeId, { isWinning: true });

    // Get all bets for this event
    const bets = await Bet.find({ game: gameId });

    // Calculate payouts
    for (let bet of bets) {
      if (bet.outcome.toString() === winningOutcomeId) {
        // Winning bet
        bet.status = 'won';

        const user = await User.findById(bet.user);
        user.wallet_balance += bet.potentialPayout;
        await user.save();
      } else {
        bet.status = 'lost';
      }
      await bet.save();
    }

    res.status(200).json({ message: 'Result set and payouts completed' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// module one of project 5 (question 2) - create game with odds
const createGame = async (req, res) => {
    try {
      const { name, sport, startTime, outcomes } = req.body;
  
      if (!name || !sport || !startTime || !outcomes || !Array.isArray(outcomes)) {
        return res.status(400).json({ message: 'Missing required fields or outcomes' });
      }
  
      // Create game
      const game = new Game({ name, sport, startTime});
      await game.save();
  
       // Create outcomes with odds
      const outcomeDocs = await Promise.all(outcomes.map(async (outcome) => {
        const { type, odds } = outcome;
        if (!type || !odds) throw new Error('Each outcome must have type and odds');
        return await new Outcome({ game: game._id, type, odds }).save();
      }));
  
      // Attach outcomes to game
      game.outcomes = outcomeDocs.map(o => o._id);
      await game.save();
  
      res.status(201).json({
        message: 'Game and odds created successfully',
        game: {
          id: game._id,
          name: game.name,
          sport: game.sport,
          startTime: game.startTime,
          outcomes: outcomeDocs.map(o => ({
            id: o._id,
            type: o.type,
            odds: o.odds
          }))
        }
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }


module.export = {
    payOut,
    createGame
}
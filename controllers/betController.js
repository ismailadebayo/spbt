const Bet = require('../models/betSchema');
const User = require('../models/userSchema');
const Game = require('../models/gameSchema');
const Outcome = require('../models/outcomeSchema');


const placeBet = async (req, res) => {
  try {
    const userId = req.user?._id; // Assumes auth middleware sets req.user
    const { gameId, outcomeId, stake } = req.body;

    if (!userId || !gameId || !outcomeId || !stake) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.wallet_balance < stake) {
      return res.status(400).json({ message: 'Insufficient wallet balance' });
    }

    const event = await Game.findById(eventId);
    if (!event || event.status !== 'upcoming') {
      return res.status(400).json({ message: 'Invalid or closed event' });
    }

    const outcome = await Outcome.findById(outcomeId);
    if (!outcome || outcome.event.toString() !== gameId) {
      return res.status(400).json({ message: 'Invalid outcome for event' });
    }

    const potentialPayout = stake * outcome.odds;

    // Deduct stake
    user.wallet_balance -= stake;
    await user.save();

    // Record bet
    const bet = new Bet({
      user: user._id,
      event: event._id,
      outcome: outcome._id,
      stake,
      odds: outcome.odds,
      potentialPayout
    });

    await bet.save();

    res.status(201).json({
      message: 'Bet placed successfully',
      bet: {
        id: bet._id,
        game: game.name,
        outcome: outcome.type,
        stake,
        odds: outcome.odds,
        potentialPayout
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}



const betHistory = async (req, res) => {
  try {
    const userId = req.user?._id;
    const bets = await Bet.find({ user: userId })
      .populate('game')
      .populate('outcome')
      .sort({ placedAt: -1 });

    const formatted = bets.map(bet => ({
      id: bet._id,
      event: bet.event.name,
      outcome: bet.outcome.type,
      stake: bet.stake,
      odds: bet.odds,
      potentialPayout: bet.potentialPayout,
      status: bet.status,
      placedAt: bet.placedAt
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports ={
    placeBet, 
    betHistory
}
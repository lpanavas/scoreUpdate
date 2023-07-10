const GameData = require("../models/data.model");

exports.addGameData = (req, res) => {
  const userID = req.body.userID;
  const outputData = req.body.outputData;

  const newData = new GameData({ userID, outputData });

  newData
    .save()
    .then(() => res.json("Data added!"))
    .catch((err) => res.status(400).json("Error: " + err));
};

exports.calculateRankings = async (req, res) => {
  const { cards, demographics } = req.body;
  const key = Object.keys(demographics)[0];
  const value = demographics[key];

  const allGameData = await GameData.aggregate([
    { $unwind: "$outputData" },
    { $match: { [`outputData.demographics.${key}`]: value } },
    { $unwind: "$outputData.CardMatchups" },
    {
      $match: {
        "outputData.CardMatchups.Card1": { $in: cards },
        "outputData.CardMatchups.Card2": { $in: cards },
      },
    },
  ]);

  let rankings = {};
  let ratings = {};
  const K = 40;

  // Initialize rankings object and ratings with player's cards
  cards.forEach((card) => {
    rankings[card] = { wins: 0, losses: 0, ties: 0, opponents: {} };
    ratings[card] = 1800; // default rating
  });

  allGameData.forEach((game) => {
    const matchup = game.outputData.CardMatchups;

    // Initialize the opponents
    if (rankings[matchup.Card1] && rankings[matchup.Card2]) {
      if (!rankings[matchup.Card1].opponents[matchup.Card2]) {
        rankings[matchup.Card1].opponents[matchup.Card2] = {
          wins: 0,
          losses: 0,
          ties: 0,
        };
      }

      if (!rankings[matchup.Card2].opponents[matchup.Card1]) {
        rankings[matchup.Card2].opponents[matchup.Card1] = {
          wins: 0,
          losses: 0,
          ties: 0,
        };
      }

      if (matchup.Answer === "Skip") {
        // It's a tie
        rankings[matchup.Card1].ties += 1;
        rankings[matchup.Card2].ties += 1;
        rankings[matchup.Card1].opponents[matchup.Card2].ties += 1;
        rankings[matchup.Card2].opponents[matchup.Card1].ties += 1;
      } else {
        // There is a winner
        const winner = matchup.Answer;
        const loser = winner === matchup.Card1 ? matchup.Card2 : matchup.Card1;

        rankings[winner].wins += 1;
        rankings[loser].losses += 1;

        rankings[winner].opponents[loser].losses += 1;
        rankings[loser].opponents[winner].wins += 1;
      }
    }
  });

  // Calculate ratings using the relative logistic method
  const numPlayers = cards.length;
  const totalGames = allGameData.length;
  for (let i = 0; i < numPlayers; i++) {
    const playerA = cards[i];

    for (let j = 0; j < numPlayers; j++) {
      if (i !== j) {
        const playerB = cards[j];

        if (rankings[playerA].opponents[playerB]) {
          const totalGamesAgainstOpponent =
            rankings[playerA].opponents[playerB].wins +
            rankings[playerA].opponents[playerB].losses +
            rankings[playerA].opponents[playerB].ties;

          const winRatio =
            rankings[playerA].opponents[playerB].wins /
            totalGamesAgainstOpponent;
          const lossRatio =
            rankings[playerA].opponents[playerB].losses /
            totalGamesAgainstOpponent;

          const ratingDifference = ratings[playerB] - ratings[playerA];
          const expectedScore = pnorm(ratingDifference, 0, 2000 / 7, 1);
          const actualScore =
            winRatio +
            (0.5 * rankings[playerA].opponents[playerB].ties) /
              totalGamesAgainstOpponent;

          const delta = K * (actualScore - expectedScore);
          ratings[playerA] += delta;
        }
      }
    }
  }

  res.json({ rankings, ratings });
};

// Helper function to calculate the cumulative probability distribution function (CDF)
function pnorm(x, mean, sd, upperTail) {
  const q = (x - mean) / sd;
  return upperTail
    ? (1 - Math.atan(q) / Math.PI) * 0.5
    : Math.atan(q) / Math.PI + 0.5;
}

exports.calculatePairwiseData = async (req, res) => {
  try {
    const cardIds = req.body.cards;
    const pairs = [];

    // Create all possible pairings
    for (let i = 0; i < cardIds.length; i++) {
      for (let j = i + 1; j < cardIds.length; j++) {
        pairs.push([cardIds[i], cardIds[j]]);
      }
    }

    const allGameData = await GameData.aggregate([
      { $unwind: "$outputData" },
      { $unwind: "$outputData.CardMatchups" },
      {
        $match: {
          "outputData.CardMatchups.Card1": { $in: cardIds },
          "outputData.CardMatchups.Card2": { $in: cardIds },
        },
      },
    ]);

    // Initialize the response object
    const response = pairs.reduce((obj, pair) => {
      obj[pair.join("-")] = { pair, counts: { [pair[0]]: 0, [pair[1]]: 0 } };
      return obj;
    }, {});

    // Update counts based on past user responses
    allGameData.forEach((game) => {
      const matchup = game.outputData.CardMatchups;
      const matchKey = [matchup.Card1, matchup.Card2].sort().join("-");

      if (response[matchKey]) {
        response[matchKey].counts[matchup.Answer]++;
        console.log(response[matchKey]);
      }
    });

    // Calculate percentages
    Object.values(response).forEach((item) => {
      const total = item.counts[item.pair[0]] + item.counts[item.pair[1]];
      item.percentages =
        total === 0
          ? { [item.pair[0]]: 50, [item.pair[1]]: 50 }
          : {
              [item.pair[0]]: (item.counts[item.pair[0]] / total) * 100,
              [item.pair[1]]: (item.counts[item.pair[1]] / total) * 100,
            };

      delete item.counts;
    });
    response.data = Object.values(response);

    res.json(response);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};

const express = require("express");
const router = express.Router();

const dataController = require("../controllers/dataController");

router.post("/add", dataController.addGameData);
router.post("/rankings", dataController.calculateRankings);
router.post("/pairwise", dataController.calculatePairwiseData);

module.exports = router;

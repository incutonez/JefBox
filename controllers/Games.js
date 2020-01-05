const express = require('express');
const router = express.Router();
const db = require('../models/index');
const Schemas = require('../schemas/index');
const GameSchema = Schemas.Games;
const BaseCrudModel = require('../models/BaseCrud');
const GameModel = db.Game;
const TeamModel = db.Team;
const Game = BaseCrudModel(GameModel);
const Team = BaseCrudModel(TeamModel);

module.exports = (io) => {
  const BaseCrudController = require('./BaseCrud')(GameModel, io);
  router.get(GameSchema.BASE_PATH, BaseCrudController.getAll);
  router.post(GameSchema.BASE_PATH, BaseCrudController.createRecord);
  router.post(GameSchema.JOIN_PATH, async (req, res) => {
    const teamId = req.body.TeamId;
    const gameId = req.params.id;
    // First lookup the Game record
    let game = await Game.getRecordById(gameId);
    if (game.AllowTeams) {
      if (teamId) {
        // Add the team to the game, if it's not already added
        await game.addTeam(teamId);
        // Get the associated model
        let gameTeam = await db.GameTeam.findOne({
          where: {
            GameId: gameId,
            TeamId: teamId
          }
        });
        await gameTeam.addUser(req.session.user.Id);
      }
    }
    else {
      // Add the user to the game, if they're not already added
      await game.addUser(req.session.user.Id);
    }
    if (io && GameModel.updateEvent) {
      io.emit(GameModel.updateEvent);
    }
    res.sendStatus(204);
  });
  router.get(GameSchema.ID_PATH, BaseCrudController.getById);
  router.put(GameSchema.ID_PATH, BaseCrudController.updateById);
  router.delete(GameSchema.ID_PATH, BaseCrudController.deleteById);
  return router;
};

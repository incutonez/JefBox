const express = require('express');
const router = express.Router();
const db = require('../models/index');
const Schemas = require('../schemas/index');
const GameSchema = Schemas.Games;
const BaseCrudModel = require('../models/BaseCrud');
const GameModel = db.Game;
const TeamModel = db.Team;
const UserModel = db.User;
const Game = BaseCrudModel(GameModel);

module.exports = (io) => {
  const BaseCrudController = require('./BaseCrud')(GameModel, io);
  router.get(GameSchema.BASE_PATH, BaseCrudController.getAll);
  router.post(GameSchema.BASE_PATH, BaseCrudController.createRecord);
  router.post(GameSchema.JOIN_PATH, async (req, res) => {
    const teamName = req.body.TeamName;
    let teamId = req.body.TeamId;
    const gameId = req.params.id;
    const userId = req.session.user.Id;
    // First lookup the Game record
    const game = await Game.getRecordById(gameId);
    if (game.AllowTeams) {
      if (teamId < 0) {
        const results = await TeamModel.findOrCreate({
          where: {
            Name: teamName.replace(/\s/g, '').toLowerCase()
          },
          defaults: {
            Name: teamName,
            UpdatedById: req.session.user.Id,
            OwnerId: req.session.user.Id
          }
        });
        teamId = results[0].Id;
      }
      // Add the team to the game, if it's not already added
      await game.addTeam(teamId);
      // Get the associated model
      const gameTeam = await db.GameTeam.findOne({
        where: {
          GameId: gameId,
          TeamId: teamId
        }
      });
      await gameTeam.addUser(userId);
      if (io && TeamModel.updateEvent) {
        io.emit(TeamModel.updateEvent);
      }
    }
    else {
      // Add the user to the game, if they're not already added
      await game.addUser(userId);
    }
    if (io && GameModel.updateEvent) {
      io.emit(`${GameModel.updateEvent}${gameId}`);
    }
    if (io && UserModel.updateEvent) {
      io.emit(`${UserModel.updateEvent}${userId}`);
    }
    res.sendStatus(204);
  });
  router.post(GameSchema.ADD_ANSWER_PATH, async (req, res) => {
    try {
      const gameId = req.params.id;
      const roundItem = await db.RoundItem.findOne({
        where: {
          Id: req.body.RoundItemId
        }
      });
      const teamId = req.body.TeamId;
      let groupId = req.session.user.Id;
      if (teamId) {
        groupId = teamId;
      }
      else {
        req.body.UserId = groupId;
      }
      req.body.GameId = gameId;
      req.body.GroupId = groupId;
      await roundItem.createAnswer(req.body);
      if (io && GameModel.updateEvent) {
        io.emit(`${GameModel.updateEvent}${gameId}`);
      }
    }
    catch (e) {
      // TODOJEF: HERE
      console.log(e);
    }
    res.sendStatus(204);
  });
  router.put(GameSchema.UPDATE_ROUND_ITEM_PATH, async (req, res) => {
    const gameId = req.params.id;
    const roundItem = await db.RoundItem.findOne({
      where: {
        GameId: gameId,
        Id: req.params.roundItemId
      }
    });
    await roundItem.update({
      AnswerDate: req.body.isComplete ? new Date() : null
    });
    if (io && GameModel.updateEvent) {
      io.emit(`${GameModel.updateEvent}${gameId}`);
    }
    res.sendStatus(204);
  });
  router.post(GameSchema.ADD_WINNER_PATH, async (req, res) => {
    const gameId = req.params.id;
    const teams = req.body.teams;
    const users = req.body.users;
    const roundItemId = req.body.RoundItemId;
    await db.RoundItemAnswer.update({
      IsCorrect: false,
      Points: 0
    }, {
      where: {
        RoundItemId: roundItemId
      }
    });
    if (teams.length || users.length) {
      for (let i = 0; i < teams.length; i++) {
        const team = teams[i];
        await db.RoundItemAnswer.update({
          IsCorrect: true,
          Points: team.Points
        }, {
          where: {
            RoundItemId: roundItemId,
            TeamId: team.Id
          }
        });
      }
    }
    if (io && GameModel.updateEvent) {
      io.emit(`${GameModel.updateEvent}${gameId}`);
    }
    res.sendStatus(204);
  });
  router.get(GameSchema.ID_PATH, BaseCrudController.getById);
  router.put(GameSchema.ID_PATH, BaseCrudController.updateById);
  router.put(GameSchema.ID_PATH + '/winner/:WinnerId', async (req, res) => {
    const gameId = req.params.id;
    await db.Game.update({
      WinnerId: req.params.WinnerId
    }, {
      where: {
        Id: gameId
      }
    });
    res.sendStatus(204);
  });
  router.delete(GameSchema.ID_PATH, BaseCrudController.deleteById);
  return router;
};

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

  router.get(GameSchema.ID_PATH, async (req, res) => {
    const gameId = req.params.id;
    const game = await Game.getRecordById(gameId);
    if (!game) {
      return res.sendStatus(404);
    }
    const roundItems = await db.RoundItem.findAll({
      where: {
        GameId: gameId
      },
      order: [
        ['RoundIndex', 'ASC'],
        ['Order', 'ASC']
      ]
    });
    const response = game.getDetails();
    if (roundItems && roundItems.length) {
      response.FirstRoundItemId = roundItems[0].Id;
      response.LastRoundItemId = roundItems[roundItems.length - 1].Id;
    }
    res.send(response);
  });

  router.get(GameSchema.PLAYER_DETAILS, async (req, res) => {
    const userId = req.session.user.Id;
    const gameId = req.params.id;
    const game = await GameModel.findOne({
      where: {
        Id: gameId
      },
      include: [{
        model: db.GameTeam,
        include: [{
          model: TeamModel
        }, {
          model: UserModel,
          through: {
            attributes: []
          }
        }]
      }]
    });
    const data = Object.assign({}, game.get());
    game.getTeams(data, userId);
    data.Group = data.Teams[0];
    delete data.Teams;
    res.send(data);
  });

  router.get(GameSchema.SCORE, async (req, res) => {
    const gameId = req.params.id;
    const game = await GameModel.findOne({
      where: {
        Id: gameId
      },
      include: [{
        model: db.RoundItem,
        as: 'RoundItems',
        required: false,
        include: [{
          model: db.RoundItemChoice,
          as: 'Choices'
        }, {
          model: db.RoundItemAnswer,
          as: 'Answers',
          where: {
            IsCorrect: true
          },
          attributes: ['Points', 'GroupId']
        }]
      }]
    });
    const gameTeams = await game.getGameTeams({
      include: [{
        model: game.AllowTeams ? TeamModel : UserModel
      }]
    });
    const groups = {};
    // TODO: Add User support
    for (let i = 0; i < gameTeams.length; i++) {
      const gameTeam = gameTeams[i];
      groups[gameTeam.Team.Id] = gameTeam.Team.Name;
    }
    let answers = [];
    const roundItems = game.RoundItems;
    if (roundItems) {
      for (let i = 0; i < roundItems.length; i++) {
        const roundItem = roundItems[i];
        const roundName = roundItem.Round;
        const roundAnswers = roundItem.Answers;
        const questionNumber = roundItem.Order;
        for (let j = 0; j < roundAnswers.length; j++) {
          const answer = roundAnswers[j].get();
          answer.Round = roundName;
          answer.QuestionNumber = questionNumber;
          answer.GroupName = groups[answer.GroupId];
          answers.push(answer);
        }
      }
    }
    res.send(answers);
  });

  router.get(GameSchema.CURRENT_QUESTION, async (req, res) => {
    const gameId = req.params.id;
    const groupId = req.query.groupId;
    const attributes = {};
    const answersOnly = req.query.answersOnly;
    const includeOptions = [{
      model: db.RoundItemChoice,
      as: 'Choices',
      required: false
    }];
    let answerQuery = {
      model: db.RoundItemAnswer,
      as: 'Answers',
      required: false
    };
    if (groupId) {
      answerQuery.where = {
        GroupId: groupId
      };
      // Exclude the answer so users can't see it
      attributes.exclude = ['Answer'];
    }
    else if (!answersOnly) {
      answerQuery = null;
    }
    if (answerQuery) {
      includeOptions.push(answerQuery);
    }
    let roundItem = await db.RoundItem.findOne({
      where: {
        [db.Op.and]: [{
          GameId: gameId
        }, {
          AnswerDate: null
        }]
      },
      attributes: attributes,
      include: includeOptions,
      order: [
        ['RoundIndex', 'ASC'],
        ['Order', 'ASC']
      ]
    });
    // This means we're possibly at the end of the game, so just grab the last record
    if (!roundItem) {
      roundItem = await db.RoundItem.findOne({
        where: {
          [db.Op.and]: [{
            GameId: gameId
          }]
        },
        attributes: attributes,
        include: [{
          model: db.RoundItemChoice,
          as: 'Choices',
          required: false
        }, answerQuery],
        order: [
          ['RoundIndex', 'DESC'],
          ['Order', 'DESC']
        ]
      });
    }
    if (roundItem) {
      const roundItemPoints = roundItem.Points;
      const answers = roundItem.Answers;
      if (answers) {
        let choicesMapped;
        const choices = roundItem.Choices;
        if (choices && choices.length) {
          choicesMapped = {};
          for (let i = 0; i < choices.length; i++) {
            const choice = choices[i];
            choicesMapped[choice.Id] = choice.Value;
          }
        }
        for (let i = 0; i < answers.length; i++) {
          const answer = answers[i];
          if (choicesMapped) {
            answer.Answer = choicesMapped[answer.ChoiceId];
          }
          answer.Points = answer.Points || roundItemPoints;
        }
      }
    }
    if (answersOnly) {
      return res.send(roundItem.Answers);
    }
    res.send(roundItem);
  });

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
      // Potentially added a team to the global teams store, so have that event fire to trickle to clients
      if (io && TeamModel.updateEvent) {
        io.emit(TeamModel.updateEvent);
      }
    }
    else {
      // Add the user to the game, if they're not already added
      await game.addUser(userId);
    }
    if (io) {
      io.emit(`${GameSchema.SOCKET_UPDATE}${gameId}`);
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
      if (io) {
        io.emit(`${GameSchema.SOCKET_UPDATE_ROUND_ANSWERS}${gameId}`);
        io.emit(`${GameSchema.SOCKET_UPDATE_GROUP}${gameId}_${groupId}`);
      }
    }
    catch (e) {
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
    if (req.body.revertPrevious) {
      // Make sure our game hasn't actually ended
      await roundItem.update({
        AnswerDate: null
      });
      const lastQuestion = await db.RoundItem.findOne({
        where: {
          GameId: gameId,
          AnswerDate: {
            [db.Op.ne]: null
          }
        },
        order: [['AnswerDate', 'DESC']]
      });
      if (lastQuestion) {
        await lastQuestion.update({
          AnswerDate: null
        });
      }
    }
    else {
      await roundItem.update({
        AnswerDate: new Date()
      });
    }
    if (io) {
      io.emit(`${GameSchema.SOCKET_UPDATE_ROUND}${gameId}`);
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
    await db.RoundItem.update({
      AnswerDate: new Date()
    }, {
      where: {
        Id: roundItemId
      }
    });
    if (io) {
      io.emit(`${GameSchema.SOCKET_UPDATE_ROUND}${gameId}`);
    }
    res.sendStatus(204);
  });

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

  router.delete(GameSchema.GROUP, async (req, res) => {
    await db.GameTeam.destroy({
      where: {
        GameId: req.params.id,
        TeamId: req.params.GroupId
      },
      cascade: true
    });
    res.sendStatus(204);
  });

  router.delete(GameSchema.ANSWERS_ID, async (req, res) => {
    const gameId = req.params.id;
    const groupAnswer = await db.RoundItemAnswer.findByPk(req.params.AnswerId);
    if (groupAnswer) {
      // Cascade delete wasn't working, so I'm using this for now
      const upload = await groupAnswer.getUpload();
      if (upload) {
        await upload.destroy();
      }
      await groupAnswer.destroy();
    }
    if (io) {
      io.emit(`${GameSchema.SOCKET_UPDATE_GROUP}${gameId}_${groupAnswer.GroupId}`);
      io.emit(`${GameSchema.SOCKET_UPDATE_ROUND_ANSWERS}${gameId}`);
    }
    res.sendStatus(204);
  });

  router.put(GameSchema.ROUND_ITEM_ANSWERS, async (req, res) => {
    const gameId = req.params.id;
    const roundItemId = req.params.roundItemId;
    const gameTeams = await db.GameTeam.findAll({
      where: {
        GameId: gameId
      }
    });
    const roundAnswers = await db.RoundItemAnswer.findAll({
      where: {
        RoundItemId: roundItemId
      }
    });
    const groupIds = gameTeams && gameTeams.map(x => x.getDataValue('Id'));
    const groupIdsWithAnswers = roundAnswers && roundAnswers.map(x => x.getDataValue('GroupId'));
    // Get the difference between the 2 groups
    const missingGroupAnswers = [...groupIds].filter(x => !groupIdsWithAnswers.includes(x));
    if (missingGroupAnswers && missingGroupAnswers.length) {
      await db.RoundItemAnswer.bulkCreate(missingGroupAnswers.map(function(item) {
        return {
          GroupId: item,
          TeamId: item,
          RoundItemId: roundItemId
        };
      }));
      if (io) {
        io.emit(`${GameSchema.SOCKET_UPDATE_ROUND_ANSWERS}${gameId}`);
        for (let i = 0; i < missingGroupAnswers.length; i++) {
          io.emit(`${GameSchema.SOCKET_UPDATE_GROUP}${gameId}_${missingGroupAnswers[i]}`);
        }
      }
    }
    res.sendStatus(204);
  });

  return router;
};

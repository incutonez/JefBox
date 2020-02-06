const GameStatuses = require('../enums/GameStatuses');
module.exports = (conn, types) => {
  const GameModel = conn.define('Game', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      set(id) {
        this.setDataValue('Id', id < 0 ? null : id);
      }
    },
    Name: {
      type: types.STRING,
      allowNull: false
    },
    Type: {
      type: types.INTEGER,
      allowNull: false
    },
    Status: {
      type: types.INTEGER,
      allowNull: false
    },
    AllowTeams: {
      type: types.BOOLEAN
    },
    WinnerId: {
      type: types.INTEGER
    }
  }, {
    timestamps: true,
    paranoid: true,
    createdAt: 'CreateDate',
    updatedAt: 'UpdateDate',
    deletedAt: 'DeleteDate',
    hooks: {
      beforeUpdate: (record, options) => {
        if (record.Status === GameStatuses.DELETED) {
          record.Status = GameStatuses.NEW;
        }
      },
      afterDestroy: async (record, options) => {
        record.Status = GameStatuses.DELETED;
        await record.save({
          hooks: false
        });
      }
    }
  });

  GameModel.associate = (models) => {
    GameModel.belongsToMany(models.Team, {
      through: models.GameTeam
    });
    GameModel.hasMany(models.GameTeam);

    GameModel.belongsToMany(models.User, {
      through: 'GameUser'
    });

    GameModel.hasMany(models.RoundItem, {
      as: 'RoundItems',
      foreignKey: 'GameId'
    });

    // I add this in here because we need the GameTeamModel association to exist in order to use it below
    GameModel.includeOptions.push({
      model: models.GameTeam,
      required: false,
      include: [{
        model: models.Team
      }, {
        model: models.User,
        through: {
          attributes: []
        }
      }]
    }, {
      model: models.RoundItem,
      as: 'RoundItems',
      required: false,
      include: [{
        model: models.RoundItemChoice,
        as: 'Choices'
      }, {
        model: models.RoundItemAnswer,
        as: 'Answers'
      }]
    });

    GameModel.updateInclude.push({
      model: models.RoundItem,
      as: 'RoundItems',
      include: models.RoundItem.updateInclude
    });
  };

  GameModel.prototype.getTeams = function(data, userId) {
    const teams = [];
    const gameTeams = data.GameTeams;
    if (gameTeams) {
      for (let i = 0; i < gameTeams.length; i++) {
        const gameTeam = gameTeams[i];
        const team = gameTeam.Team.get();
        const teamUsers = gameTeam.Users;
        const users = [];
        let containsUser = !userId;
        for (let j = 0; j < teamUsers.length; j++) {
          const user = teamUsers[j].get();
          users.push(user);
          if (!containsUser && user.Id === userId) {
            containsUser = true;
          }
        }
        if (containsUser) {
          team.Users = users;
          teams.push(team);
        }
      }
      data.Teams = teams;
      delete data.GameTeams;
    }
  };

  GameModel.prototype.getScore = function(data, scoreOnly) {
    const standings = [];
    data = data || Object.assign({}, this.get());
    const roundItems = data.RoundItems;
    if (roundItems) {
      // TODOJEF: Add support for user only games
      const teamIds = data.Teams.map(x => x.Id);
      for (let i = 0; i < roundItems.length; i++) {
        const roundItem = roundItems[i];
        const answers = roundItem.Answers;
        const choices = roundItem.Choices;
        const choiceIds = choices && choices.map(x => x.Id);
        if (answers) {
          for (let j = 0; j < answers.length; j++) {
            const answer = answers[j].get();
            const groupId = answer.TeamId || answer.UserId;
            const group = data.Teams[teamIds.indexOf(groupId)];
            const groupName = group && group.Name;
            if (answer.IsCorrect) {
              standings.push({
                Round: roundItem.Round,
                QuestionNumber: roundItem.Order,
                Points: answer.Points,
                GroupId: groupId,
                GroupName: groupName
              });
            }
            if (choiceIds && choiceIds.length) {
              const choice = choices[choiceIds.indexOf(answer.ChoiceId)];
              answer.Answer = choice && choice.Value;
            }
            answer.GroupName = groupName;
            answer.GroupId = groupId;
            if (answer.Points === null) {
              answer.Points = roundItem.Points;
            }
          }
        }
      }
    }
    data.Score = standings;
  };

  GameModel.prototype.getDetails = function() {
    const data = Object.assign({}, this.get());
    this.getTeams(data);
    this.getScore(data);
    return data;
  };

  GameModel.includeOptions = [];
  GameModel.updateInclude = [];
  GameModel.updateEvent = 'updatedGames';

  return GameModel;
};

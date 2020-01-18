module.exports = (conn, types) => {
  const RoundItemAnswerModel = conn.define('RoundItemAnswer', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Answer: {
      type: types.STRING
    },
    ChoiceId: {
      type: types.INTEGER
    },
    IsCorrect: {
      type: types.BOOLEAN,
      defaultValue: false
    },
    GroupId: {
      type: new types.VIRTUAL(types.INTEGER)
    },
    GroupName: {
      type: new types.VIRTUAL(types.STRING, ['Team', 'User']),
      get() {
        let groupId;
        let groupName;
        const user = this.User;
        const team = this.Team;
        delete this.dataValues.Team;
        delete this.dataValues.User;
        if (team) {
          groupId = team.Id;
          groupName = team.Name;
        }
        else if (user) {
          groupId = user.Id;
          groupName = user.UserName;
        }
        if (groupId) {
          this.setDataValue('GroupId', groupId);
        }
        return groupName;
      }
    },
    Points: {
      type: new types.VIRTUAL(types.INTEGER)
    },
    RoundNumber: {
      type: new types.VIRTUAL(types.INTEGER)
    },
    QuestionNumber: {
      type: new types.VIRTUAL(types.INTEGER)
    }
  });

  RoundItemAnswerModel.associate = (models) => {
    RoundItemAnswerModel.belongsTo(models.Upload, {
      foreignKey: 'UploadId'
    });
    RoundItemAnswerModel.belongsTo(models.RoundItemChoice, {
      foreignKey: 'ChoiceId'
    });
    RoundItemAnswerModel.belongsTo(models.Game);
    RoundItemAnswerModel.belongsTo(models.RoundItem);
    RoundItemAnswerModel.belongsTo(models.Team);
    RoundItemAnswerModel.belongsTo(models.User);
  };

  RoundItemAnswerModel.includeOptions = [];

  return RoundItemAnswerModel;
};
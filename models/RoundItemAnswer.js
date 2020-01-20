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
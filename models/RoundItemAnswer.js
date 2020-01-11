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
    models.Game.includeOptions.push({
      model: RoundItemAnswerModel,
      as: 'Score',
      required: false,
      where: {
        IsCorrect: true
      },
      include: [{
        association: RoundItemAnswerModel.associations.RoundItem,
        attributes: []
      }],
      attributes: ['RoundItemId', 'TeamId', 'UserId', [conn.literal('`Score->RoundItem`.Round'), 'RoundNumber'], [conn.literal('`Score->RoundItem`.`Order`'), 'QuestionNumber'], [conn.literal('`Score->RoundItem`.Points'), 'Points']]
    });
  };

  RoundItemAnswerModel.includeOptions = [];

  return RoundItemAnswerModel;
};
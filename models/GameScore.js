module.exports = (conn, types) => {
  const GameScore = conn.define('GameScore', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    QuestionNumber: {
      type: types.INTEGER
    }
  });

  GameScore.associate = (models) => {
    GameScore.belongsTo(models.RoundItem);
    models.Game.includeOptions.push({
      model: GameScore,
      as: 'Score',
      required: false,
      attributes: ['QuestionNumber', 'RoundItemId', 'UniqueId', [conn.literal('`Score->RoundItem`.`Points`'), 'Points']],
      include: [{
        model: models.RoundItem,
        as: 'RoundItem',
        attributes: [],
        required: false
      }]
    });
  };

  return GameScore;
};
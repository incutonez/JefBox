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
  };

  return GameScore;
};
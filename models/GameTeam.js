module.exports = (conn, types) => {
  const GameTeamModel = conn.define('GameTeam', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  GameTeamModel.associate = (models) => {
    GameTeamModel.belongsTo(models.Team);
    GameTeamModel.belongsTo(models.Game);
    GameTeamModel.belongsToMany(models.User, {
      through: models.GameTeamUser
    });
    GameTeamModel.hasMany(models.GameTeamUser);
  };

  return GameTeamModel;
};
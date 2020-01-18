module.exports = (conn, types) => {
  const GameTeamUserModel = conn.define('GameTeamUser', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    }
  });

  GameTeamUserModel.associate = (models) => {
    GameTeamUserModel.belongsTo(models.GameTeam);
    GameTeamUserModel.belongsTo(models.User);
  };

  return GameTeamUserModel;
};
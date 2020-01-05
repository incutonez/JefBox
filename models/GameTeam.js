module.exports = (conn, types) => {
  const GameTeamModel = conn.define('GameTeam', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    GameId: {
      type: types.INTEGER
    },
    TeamId: {
      type: types.INTEGER
    }
  });

  GameTeamModel.associate = (models) => {
    GameTeamModel.belongsToMany(models.User, {
      as: 'Users',
      through: 'GameTeamUser'
    });
    GameTeamModel.includeOptions.push({
      // We use association instead of model
      association: GameTeamModel.associations.Users,
      through: {
        attributes: []
      }
    });
  };

  GameTeamModel.includeOptions = [];

  return GameTeamModel;
};
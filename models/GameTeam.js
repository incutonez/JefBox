const Sequelize = require('sequelize');
const Op = Sequelize.Op;
module.exports = (conn, types) => {
  const GameTeamModel = conn.define('GameTeam', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true
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
      on: {
        '$Teams.GameTeam.Id$': {
          [Op.eq]: conn.col('Teams.Users.GameTeamUser.GameTeamId')
        }
      },
      through: {
        attributes: []
      }
    });
  };

  GameTeamModel.includeOptions = [];

  return GameTeamModel;
};
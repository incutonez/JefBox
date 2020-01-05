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
    Room: {
      type: types.STRING
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
      as: 'Teams',
      through: models.GameTeam
    });

    GameModel.belongsToMany(models.User, {
      as: 'Users',
      through: 'GamesUsers'
    });

    GameModel.hasMany(models.RoundItem, {
      as: 'RoundItems',
      foreignKey: 'GameId'
    });

    // I add this in here because we need the GameTeamModel association to exist in order to use it below
    GameModel.includeOptions.push({
      model: models.Team,
      as: 'Teams',
      include: models.GameTeam.includeOptions,
      through: {
        attributes: []
      }
    });

    GameModel.includeOptions.push({
      model: models.RoundItem,
      as: 'RoundItems',
      include: models.RoundItem.includeOptions
    });

    GameModel.updateInclude.push({
      model: models.RoundItem,
      as: 'RoundItems',
      include: models.RoundItem.updateInclude
    });
  };

  GameModel.includeOptions = [];
  GameModel.updateInclude = [];
  GameModel.updateEvent = 'updatedGames';

  return GameModel;
};

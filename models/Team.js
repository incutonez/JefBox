module.exports = (conn, types) => {
  const TeamModel = conn.define('Team', {
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
    Color: {
      type: types.STRING
    }
  }, {
    timestamps: true,
    paranoid: true,
    createdAt: 'CreateDate',
    updatedAt: 'UpdateDate',
    deletedAt: 'DeleteDate'
  });

  TeamModel.associate = (models) => {
    TeamModel.belongsToMany(models.Game, {
      as: 'Games',
      through: models.GameTeam,
      foreignKey: 'TeamId'
    });

    TeamModel.hasMany(models.RoundItemAnswer, {
      as: 'Answers',
      foreignKey: 'UniqueId'
    });

    TeamModel.includeOptions.push({
      model: models.Game,
      as: 'Games',
      through: {
        attributes: []
      }
    });
  };

  TeamModel.includeOptions = [];
  TeamModel.updateEvent = 'updatedTeams';

  return TeamModel;
};

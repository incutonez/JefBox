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
      type: types.STRING,
      // Generate a random color
      defaultValue: '#' + (Math.random() * 0xFFFFFF << 0).toString(16)
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
      through: models.GameTeam
    });
    TeamModel.hasMany(models.GameTeam);

    TeamModel.hasMany(models.RoundItemAnswer, {
      as: 'Answers',
      foreignKey: 'TeamId'
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

module.exports = (conn, types) => {
  const RoundItemModel = conn.define('RoundItem', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      set(id) {
        this.setDataValue('Id', id < 0 ? null : id);
      }
    },
    Type: {
      type: types.INTEGER,
      allowNull: false
    },
    Round: {
      type: types.INTEGER
    },
    Order: {
      type: types.INTEGER
    },
    Points: {
      type: types.DECIMAL
    },
    Question: {
      type: types.STRING,
      allowNull: false
    },
    Answer: {
      type: types.STRING
    },
    Url: {
      type: types.STRING
    }
  });

  RoundItemModel.associate = (models) => {
    RoundItemModel.belongsToMany(models.Team, {
      as: 'Winners',
      through: 'RoundItemWinners'
    });

    RoundItemModel.hasMany(models.RoundItemChoice, {
      as: 'Choices',
      foreignKey: 'RoundItemId',
      onDelete: 'cascade'
    });

    RoundItemModel.belongsTo(models.Upload, {
      foreignKey: 'UploadId'
    });

    RoundItemModel.updateInclude.push({
      model: models.RoundItemChoice,
      as: 'Choices'
    });

    RoundItemModel.includeOptions.push({
      model: models.RoundItemChoice,
      as: 'Choices'
    });
  };

  RoundItemModel.updateInclude = [];
  RoundItemModel.includeOptions = [];

  return RoundItemModel;
};
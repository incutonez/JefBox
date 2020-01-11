const Sequelize = require('sequelize');
const Op = Sequelize.Op;
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
    RoundName: {
      type: types.STRING
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
    },
    AnswerDate: {
      type: types.DATE
    }
  });

  RoundItemModel.associate = (models) => {
    RoundItemModel.hasMany(models.RoundItemChoice, {
      as: 'Choices',
      foreignKey: 'RoundItemId',
      onDelete: 'cascade'
    });

    RoundItemModel.belongsTo(models.Upload, {
      foreignKey: 'UploadId'
    });

    RoundItemModel.hasMany(models.RoundItemAnswer, {
      as: 'Answers',
      foreignKey: 'RoundItemId'
    });

    RoundItemModel.updateInclude.push({
      model: models.RoundItemChoice,
      as: 'Choices'
    });

    RoundItemModel.includeOptions.push({
      model: models.RoundItemChoice,
      as: 'Choices'
    }, {
      association: RoundItemModel.associations.Answers,
      attributes: ['Id', 'Answer', 'ChoiceId', 'RoundItemId', 'UploadId', 'UniqueId', 'IsCorrect', [conn.literal('`RoundItems->Answers->RoundItemChoice`.Value'), 'ChoiceDisplay']],
      include: [{
        model: models.RoundItemChoice,
        attributes: []
      }]
    });
  };

  RoundItemModel.updateInclude = [];
  RoundItemModel.includeOptions = [];

  return RoundItemModel;
};
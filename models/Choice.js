module.exports = (conn, types) => {
  const RoundItemChoiceModel = conn.define('RoundItemChoice', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      set(id) {
        this.setDataValue('Id', id < 0 ? null : id);
      }
    },
    Value: {
      type: types.STRING,
      allowNull: false
    },
    Order: {
      type: types.INTEGER,
      allowNull: false
    }
  });

  RoundItemChoiceModel.includeOptions = [];

  return RoundItemChoiceModel;
};
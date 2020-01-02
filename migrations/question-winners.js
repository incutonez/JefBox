module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('RoundItemWinners', {
      RoundItemId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'RoundItem',
          key: 'Id'
        }
      },
      TeamId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Team',
          key: 'Id'
        }
      }
    });
  }, down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('RoundItemWinners');
  }
};
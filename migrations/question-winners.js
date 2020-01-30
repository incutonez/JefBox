module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('RoundItems', {
      TimeLimit: {
        type: Sequelize.INTEGER
      }
    });
  }, down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('RoundItems');
  }
};
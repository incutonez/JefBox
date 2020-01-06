module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('RoundItems', 'AnsweredDate', {transaction});
      await queryInterface.addColumn(
      'RoundItems',
      'AnswerDate', {
        type: Sequelize.DATE
      }, {
        transaction
      });
      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('Questions', 'Round', {transaction});
      await transaction.commit();
    }
    catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};
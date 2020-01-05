module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      Id: 1,
      UserName: 'jef',
      IsActive: 1,
      AccessLevel: 1,
      Password: '59b7a3f449d877334f2b305d4dfd483d36cde9cf208e9946e216c6f121b8ca2a',
      Salt: 'zOvAITdvSwhJ5QiKJSZ1qg==',
      CreateDate: new Date(),
      UpdateDate: new Date()
    }], {});
    queryInterface.bulkInsert('Teams', [{
      Id: 1,
      Name: 'Team 1',
      Color: '#ff8040',
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }], {});
    return queryInterface.bulkInsert('Games', [{
      Name: 'Test Game',
      Room: 121,
      Type: 1,
      Status: 1,
      AllowTeams: true,
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
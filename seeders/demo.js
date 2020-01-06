module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      Id: 1,
      UserName: 'User 1',
      IsActive: 1,
      AccessLevel: 1,
      Password: '59b7a3f449d877334f2b305d4dfd483d36cde9cf208e9946e216c6f121b8ca2a',
      Salt: 'zOvAITdvSwhJ5QiKJSZ1qg==',
      CreateDate: new Date(),
      UpdateDate: new Date()
    }, {
      Id: 2,
      UserName: 'User 2',
      IsActive: 1,
      AccessLevel: 1,
      Password: '59b7a3f449d877334f2b305d4dfd483d36cde9cf208e9946e216c6f121b8ca2a',
      Salt: 'zOvAITdvSwhJ5QiKJSZ1qg==',
      CreateDate: new Date(),
      UpdateDate: new Date()
    }, {
      Id: 3,
      UserName: 'User 3',
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
    }, {
      Id: 2,
      Name: 'Team 2',
      Color: '#ff8040',
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }, {
      Id: 3,
      Name: 'Team 3',
      Color: '#ff8040',
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }], {});
    queryInterface.bulkInsert('Games', [{
      Id: 1,
      Name: 'NO TEAMS',
      Room: 1,
      Type: 1,
      Status: 1,
      AllowTeams: false,
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }, {
      Id: 2,
      Name: 'TEAMS',
      Room: 2,
      Type: 1,
      Status: 1,
      AllowTeams: true,
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }, {
      Id: 3,
      Name: 'TEAMS 2',
      Room: 2,
      Type: 1,
      Status: 1,
      AllowTeams: true,
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }], {});
    queryInterface.bulkInsert('GameTeams', [{
      Id: 1,
      GameId: 2,
      TeamId: 3
    }, {
      Id: 2,
      GameId: 2,
      TeamId: 1
    }, {
      Id: 3,
      GameId: 3,
      TeamId: 1
    }, {
      Id: 4,
      GameId: 3,
      TeamId: 3
    }], {});
    return queryInterface.bulkInsert('GameTeamUser', [{
      GameTeamId: 1,
      UserId: 1
    }, {
      GameTeamId: 1,
      UserId: 2
    }, {
      GameTeamId: 2,
      UserId: 3
    }, {
      GameTeamId: 3,
      UserId: 1
    }, {
      GameTeamId: 3,
      UserId: 2
    }, {
      GameTeamId: 4,
      UserId: 3
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
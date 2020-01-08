module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert('Users', [{
      UserName: 'User 1',
      IsActive: 0,
      AccessLevel: 1,
      Password: '59b7a3f449d877334f2b305d4dfd483d36cde9cf208e9946e216c6f121b8ca2a',
      Salt: 'zOvAITdvSwhJ5QiKJSZ1qg==',
      CreateDate: new Date(),
      UpdateDate: new Date()
    }, {
      UserName: 'User 2',
      IsActive: 0,
      AccessLevel: 1,
      Password: '59b7a3f449d877334f2b305d4dfd483d36cde9cf208e9946e216c6f121b8ca2a',
      Salt: 'zOvAITdvSwhJ5QiKJSZ1qg==',
      CreateDate: new Date(),
      UpdateDate: new Date()
    }, {
      UserName: 'User 3',
      IsActive: 0,
      AccessLevel: 1,
      Password: '59b7a3f449d877334f2b305d4dfd483d36cde9cf208e9946e216c6f121b8ca2a',
      Salt: 'zOvAITdvSwhJ5QiKJSZ1qg==',
      CreateDate: new Date(),
      UpdateDate: new Date()
    }, {
      UserName: 'jef',
      IsActive: 0,
      AccessLevel: 3,
      Password: '524902fb2c23d3c943f910f7fb4e4b1964a5023ab9185dc1a7242e3fff627693',
      Salt: '3uSp7NU4RlbfSTLSd1jRFg==',
      CreateDate: new Date(),
      UpdateDate: new Date()
    }], {});
    queryInterface.bulkInsert('Teams', [{
      Name: 'Team 1',
      Color: '#ff8040',
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }, {
      Name: 'Team 2',
      Color: '#ff8040',
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }, {
      Name: 'Team 3',
      Color: '#ff8040',
      CreateDate: new Date(),
      UpdateDate: new Date(),
      UpdatedById: 1,
      OwnerId: 1
    }], {});
    queryInterface.bulkInsert('Games', [{
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
      GameId: 2,
      TeamId: 3
    }, {
      GameId: 2,
      TeamId: 1
    }, {
      GameId: 3,
      TeamId: 1
    }, {
      GameId: 3,
      TeamId: 3
    }], {});
    queryInterface.bulkInsert('GameTeamUser', [{
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
    queryInterface.bulkInsert('RoundItems', [{
      Type: 1,
      Round: 1,
      Order: 1,
      Points: 12,
      Question: 'This is a text question?',
      Answer: 'Yes',
      GameId: 3
    }, {
      Type: 2,
      Round: 1,
      Order: 2,
      Points: -10,
      Question: 'This is a multiple choice question?',
      Answer: 'Yes',
      GameId: 3
    }, {
      Type: 3,
      Round: 1,
      Order: 3,
      Points: 122,
      Question: 'Who is this band?',
      Answer: 'Incubus',
      Url: 'https://www.youtube.com/watch?v=fgT9zGkiLig',
      GameId: 3
    }, {
      Type: 4,
      Round: 2,
      Order: 1,
      Points: 12222,
      Question: 'What is this a picture of?',
      Answer: 'Some dude',
      GameId: 3
    }, {
      Type: 4,
      Round: 2,
      Order: 2,
      Points: 4,
      Question: 'What is this?',
      Answer: 'Tumbleweed',
      Url: 'https://knpr.org/sites/default/files/public/styles/detail_small/public/images/story/a5tumbleweed.jpg?itok=bMd6sqn-',
      GameId: 3
    }, {
      Type: 5,
      Round: 2,
      Order: 3,
      Points: 122222,
      Question: 'Who is in this video?',
      Answer: 'JJ',
      Url: 'https://www.youtube.com/watch?v=seZMOTGCDag',
      GameId: 3
    }, {
      Type: 6,
      Round: 2,
      Order: 4,
      Points: 12,
      Question: 'Draw me Mulder',
      Answer: 'no',
      GameId: 3
    }], {});
    return queryInterface.bulkInsert('RoundItemAnswers', [{
      RoundItemId: 1,
      UniqueId: 2,
      Answer: 'This is like so much fun zomg'
    }, {
      RoundItemId: 1,
      UniqueId: 1,
      Answer: 'FUCK IT, WE\'LL DO IT LIVE'
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
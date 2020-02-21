module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RoundItemChoices', {}, {
      truncate: true,
      restartIdentity: true
    });
    await queryInterface.bulkDelete('RoundItems', {}, {
      truncate: true,
      restartIdentity: true
    });
    await queryInterface.bulkDelete('Games', {}, {
      truncate: true,
      restartIdentity: true
    });
    await queryInterface.bulkDelete('Users', {}, {
      truncate: true,
      restartIdentity: true
    });
    await queryInterface.bulkInsert('Users', [{
      Id: 1,
      UserName: 'jef',
      IsActive: 0,
      AccessLevel: 3,
      Password: '524902fb2c23d3c943f910f7fb4e4b1964a5023ab9185dc1a7242e3fff627693',
      Salt: '3uSp7NU4RlbfSTLSd1jRFg==',
      CreateDate: new Date(),
      UpdateDate: new Date()
    }], {});
    await queryInterface.bulkInsert('Games', [
      {
        'Id': 1,
        'Name': 'Test',
        'Type': 1,
        'Status': 1,
        'AllowTeams': 1,
        'WinnerId': 1,
        'CreateDate': '2020-02-20 23:27:25.115 +00:00',
        'UpdateDate': '2020-02-21 01:38:57.268 +00:00',
        'UpdatedById': 1,
        'OwnerId': 1
      }
    ], {});
    await queryInterface.bulkInsert('RoundItems', [
      {
        'Id': 2,
        'Type': 1,
        'Round': 'One',
        'TimeLimit': 120,
        'RoundIndex': 0,
        'Order': 1,
        'Points': 1,
        'Question': 'Text Question?',
        'Answer': 'Yes',
        'IsMultipleChoice': 0,
        'Url': '',
        'AnswerDate': '2020-02-21 00:48:40.412 +00:00',
        'GameId': 1
      },
      {
        'Id': 3,
        'Type': 1,
        'Round': 'One',
        'TimeLimit': 2,
        'RoundIndex': 0,
        'Order': 2,
        'Points': 2,
        'Question': 'Multiple Choice?',
        'Answer': '',
        'IsMultipleChoice': 1,
        'Url': '',
        'AnswerDate': '2020-02-21 00:48:45.342 +00:00',
        'GameId': 1
      },
      {
        'Id': 4,
        'Type': 2,
        'Round': 'One',
        'TimeLimit': 120,
        'RoundIndex': 0,
        'Order': 3,
        'Points': 3,
        'Question': 'Audio Question?',
        'Answer': 'Yes',
        'IsMultipleChoice': 0,
        'Url': 'https://www.youtube.com/watch?v=WTuAMlR3WuM&start=45&end=50',
        'GameId': 1
      },
      {
        'Id': 5,
        'Type': 3,
        'Round': 'One',
        'TimeLimit': 120,
        'RoundIndex': 0,
        'Order': 4,
        'Points': 4,
        'Question': 'Attached Image?',
        'Answer': 'Yes',
        'IsMultipleChoice': 0,
        'Url': '',
        'GameId': 1
      },
      {
        'Id': 6,
        'Type': 3,
        'Round': 'One',
        'TimeLimit': 120,
        'RoundIndex': 0,
        'Order': 5,
        'Points': 5,
        'Question': 'Regular Image?',
        'Answer': 'Yes',
        'IsMultipleChoice': 0,
        'Url': 'https://cdn5.vectorstock.com/i/1000x1000/02/74/zen-tangle-of-gesture-of-blah-blah-blah-vector-24000274.jpg',
        'GameId': 1
      },
      {
        'Id': 7,
        'Type': 4,
        'Round': 'Two',
        'TimeLimit': 120,
        'RoundIndex': 1,
        'Order': 1,
        'Points': 1,
        'Question': 'Video?',
        'Answer': 'Yes',
        'IsMultipleChoice': 0,
        'Url': 'https://www.youtube.com/watch?v=Tmr5mGf1OQI&start=40&end=50',
        'GameId': 1
      },
      {
        'Id': 8,
        'Type': 5,
        'Round': 'Two',
        'TimeLimit': 2,
        'RoundIndex': 1,
        'Order': 2,
        'Points': 2,
        'Question': 'Drawing?',
        'Answer': '',
        'IsMultipleChoice': 0,
        'Url': '',
        'GameId': 1
      }
    ], {});
    await queryInterface.bulkInsert('RoundItemChoices', [
      {
        'Id': 1,
        'Value': 'asdf',
        'Order': 1,
        'IsAnswer': 0,
        'RoundItemId': 3
      },
      {
        'Id': 2,
        'Value': 'eeee',
        'Order': 2,
        'IsAnswer': 1,
        'RoundItemId': 3
      },
      {
        'Id': 3,
        'Value': 'eeadfasd',
        'Order': 3,
        'IsAnswer': 1,
        'RoundItemId': 3
      },
      {
        'Id': 4,
        'Value': 'rrarar',
        'Order': 4,
        'IsAnswer': 0,
        'RoundItemId': 3
      }
    ], {});
    return Promise.resolve();
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
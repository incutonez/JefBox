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
        'Name': 'Jef\'s Amazing Game',
        'Type': 1,
        'Status': 0,
        'AllowTeams': 1,
        'CreateDate': '2020-01-25 23:09:32.890 +00:00',
        'UpdateDate': '2020-01-25 23:09:32.890 +00:00',
        'UpdatedById': 1,
        'OwnerId': 1
      }
    ], {});
    await queryInterface.bulkInsert('RoundItems', [
      {
        'Id': 1,
        'Type': 1,
        'Round': 'Bad Jokes',
        'RoundIndex': 0,
        'Order': 1,
        'Points': 50,
        'Question': 'What state has the most pirates?',
        'Answer': 'Arrrrrrrkansas',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 2,
        'Type': 1,
        'Round': 'Bad Jokes',
        'RoundIndex': 0,
        'Order': 2,
        'Points': 100,
        'Question': 'What do you call a burger without a savings plan?',
        'Answer': 'Roth-less Burger (Roethlisberger)',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 3,
        'Type': 1,
        'Round': 'Bad Jokes',
        'RoundIndex': 0,
        'Order': 3,
        'Points': 100,
        'Question': 'Who\'s the only black Nascar driver?',
        'Answer': 'Dale Earnhardt (when his car was on fire)',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 4,
        'Type': 1,
        'Round': 'Bad Jokes',
        'RoundIndex': 0,
        'Order': 4,
        'Points': 25,
        'Question': 'What do you give to a sick lemon?',
        'Answer': 'Lemon Aid',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 5,
        'Type': 1,
        'Round': 'Bad Jokes',
        'RoundIndex': 0,
        'Order': 5,
        'Points': 25,
        'Question': 'Why did the can crusher quit his job?',
        'Answer': 'Because it was soda pressing!',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 6,
        'Type': 1,
        'Round': 'Bad Jokes',
        'RoundIndex': 0,
        'Order': 6,
        'Points': 25,
        'Question': 'Why do fish live in salt water?',
        'Answer': 'Because pepper makes them sneeze!',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 7,
        'Type': 1,
        'Round': 'Famous Deaths',
        'RoundIndex': 1,
        'Order': 1,
        'Points': 25,
        'Question': 'What year did Kurt Cobain die?',
        'Answer': '',
        'IsMultipleChoice': 1,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 8,
        'Type': 1,
        'Round': 'Famous Deaths',
        'RoundIndex': 1,
        'Order': 2,
        'Points': 25,
        'Question': 'What year did Hitler die?',
        'Answer': '',
        'IsMultipleChoice': 1,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 9,
        'Type': 1,
        'Round': 'Famous Deaths',
        'RoundIndex': 1,
        'Order': 3,
        'Points': 50,
        'Question': 'How did Elvis die?',
        'Answer': 'Heart attack',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 10,
        'Type': 1,
        'Round': 'Famous Births',
        'RoundIndex': 2,
        'Order': 1,
        'Points': 25,
        'Question': 'Who was born as an old-man baby?',
        'Answer': 'Benjamin Button',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 11,
        'Type': 1,
        'Round': 'Music That Alan Listens To',
        'RoundIndex': 3,
        'Order': 1,
        'Points': -25,
        'Question': 'Alan\'s favorite band that includes Cedric?',
        'Answer': 'The Mars Volta',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 12,
        'Type': 1,
        'Round': 'Music That Alan Listens To',
        'RoundIndex': 3,
        'Order': 2,
        'Points': 50,
        'Question': 'Alan drops acid and listens to this band on the reg.',
        'Answer': 'Tool',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 13,
        'Type': 1,
        'Round': 'Music That Alan Listens To',
        'RoundIndex': 3,
        'Order': 3,
        'Points': 100,
        'Question': 'In 2007, who created a cover of Imagine for a John Lennon compilation album?',
        'Answer': 'Jack Johnson',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 14,
        'Type': 1,
        'Round': 'Math',
        'RoundIndex': 4,
        'Order': 1,
        'Points': 12,
        'Question': 'How many inches in a mile?',
        'Answer': '5280 * 12 = 63360',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 15,
        'Type': 3,
        'Round': 'Math',
        'RoundIndex': 4,
        'Order': 2,
        'Points': 100,
        'Question': 'What famous theorem is depicted here?',
        'Answer': 'Pythagorean Theorem',
        'IsMultipleChoice': 0,
        'Url': 'https://calcworkshop.com/wp-content/uploads/pythagorean-theorem-formula.png',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 16,
        'Type': 1,
        'Round': 'Math',
        'RoundIndex': 4,
        'Order': 3,
        'Points': 100,
        'Question': 'Who came up with the idea of Calculus?',
        'Answer': 'Newton andor Leibniz',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 17,
        'Type': 1,
        'Round': 'Math',
        'RoundIndex': 4,
        'Order': 4,
        'Points': 100,
        'Question': 'Compute: 12 + (3 * 6) - 4 / 4 * 4 + 1',
        'Answer': 27,
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 18,
        'Type': 1,
        'Round': 'Math',
        'RoundIndex': 4,
        'Order': 5,
        'Points': 100,
        'Question': 'In geometry, Jef learned an important lesson... what was it?',
        'Answer': '',
        'IsMultipleChoice': 1,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 19,
        'Type': 1,
        'Round': 'General Knowledge',
        'RoundIndex': 5,
        'Order': 1,
        'Points': 50,
        'Question': 'What does DNA stand for?',
        'Answer': 'Deoxyribonucleic acid',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 20,
        'Type': 1,
        'Round': 'General Knowledge',
        'RoundIndex': 5,
        'Order': 2,
        'Points': 100,
        'Question': 'What are the 4 nucleotides of DNA?',
        'Answer': 'Thymine, Cytosine, Adenine, and Guanine',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 21,
        'Type': 1,
        'Round': 'General Knowledge',
        'RoundIndex': 5,
        'Order': 3,
        'Points': 100,
        'Question': 'Who does Jef look up to?',
        'Answer': 'Jack Johnson',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 22,
        'Type': 3,
        'Round': 'General Knowledge',
        'RoundIndex': 5,
        'Order': 4,
        'Points': 150,
        'Question': 'Who is this?',
        'Answer': '',
        'IsMultipleChoice': 1,
        'Url': 'http://www.cse.psu.edu/~b58/Barlow-Jesse-Small.jpg',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 23,
        'Type': 5,
        'Round': 'Bonus!!',
        'RoundIndex': 6,
        'Order': 3,
        'Points': 100,
        'Question': 'Draw me an incredibly realistic penis.',
        'Answer': 'Okay',
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 24,
        'Type': 1,
        'Round': 'Bonus!!',
        'RoundIndex': 6,
        'Order': 1,
        'Points': 100,
        'Question': 'Where did Jef grow up?',
        'Answer': '',
        'IsMultipleChoice': 1,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      },
      {
        'Id': 25,
        'Type': 1,
        'Round': 'Bonus!!',
        'RoundIndex': 6,
        'Order': 2,
        'Points': 31,
        'Question': 'How old is Jef?',
        'Answer': 31,
        'IsMultipleChoice': 0,
        'Url': '',
        AnswerDate: null,
        'GameId': 1,
        UploadId: null,
        TimeLimit: 2
      }
    ], {});
    await queryInterface.bulkInsert('RoundItemChoices', [
      {
        'Id': 1,
        'Value': 1993,
        'Order': 1,
        'IsAnswer': 0,
        'RoundItemId': 7
      },
      {
        'Id': 2,
        'Value': 1994,
        'Order': 2,
        'IsAnswer': 1,
        'RoundItemId': 7
      },
      {
        'Id': 3,
        'Value': 1995,
        'Order': 3,
        'IsAnswer': 0,
        'RoundItemId': 7
      },
      {
        'Id': 4,
        'Value': 1996,
        'Order': 4,
        'IsAnswer': 0,
        'RoundItemId': 7
      },
      {
        'Id': 5,
        'Value': 1944,
        'Order': 1,
        'IsAnswer': 0,
        'RoundItemId': 8
      },
      {
        'Id': 6,
        'Value': 1945,
        'Order': 2,
        'IsAnswer': 1,
        'RoundItemId': 8
      },
      {
        'Id': 7,
        'Value': 1946,
        'Order': 3,
        'IsAnswer': 0,
        'RoundItemId': 8
      },
      {
        'Id': 8,
        'Value': 'He\'s still alive',
        'Order': 4,
        'IsAnswer': 0,
        'RoundItemId': 8
      },
      {
        'Id': 9,
        'Value': 'That guy fucking sucks, why do I care?',
        'Order': 5,
        'IsAnswer': 1,
        'RoundItemId': 8
      },
      {
        'Id': 10,
        'Value': 'That he\'s a moron.',
        'Order': 1,
        'IsAnswer': 0,
        'RoundItemId': 18
      },
      {
        'Id': 11,
        'Value': 'That math is hard.',
        'Order': 2,
        'IsAnswer': 1,
        'RoundItemId': 18
      },
      {
        'Id': 12,
        'Value': 'That lines can just fucking go on forever, man.',
        'Order': 3,
        'IsAnswer': 1,
        'RoundItemId': 18
      },
      {
        'Id': 13,
        'Value': 'The transitive party.',
        'Order': 4,
        'IsAnswer': 1,
        'RoundItemId': 18
      },
      {
        'Id': 14,
        'Value': 'All of the above.',
        'Order': 5,
        'IsAnswer': 0,
        'RoundItemId': 18
      },
      {
        'Id': 15,
        'Value': 'Some Douche',
        'Order': 1,
        'IsAnswer': 0,
        'RoundItemId': 22
      },
      {
        'Id': 16,
        'Value': 'Jesse Smith',
        'Order': 2,
        'IsAnswer': 0,
        'RoundItemId': 22
      },
      {
        'Id': 17,
        'Value': 'Jesse Barlow',
        'Order': 3,
        'IsAnswer': 1,
        'RoundItemId': 22
      },
      {
        'Id': 18,
        'Value': 'A scary man Jef found on the Internet through Craigslist',
        'Order': 4,
        'IsAnswer': 0,
        'RoundItemId': 22
      },
      {
        'Id': 19,
        'Value': 'Matthew Dunbier',
        'Order': 5,
        'IsAnswer': 0,
        'RoundItemId': 22
      },
      {
        'Id': 20,
        'Value': 'Maryland',
        'Order': 1,
        'IsAnswer': 0,
        'RoundItemId': 24
      },
      {
        'Id': 21,
        'Value': 'Massachusetts',
        'Order': 2,
        'IsAnswer': 0,
        'RoundItemId': 24
      },
      {
        'Id': 22,
        'Value': 'Pennsylvania',
        'Order': 3,
        'IsAnswer': 1,
        'RoundItemId': 24
      },
      {
        'Id': 23,
        'Value': 'Virginia',
        'Order': 4,
        'IsAnswer': 0,
        'RoundItemId': 24
      },
      {
        'Id': 24,
        'Value': 'New Jersey',
        'Order': 5,
        'IsAnswer': 0,
        'RoundItemId': 24
      }
    ], {});
    return Promise.resolve();
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
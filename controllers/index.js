const url = require('url');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
module.exports = (app, io) => {
  app.use(cookieParser());
  app.use(session({
    key: 'auth_token',
    secret: 'jackjohnson1',
    resave: true,
    saveUninitialized: true,
    store: new SQLiteStore({
      db: './database.sqlite'
    }),
    cookie: {
      // Expires in 30 days
      maxAge: 1000 * 60 * 60 * 24 * 30
    }
  }));
  app.use((req, res, next) => {
    // TODO: This should probably check the database for the req.session.user.Id value
    // Only allow login and enums to pass
    // TODO: Should figure out how to not allow the app loading before login has succeeded
    if ([process.env.BASE_API_PATH + '/login', process.env.BASE_API_PATH + '/enums'].indexOf(url.parse(req.url).pathname) === -1 && (!req.cookies.auth_token || !req.session.user)) {
      return res.sendStatus(401);
    }
    next();
  });
  app.use(process.env.BASE_API_PATH, require('./Login'));
  app.use(process.env.BASE_API_PATH, require('./Users')(io));
  app.use(process.env.BASE_API_PATH, require('./Teams')(io));
  app.use(process.env.BASE_API_PATH, require('./Games')(io));
  app.use(process.env.BASE_API_PATH, require('./Upload')(io));
  app.use(process.env.BASE_API_PATH, require('./Enums'));
};
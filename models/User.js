const crypto = require('crypto');
const orm = require('sequelize');
const AccessLevels = require('../enums/AccessLevels');
module.exports = (conn, types) => {
  let UserModel = conn.define('User', {
    Id: {
      type: types.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      set(id) {
        this.setDataValue('Id', id < 0 ? null : id);
      }
    },
    UserName: {
      type: types.STRING,
      allowNull: false
    },
    IsActive: {
      type: types.BOOLEAN,
      defaultValue: 0
    },
    AccessLevel: {
      type: types.INTEGER,
      defaultValue: AccessLevels.STANDARD
    },
    Password: {
      type: types.STRING,
      defaultValue: 'password',
      /* We use get() to tell Sequelize to treat this column as a function instead of variables, preventing them from
       * showing up on queries like findAll() or findById(1) */
      get() {
        return () => this.getDataValue('Password');
      }
    },
    Salt: {
      type: types.STRING,
      /* We use get() to tell Sequelize to treat this column as a function instead of variables, preventing them from
       * showing up on queries like findAll() or findById(1) */
      get() {
        return () => this.getDataValue('Salt');
      }
    },
    IsAdmin: {
      type: new types.VIRTUAL(types.BOOLEAN, ['AccessLevel']),
      get() {
        const accessLevel = this.getDataValue('AccessLevel');
        return accessLevel === AccessLevels.ADMIN || accessLevel === AccessLevels.SUPER;
      }
    }
  }, {
    timestamps: true,
    paranoid: true,
    createdAt: 'CreateDate',
    updatedAt: 'UpdateDate',
    deletedAt: 'DeleteDate',
    hooks: {
      beforeCreate: (user) => {
        user.setSaltAndPassword();
      },
      beforeUpdate: (user) => {
        user.setSaltAndPassword();
      }
    }
  });

  // Class methods
  UserModel.getUserNameFind = (userName) => {
    return orm.where(orm.fn('lower', orm.col('UserName')), orm.fn('lower', userName));
  };

  UserModel.updateUser = async function(userData) {
    return this.update(userData, {
      where: {
        Id: userData.Id
      }
    });
  };

  // In Sequelize, when using find and wanting to return soft-deleted items, paranoid must be set to false
  UserModel.excludeDeleted = async (userId) => {
    const record = await UserModel.findByPk(userId);
    return !record || !record.IsAdmin;
  };

  UserModel.associate = (models) => {
    UserModel.hasOne(models.User, {
      foreignKey: 'UpdatedById'
    });
    UserModel.hasOne(models.Team, {
      foreignKey: 'UpdatedById'
    });
    UserModel.hasOne(models.Team, {
      foreignKey: 'OwnerId'
    });
    UserModel.hasOne(models.Game, {
      foreignKey: 'UpdatedById'
    });
    UserModel.hasOne(models.Game, {
      foreignKey: 'OwnerId'
    });
    UserModel.hasOne(models.Upload, {
      foreignKey: 'OwnerId'
    });
    UserModel.belongsToMany(models.Team, {
      as: 'Teams',
      through: 'TeamUsers'
    });
    // TODOJEF: Issue here when a user is inactive, and they're on a Team... they don't get removed from the join table,
    // and so they show up in the list, but as null
    UserModel.includeOptions.push({
      model: models.Team,
      as: 'Teams',
      through: {
        attributes: []
      }
    });
  };

  UserModel.includeOptions = [];
  UserModel.updateEvent = 'updatedUsers';

  // Instance methods
  UserModel.prototype.encryptPassword = function(password) {
    return crypto.createHash('RSA-SHA256').update(password).update(this.Salt()).digest('hex');
  };

  UserModel.prototype.setSaltAndPassword = function() {
    if (this.changed('Password')) {
      this.Salt = crypto.randomBytes(16).toString('base64');
      this.Password = this.encryptPassword(this.Password());
    }
  };

  UserModel.prototype.isPassword = function(password) {
    return this.encryptPassword(password) === this.Password();
  };

  return UserModel;
};

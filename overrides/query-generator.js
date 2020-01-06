// include the module whose functions are to be overridden
let QueryGenerator = require('sequelize/lib/dialects/abstract/query-generator');

// delete the function you would like to override
delete QueryGenerator.prototype.generateThroughJoin;

// add new functional with the same name as deleted function
QueryGenerator.prototype.generateThroughJoin = function(include, includeAs, parentTableName, topLevelInfo) {
  const through = include.through;
  const throughTable = through.model.getTableName();
  const throughAs = `${includeAs.internalAs}->${through.as}`;
  const externalThroughAs = `${includeAs.externalAs}.${through.as}`;
  const throughAttributes = through.attributes.map(attr => {
    let alias = `${externalThroughAs}.${Array.isArray(attr) ? attr[1] : attr}`;

    if (this.options.minifyAliases) {
      alias = this._getMinifiedAlias(alias, throughAs, topLevelInfo.options);
    }

    return `${this.quoteIdentifier(throughAs)}.${this.quoteIdentifier(Array.isArray(attr) ? attr[0] : attr)
    } AS ${
    this.quoteIdentifier(alias)}`;
  });
  const association = include.association;
  const parentIsTop = !include.parent.association && include.parent.model.name === topLevelInfo.options.model.name;
  const tableSource = parentTableName;
  const identSource = association.identifierField;
  const tableTarget = includeAs.internalAs;
  const identTarget = association.foreignIdentifierField;
  const attrTarget = association.targetKeyField;

  const joinType = include.required ? 'INNER JOIN' : include.right && this._dialect.supports['RIGHT JOIN'] ? 'RIGHT OUTER JOIN' : 'LEFT OUTER JOIN';
  let joinBody;
  let joinCondition;
  const attributes = {
    main: [],
    subQuery: []
  };
  let attrSource = association.sourceKey;
  let sourceJoinOn;
  let targetJoinOn;
  let throughWhere;
  let targetWhere;

  if (topLevelInfo.options.includeIgnoreAttributes !== false) {
    // Through includes are always hasMany, so we need to add the attributes to the mainAttributes no matter what (Real join will never be executed in subquery)
    for (const attr of throughAttributes) {
      attributes.main.push(attr);
    }
  }

  // Figure out if we need to use field or attribute
  if (!topLevelInfo.subQuery) {
    attrSource = association.sourceKeyField;
  }
  if (topLevelInfo.subQuery && !include.subQuery && !include.parent.subQuery && include.parent.model !== topLevelInfo.options.mainModel) {
    attrSource = association.sourceKeyField;
  }

  // Filter statement for left side of through
  // Used by both join and subquery where
  // If parent include was in a subquery need to join on the aliased attribute
  if (topLevelInfo.subQuery && !include.subQuery && include.parent.subQuery && !parentIsTop) {
    // If we are minifying aliases and our JOIN target has been minified, we need to use the alias instead of the original column name
    const joinSource = this._getAliasForField(tableSource, `${tableSource}.${attrSource}`, topLevelInfo.options) || `${tableSource}.${attrSource}`;

    sourceJoinOn = `${this.quoteIdentifier(joinSource)} = `;
  }
  else {
    // If we are minifying aliases and our JOIN target has been minified, we need to use the alias instead of the original column name
    const aliasedSource = this._getAliasForField(tableSource, attrSource, topLevelInfo.options) || attrSource;

    /**
     * @patch https://github.com/sequelize/sequelize/issues/11796
     */
    if (include.on) {
      sourceJoinOn = this.whereItemsQuery(include.on, {
        prefix: this.sequelize.literal(this.quoteIdentifier(throughAs)),
        model: include.model
      });
    }
    else {
      sourceJoinOn = `${this.quoteIdentifier(tableSource)}.${this.quoteIdentifier(aliasedSource)} = `;
    }
  }
  if (!include.on) {
    sourceJoinOn += `${this.quoteIdentifier(throughAs)}.${this.quoteIdentifier(identSource)}`;
  }

  // Filter statement for right side of through
  // Used by both join and subquery where
  targetJoinOn = `${this.quoteIdentifier(tableTarget)}.${this.quoteIdentifier(attrTarget)} = `;
  targetJoinOn += `${this.quoteIdentifier(throughAs)}.${this.quoteIdentifier(identTarget)}`;

  if (through.where) {
    throughWhere = this.getWhereConditions(through.where, this.sequelize.literal(this.quoteIdentifier(throughAs)), through.model);
  }

  if (this._dialect.supports.joinTableDependent) {
    // Generate a wrapped join so that the through table join can be dependent on the target join
    joinBody = `( ${this.quoteTable(throughTable, throughAs)} INNER JOIN ${this.quoteTable(include.model.getTableName(), includeAs.internalAs)} ON ${targetJoinOn}`;
    if (throughWhere) {
      joinBody += ` AND ${throughWhere}`;
    }
    joinBody += ')';
    joinCondition = sourceJoinOn;
  }
  else {
    // Generate join SQL for left side of through
    joinBody = `${this.quoteTable(throughTable, throughAs)} ON ${sourceJoinOn} ${joinType} ${this.quoteTable(include.model.getTableName(), includeAs.internalAs)}`;
    joinCondition = targetJoinOn;
    if (throughWhere) {
      joinCondition += ` AND ${throughWhere}`;
    }
  }

  if (include.where || include.through.where) {
    if (include.where) {
      targetWhere = this.getWhereConditions(include.where, this.sequelize.literal(this.quoteIdentifier(includeAs.internalAs)), include.model, topLevelInfo.options);
      if (targetWhere) {
        joinCondition += ` AND ${targetWhere}`;
      }
    }
  }

  this._generateSubQueryFilter(include, includeAs, topLevelInfo);

  return {
    join: joinType,
    body: joinBody,
    condition: joinCondition,
    attributes
  };
};

// re-export the module for changes to take effect
module.exports = QueryGenerator;
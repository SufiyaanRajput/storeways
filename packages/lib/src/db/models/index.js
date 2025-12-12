'use strict';

import Sequelize from 'sequelize';

const db = {};

export const loadModels = async ({ dbConnectionUrl, domains }) => {
  try{
    const sequelize = new Sequelize(dbConnectionUrl, {
      pool: {
        max: 3,
        min: 0,
        idle: 5000
      },
    });

    console.log('domains ======>', domains);

    for (const fn of domains) {
      const models = await import(`${__dirname}/../../domain/${fn}/models/index.js`);

      for (const model of Object.values(models)) {
        if (typeof model === 'function') {
          const definedModel = await model(sequelize, Sequelize.DataTypes);
          db[definedModel.name] = definedModel;
        }
      }
    }
  
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
  }catch(error){
    throw error;
  }
}

export const getDatabase = () => {
  return db;
}

export default loadModels;
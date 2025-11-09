import { Umzug, SequelizeStorage } from 'umzug'
import database from '../src/models';
import logger from '../src/loaders/logger';

try{
  const { sequelize } = database;

  const umzug = new Umzug({
    migrations: { glob: 'migrations/!(*index).js' },
    context: sequelize.getQueryInterface(),
    storage: new SequelizeStorage({ sequelize }),
  });

  (async () => {
    // Checks migrations and run them if they are not already applied. To keep
    // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
    // will be automatically created (if it doesn't exist already) and parsed.
  
    const pendingMigrations = await umzug.pending();
    logger('Migrations').info('Pending ======>', pendingMigrations);
  
    await umzug.up();

    const executedMigrations = await umzug.executed();
    logger('Migrations').info('Executed ======>', executedMigrations);
  })();
}catch(error){
  logger('Migrations').error(error);
}
import { Umzug, SequelizeStorage } from 'umzug'
import loadModels from '@storeways/lib/db/models/index';

const migrate = async ({ dbConnectionUrl }) => {
  try{
    try{
      const { sequelize } = await loadModels({ dbConnectionUrl });
    
      const umzug = new Umzug({
        migrations: { glob: 'migrations/!(*index).js' },
        context: sequelize.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize }),
      });
    
      // Checks migrations and run them if they are not already applied. To keep
      // track of the executed migrations, a table (and sequelize model) called SequelizeMeta
      // will be automatically created (if it doesn't exist already) and parsed.
    
      const pendingMigrations = await umzug.pending();
      console.log('Pending ======>', pendingMigrations);
    
      await umzug.up();
  
      const executedMigrations = await umzug.executed();
      console.log('Executed ======>', executedMigrations);
    }catch(error){
      console.error(error);
    }
  }catch(error){
    console.error(error);
  }
}

export default migrate;
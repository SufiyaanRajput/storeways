import path from 'path';
import { Umzug, SequelizeStorage } from 'umzug'
import { loadModels } from '../models/index';

const migrate = async ({ dbConnectionUrl }) => {
  try{
    try{
      const domains = ['products', 'stores', 'users', 'orders'];
      const { sequelize } = await loadModels({ dbConnectionUrl, domains });
    
      const umzug = new Umzug({
        migrations: { glob: path.join(__dirname, '!(*index).js') },
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
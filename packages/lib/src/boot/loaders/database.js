import loadModels from '@storeways/lib/db/models/index';

export default async ({ dbConnectionUrl, domains }) => {
  try{
    const database = await loadModels({ dbConnectionUrl, domains });
    await database.sequelize.authenticate();
    console.log(`
      ++++++++++++++++++++++++++++++++++++++++++++++++
        POSTGRESQL CONNECTED SUCCESSFULLY!
      ++++++++++++++++++++++++++++++++++++++++++++++++
    `);
  }catch(error){
    console.log(error);
    throw new Error("⚠️  Couldn't connect to postgres  ⚠️");
  }
}
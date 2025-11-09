import database from '../models';

export default async () => {
  try{
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
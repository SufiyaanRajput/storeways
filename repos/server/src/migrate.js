import config from './config';
import migrate from "@storeways/lib/db/migrations";

(async () => {
  await migrate({ dbConnectionUrl: config.databaseURL });
})();

import config from "../../config";

export const adminCorsOptions = {
  origin: config.clientbaseUrl,
  optionsSuccessStatus: 200
};
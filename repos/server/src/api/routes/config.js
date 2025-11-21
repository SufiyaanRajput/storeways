import config from "../../config";

export const adminCorsOptions = {
  origin: config.adminbaseUrl,
  optionsSuccessStatus: 200
};
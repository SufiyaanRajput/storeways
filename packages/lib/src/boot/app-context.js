let appConfig = {};

export const setAppConfig = (config = {}) => {
  appConfig = config || {};
};

export const getAppConfig = () => appConfig;

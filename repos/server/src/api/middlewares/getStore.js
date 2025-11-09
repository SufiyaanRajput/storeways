import {formatFromError} from '../../utils/helpers';
import models from '../../models';

const getStore = () => async (req, res, next) => {
  try{
    const storeOptions = {
      attributes: ['id', 'settings', 'name', 'subDomain'], 
      raw: true
    }
    if (!req.storeId) {
      const {origin} = req.headers;
      const parts = origin.split('.');
      const subDomain = parts[0].replace(/http(s)?:\/\//, '');
      const domain = origin.replace(/http(s)?:\/\//, '');
  
      var store = await models.Store.findOne({ where: {[models.Sequelize.Op.or]: [{subDomain}, {domain}], active: true}, ...storeOptions });
    } else {
      var store = await models.Store.findOne({ where: {id: req.storeId, active: true}, ...storeOptions });
    }

    if (!store) {
      throw {status: 400, msgText: 'Site not found!', data: { errorCode: 1000 }, error: new Error()};
    }

    req.subDomain = store.subDomain;
    req.storeId = store.id;
    req.storeSettings = store.settings.store;
    req.storeName = store.name;
    req.storeSupport = {
      email: store.settings?.footer?.email,
      phone: store.settings?.footer?.phone,
    }

    next();
  }catch(error){
    console.log(error);
    const {status, ...data} = formatFromError(error);
    return res.status(status).send(data);
  } 
}

export default getStore;
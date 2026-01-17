import { formatFromError } from '../utils/helpers';
import { Store } from '../../domain';

const storeService = new Store();

const getStore = () => async (req, res, next) => {
  try {
    let store;
    if (!req.storeId) {
      const { origin } = req.headers;
      const parts = origin?.split('.') || [];
      const subDomain = parts[0]?.replace(/http(s)?:\/\//, '');

      [store] = await storeService.fetch({ subDomain, active: true });
    } else {
      [store] = await storeService.fetch({ id: req.storeId, active: true });
    }

    if (!store) {
      throw { status: 400, msgText: 'Site not found!', data: { errorCode: 1000 }, error: new Error() };
    }

    req.subDomain = store.subDomain;
    req.storeId = store.id;
    req.storeSettings = store.settings.store;
    req.storeName = store.name;
    req.storeSupport = {
      email: store.settings?.footer?.email,
      phone: store.settings?.footer?.phone,
    };

    next();
  } catch (error) {
    const { status, ...data } = formatFromError(error);
    return res.status(status).send(data);
  }
};

export default getStore;

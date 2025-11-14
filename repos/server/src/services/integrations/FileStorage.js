import getConfig from "../../../config";
import { getPlugin } from "../../plugins/registry";

let storage = null;

const getStorage = () => {
  if (!storage) {
    const pluginConfig = getConfig().plugins.find(plugin => plugin.key === 'storage');
    const UploadService = getPlugin('storage'); 
    storage = new UploadService(pluginConfig.options);
  }

  return storage;
}

FileStorage.prototype.upload = async function(...args) {
  return getStorage().upload(...args);
};

FileStorage.prototype.delete = async function(...args) {};

function FileStorage() {}

export default FileStorage;
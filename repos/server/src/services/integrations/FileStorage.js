import LocalFileStorage from '../../plugins/storage/LocalFileStorage';

let storage = null;

const getStorage = () => {
  if (!storage) {
    storage = new LocalFileStorage();
  }

  return storage;
}

FileStorage.prototype.upload = async function(...args) {
  return getStorage().upload(...args);
};

FileStorage.prototype.delete = async function(...args) {};

function FileStorage() {}

export default FileStorage;
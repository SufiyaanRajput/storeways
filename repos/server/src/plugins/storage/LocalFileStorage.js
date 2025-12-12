import fs from "fs/promises";
import path from "path";
import config from "../../config";

LocalFileStorage.prototype.upload = async function(fileBuffer, filename, uploadPath) {
  await fs.mkdir(uploadPath, { recursive: true });
  const filePath = path.join(uploadPath, filename);
  await fs.writeFile(filePath, fileBuffer);
  return { url: `${config.endpointBaseUrl}/${uploadPath}/${filename}`, fileId: filename };
}

LocalFileStorage.prototype.delete = async (filename) => {}

function LocalFileStorage(options = {}) {
  this.name = "storage-local";
  this.options = options;
}

export default LocalFileStorage;
import fs from "fs/promises";
import path from "path";
import config from "../../config";

LocalFileStorage.prototype.upload = async function(fileBuffer, filename) {
  const uploadDir = this.options.uploadDir || "uploads";
  await fs.mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);
  await fs.writeFile(filePath, fileBuffer);
  return { url: `${config.endpointBaseUrl}/uploads/${filename}`, fileId: filename };
}

LocalFileStorage.prototype.delete = async (filename) => {}

function LocalFileStorage(options = {}) {
  this.name = "storage-local";
  this.options = options;
}

export default LocalFileStorage;
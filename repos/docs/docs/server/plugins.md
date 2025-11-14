---
id: plugins
title: Plugins
---

Plugins enable optional integrations (e.g., storage, payments). They are declared via configuration and resolved at runtime with options.

## How to add a plugin (example: storage)

1) Implement the plugin
- Export a constructor that accepts `options` and provides methods the app expects (e.g., `upload`, `delete`).
- Reference implementation: `repos/server/src/plugins/storage/LocalFileStorage.js`.

Example (simplified):

```js
// repos/server/src/plugins/storage/LocalFileStorage.js
import config from "../../config";

LocalFileStorage.prototype.upload = async function(fileBuffer, filename) {
  // logic goes here
}

LocalFileStorage.prototype.delete = async function(filename) {
  // logic goes here
}

function LocalFileStorage(options = {}) {
  this.name = "storage-local";
  this.options = options;
}

export default LocalFileStorage;
```

2) Register the plugin in server config
- Add an entry in `repos/server/config.js` under the `plugins` array:
  - `key`: a unique identifier (e.g., `storage`)
  - `resolve`: path to your plugin module
  - `options`: configuration passed to the plugin constructor (e.g., `uploadDir`)

Example:

```js
// repos/server/config.js
const getConfig = () => ({
  plugins: [
    {
      key: 'storage',
      resolve: `./storage/LocalFileStorage`,
      options: {
        uploadDir: "uploads",
      },
    },
  ],
});
export default getConfig;
```

3) Use via the adapter (not directly)
- The `FileStorage` adapter resolves the plugin by key and forwards calls:
  - Adapter: `repos/server/src/services/integrations/FileStorage.js`
  - This keeps app code stable while allowing you to swap implementations.

Example usage:

```js
// repos/server/src/services/integrations/FileStorage.js
import getConfig from "../../../config";
import { getPlugin } from "../../plugins/registry";

let storage = null;

const getStorage = () => {
  if (!storage) {
    const pluginConfig = getConfig().plugins.find(p => p.key === 'storage');
    const UploadService = getPlugin('storage');
    storage = new UploadService(pluginConfig.options);
  }
  return storage;
}

FileStorage.prototype.upload = async function(...args) {
  return getStorage().upload(...args);
};

FileStorage.prototype.delete = async function(...args) {
  return getStorage().delete?.(...args);
};

function FileStorage() {}
export default FileStorage;
```

### Using FileStorage in your code

Service example:

```js
// repos/server/src/services/admin/updateProduct.js
import FileStorage from '../integrations/FileStorage';

export const addImage = async ({ file, fileName, ext }) => {
  const storage = new FileStorage();
  const { url, fileId } = await storage.upload(file, `${fileName}.${ext}`);
  return {
    url,
    fileId,
    name: fileName,
  };
};
```

Notes
- Keep plugin APIs minimal and cohesive.
- Use environment variables for secrets in `options`.
- Prefer pure IO boundaries to make testing easier.



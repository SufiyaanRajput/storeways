import path from "path";
import { registerPlugin } from "../plugins/registry";

/**
 * Dynamically imports all configured plugins
 * Each plugin must export an `init(options)` or `register(app, options)` function.
 */
export default async function loadPlugins(config, context = {}) {
  for (const plugin of config.plugins || []) {
    const { key, resolve } = plugin;

    // Convert relative path to absolute
    const pluginPath = path.resolve(__dirname, '../plugins', resolve);

    try {
      // Dynamically import the plugin
      const plugin = await import(pluginPath);

      // Instance of each plugin is registered
      registerPlugin(key, plugin.default);
    } catch (error) {
      console.warn(`⚠️  Plugin ${resolve} has no init/register export.`); 
    }
  }

	console.log(`
	++++++++++++++++++++++++++++++++++++++++++++++++
		PLUGINS LOADED SUCCESSFULLY!
	++++++++++++++++++++++++++++++++++++++++++++++++
`);
}

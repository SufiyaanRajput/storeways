import path from "path";
import { registerPlugin } from "../plugins/registry";
import { execSync } from "child_process";
import _ from "lodash";

async function ensurePluginDependencies(plugin) {
  if (_.isEmpty(plugin.packages)) {
    return; // No dependencies declared
  }

  for (const pkg of plugin.packages) {
    try {
      require.resolve(pkg);
    } catch (error) {
      console.error(`plugin dependency not found: ${pkg}`);
      console.log(`📦 Installing missing plugin dependency: ${pkg}`);
      execSync(`pnpm add ${pkg} --filter server --stream`, {
        cwd: process.cwd(),
        stdio: "inherit",
      });
    }
  }
}

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
      // Ensure dependencies (install if missing)
      ensurePluginDependencies(plugin);

      // Dynamically import the plugin
      const pluginModule = await import(pluginPath);

      // Instance of each plugin is registered
      registerPlugin(key, pluginModule.default);
    } catch (error) {
      console.warn(`⚠️  Plugin ${resolve} has no init/register export.`, error); 
    }
  }

	console.log(`
	++++++++++++++++++++++++++++++++++++++++++++++++
		PLUGINS LOADED SUCCESSFULLY!
	++++++++++++++++++++++++++++++++++++++++++++++++
`);
}

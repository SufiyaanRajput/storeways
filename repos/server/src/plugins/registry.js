// src/core/plugin-registry.js
const registry = new Map();

export function registerPlugin(key, instance) {
  registry.set(key, instance);
}

export function getPlugin(key) {
  return registry.get(key);
}

export function listPlugins() {
  return Array.from(registry.keys());
}

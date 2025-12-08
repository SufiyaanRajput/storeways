import express from "express";

export async function createStorewaysApp(config) {
  const app = express();

  await require('@storeways/lib/loaders/index').default({app, config });

  return app;
}
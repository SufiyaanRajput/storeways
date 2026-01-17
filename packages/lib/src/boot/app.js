import express from "express";
import { setAppConfig } from './app-context';

export async function createStorewaysApp(config) {
  const app = express();

  setAppConfig(config);
  await require('./loaders/index').default({app, config });

  return app;
}
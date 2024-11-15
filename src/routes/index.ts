import { Application } from "express";

import authRoute from "./auth";

const routes = [authRoute];

const registerApiEndpoints = (app: Application) => {
  routes.forEach((route) => {
    app.use(route);
  });
};

export default registerApiEndpoints;

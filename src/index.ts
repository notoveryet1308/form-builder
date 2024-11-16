import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";

import makeConnectionWithDatabase from "./db";
import authRoute from "./routes/auth";

dotenv.config();

const PORT = process.env.PORT || 2023;

const app: Application = express();

app.use(express.json());

app.use(authRoute);

makeConnectionWithDatabase();

app.listen(PORT, () => {
  console.log("Server is listening on:", PORT);
});

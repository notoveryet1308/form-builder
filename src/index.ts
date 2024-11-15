import express, { Request, Response, Application } from "express";
import dotenv from "dotenv";

import makeConnectionWithDatabase from "./db";
import registeApiEndpoints from "./routes";

dotenv.config();

const PORT = process.env.PORT || 2023;

const app: Application = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ status: "200", message: "hello from form-builder" });
});

registeApiEndpoints(app);

makeConnectionWithDatabase();

app.listen(PORT, () => {
  console.log("Server is listening on:", PORT);
});

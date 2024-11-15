import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 2023;

const app = express();

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send({ status: "200", message: "hello from form-builder" });
});

app.listen(PORT, () => {
  console.log("Server is listening on:", PORT);
});

import express, { Application } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import makeConnectionWithDatabase from "./db";
import authenticateToken from "./middleware/auth/authenticateToken";
import authRoute from "./routes/auth";
import formRoute from "./routes/form";
import submitForm from "./routes/formSubmission";

dotenv.config();

const PORT = process.env.PORT ?? 2023;

const app: Application = express();

app.use(cookieParser());
app.use(express.json());
app.use(authenticateToken);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.use(authRoute);
app.use(formRoute);
app.use(submitForm);

makeConnectionWithDatabase();

app.listen(PORT, () => {
  console.log("Server is listening on:", PORT);
});

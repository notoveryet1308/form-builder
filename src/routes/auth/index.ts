import express from "express";
import registerUser from "../../controllers/auth/registerUser";
import loginUser from "../../controllers/auth/loginUser";
import refreshToken from "../../controllers/auth/refreshToken";

const router = express.Router();

router
  .post("/api/register", registerUser)
  .post("/api/login", loginUser)
  .post("/api/refresh-token", refreshToken);

export default router;

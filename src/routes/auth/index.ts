import express from "express";
import registerUser from "../../controllers/auth/registerUser";
import loginUser from "../../controllers/auth/loginUser";

const router = express.Router();

router
  .post("/api/register", registerUser)
  .post("/api/login", loginUser)
  .post("/api/refresh-token", () => {});

export default router;

import express from "express";
import registerUser from "../../controllers/auth/register";
import loginUser from "../../controllers/auth/login";
import refreshToken from "../../controllers/auth/refreshToken";
import me from "../../controllers/auth/me";
import logout from "../../controllers/auth/logout";
import changePassword from "../../controllers/auth/changePassword";

const router = express.Router();

router
  .post("/api/register", registerUser)
  .post("/api/login", loginUser)
  .post("/api/refresh-token", refreshToken)
  .post("/api/logout", logout)
  .post("/api/change-password", changePassword);

router.get("/api/me", me);

export default router;

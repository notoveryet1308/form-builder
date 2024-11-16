import express from "express";
import { registerUser } from "../../controllers/auth";

const router = express.Router();

router.post("/api/register", registerUser);

export default router;

import express from "express";
import createForm from "../../controllers/form/createForm";
import getFormById from "../../controllers/form/getFormById";

const router = express.Router();

router.post("/api/form", createForm);
router.get("/api/form/:id", getFormById);

export default router;

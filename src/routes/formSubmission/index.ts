import express from "express";
import submitForm from "../../controllers/formSubmission/submitForm";

const router = express.Router();

router.post("/api/form-submission", submitForm);

export default router;

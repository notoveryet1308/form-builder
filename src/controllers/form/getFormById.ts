import { Request, Response } from "express";
import { withTryCatch } from "../../middleware/error/withTryCatch";
import { FormService } from "../../services/form.service";

const getFormById = withTryCatch(async (req: Request, res: Response) => {
  const formId = parseInt(req.params.id);

  if (isNaN(formId)) {
    return res.status(400).json({
      message: "Invalid form ID",
      error: "Form ID must be a number",
    });
  }

  const form = await FormService.getFormById(formId);

  if (!form) {
    return res.status(404).json({
      message: "Form not found",
    });
  }

  return res.status(200).json({
    message: "Form fetched successfully",
    data: form,
  });
});

export default getFormById;

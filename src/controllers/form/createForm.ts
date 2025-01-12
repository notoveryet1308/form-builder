import { Request, Response } from "express";
import { withTryCatch } from "../../middleware/error/withTryCatch";
import { FormService } from "../../services/form.service";
import { CreateFormSchema } from "../../types/form";

const createForm = withTryCatch(async (req: Request, res: Response) => {
  const result = CreateFormSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  const form = await FormService.createForm(req.body);

  res.status(201).json({
    message: "Form created successfully",
    data: form,
  });
});

export default createForm;

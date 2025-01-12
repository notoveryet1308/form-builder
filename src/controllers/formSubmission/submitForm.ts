import { Request, Response } from "express";
import { withTryCatch } from "../../middleware/error/withTryCatch";
import { FormSubmissionService } from "../../services/formSubmission.service";
import { formSubmissionSchema } from "../../types/formSubmission";

const submitForm = withTryCatch(async (req: Request, res: Response) => {
  const result = formSubmissionSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input",
      errors: result.error.flatten(),
    });
  }

  const submission = await FormSubmissionService.submitForm({
    ...req.body,
  });

  res.status(201).json({
    message: "Form submitted successfully",
    data: submission,
  });
});

export default submitForm;

import { db } from "../db";
import {
  FormSubmission,
  MultipleChoiceResponse,
  ParagraphResponse,
} from "../schema/FormSubmission";
import { FormSubmissionInput } from "../types/formSubmission";

export class FormSubmissionService {
  static async submitForm({
    multipleChoiceResponses,
    longTextResponses,
    shortTextResponses,
    formId,
  }: FormSubmissionInput) {
    // Create form submission
    const [submission] = await db
      .insert(FormSubmission)
      .values({
        formId,
        submittedAt: new Date(),
      })
      .returning();

    // Handle multiple choice responses
    if (multipleChoiceResponses.length > 0) {
      await db.insert(MultipleChoiceResponse).values(
        multipleChoiceResponses.map((response) => ({
          submissionId: submission.id,
          questionId: response.questionId,
          selectedOptions: response.selectedOptions,
        }))
      );
    }

    // Handle long paragraph responses
    if (longTextResponses.length > 0) {
      await db.insert(ParagraphResponse).values(
        longTextResponses.map((response) => ({
          submissionId: submission.id,
          questionId: response.questionId,
          response: response.response,
        }))
      );
    }

    // Handle short paragraph responses
    if (shortTextResponses.length > 0) {
      await db.insert(ParagraphResponse).values(
        shortTextResponses.map((response) => ({
          submissionId: submission.id,
          questionId: response.questionId,
          response: response.response,
        }))
      );
    }

    return submission;
  }
}

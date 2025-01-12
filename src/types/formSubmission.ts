import { z } from "zod";

export const multipleChoiceResponseSchema = z.object({
  questionId: z.number(),
  selectedOptions: z.array(z.number()),
});

export const paragraphResponseSchema = z.object({
  questionId: z.number(),
  response: z.string().min(1),
});

export const formSubmissionSchema = z.object({
  formId: z.number(),
  multipleChoiceResponses: z.array(multipleChoiceResponseSchema),
  longTextResponses: z.array(paragraphResponseSchema),
  shortTextResponses: z.array(paragraphResponseSchema),
});

export type MultipleChoiceResponseInput = z.infer<
  typeof multipleChoiceResponseSchema
>;
export type ParagraphResponseInput = z.infer<typeof paragraphResponseSchema>;
export type FormSubmissionInput = z.infer<typeof formSubmissionSchema>;

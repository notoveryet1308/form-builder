import { z } from "zod";

export const OptionSchema = z
  .object({
    label: z.string(),
    isCorrect: z.boolean().optional(),
    isQuizType: z.boolean().optional(),
    icon: z.string().optional(),
  })
  .strict();

export const BaseQuestionSchema = z
  .object({
    title: z.string(),
    description: z.string().optional(),
    isRequired: z.boolean(),
    callout: z
      .object({
        description: z.string().optional(),
        icon: z.string().optional(),
      })
      .optional(),
  })
  .strict();

export const MultipleChoiceQuestionSchema = BaseQuestionSchema.extend({
  questionType: z.literal("multiple_choice"),
  options: z.array(OptionSchema).min(1),
}).strict();

export const LongTextSchema = BaseQuestionSchema.extend({
  questionType: z.literal("long_text"),
  maxLength: z.number().optional(),
}).strict();

export const ShortTextSchema = BaseQuestionSchema.extend({
  questionType: z.literal("short_text"),
  maxLength: z.number().optional(),
}).strict();

export const QuestionSchema = z.discriminatedUnion("questionType", [
  MultipleChoiceQuestionSchema,
  LongTextSchema,
  ShortTextSchema,
]);

export const CreateFormSchema = z
  .object({
    userId: z.string().email(),
    shouldAuthenticateUser: z.boolean(),
    title: z.string(),
    description: z.string().optional(),
    question: z.array(QuestionSchema).min(1),
  })
  .strict();

export type CreateFormInput = z.infer<typeof CreateFormSchema>;

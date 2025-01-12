import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { Form } from "./Form";
import { Question } from "./Question";

export const FormSubmission = pgTable("form_submission", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  formId: integer("form_id")
    .notNull()
    .references(() => Form.id),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
});

export const MultipleChoiceResponse = pgTable("multiple_choice_response", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => FormSubmission.id),
  questionId: integer("question_id")
    .notNull()
    .references(() => Question.id),
  selectedOptions: integer("selected_options").array().notNull(),
});

export const ParagraphResponse = pgTable("paragraph_response", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  submissionId: integer("submission_id")
    .notNull()
    .references(() => FormSubmission.id),
  questionId: integer("question_id")
    .notNull()
    .references(() => Question.id),
  response: text("response").notNull(),
});

import { pgTable as table, integer } from "drizzle-orm/pg-core";
import { Question } from "./Question";

import { ChoiceOption } from "./ChoiceOption";
import { relations } from "drizzle-orm";

export const MultipleChoice = table("multiple_choice", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer("question_id")
    .notNull()
    .references(() => Question.id),
  options: integer().array().notNull(),
  response: integer("response").array(),
});

export const MultipleChoiceRelations = relations(
  MultipleChoice,
  ({ many }) => ({
    options: many(ChoiceOption),
    response: many(ChoiceOption),
  })
);

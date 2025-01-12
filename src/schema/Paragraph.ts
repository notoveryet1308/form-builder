import { pgTable as table, integer } from "drizzle-orm/pg-core";
import { Question } from "./Question";

export const ShortText = table("short_text", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer("question_id")
    .notNull()
    .references(() => Question.id),
  maxLength: integer("max_length"),
});

export const LongText = table("long_text", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  questionId: integer("question_id")
    .notNull()
    .references(() => Question.id),
  maxLength: integer("max_length"),
});

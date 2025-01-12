import { pgTable, integer, text, boolean } from "drizzle-orm/pg-core";

export const ChoiceOption = pgTable("choice_option", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  label: text("label").notNull().unique(),
  isCorrect: boolean("is_correct").default(false),
  isQuizType: boolean("is_quiz_type").notNull().default(false),
  icon: text("icon"),
});

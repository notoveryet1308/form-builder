import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { Form } from "./Form";

export const Question = pgTable("question", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  formId: integer("form_id")
    .notNull()
    .references(() => Form.id),
  questionTypeId: integer("question_id").notNull().default(1),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  isRequired: boolean("is_required").notNull().default(false),
  calloutDescription: text("callout_description"),
  calloutIcon: text("callout_icon"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const questionRelations = relations(Question, ({ one }) => ({
  form: one(Form),
}));

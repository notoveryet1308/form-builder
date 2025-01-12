import {
  pgTable,
  integer,
  text,
  boolean,
  timestamp,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

import { User } from "./User";
import { Question } from "./Question";

export const Form = pgTable("form", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: text("user_id")
    .notNull()
    .references(() => User.email),
  title: text("title").unique().notNull(),
  description: text("description"),
  shouldAuthenticateUser: boolean("should_authenticate_user")
    .notNull()
    .default(true),
  questionIds: integer("question_ids").array().default([]),
  isDraft: boolean("is_draft").default(true),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const formsRelations = relations(Form, ({ many, one }) => ({
  questions: many(Question),
  user: one(User),
}));

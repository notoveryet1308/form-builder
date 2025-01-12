import { eq, inArray } from "drizzle-orm";
import { db } from "../db";
import {
  Form,
  Question,
  ChoiceOption,
  MultipleChoice,
  LongText,
  ShortText,
} from "../schema/index";
import type { CreateFormInput } from "../types/form";

// Replace QUESTION_TYPE constant with enum
export enum QuestionTypes {
  MULTIPLE_CHOICE = "multiple_choice",
  LONG_TEXT = "long_text",
  SHORT_TEXT = "short_text",
}

export class FormService {
  static async createForm(data: CreateFormInput) {
    // Step 1: Create the form
    const form = await this.createFormRecord(data);

    // Step 2: Create questions and collect their IDs
    const questionIds = await this.createQuestions(form.id, data.question);

    // Step 3: Update the form with question IDs
    return await this.updateFormWithQuestions(form.id, questionIds);
  }

  static async getFormById(formId: number) {
    const [form] = await db.select().from(Form).where(eq(Form.id, formId));

    if (!form) {
      return null;
    }

    const questions = await db
      .select()
      .from(Question)
      .where(eq(Question.formId, formId));

    const populatedQuestions = await Promise.all(
      questions.map(async (question) => {
        // Get question details based on type
        switch (question.type) {
          case QuestionTypes.MULTIPLE_CHOICE: {
            const [multipleChoice] = await db
              .select()
              .from(MultipleChoice)
              .where(eq(MultipleChoice.id, question.questionTypeId));

            if (!multipleChoice) {
              throw new Error(
                `Multiple choice data not found for question ${question.id}`
              );
            }

            const options = await db
              .select()
              .from(ChoiceOption)
              .where(inArray(ChoiceOption.id, multipleChoice.options));

            return {
              ...question,
              questionType: QuestionTypes.MULTIPLE_CHOICE,
              options,
            };
          }

          case QuestionTypes.LONG_TEXT: {
            const [longText] = await db
              .select()
              .from(LongText)
              .where(eq(LongText.id, question.questionTypeId));

            if (!longText) {
              throw new Error(
                `Long text data not found for question ${question.id}`
              );
            }

            return {
              ...question,
              questionType: QuestionTypes.LONG_TEXT,
              maxLength: longText.maxLength,
            };
          }

          case QuestionTypes.SHORT_TEXT: {
            const [shortText] = await db
              .select()
              .from(ShortText)
              .where(eq(ShortText.id, question.questionTypeId));

            if (!shortText) {
              throw new Error(
                `Short text data not found for question ${question.id}`
              );
            }

            return {
              ...question,
              questionType: QuestionTypes.SHORT_TEXT,
              maxLength: shortText.maxLength,
            };
          }

          default:
            throw new Error(
              `Unknown question type for question ${question.id}`
            );
        }
      })
    );

    return {
      ...form,
      questions: populatedQuestions,
    };
  }

  private static async createFormRecord(data: CreateFormInput) {
    const [form] = await db
      .insert(Form)
      .values({
        userId: data.userId,
        shouldAuthenticateUser: data.shouldAuthenticateUser,
        title: data.title,
        description: data.description,
        questionIds: [],
      })
      .returning();

    return form;
  }

  private static async createQuestions(formId: number, questions: any[]) {
    const questionIds: number[] = [];

    for (const questionData of questions) {
      const question = await this.createQuestion(formId, questionData);
      const questionTypeId = await this.handleQuestionType(
        question.id,
        questionData
      );

      await this.updateQuestionWithType(question.id, questionTypeId);
      questionIds.push(question.id);
    }

    return questionIds;
  }

  private static async createQuestion(formId: number, questionData: any) {
    const [question] = await db
      .insert(Question)
      .values({
        formId,
        title: questionData.title,
        description: questionData.description,
        isRequired: questionData.isRequired,
        type: questionData.questionType,
        calloutDescription: questionData.callout?.description || null,
        calloutIcon: questionData.callout?.icon || null,
      })
      .returning();

    return question;
  }

  private static async handleQuestionType(
    questionId: number,
    questionData: any
  ) {
    switch (questionData.questionType) {
      case QuestionTypes.MULTIPLE_CHOICE: {
        const optionIds = await this.createOptions(questionData.options);
        const [multipleChoice] = await db
          .insert(MultipleChoice)
          .values({
            questionId,
            options: optionIds,
          })
          .returning();
        return multipleChoice.id;
      }

      case QuestionTypes.LONG_TEXT: {
        const [longText] = await db
          .insert(LongText)
          .values({
            questionId,
            maxLength: questionData.maxLength || null,
          })
          .returning();
        return longText.id;
      }

      case QuestionTypes.SHORT_TEXT: {
        const [shortText] = await db
          .insert(ShortText)
          .values({
            questionId,
            maxLength: questionData.maxLength || null,
          })
          .returning();
        return shortText.id;
      }

      default:
        throw new Error(
          `Unsupported question type: ${questionData.questionType}`
        );
    }
  }

  private static async createOptions(options: any[]) {
    const optionIds = [];
    
    for (const option of options) {
      // Check if option already exists
      const [existingOption] = await db
        .select()
        .from(ChoiceOption)
        .where(eq(ChoiceOption.label, option.label));

      if (existingOption) {
        optionIds.push(existingOption.id);
      } else {
        const [newOption] = await db
          .insert(ChoiceOption)
          .values(option)
          .returning();
        optionIds.push(newOption.id);
      }
    }

    return optionIds;
  }

  private static async updateQuestionWithType(
    questionId: number,
    questionTypeId: number
  ) {
    await db
      .update(Question)
      .set({ questionTypeId })
      .where(eq(Question.id, questionId));
  }

  private static async updateFormWithQuestions(
    formId: number,
    questionIds: number[]
  ) {
    const [updatedForm] = await db
      .update(Form)
      .set({ questionIds })
      .where(eq(Form.id, formId))
      .returning();

    return updatedForm;
  }
}

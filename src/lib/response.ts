// src/lib/response.ts
import { prisma } from './prisma';

type AnswerInput = {
  questionId: number;
  optionId?: number;  // for radio/checkbox
  text?: string;      // for text input
};

export async function submitResponse(formId: number, answers: AnswerInput[], userId?: number) {
  return prisma.response.create({
    data: {
      formId,
      userId,
      answers: {
        create: answers.map((a) => ({
          questionId: a.questionId,
          optionId: a.optionId,
          text: a.text,
        })),
      },
    },
  });
}

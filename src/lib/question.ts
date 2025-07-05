// src/lib/question.ts
import { prisma } from './prisma';

export async function addQuestion(formId: number, question: {
  label: string;
  type: 'text' | 'radio' | 'checkbox';
  position: number;
  options?: { text: string; position: number }[];
}) {
  return prisma.question.create({
    data: {
      formId,
      label: question.label,
      type: question.type,
      position: question.position,
      options: question.options
        ? {
            create: question.options,
          }
        : undefined,
    },
  });
}

// export async function updateQuestion(id: number, data: Partial<{ label: string; type: string }>) {
//   return prisma.question.update({
//     where: { id },
//     data,
//   });
// }

export async function deleteQuestion(id: number) {
  return prisma.question.delete({
    where: { id },
  });
}

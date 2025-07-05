// src/lib/form.ts
import { prisma } from './prisma';

// Create a form
export async function createForm(data: {
  title: string;
  description?: string;
  userId: number;
}) {
  return prisma.form.create({
    data,
  });
}

// Get all forms by user
export async function getFormsByUser(userId: number) {
  return prisma.form.findMany({
    where: { userId },
    include: { questions: true },
    orderBy: { createdAt: 'desc' },
  });
}

// Get form with questions/options
export async function getFormWithDetails(formId: number) {
  return prisma.form.findUnique({
    where: { id: formId },
    include: {
      questions: {
        include: {
          options: true,
        },
        orderBy: { position: 'asc' },
      },
    },
  });
}

// Update form
export async function updateForm(formId: number, data: { title?: string; description?: string }) {
  return prisma.form.update({
    where: { id: formId },
    data,
  });
}

// Delete form
export async function deleteForm(formId: number) {
  return prisma.form.delete({
    where: { id: formId },
  });
}

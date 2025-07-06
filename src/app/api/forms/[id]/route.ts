import { prisma } from '../../../../../prisma/prisma';
import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const form = await prisma.form.findUnique({
    where: { id: Number(params.id) },
    include: {
      questions: {
        include: { options: true },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!form) {
    return NextResponse.json({ error: 'フォームが見つかりません' }, { status: 404 });
  }

  return NextResponse.json(form);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  // 質問に紐づく選択肢削除
  await prisma.option.deleteMany({
    where: { question: { formId: Number(id) } }
  });
  // フォームに紐づく質問削除
  await prisma.question.deleteMany({
    where: { formId: Number(id) }
  });
  // フォーム削除
  await prisma.form.deleteMany({
    where: { id },
  });

  return NextResponse.json({ success: true });
}

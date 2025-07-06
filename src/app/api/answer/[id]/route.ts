import { prisma } from '../../../../../prisma/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const formId = Number(params.id);
  const body = await req.json();

  try {
    const response = await prisma.response.create({
      data: {
        formId,
        answers: {
          create: body.items.map((item: { questionId: string; value: string }) => ({
            questionId: item.questionId,
            value: item.value,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, id: response.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: '回答の保存に失敗しました' }, { status: 500 });
  }
}

import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '../auth/auth';

export async function GET() {
  const forms = await prisma.form.findMany({
    include: {
      questions: {
        include: {
          options: true,
        },
        orderBy: { position: 'asc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(forms);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized', session }, { status: 401 });
  }

  const { id, title, description, questions } = await req.json();

  // フォームの基本情報更新
  if(id) {
    const updatedForm = await prisma.form.update({
      where: { id: Number(id) },
      data: {
        title,
        description,
      },
    });

    // 既存の質問・選択肢を削除（簡易な差分更新でなく全削除 → 再作成）
    await prisma.option.deleteMany({ where: { question: { formId: Number(id) } } });
    await prisma.question.deleteMany({ where: { formId: Number(id) } });
    // 質問・選択肢を登録
    await insertQuestionAndOption(updatedForm.id, questions);

    // 再取得して返す
    return NextResponse.json(await getFormRecord(updatedForm.id));
  } else {
    const createdForm = await prisma.form.create({
      data: {
        title,
        description,
        userId: Number(session.user.id)
      },
    });
    // 質問・選択肢を登録
    await insertQuestionAndOption(createdForm.id, questions);

    // 再取得して返す
    return NextResponse.json(await getFormRecord(createdForm.id));
  }
}

async function getFormRecord(formId: number) {
  return await prisma.form.findUnique({
    where: { id: formId },
    include: {
      questions: {
        orderBy: { position: 'asc' },
        include: {
          options: { orderBy: { position: 'asc' } },
        },
      },
    },
  });
}

async function insertQuestionAndOption(formId: number, questions: any) {
  // 質問と選択肢を再作成
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const newQuestion = await prisma.question.create({
      data: {
        formId: formId,
        label: q.label,
        type: q.type,
        position: q.position,
      },
    });

    if (q.type === 'radio' || q.type === 'checkbox') {
      const optionsData = (q.options || []).map((opt: any, j: number) => ({
        text: opt.text,
        position: opt.position,
        questionId: newQuestion.id,
      }));

      await prisma.option.createMany({
        data: optionsData,
      });
    }
  }
}

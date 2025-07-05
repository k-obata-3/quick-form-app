// app/api/forms/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formId = parseInt(params?.id);
  const form = await prisma.form.findUnique({
    where: { id: formId },
    include: {
      questions: {
        include: { options: true },
        orderBy: { position: 'asc' },
      },
    },
  });

  if (!form) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(form);
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formId = parseInt(params.id);
  const data = await req.json();

  const updated = await prisma.form.update({
    where: { id: formId },
    data: {
      title: data.title,
      description: data.description,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const formId = parseInt(params.id);
  await prisma.form.delete({
    where: { id: formId },
  });

  return new NextResponse(null, { status: 204 });
}

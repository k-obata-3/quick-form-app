// app/api/forms/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const forms = await prisma.form.findMany({
    where: { userId: Number(session.user.id) },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(forms);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized', session }, { status: 401 });
  }

  const { title, description } = await req.json();

  const form = await prisma.form.create({
    data: {
      title,
      description,
      userId: Number(session.user.id),
    },
  });

  return NextResponse.json(form, { status: 201 });
}

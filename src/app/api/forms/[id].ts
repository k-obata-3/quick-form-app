// import { prisma } from '@/lib/prisma';
// import { useSession } from 'next-auth/react';
// import { NextResponse } from 'next/server';

// export async function GET() {
//   const forms = await prisma.form.findMany({
//     include: {
//       questions: {
//         include: {
//           options: true,
//         },
//         orderBy: { position: 'asc' },
//       },
//     },
//     orderBy: { createdAt: 'desc' },
//   });

//   return NextResponse.json(forms);
// }

// export async function POST(req: Request) {
//   const { data: session } = useSession();
//   if (!session?.user?.id) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const { title, description, questions } = await req.json();

  
//   const form = await prisma.form.create({
//     data: {
//       title,
//       description,
//       userId: Number(session?.user?.id),
//       questions: {
//         create: questions.map((q: any, i: number) => ({
//           label: q.label,
//           type: q.type,
//           // position: i,
//           options: q.type === 'text'
//             ? undefined
//             : {
//                 create: (q.options || []).map((opt: any, j: number) => ({
//                   text: opt.text,
//                   // position: j,
//                 })),
//               },
//         })),
//       },
//     },
//     include: {
//       questions: {
//         include: { options: true },
//       },
//     },
//   });

//   return NextResponse.json(form);
// }

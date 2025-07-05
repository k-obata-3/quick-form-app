import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const formId = parseInt(req.query.id as string, 10);
  if (isNaN(formId)) return res.status(400).json({ error: "Invalid ID" });

  if (req.method === "GET") {
    const form = await prisma.form.findUnique({
      where: { id: formId },
      include: {
        questions: {
          include: { options: true },
          orderBy: { position: "asc" },
        },
      },
    });
    if (!form) return res.status(404).json({ error: "Form not found" });
    return res.status(200).json(form);
  }

  if (req.method === "PUT") {
    const { title, description } = req.body;
    const updated = await prisma.form.update({
      where: { id: formId },
      data: { title, description },
    });
    return res.status(200).json(updated);
  }

  if (req.method === "DELETE") {
    await prisma.form.delete({
      where: { id: formId },
    });
    return res.status(204).end();
  }

  return res.status(405).end();
}

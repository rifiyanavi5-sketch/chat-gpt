import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = createProductSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: parsed.data.name,
      skuPrefix: parsed.data.skuPrefix,
      variants: {
        create: parsed.data.variants
      }
    },
    include: {
      variants: true
    }
  });

  return NextResponse.json(product, { status: 201 });
}

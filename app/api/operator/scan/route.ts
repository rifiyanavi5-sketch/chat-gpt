import { MovementType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { movementSchema } from "@/lib/validation";
import { getServerAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = await getServerAuth();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = movementSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const result = await prisma.$transaction(async (tx) => {
    const variant = await tx.productVariant.findFirst({
      where: { OR: [{ barcode: parsed.data.barcode }, { qrCode: parsed.data.barcode }], isActive: true }
    });
    if (!variant) throw new Error("Variant not found");

    const warehouse = await tx.warehouse.findUnique({ where: { code: parsed.data.warehouseCode } });
    if (!warehouse || !warehouse.isActive) throw new Error("Warehouse not found");

    const stock = await tx.stock.upsert({
      where: { variantId_warehouseId: { variantId: variant.id, warehouseId: warehouse.id } },
      update: { quantity: { increment: parsed.data.quantity } },
      create: { variantId: variant.id, warehouseId: warehouse.id, quantity: parsed.data.quantity }
    });

    await tx.stockMovement.create({
      data: {
        variantId: variant.id,
        warehouseId: warehouse.id,
        type: MovementType.IN,
        quantity: parsed.data.quantity,
        note: parsed.data.note,
        createdById: auth.sub
      }
    });

    return stock;
  });

  return NextResponse.json({ stock: result });
}

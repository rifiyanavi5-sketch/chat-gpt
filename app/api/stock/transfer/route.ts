import { MovementType } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { transferSchema } from "@/lib/validation";
import { getServerAuth } from "@/lib/auth";

export async function POST(request: Request) {
  const auth = await getServerAuth();
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = transferSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (parsed.data.fromWarehouseCode === parsed.data.toWarehouseCode) {
    return NextResponse.json({ error: "Cannot transfer to same warehouse" }, { status: 400 });
  }

  const transferGroupId = crypto.randomUUID();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const variant = await tx.productVariant.findFirst({
        where: { OR: [{ barcode: parsed.data.barcode }, { qrCode: parsed.data.barcode }], isActive: true }
      });
      if (!variant) throw new Error("Variant not found");

      const [from, to] = await Promise.all([
        tx.warehouse.findUnique({ where: { code: parsed.data.fromWarehouseCode } }),
        tx.warehouse.findUnique({ where: { code: parsed.data.toWarehouseCode } })
      ]);

      if (!from || !to) throw new Error("Warehouse not found");

      const source = await tx.stock.upsert({
        where: { variantId_warehouseId: { variantId: variant.id, warehouseId: from.id } },
        update: {},
        create: { variantId: variant.id, warehouseId: from.id, quantity: 0 }
      });

      if (source.quantity < parsed.data.quantity) {
        throw new Error("Insufficient stock");
      }

      const destination = await tx.stock.upsert({
        where: { variantId_warehouseId: { variantId: variant.id, warehouseId: to.id } },
        update: {},
        create: { variantId: variant.id, warehouseId: to.id, quantity: 0 }
      });

      const updatedSource = await tx.stock.update({
        where: { id: source.id },
        data: { quantity: { decrement: parsed.data.quantity } }
      });

      const updatedDestination = await tx.stock.update({
        where: { id: destination.id },
        data: { quantity: { increment: parsed.data.quantity } }
      });

      await tx.stockMovement.createMany({
        data: [
          {
            variantId: variant.id,
            warehouseId: from.id,
            fromWarehouseId: from.id,
            toWarehouseId: to.id,
            transferGroupId,
            type: MovementType.TRANSFER_OUT,
            quantity: parsed.data.quantity,
            note: parsed.data.note,
            createdById: auth.sub
          },
          {
            variantId: variant.id,
            warehouseId: to.id,
            fromWarehouseId: from.id,
            toWarehouseId: to.id,
            transferGroupId,
            type: MovementType.TRANSFER_IN,
            quantity: parsed.data.quantity,
            note: parsed.data.note,
            createdById: auth.sub
          }
        ]
      });

      return { updatedSource, updatedDestination, transferGroupId };
    });

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

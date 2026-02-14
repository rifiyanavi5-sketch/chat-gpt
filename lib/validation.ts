import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

export const createProductSchema = z.object({
  name: z.string().min(2),
  skuPrefix: z.string().min(2),
  variants: z
    .array(
      z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        barcode: z.string().min(3),
        qrCode: z.string().min(3)
      })
    )
    .min(1)
});

export const movementSchema = z.object({
  barcode: z.string().min(3),
  warehouseCode: z.string().min(2),
  quantity: z.number().int().positive(),
  note: z.string().max(300).optional()
});

export const transferSchema = z.object({
  barcode: z.string().min(3),
  fromWarehouseCode: z.string().min(2),
  toWarehouseCode: z.string().min(2),
  quantity: z.number().int().positive(),
  note: z.string().max(300).optional()
});

export const opnameSchema = z.object({
  barcode: z.string().min(3),
  warehouseCode: z.string().min(2),
  actualQty: z.number().int().nonnegative(),
  note: z.string().max(300).optional()
});

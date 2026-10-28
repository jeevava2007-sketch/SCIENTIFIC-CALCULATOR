import { z } from "zod";

export const historySchema = z.object({
  id: z.string().min(1).max(80),
  expression: z.string().max(400),
  result: z.string().max(200),
  at: z.number(),
  note: z.string().max(500).optional(),
});

export const customFormulaSchema = z.object({
  id: z.string().min(1).max(80),
  name: z.string().min(1).max(80),
  expression: z.string().min(1).max(400),
  variables: z.array(z.string().regex(/^[A-Za-z][A-Za-z0-9_]*$/)).max(12),
  note: z.string().max(500).optional(),
});

export const backupSchema = z.object({
  version: z.literal(1),
  history: z.array(historySchema).max(500),
  formulas: z.array(customFormulaSchema).max(200).optional(),
  bookmarks: z.array(z.string().max(80)).max(200).optional(),
});

export type NexusBackup = z.infer<typeof backupSchema>;

export function parseBackup(raw: unknown): NexusBackup {
  return backupSchema.parse(raw);
}

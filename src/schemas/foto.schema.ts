import { z } from "zod";

export const criarFotoSchema = z.object({
    url: z
        .string()
        .url("A URL da foto é inválida")
        .max(255, "A URL deve ter no máximo 255 caracteres"),

    ordem: z
        .number()
        .int("A ordem deve ser um número inteiro")
        .min(0, "A ordem não pode ser negativa")
        .optional()
});
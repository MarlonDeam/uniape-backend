import { z } from "zod";

export const criarGrupoSchema = z.object({
    nome_grupo: z
        .string()
        .min(3, "O nome do grupo deve ter pelo menos 3 caracteres")
        .max(100, "O nome do grupo deve ter no máximo 100 caracteres"),

    imovel_id: z
        .number()
        .int("O imovel_id deve ser um número inteiro")
        .positive("O imovel_id deve ser maior que zero")
        .optional()
});
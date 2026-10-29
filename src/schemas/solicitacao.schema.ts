import { z } from "zod";

export const criarSolicitacaoSchema = z.object({
    grupo_id: z
        .number()
        .int("O ID do grupo deve ser um número inteiro")
        .positive("O ID do grupo deve ser maior que zero"),

    imovel_id: z
        .number()
        .int("O ID do imóvel deve ser um número inteiro")
        .positive("O ID do imóvel deve ser maior que zero"),

    tipo_solicitante: z
        .string()
        .min(1, "O tipo do solicitante é obrigatório"),

    status: z
        .string()
        .min(1, "O status é obrigatório"),

    mensagem: z
        .string()
        .optional()
});
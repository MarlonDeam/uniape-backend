import { z } from "zod";

export const criarImovelSchema = z.object({
    proprietario_id: z
        .number()
        .int("O proprietario_id deve ser um número inteiro")
        .positive("O proprietario_id deve ser maior que zero"),

    titulo: z
        .string()
        .min(3, "O título deve ter pelo menos 3 caracteres")
        .max(150, "O título deve ter no máximo 150 caracteres"),

    localizacao: z
        .string()
        .min(3, "A localização deve ter pelo menos 3 caracteres"),

    preco_mensal: z
        .number()
        .positive("O preço mensal deve ser maior que zero"),

    tipo: z.enum([
        "kitnet",
        "quarto",
        "republica",
        "apartamento",
        "casa"
    ], {
        message: "Tipo de imóvel inválido"
    }),

    vagas_disponiveis: z
        .number()
        .int("As vagas devem ser um número inteiro")
        .min(0, "As vagas não podem ser negativas")
        .optional(),

    mobiliado: z
        .boolean()
        .optional(),

    disponivel: z
        .boolean()
        .optional()
});
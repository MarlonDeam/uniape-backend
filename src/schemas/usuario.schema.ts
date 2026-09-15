import { z } from "zod";

export const criarUsuarioSchema = z.object({
    nome: z
        .string()
        .min(3, "O nome deve ter pelo menos 3 caracteres")
        .max(120, "O nome deve ter no máximo 120 caracteres"),

    email: z
        .string()
        .email("E-mail inválido")
        .max(150, "O e-mail deve ter no máximo 150 caracteres"),

    senha: z
        .string()
        .min(6, "A senha deve ter pelo menos 6 caracteres")
        .max(100, "A senha deve ter no máximo 100 caracteres"),

    tipo: z.enum(["proprietario", "estudante"], {
        message: "O tipo deve ser proprietario ou estudante"
    }),

    telefone: z
        .string()
        .max(20, "O telefone deve ter no máximo 20 caracteres")
        .optional()
});
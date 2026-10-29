import { z } from "zod";

export const entrarGrupoSchema = z.object({
grupo_id: z
.number()
.int("O ID do grupo deve ser um número inteiro")
.positive("O ID do grupo deve ser maior que zero")
});

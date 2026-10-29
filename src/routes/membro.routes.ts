
import { Router } from "express";

import {
    listarMembrosPorGrupo,
    entrarGrupo,
    removerMembro
} from "../controllers/membro.controller";

import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/grupos/:id/membros",
    listarMembrosPorGrupo
);

router.post(
    "/grupos/entrar",
    autenticar,
    entrarGrupo
);

router.delete(
    "/grupos/:grupoId/membros/:usuarioId",
    autenticar,
    removerMembro
);

export default router;

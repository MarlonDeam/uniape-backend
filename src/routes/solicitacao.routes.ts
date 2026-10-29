import { Router } from "express";

import {
    listarSolicitacoesPorGrupo,
    criarSolicitacao,
    atualizarStatusSolicitacaoController
} from "../controllers/solicitacao.controller";

import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.get(
    "/grupos/:id/solicitacoes",
    listarSolicitacoesPorGrupo
);

router.post(
    "/grupos/solicitar",
    autenticar,
    criarSolicitacao
);

router.put(
    "/solicitacoes/:id/status",
    autenticar,
    atualizarStatusSolicitacaoController
);

export default router;
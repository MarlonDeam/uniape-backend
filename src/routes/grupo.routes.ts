import { Router } from "express";

import {
listarGrupos,
listarGrupoPorId,
criarGrupo
} from "../controllers/grupo.controller";

import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", listarGrupos);

router.get("/:id", listarGrupoPorId);

router.post("/", autenticar, criarGrupo);

export default router;

import { Router } from "express";

import {
    listarImoveis,
    listarImovelPorId,
    criarImovel,
    editarImovel,
    deletarImovel
} from "../controllers/imovel.controller";

import { autenticar } from "../middlewares/auth.middleware";

const router = Router();

router.get("/", listarImoveis);

router.get("/:id", listarImovelPorId);

router.post("/", autenticar, criarImovel);

router.put("/:id", autenticar, editarImovel);

router.delete("/:id", autenticar, deletarImovel);

export default router;
import { Router } from "express";

import {
    listarImoveis,
    listarImovelPorId,
    criarImovel,
    editarImovel
} from "../controllers/imovel.controller";

const router = Router();

router.get("/", listarImoveis);
router.get("/:id", listarImovelPorId);
router.post("/", criarImovel);
router.put("/:id", editarImovel);

export default router;